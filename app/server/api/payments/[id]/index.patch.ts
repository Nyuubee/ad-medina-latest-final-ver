import { eq } from "drizzle-orm"
import { db } from "~/server/database"
import { payment } from "~/server/database/schema"
import getRouteIntParam from "~/server/utils/getRouteParamInt"

export default roleHandler(['admin', 'doctor', 'receptionist'], async (event) => {
    // here, only allow voiding payments
    const paymentId = getRouteIntParam(event, 'id')
    const {voided} = await readBody<{
        voided: boolean
    }>(event)
    const result = await db.update(payment).set({
        id: paymentId,
        voidedAt: voided ? new Date() : null,
    }).where(eq(payment.id, paymentId))
})
