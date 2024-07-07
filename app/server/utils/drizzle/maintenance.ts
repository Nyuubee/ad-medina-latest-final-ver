import { db, tables } from "~/server/database";
import { user_actions } from "~/server/database/schema/maintenance";
import { type OmitIdAndTimestamps } from "~/utils/types";
import { migrate } from "./migrate";

export async function canLog() {
    return db.query.config.findFirst({
        columns: {
            LOGGING_ENABLED: true
        },
    })
}
export async function logAction(data:OmitIdAndTimestamps<typeof user_actions.$inferInsert>) {
    return db.insert(user_actions)
        .values(data)
}

export async function addConfigOrDoNothing() {
    const existing = await db.query.config.findFirst({
        columns: {
            id: true,
        }
    })
    if (existing) {
        console.log('MAINTENANCE: config exists, skipping...')
        return
    } else {
        console.log('MAINTENANCE: Adding default config...')
    }
    await db.insert(tables.config).values({
        id: 1,
        USER_REGISTRATION_ENABLED: process.env.USER_REGISTRATION_ENABLED == 'true',
        RESET_VERIFICATION_TOKEN_VALIDITY_IN_SECONDS: parseInt(process.env.RESET_VERIFICATION_TOKEN_VALIDITY_IN_SECONDS ?? '300'),
    })
}

/**
 * Run `addConfigOrDoNothing` first
 */
export async function addAdminIfMissing() {
    console.log('MAINTENANCE: Adding admin user...')
    const username = process.env.ADMIN_USERNAME
    const password = process.env.ADMIN_PASSWORD
    // if unset, log the errors
    if (!username) {
        console.log('ENV: ADMIN_USERNAME is not set')
    }
    if (!password) {
        console.log('ENV: ADMIN_PASSWORD is not set')
    }
    if (!username || !password) {
        return
    }
    // check if user exists
    const userAuth = await db.query.auth.findFirst({
        where:(fields, {eq}) => eq(fields.username, username),
        with: {
            user: {
                with: {
                    roles: true
                }
            }
        }
    })
    if (userAuth?.user) {
        const {userRole} = await import("~/server/database/schema/user")
        if (userAuth.user.roles.find(r => r.role == 'admin')) {
            console.log('MAINTENANCE: admin exists, skipping...')
        } else {
            // adding admin role
            await db.insert(userRole).values({
                userId: userAuth.user.id,
                role: 'admin'
            })
        }
        return
    }
    const { sha256Hex } = await import("@clinic/crypto")
    const { registerWithCredentials } = await import("~/server/utils/drizzle/registerUser")
    // like the frontend, the password must be hashed first
    await registerWithCredentials(username, await sha256Hex(password),true,'admin')

    console.log(`MAINTENANCE: admin ${username} created`)
}

export async function init() {
    // migrations
    // console.log('Running migrations...')
    // await migrate()
    console.log('Initializing database config and admin user...')
    await addConfigOrDoNothing()
    await addAdminIfMissing()
    console.log('Database config and admin user initialized')
}
