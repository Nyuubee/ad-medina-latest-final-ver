import { eq } from "drizzle-orm"
import { db, tables } from "~/server/database"
import { CONFIG_ID } from "~/server/utils/drizzle/registerUser"

// Allows changing the config in the admin panel
export default roleHandler(['admin'], async (event) => {
    const body = await readBody<typeof tables.config.$inferInsert>(event)
    const result = await db.update(tables.config).set({
        ...body,
        updatedAt: new Date(),
        createdAt: undefined,
    }).where(
        eq(tables.config.id, CONFIG_ID)
    )
    return crypto.randomUUID()
})
