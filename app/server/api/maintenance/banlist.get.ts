import { db } from "~/server/database"
import { user } from "~/server/database/schema"

/**
 * Responds with the current banlist
 */
export default roleHandler(['admin'], async (event) => {
    const banlist = await db.query.banlist.findMany({
        with: {
            user: {
                columns: {
                    id: true,
                },
                with: {
                    auth: {
                        columns: {
                            userId: true,
                            username: true,
                        }
                    }
                }
            }
        }
    })
    return banlist
})
