import { derivePassword } from "@clinic/crypto"
import { eq } from "drizzle-orm"
import { db, tables } from "~/server/database"

export async function getVerificationCodeByEmail(email: string) {
    return db.query.user.findFirst({
        where: eq(tables.user.email, email),
        columns: {
            id: true,
            email:true,
        },
        with: {
            forgotPassword: true,
            auth: {
                columns: {
                    salt: true,
                }
            }
        }
    })
}

export function prepExpiry(expiry_in_seconds: number) {
    return (entry: typeof tables.forgotPassword.$inferSelect) => _hasExpired(entry, expiry_in_seconds)
}
export function _hasExpired(entry: typeof tables.forgotPassword.$inferSelect, expiry_in_seconds: number) {
    const createdAtTime = entry.createdAt.getTime()
    const expiryAt = new Date(createdAtTime)
    expiryAt.setSeconds(expiryAt.getSeconds() + expiry_in_seconds)
    const now = new Date()
    console.log('NOW', now.toTimeString(), 'EXPIRY', expiryAt.toTimeString(), 'GRACE', expiry_in_seconds)
    return expiryAt < now
}

export const hasExpired = prepExpiry(parseInt(process.env.RESET_PASSWORD_EXPIRY_IN_SECONDS!))

export function throwIfExpired(entry: typeof tables.forgotPassword.$inferSelect) {
    if (hasExpired(entry)) {
        throw createError({
            status: 403,
            statusMessage: 'Code has expired',
        })
    }
}
export default eventHandler(async( event) => {
    const { email, code, newPassword } =await readBody<{ email: string, code: string, newPassword: string }>(event)
    const user = await getVerificationCodeByEmail(email)
    if (user == null) {
        throw createError({
            status: 404,
            statusMessage: 'User not found',
        })
    }

    if (user.forgotPassword == null) {
        throw createError({
            status: 403,
            statusMessage: 'No code found',
        })
    }
    if (user.forgotPassword.code !== code) {
        throw createError({
            status: 403,
            statusMessage: 'Invalid code',
        })
    }
    throwIfExpired(user.forgotPassword)
    const hashedSaltedPassword = await derivePassword(newPassword, user.auth.salt)
    await db.update(tables.auth).set({
        password: hashedSaltedPassword,
    }).where(eq(tables.auth.userId, user.id))

    // delete the verification code
    await db.delete(tables.forgotPassword)
        .where(eq(tables.forgotPassword.userId, user.id))
})
