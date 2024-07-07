import { and, eq, sql } from "drizzle-orm";
import { db, tables } from "~/server/database";
import { gmailTransporter } from "../../../utils/email";
import { H3Event, EventHandlerRequest } from "h3"
interface SupplyUsageReport {
  id: number
  name: string
  quantityOriginal: number
  quantityUsed: number
  quantityRemaining: number
  isCritical: boolean
}

/**
 * @returns a subquery that calculates the total quantity used for each supply
 */
export function totalQuantity() {
  return db
    .select({
      supplyId: tables.supplyUsage.supplyId,
      quantityUsed: sql`COALESCE(sum(${tables.supplyUsage.quantityUsed}), 0)`
        .mapWith(Number).as('quantityUsed')
    })
    .from(tables.supplyUsage)
    .groupBy(tables.supplyUsage.supplyId)
}
export function usageQuery(supplyId: number) {
  const totalQuantityUsedSq = db.$with('totalQuantityUsed')
    .as(
      totalQuantity()
        .where(eq(tables.supplyUsage.supplyId, supplyId))
    )
  // Get the supply and its usage
  return db.with(totalQuantityUsedSq).select({
    id: tables.supplies.id,
    name: tables.supplies.name,
    quantityOriginal: tables.supplies.quantity,
    quantityUsed: totalQuantityUsedSq.quantityUsed,
    quantityRemaining: sql`${tables.supplies.quantity} - ${totalQuantityUsedSq.quantityUsed}`.mapWith(Number).as('quantityRemaining'),
    isCritical: sql`${tables.supplies.quantity} - ${totalQuantityUsedSq.quantityUsed} <= ${tables.supplies.criticalLevel}`
      .mapWith(Boolean).as('isCritical'),
  }).from(tables.supplies)
    .where(eq(tables.supplies.id, supplyId))
    .leftJoin(totalQuantityUsedSq, eq(tables.supplies.id, totalQuantityUsedSq.supplyId))
}
export async function getUsageReport(supplyId: number): Promise<SupplyUsageReport | null> {
  const result = await usageQuery(supplyId)
  if (result.length == 0) {
    return null
  }

  return result[0]
}

export async function sendCriticalEmail(supply: SupplyUsageReport) {
  // find all inventory managers with emails, then send a notif if low
  const inventoryMgrs = await db.query.userRole.findMany({
    where: and(
      eq(tables.userRole.role, 'inventory_manager'),
    ),
    with: {
      user: {
        columns: {
          id: true,
          email: true,
        }
      }
    }
  })

  // low supplies html table
  const html = `
    <html>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Supply Name</th>
                    <th>Quantity</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${supply.id}</td>
                    <td>${supply.name}</td>
                    <td>${supply.quantityRemaining}</td>
                </tr>
            </tbody>
        </table>
    </html> 
    `

  const transporter = gmailTransporter()
  for (const m of inventoryMgrs) {
    if (m.user.email) {
      console.log("sending critical email to", m.user.email)
      await transporter.sendMail({
        subject: 'Low Supplies | AD Medina Dental Clinic',
        from: `AD Medina Clinic Support ${process.env.NODEMAILER_EMAIL}`,
        to: m.user.email!,
        html,
      })
    }
  }

}
export async function handler(event: H3Event<EventHandlerRequest>) {
  const supplyId = getRouteParamInt(event, 'id');
  return await getUsageReport(supplyId)
}
export default roleHandler(['inventory_manager', 'admin'], handler)
