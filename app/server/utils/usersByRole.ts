import { eq } from "drizzle-orm"
import { db, tables } from "~/server/database"

export async function usersByRole(role: typeof tables.user.$inferSelect.role) {
    return db.select()
        .from(tables.user)
        .where(eq(tables.user.role, role))
}
