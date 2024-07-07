import { derivePassword } from "@clinic/crypto"
import { eq } from "drizzle-orm"
import { db, tables } from "~/server/database"

export default roleHandler(['admin'], async (event) => {
    const body = await readBody<{ userId: number, password: string }>(event)
    const auth = await db.query.auth.findFirst({
        where: eq(tables.auth.userId, body.userId),
        columns: {
            salt: true,
        }
    })
    if (auth) {
        const argon2HashedPassword = await derivePassword(body.password, auth.salt)
        await db.update(tables.auth).set({
            userId: body.userId,
            password: argon2HashedPassword,
        }).where(eq(tables.auth.userId, body.userId))
    }

})
