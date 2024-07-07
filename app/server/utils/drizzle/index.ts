import { Column, and, between, count, gte, inArray, lte, or } from "drizzle-orm";
import { db } from "~/server/database";
import { GLOBAL_RECORDS_PER_PAGE_LIMIT } from "~/utils";
import type { EventHandler, EventHandlerRequest, H3Event } from 'h3'
import { ColumnBaseConfig, ColumnDataType, eq, ilike } from "drizzle-orm"

export const ERROR = Object.freeze({
    UNIQUE_CONSTRAINT: "23505"
})

/**
 * To limit query results to a maximum of GLOBAL_LIMIT or if the limit is nullable
 */
export function applyGlobalLimit(limit: number = GLOBAL_RECORDS_PER_PAGE_LIMIT) {
    return limit > GLOBAL_RECORDS_PER_PAGE_LIMIT ? GLOBAL_RECORDS_PER_PAGE_LIMIT : limit
}
export function withLimitOffset<Query>(q: Query & LimitOffset): Required<LimitOffset> & Query {
    return {
        offset: q.offset ?? 0,
        ...q,
        limit: applyGlobalLimit(q.limit)
    }
}

/**
 * statusCode defaults to 409 unless specified
 */
export function onUniqueConstraintError(options: Exclude<Parameters<typeof createError>[0], string>) {
    return (error: any) => {
        console.log(typeof error)
        if (error.code == ERROR.UNIQUE_CONSTRAINT) {
            throw createError({
                statusCode: 409,
                ...options,
            })
        }
        // else, throw it again
        throw error;
    }
}
export const Count = {
    nullable<T extends ColumnBaseConfig<ColumnDataType, string>>(pgColumn: Column<T>) {
        return db
            .select({
                count: count(),
            })
            .from(pgColumn.table)
    },
    nonNullable<T extends ColumnBaseConfig<ColumnDataType, string>>(pgColumn: Column<T>) {
        return db
            .select({
                count: count(pgColumn),
            })
            .from(pgColumn.table)
    },
}

export function countHandler<T extends Column>(pgColumn: T) {
    return eventHandler(async (event) => {
        const result = await Count.nonNullable(pgColumn).then(takeUniqueOrThrow)
        return result
    })
}

/**
 * https://nuxt.com/docs/guide/directory-structure/server
 * Sample template to wrap a route handler
 */
export const defineWrappedResponseHandler = <T extends EventHandlerRequest, D>(
    handler: EventHandler<T, D>
): EventHandler<T, D> =>
    defineEventHandler<T>(async event => {
        try {
            // do something before the route handler
            const response = await handler(event)
            // do something after the route handler
            return { response }
        } catch (err) {
            // Error handling
            return { err }
        }
    })
// based on the above, create an ExtendedCountHandler, it accepts a type arg Query, parameters:
// column: PgColumn
// query: Query which is a record with keys based on the table where column belongs, , values are the conditions for the where clause
//  possible actions: exact | ilike | between | gte | lte | inArray
// the logic is to construct the where clause based on the keys of the query object
// during the request, if the query object is just {}, then just run count.nonNullable(column)
type Action = 'exact' | 'ilike' | 'gte' | 'lte' | 'between' | 'composite-ilike' | 'any' //| 'inArray'
export type SearchConfig = Record<string, 
    { column: Column, action: Action, args?: undefined }
    | {
        column: Column, action: 'between', args: {
            queryKeyStart: Column['name'],
            queryKeyEnd: Column['name'],
        }
    }
    | {
        column?: undefined, action: 'composite-ilike', args: Column[]
    }
>;
            
export function ExtendedCountHandler<Query extends Record<string, any>>(idColumn: Column,
    a: SearchConfig) {
    return eventHandler(async (event) => {
        const query = getQuery<Query>(event)
        const where = transformSearch(a, query)
        const command = Count.nonNullable(idColumn)
        return await command.where(where).then(takeUniqueOrThrow)
    })
}

// make a generalized whereBuilder based on the mapping of the query object to the where clause
export function transformSearch<Q extends Record<string, any>>(s:SearchConfig, query: Q) {
    const conditions = Object.entries(s).map(([key, { column, action, args }]) => {
        const val = query[key] as any
        if (action == 'between') {
            if (args == undefined) throw new Error('args for action `composite-like` is required')
            // check if the start and end are defined
            const start = query[args.queryKeyStart]
            const end = query[args.queryKeyEnd]
            if (start && end) {
                return between(column, new Date(start), new Date(end))
            }
            if (start) {
                return gte(column, new Date(start))
            }
            if (end) {
                return lte(column, new Date(end))
            }
        }

        if (val == undefined) return
        if (action == 'exact') return eq(column, val)
        if (action == 'ilike') return ilike(column, fuz(val as string))
        if (action == 'gte') return gte(column, val)
        if (action == 'lte') return lte(column, val)
        // if composite ilike, combine w/ or
        if (action == 'composite-ilike') {
            if (args == undefined) throw new Error('args for action `composite-like` is required')
            return or(
                ...args.map(col => ilike(col, fuz(val as string)))
            )
        }
        if (action == 'any') {
            return inArray(column, val)
        }
    }).filter(Boolean)
    if (conditions.length == 0) return undefined
    return and(...conditions)
}
export interface LimitOffset {
    limit?: number
    offset?: number
}
export function getQueryWithLimitOffset<T>(event: H3Event) {
    let { limit, offset = 0, ...rest } = getQuery<T & LimitOffset>(event)
    if (typeof limit == 'string') {
        limit = parseInt(limit) ?? undefined
    }
    let _limit = applyGlobalLimit(limit as any)
    return {
        ...rest,
        limit: _limit,
        offset: offset as number,
    }
}
