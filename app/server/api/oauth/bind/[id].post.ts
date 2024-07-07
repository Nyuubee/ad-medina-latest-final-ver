import { getServerSession, getToken } from "#auth"
import { eq } from "drizzle-orm"
import { db, tables } from "~/server/database"
export default eventHandler(async (event) => {
    const userId = getRouteParamInt(event, 'id')
    const session = await getServerSession(event)
    if (session == null || !session.user?.email) {
        throw createError({
            statusMessage: 'Unauthorized',
            status: 401,
        })
    }
    console.log("LINK START", userId, session)
    const oauth = await db.query.oauth.findFirst({
        where: eq(tables.oauth.email, session.user.email),
        with: {
            google: {
                with: {
                    user: true,
                }
            }
        }
    })
    if (oauth == undefined) {
        throw createError({
            statusMessage: 'Unauthorized',
            status: 401,
        })
    }
    // check if oauth is already linked
    if (oauth?.google) {
        throw createError({
            statusMessage: 'Already linked',
            status: 301,
        })
    }

    // insert oauth's email
    await db.insert(tables.google).values({
        userId: userId,
        oauthId: oauth.id,
    })
    //return nothing, means HTTP 200 ok
    return {
        google: true
    }
})
