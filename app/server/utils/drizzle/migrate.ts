import { db } from "~/server/database"

export const migrationsFolder = {
    migrationsFolder: "/server/database/migrations",
}
export async function migrate() {
    if (process.env.USE_DATABASE_URL == 'true') {
        const { migrate } = await import("drizzle-orm/postgres-js/migrator")
        console.log("Migrating using postgres-js")
        await migrate(db as any, migrationsFolder)
    } else {
        const { migrate } = await import("drizzle-orm/vercel-postgres/migrator")
        console.log("Migrating using vercel-postgres")
        await migrate(db as any, migrationsFolder)
    }
}
