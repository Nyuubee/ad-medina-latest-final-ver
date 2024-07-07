import { eq, sum } from "drizzle-orm"
import { db, tables } from "~/server/database"

interface PaymentBody {
    amountPaidCentavos: number
    method: typeof tables.payment.$inferInsert.method
    treatmentId: number
}
export default eventHandler<{body:PaymentBody}, Promise<{id:number}[]>>(async (ev) => {

    const body = await readBody(ev)

    if (body.amountPaidCentavos <= 0) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Amount paid must be greater than 0'
        })
    }

    console.log(body)
    const returned = await db.insert(tables.payment)
        .values({
            amountPaidCentavos: body.amountPaidCentavos,
            method: body.method,
            treatmentId: body.treatmentId
        }).returning({
            id: tables.payment.id
        })
    return returned
})
