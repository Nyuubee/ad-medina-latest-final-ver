import { count, desc, eq, sum } from "drizzle-orm";
import { db, tables } from "~/server/database";
import { SearchConfig, transformSearch } from "~/server/utils/drizzle"
import { PaymentMethodTypes } from "~/utils/payment"    

export const paymentSearch: SearchConfig ={
    id: {
        action: 'exact',
        column: tables.payment.id,
    },
    method: {
        action: 'exact',
        column: tables.payment.method,
    },
    startend: {
        action: 'between',
        column: tables.payment.createdAt,
        args: {
            queryKeyStart: 'start',
            queryKeyEnd: 'end',
        }
    }
}
export type Query = {
    limit?: number
    offset?: number,
    start: string,
    end: string,
    id?: number | number[],
    method: PaymentMethodTypes
}
export default eventHandler(async (event) => {
    const { limit, offset, ...query } = getQueryWithLimitOffset<Query>(event)
    const payments = await db.query.payment.findMany({
        limit,
        offset,
        orderBy: [desc(tables.payment.updatedAt)],
        where: transformSearch(paymentSearch, query)
    })
    return payments
})
