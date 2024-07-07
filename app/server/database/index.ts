import { schema } from "./tables"
export { tables } from "./tables"
import { sql } from '@vercel/postgres';
import { drizzle as vercelDrizzle } from 'drizzle-orm/vercel-postgres';
//
import { drizzle as postgresDrizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
function logMode(mode: 'SUPABASE' | 'POSTGRES' | 'VERCEL') {
    console.log(`DRIZZLE:DATABASE: Using ${mode}`)
}
function setup() {
    if (process.env.USE_DATABASE_URL == 'true' && process.env.DATABASE_URL) {
        if (process.env.DATABASE_URL.includes('supabase')) {
            logMode('SUPABASE')
        } else {
            logMode('POSTGRES')
        }
        const client = postgres(process.env.DATABASE_URL,{prepare: false});
        return postgresDrizzle(client, { schema })
    }
    logMode('VERCEL')
    return vercelDrizzle(sql, { schema })
}
export const db = setup()
