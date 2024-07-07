import { eq } from "drizzle-orm"
import { db, tables } from "~/server/database"

export default eventHandler(async(event)=> {
    const suppliersId = getRouteParamInt(event, 'id')
    const supplier = await db.query.suppliers.findFirst({
        where: eq(tables.suppliers.id, suppliersId),
    })

    return supplier
})
