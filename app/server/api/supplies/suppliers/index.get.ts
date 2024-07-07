import { db, tables } from "~/server/database"
import { LimitOffset, SearchConfig } from "~/server/utils/drizzle"
import {type H3Event, type EventHandlerRequest}  from "h3"
//First define a config object that will be used to search the table
export const suppliersSearchConfig: SearchConfig = {
    id: {
        action: 'exact',
        column: tables.suppliers.id,
    },
    name: {
        action: 'ilike',
        column: tables.suppliers.name,
    },
    startend: {
        action: 'between',
        column: tables.suppliers.createdAt,
        args: {
            queryKeyStart: 'start',
            queryKeyEnd: 'end',
        }
    },
}

export async function handler(query:Partial<typeof tables.suppliers.$inferSelect & LimitOffset>) {

    const where = transformSearch(suppliersSearchConfig, query)
    const suppliers = await db.query.suppliers.findMany({
        where,
        limit: query.limit,
        offset: query.offset,
    })
    // now head on over to ./count.get.ts for pagination
    return suppliers
}

export default roleHandler(['inventory_manager', 'admin'], async (event) => {
    const query = getQueryWithLimitOffset<typeof tables.suppliers.$inferSelect>(event)
    return await handler(query)
})
