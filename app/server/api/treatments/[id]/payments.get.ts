import { and, eq, isNull, sql } from "drizzle-orm"
import { db, tables } from "~/server/database"
import getRouteIntParam from "~/server/utils/getRouteParamInt"
export default eventHandler(async (event) => {
    const id = getRouteIntParam(event, 'id')
    const query = withLimitOffset(getQuery(event))
    // subquery for summing payments
    // sum payments that are not voided
    const totalPaidCentavos = db.$with("sq").as(db.select({
        treatmentId: tables.payment.treatmentId,
        totalPaidCentavos: sql<number>`sum(${tables.payment.amountPaidCentavos})`.as("totalPaidCentavos"),
    }).from(tables.payment).groupBy(tables.payment.treatmentId).where(
        and(
            eq(tables.payment.treatmentId, id),
            isNull(tables.payment.voidedAt)
        )
    ))
    // const paymentsSQ = db.$with("payments").as(db.select().from(tables.payment).where(
    //     eq(tables.payment.treatmentId, id)
    // )) unfortunately, multiple CTEs doesn't seem to work
    const em = await db.with(totalPaidCentavos).select()
        .from(totalPaidCentavos)
        .rightJoin(tables.treatment,
            eq(
                tables.treatment.id, totalPaidCentavos.treatmentId
            ))
        .where(eq(tables.treatment.id, id))

    const {treatment, sq} = {
        sq:{totalPaidCentavos:0,...em[0].sq},
        treatment:em[0].treatment,
    }

    if (!treatment) {
        throw createError({
            status: 404,
            message: 'Treatment not found',
        })
    }
    // all payments belong to treatment
    const payments = await db.query.payment.findMany({
        limit: query.limit,
        offset: query.offset,
        where: eq(tables.payment.treatmentId, id),
    })

    const balanceCentavos = treatment.amountChargedCentavos - sq.totalPaidCentavos ;

    return {
        ...treatment,
        totalPaidCentavos: sq.totalPaidCentavos,
        balanceCentavos,
        totalPaidPesos: sq.totalPaidCentavos / 100,
        amountChargedPesos: treatment.amountChargedCentavos / 100,
        balancePesos: balanceCentavos / 100,
        payments,
    }
})
