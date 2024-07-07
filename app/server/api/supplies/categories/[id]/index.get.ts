import { eq } from "drizzle-orm"
import { db, tables } from "~/server/database"

export default eventHandler(async(event)=> {
    const categoriesId = getRouteParamInt(event, 'id')
    const categories = await db.query.supplyCategories.findFirst({
        where: eq(tables.supplyCategories.id, categoriesId),
    })

    return categories
})
