import { db, tables } from "~/server/database"
import { SearchConfig } from "~/server/utils/drizzle"
import {type H3Event, type EventHandlerRequest}  from "h3"

//First define a config object that will be used to search the table
export const categoriesSearch: SearchConfig = {
    id: {
        action: 'exact',
        column: tables.supplyCategories.id,
    },
    name: {
        action: 'ilike',
        column: tables.supplyCategories.name,
    },
    startend: {
        action: 'between',
        column: tables.supplyCategories.createdAt,
        args: {
            queryKeyStart: 'start',
            queryKeyEnd: 'end',
        }
    },
}
export async function handler(query:Partial<typeof tables.supplyCategories.$inferSelect & LimitOffset>) {
    const where = transformSearch(categoriesSearch, query)
    const supplycategories = await db.query.supplyCategories.findMany({
        where,
        limit: query.limit,
        offset: query.offset,
    })
    // now head on over to ./count.get.ts for pagination
    return supplycategories
}

export default roleHandler(['inventory_manager', 'admin'], async (event) => {
    const query = getQueryWithLimitOffset<typeof tables.supplyCategories.$inferSelect>(event)
    return await handler(query)
})

