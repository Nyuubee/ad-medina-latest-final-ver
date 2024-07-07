import { eq } from "drizzle-orm"
import { db, tables } from "~/server/database"
import { Roles } from "~/server/database/schema"
import { takeUniqueOrThrow } from "../takeUniqueOrThrow";
import { randomSalt, arrayBufferToHex, derivePassword } from "@clinic/crypto";
export const CONFIG_ID = 1;

export async function selectConfig() {
    return db.query.config.findFirst({
        where: eq(tables.config.id, CONFIG_ID)
    })
}
export async function registerWithCredentials(username: string, password: string, dangerouslyDisregardEnv: boolean = false, role?: Roles) {
    const saltBuffer = randomSalt()
    const saltHex = arrayBufferToHex(saltBuffer)
    const hashedSaltedPassword = await derivePassword(password, saltHex)
    return await register(username, saltHex, hashedSaltedPassword, dangerouslyDisregardEnv, role)
}
export async function register(username: string, salt: string, password: string, dangerouslyDisregardEnv: boolean = false, role?: Roles) {
    // create a user record
    //TODO: Let user change these fields later
    const config = await selectConfig()
    if (!(config?.USER_REGISTRATION_ENABLED || dangerouslyDisregardEnv)) {
        throw createError({
            statusCode: 403,
            statusMessage: "User registration is disabled"
        })
    }
    await db.transaction(async (db) => {
        const user = await db.insert(tables.user).values({
            firstName: '',
            middleName: '',
            lastName: '',
            phone: '',
            sex: 'male',
            suffix: '',
        }).returning()
            .then(takeUniqueOrThrow)

        // create an auth record
        const auth = await db.insert(tables.auth).values({
            userId: user.id,
            password,
            salt,
            username,
        })

        // add role if set
        if (role) {
            await db.insert(tables.userRole).values({
                userId: user.id,
                role,
            })
        }
    })

    return true
}
