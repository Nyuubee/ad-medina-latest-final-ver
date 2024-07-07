import { eq } from "drizzle-orm"
import { db } from "~/server/database"
import { banlist } from "~/server/database/schema"

// delete user id from banlist
export default roleHandler(['admin'], async (event) => {
    const {userId} = getQuery<{userId:number}>(event)
    await db.delete(banlist).where(eq(banlist.userId, userId))
})
