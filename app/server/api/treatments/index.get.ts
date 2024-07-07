import { eq, isNull } from "drizzle-orm"
import { db, tables } from "~/server/database"

export default eventHandler(async (event) => {
  const { limit = 10, offset = 0, dentalChartId } = getQuery<{
    limit: number
    offset: number,
    dentalChartId: number
  }>(event)
  const treatments = await db.query.treatment.findMany({
    limit,
    offset,
    where: eq(tables.treatment.dentalChartId, dentalChartId),
    with: {
      payments: {
        where: isNull(tables.payment.voidedAt),
      },
      dentalChart: {
        columns: {
          id: true,
        },
        with: {
          user: {
            columns: {
              id: true,
              firstName: true,
              lastName: true,
              middleName: true,
              suffix: true,
            }
          },
        }
      }
    }
  })
  console.log("TREATMENTS", treatments)
  return treatments
})  
