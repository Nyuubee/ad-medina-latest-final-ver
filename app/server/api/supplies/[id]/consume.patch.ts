import { and, eq, lte, sql, sum } from "drizzle-orm";
import { db, tables } from "~/server/database";
import {getToken} from "#auth"
import { sum as sumArray } from "~/utils/array";
import { getUsageReport, sendCriticalEmail } from "./remaining.get";
export default roleHandler(['admin', 'inventory_manager'], async (event) => {
    const supplyId = getRouteParamInt(event, 'id');
    const token = (await getToken({ event }))!;
    const body = await readBody<{
        id: number,
        quantityUsed: number,
    }>(event);
    const current = await db.query.supplies.findFirst({
        where: eq(tables.supplies.id, supplyId),
        with: {
            supplyUsage: {
                columns: {
                    quantityUsed: true,
                }
            },
        }
    });

    if (!current) {
        throw createError({
            statusMessage: 'Supply not found',
            statusCode: 404,
        })
    }
    
    const remaining = current?.quantity - sumArray(current?.supplyUsage, 'quantityUsed')

    if (remaining < body.quantityUsed) {
        throw createError({
            statusMessage: 'Insufficient quantity',
            statusCode: 400,
        })
    }

    await db.insert(tables.supplyUsage).values({
        supplyId: supplyId,
        userId: token.id,
        quantityUsed: body.quantityUsed,
    }).returning()

    const usageReport = await getUsageReport(supplyId)
    if (usageReport?.isCritical) {
        await sendCriticalEmail(usageReport)
    }

    return true
})

