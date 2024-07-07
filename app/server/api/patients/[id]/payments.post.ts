import { db, tables } from "~/server/database"
import { PaymentMethodEnum } from "~/server/database/schema/payment"
type RequestBody = Omit<typeof tables.treatment.$inferInsert,
  'id' | 'createdAt' | 'updatedAt' | 'amountChargedCentavos' | 'amountChargedPaid'> & {
    method: typeof tables.payment.$inferInsert.method
  }
export default eventHandler(async (event) => {
  const { method, ...body } = await readBody<RequestBody>(event)
  console.log(body)

  if (body.amountPaidPesos <= 0) {
    throw createError({
        statusCode: 400,
        statusMessage: 'Amount charged must be greater than 0'
    })
  }
  const amountPaidCentavos = body.amountPaidPesos * 100
  const result = await db.insert(tables.treatment)
    .values({
      amountChargedCentavos: body.amountPaidPesos * 100,
      procedure: body.procedure,
      toothNumbers: body.toothNumbers,
      nextAppointment: body.nextAppointment,
      patientId: body.patientId,
      doctorId: body.doctorId,
    }).returning({
      id: tables.treatment.id,
    })

  // check cash payments
  for await (const r of result) {
    event.$fetch("/api/payments", {
      method: "POST",
      body: {
        amountPaidCentavos,
        method,
        treatmentId: r.id
      }
    })
    // early break, since there should only be one result
    break;
  }
})
