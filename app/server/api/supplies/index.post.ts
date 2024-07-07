import { eq } from "drizzle-orm"
import { db, tables } from "~/server/database"
import { trimLowercase } from "~/server/utils/trimLowercase"

export default roleHandler(['inventory_manager', 'admin'], async (event) => {
    let {supplier, category, ...body} = await readBody<typeof tables.supplies.$inferSelect & {
        supplier: string
        category: string
    }>(event)
    // add supplier
    supplier = trimLowercase(supplier)
    category = trimLowercase(category)
    console.log(body)

    // check if suppliers and categories exist
    let s = await db.query.suppliers.findFirst({
        where: eq(tables.suppliers.name, supplier)
    })
    let c = await db.query.supplyCategories.findFirst({
        where: eq(tables.supplyCategories.name, category)
    })

    const newSupplyOrError = await db.transaction(async (db) => {
        // more or less the same as the patch.ts file
        if (!s) {
            const ss = await db.insert(tables.suppliers).values({ name: supplier }).returning()
            s = ss[0]
        }
        if (!s) {
            return 'no-supplier'
        }
        if (!c) {
            const cc = await db.insert(tables.supplyCategories).values({ name: category }).returning()
            c = cc[0]
        }

        if (!c) {
            return 'no-category'
        }

        return db.insert(tables.supplies).values({
            ...body,
            supplierId: s.id,
            categoryId: c.id
        })
    })

    if (newSupplyOrError == 'no-supplier') {
        throw createError({
            statusCode: 400,
            statusText: 'No supplier found'
        })
    }

    if (newSupplyOrError == 'no-category') {
        throw createError({
            statusCode: 400,
            statusText: 'No category found'
        })
    }

    console.log("added supply", newSupplyOrError)

    return 'success'
})
