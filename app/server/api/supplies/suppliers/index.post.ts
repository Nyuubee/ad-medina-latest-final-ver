import { db, tables } from "~/server/database"

export default roleHandler(['inventory_manager', 'admin'], async (event) => {
    const body = await readBody<typeof tables.suppliers.$inferSelect>(event)
    const supplier = await db.insert(tables.suppliers).values(body)
})
