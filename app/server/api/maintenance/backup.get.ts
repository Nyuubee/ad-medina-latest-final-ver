import { PgTable } from "drizzle-orm/pg-core"
import { db } from "~/server/database"
export async function getAllTables() {
    const { tables } = await import("~/server/database")
    const pgTables: [string, PgTable][] = Object.entries(tables)
    .filter(([_, entity]) => entity instanceof PgTable) as any
    return pgTables
}
export default roleHandler(['admin'], async (event) => {
    event.headers.set('Content-Type', 'application/json')
    const date = new Date()
    const stream = new ReadableStream<string>({
        async start(controller) {
            controller.enqueue(`{"backuptime": "${date.toISOString()}", "data": `)
            const pgTables = await getAllTables()
            controller.enqueue('[')
            //  keep only pgTables
            let i = pgTables.length
            for await (const [name, entity] of pgTables) {
                const rows = await db.select().from(entity)
                controller.enqueue(JSON.stringify([name, rows]))
                if (i > 1) {
                    controller.enqueue(',')
                }
                i--
            }
            controller.enqueue(']')
            controller.enqueue('}')
            controller.close()
        }
    })

    return stream
})
