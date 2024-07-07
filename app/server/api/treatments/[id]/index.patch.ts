import { eq } from "drizzle-orm";
import { db, tables } from "~/server/database";

export default eventHandler(async (event) => {
    const id = getRouteParamInt(event, 'id');
    const body = await readBody<typeof tables.treatment.$inferInsert>(event);
    console.log('body', body)
    const treatment = await db.update(tables.treatment).set({
        amountChargedCentavos: body.amountChargedCentavos,
        dentalChartId: body.dentalChartId,
        nextAppointment: body.nextAppointment ?? undefined,
        procedure: body.procedure,
        toothNumbers: body.toothNumbers,
        updatedAt: new Date(),
    }).where(eq(tables.treatment.id, id))
})
