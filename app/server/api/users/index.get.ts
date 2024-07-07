import { db, tables } from "~/server/database"
import { SearchConfig, withLimitOffset } from "~/server/utils/drizzle"

export const userSearch:SearchConfig = {
    id: {
        action: 'exact',
        column: tables.user.id,
    },
    name: {
        action: 'composite-ilike',
        args: [tables.user.firstName, tables.user.middleName, tables.user.lastName],
    },
    email: {
        action: 'ilike',
        column: tables.user.email,
    },
    birthdate: {
        action: 'exact',
        column: tables.user.birthDate,
    },
    sex: {
        action: 'exact',
        column: tables.user.sex,
    },
}

export default roleHandler(["admin"], async (event) => {
    const { limit, offset, ...query } = withLimitOffset<{
        id?: number,
        name?: string,
        email?: string,
        birthdate?:Date,
    }>(getQuery(event))
    const users = await db.query.user.findMany({
        limit,
        offset,
        where:transformSearch(userSearch, query)
    })

    return users
})
