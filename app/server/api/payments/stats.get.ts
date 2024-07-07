import { and, between, eq, isNull, sql } from "drizzle-orm"
import { db, tables } from "~/server/database"
type SupportedIntervals = "day" | "week" | "month" | "year"
export default eventHandler(async (event) => {
    const query = getQuery<{
        interval: SupportedIntervals,
        start: string,
        length?: number,
    }>(event)
    if (query.length === undefined) {
        query.length = 1
    }
    const start = new Date(query.start)
    const end = new Date(start)
    if (query.interval === "day") {
        end.setDate(start.getDate())
    } else if (query.interval === "week") {
        end.setDate(start.getDate() + query.length * 7)
    } else if (query.interval === "month") {
        end.setMonth(start.getMonth() + query.length)
    } else if (query.interval === "year") {
        end.setFullYear(start.getFullYear() + query.length)
    } else {
        throw new Error(`Unsupported interval: ${query.interval}`)
    }

    const where = and(
        // exclude voided payments
        isNull(tables.payment.voidedAt),
        // same day: abs(extract(day from A - B)) == 0
        query.interval == 'day' ? eq(sql`abs(extract(day from ${tables.payment.createdAt} - ${query.start}))`,0):
        between(
            tables.payment.createdAt,
            start,
            end,
        )
    )

    const payments = await db.select({
        totalPaidCentavos: sql<number>`sum(${tables.payment.amountPaidCentavos})`.mapWith(Number).as("totalPaidCentavos"),
    }).from(tables.payment)
        .where(where)
        .then(takeUniqueOrThrow)

    return {
        totalPaidCentavos: payments.totalPaidCentavos ?? 0,
    }
})
