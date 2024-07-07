import { eq } from "drizzle-orm"
import { db, tables } from "~/server/database"
import getRouteIntParam from "~/server/utils/getRouteParamInt"
import { trimLowercase } from "~/server/utils/trimLowercase"
import { OmitTimestamps } from "~/utils/types"

export default roleHandler(['inventory_manager', 'admin'], async (event) => {
    const id = getRouteIntParam(event, 'id')
    const body = await readBody<OmitTimestamps<typeof tables.suppliers.$inferSelect>>(event)
    const supplier = await db.update(tables.suppliers)
        .set({
            id: body.id,
            name: trimLowercase(body.name),
            address: body.address,
            updatedAt: new Date(),
            createdAt: undefined,
        })
        .where(eq(tables.suppliers.id, id))
})
