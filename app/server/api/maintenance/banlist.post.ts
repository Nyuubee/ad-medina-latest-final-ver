import { eq } from "drizzle-orm"
import { db, tables } from "~/server/database"
import {getToken} from "#auth"
// ban usernames or id those in the query
export default roleHandler(['admin'], async (event) => {
    const query = getQuery<{username?:string}>(event)
    const token = await getToken({event})
    // prevent self-ban

    if (query.username) {
        if (token?.name == query.username) {
            throw createError({
                status: 400,
                message: 'You cannot ban yourself'
            })
        }
        const authSq = await db.query.auth.findFirst({
            where: eq(tables.auth.username, query.username),
            with: {
                user: {
                    with: {
                        roles: true
                    }
                }
            }
        })
        if (authSq === undefined) {
            throw createError({
                status: 404,
                message: 'User not found'
            })
        }

        // if admin, prevent banning other admins
        if (authSq.user.roles.some(r => r.role == 'admin')) {
            throw createError({
                status: 400,
                message: 'You cannot ban other admins'
            })
        }

        await db.insert(tables.banlist).values({
            userId: authSq.userId
        })

        return crypto.randomUUID()
    }
})
