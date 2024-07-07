import { db, tables } from "~/server/database"
import { SearchConfig, transformSearch, withLimitOffset } from "~/server/utils/drizzle"

const authSearch: SearchConfig = {
    username: {
        action: 'ilike',
        column: tables.auth.username,
    },
}
export default roleHandler(['admin'], async (event) => {
    const { limit, offset, username, salt,roles } = withLimitOffset<{ username: string, salt?: boolean}>(getQuery(event))
    const auths = await db.query.auth.findMany({
        limit,
        offset,
        columns: {
            userId: true,
            username: true,
            salt,
        },
        where: transformSearch(authSearch, { username }),
    })
    return auths
})
