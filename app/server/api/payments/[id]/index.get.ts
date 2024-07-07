import getRouteIntParam from "~/server/utils/getRouteParamInt"
import { db, tables } from "~/server/database"
import { eq } from "drizzle-orm"

/**
 * Payment.id => Payment
 */
export default eventHandler(async (event) => {
    const paymentId = getRouteIntParam(event, 'id')
    const payment = await db.query.payment.findFirst({
        where: eq(tables.payment.id, paymentId)
    })
    return payment
})
