import { eq } from "drizzle-orm"
import { db, tables } from "~/server/database"
import getRouteIntParam from "~/server/utils/getRouteParamInt"
import { trimLowercase } from "~/server/utils/trimLowercase"
import { OmitTimestamps } from "~/utils/types"

export default roleHandler(['inventory_manager', 'admin'], async (event) => {
    const id = getRouteIntParam(event, 'id')
    // no need to specify the type (id,name), but for example purposes
    const body = await readBody<OmitTimestamps<typeof tables.supplies.$inferSelect & { supplier: string, category: string }>>(event)
    body.supplier = trimLowercase(body.supplier)
    body.category = trimLowercase(body.category)
    // check if the supplier and category have changed based on id
    let supplier = await db.query.suppliers.findFirst({
        where: eq(tables.suppliers.name, body.supplier)
    })
    let category = await db.query.supplyCategories.findFirst({
        where: eq(tables.supplyCategories.name, body.category)
    })
    
    const errorStatus = await db.transaction(async (db) => {
        if (!supplier) {
            supplier = await db.insert(tables.suppliers)
                .values({ name: body.supplier })
                .onConflictDoNothing()
                .returning
                ().then(takeUniqueOrThrow)
        }

        if (!category) {
            category = await db.insert(tables.supplyCategories)
                .values({ name: body.category })
                .onConflictDoNothing()
                .returning()
                .then(takeUniqueOrThrow)
        }
        if (!supplier) {
            return 'no-supplier'
        }

        if (!category) {
            return 'no-category'
        }

        const supplies = await db.update(tables.supplies)
            .set({
                ...body,
                supplierId: supplier.id,
                categoryId: category.id,
                updatedAt: new Date(),
                createdAt: undefined,
            })
            .where(eq(tables.supplies.id, id))

        return undefined
    })

    if (errorStatus) {
        throw createError({
            statusCode: 400,
            statusText: `No ${errorStatus} found`
        })
    }

})
