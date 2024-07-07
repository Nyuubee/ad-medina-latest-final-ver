import { eq } from "drizzle-orm"
import { db, tables } from "~/server/database"
import getRouteIntParam from "~/server/utils/getRouteParamInt"
import { trimLowercase } from "~/server/utils/trimLowercase"
import { OmitTimestamps } from "~/utils/types"

export default roleHandler(['inventory_manager', 'admin'], async (event) => {
    const id = getRouteIntParam(event, 'id')
    // no need to specify the type (id,name), but for example purposes
    const body: {id:number, name:string} = await readBody<OmitTimestamps<typeof tables.supplyCategories.$inferSelect>>(event)
    const categories = await db.update(tables.supplyCategories)
        .set({
            id: body.id,
            name: trimLowercase(body.name),
            updatedAt: new Date(),
            createdAt: undefined,
        })
        .where(eq(tables.supplyCategories.id, id))
})
