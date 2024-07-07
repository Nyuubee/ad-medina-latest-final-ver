import { eq } from "drizzle-orm"
import { db, tables } from "~/server/database"

export default eventHandler(async(event)=> {
    const userId = getRouteParamInt(event, 'id')
    const user = await db.query.user.findFirst({
        where: eq(tables.user.id, userId),
        with: {
            google: {
                with:  {
                    oauth: {
                        columns: {
                            provider: true,
                        }
                    }
                },
            },
            roles: {
                columns: {
                    role: true,
                }
            }
        }
    })

    return user
})
