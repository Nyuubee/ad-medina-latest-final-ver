import { desc } from "drizzle-orm"
import { db, tables } from "~/server/database"
import { SearchConfig } from "~/server/utils/drizzle"

export const logsConfig: SearchConfig = {
    id: {
        action: 'exact',
        column: tables.user_actions.id,
    },
    userId: {
        action: 'exact',
        column: tables.user_actions.userId,
    },
    startend: {
        action: 'between',
        column: tables.user_actions.createdAt,
        args: {
            queryKeyStart: 'start',
            queryKeyEnd: 'end',
        }
    }
}   
export default roleHandler(["admin"], async (event) => {
    const query =  getQueryWithLimitOffset(event);
    const where = transformSearch(logsConfig,query)
    const logs = await db.query.user_actions.findMany({
        where,
        limit: query.limit,
        offset: query.offset,
        orderBy: [desc(tables.user_actions.createdAt)],
    })
    return logs
})
