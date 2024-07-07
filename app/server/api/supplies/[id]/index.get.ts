import { eq } from "drizzle-orm"
import { db, tables } from "~/server/database"

export default eventHandler(async(event)=> {
    const suppliesId = getRouteParamInt(event, 'id')
    const supplies = await db.query.supplies.findFirst({
        where: eq(tables.supplies.id, suppliesId),
        with: {
            supplier: true,
            category: true,
        }
    })

    return supplies
})
