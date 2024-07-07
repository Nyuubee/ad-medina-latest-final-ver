import { eq } from "drizzle-orm";
import { db, tables } from "~/server/database";

export default eventHandler(async (event) => {
    const body = await readBody<typeof tables.treatment.$inferInsert>(event);
    
    const treatment = await db.insert(tables.treatment).values({
        ...body,
        // nextAppointment: undefined,
        createdAt: undefined,
    }).returning()
    .then(takeUniqueOrThrow);

    return treatment
})
