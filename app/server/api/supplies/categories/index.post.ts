import { db, tables } from "~/server/database"

export default roleHandler(['inventory_manager', 'admin'], async (event) => {
    const body = await readBody<typeof tables.supplyCategories.$inferSelect>(event)
    const category = await db.insert(tables.supplyCategories).values(body)
})
