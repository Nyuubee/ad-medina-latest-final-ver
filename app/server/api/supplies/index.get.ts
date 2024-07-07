import { db, tables } from "~/server/database"
import { SearchConfig } from "~/server/utils/drizzle"
import { handler as getSuppliers } from "./suppliers/index.get"
import { handler as getCategories } from "./categories/index.get"
import { and, desc, eq, lte, sql } from "drizzle-orm"
import { sum } from "~/utils/array"
import { totalQuantity } from "./[id]/remaining.get"

//First define a config object that will be used to search the table
export const suppliesSearchConfig: SearchConfig = {
    id: {
        action: 'exact',
        column: tables.supplies.id,
    },
    name: {
        action: 'ilike',
        column: tables.supplies.name,
    },
    startend: {
        action: 'between',
        column: tables.supplies.createdAt,
        args: {
            queryKeyStart: 'start',
            queryKeyEnd: 'end',
        }
    },
    supplierId: {
        action: 'any',
        column: tables.supplies.supplierId,
    },
    categoryId: {
        action: 'any',
        column: tables.supplies.categoryId,
    },
    // anyCritical: {
    //     action: 'gte',
    //     column: tables.supplies.criticalLevel,
    // }
}

export const CriticalConfig = {
    anyCritical: {
        action: 'gte',
        column: tables.supplies.criticalLevel,
    }
}
type Query = Omit<typeof tables.supplies.$inferSelect, "supplierId" | "categoryId"> & {
    supplier?: string
    category?: string
    supplierId?: number[]
    categoryId?: number[]
    isCritical?: boolean
}
export default roleHandler(['inventory_manager', 'admin'], async (event) => {
    // Then, use the table schema to infer the select type
    const query = getQueryWithLimitOffset<Query>(event)
    if (query.supplier) {
        const suppliers = await getSuppliers({
            name: query.supplier,
        })
        if (suppliers.length === 0) {
            return []
        }
        query.supplierId = suppliers.map(s => s.id)
    }
    if (query.category) {
        const categories = await getCategories({
            name: query.category,
        })
        if (categories.length === 0) {
            return []
        }
        query.categoryId = categories.map(c => c.id)
    }
    // hack the query to include the critical level
    let where = transformSearch(suppliesSearchConfig, query)
    // const supplies = await db.query.supplies.findMany({
    //     where,
    //     orderBy: [desc(tables.supplies.createdAt)],
    //     limit: query.limit,
    //     offset: query.offset,
    //     with: {
    //         category: true,
    //         supplier: true,
    //         supplyUsage: {
    //             columns: {
    //                 quantityUsed: true,
    //             },
    //         },
    //     }
    // })
    // SQL version of the above code:
    const totalQuantityUsedSq = db.$with('totalQuantityUsed').as(totalQuantity());
    // Get the supply and its usage
    // remaining and isCritical subquery
    const isCritical = () => sql`${tables.supplies.quantity} - ${totalQuantityUsedSq.quantityUsed} <= ${tables.supplies.criticalLevel}`
    const usageQuery = db.with(totalQuantityUsedSq).selectDistinct({
        id: tables.supplies.id,
        quantity: tables.supplies.quantity,
        quantityUsed: sql<number>`COALESCE(${totalQuantityUsedSq.quantityUsed}, 0)`.mapWith(Number),
        quantityLeft: sql`${tables.supplies.quantity} - COALESCE(${totalQuantityUsedSq.quantityUsed}, 0)`.mapWith(Number).as('quantityLeft'),
        isCriticalLevel: sql`COALESCE(${isCritical()}, false)`
            .mapWith(Boolean).as('isCriticalLevel'),
        name: tables.supplies.name,
        criticalLevel: tables.supplies.criticalLevel,
        createdAt: tables.supplies.createdAt,
        supplier: tables.suppliers.name,
        category: tables.supplyCategories.name,
        unit: tables.supplies.unit,
    }).from(tables.supplies)
        .leftJoin(tables.suppliers, eq(tables.supplies.supplierId, tables.suppliers.id))
        .leftJoin(tables.supplyCategories, eq(tables.supplies.categoryId, tables.supplyCategories.id))
        .leftJoin(totalQuantityUsedSq, eq(tables.supplies.id, totalQuantityUsedSq.supplyId))
        .limit(query.limit)
        .offset(query.offset)
        .orderBy(desc(tables.supplies.createdAt))
        .groupBy(totalQuantityUsedSq.quantityUsed, tables.supplies.id, tables.supplies.name, tables.supplies.quantity, tables.supplies.criticalLevel, tables.supplies.createdAt, tables.suppliers.name, tables.supplyCategories.name)
        .where(
            and(
                where,
                query.isCritical ? isCritical() : sql`true`,
            )
        )

    const supplies = await usageQuery
    // now head on over to ./count.get.ts for pagination

    return supplies
})
