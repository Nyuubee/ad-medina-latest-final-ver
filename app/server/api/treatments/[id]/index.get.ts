import { eq, sum } from "drizzle-orm"
import { db, tables } from "~/server/database"
import getRouteIntParam from "~/server/utils/getRouteParamInt"
/**
 * treatment.id => treatment
 */
export default eventHandler(async (event) => {
    const id = getRouteIntParam(event, 'id')
    const treatment = await db.query.treatment.findFirst({
        where: eq(tables.treatment.id, id),
        with: {
            payments: true,
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
                    intraoralExam: {
                        columns: {
                            id: true,
                            createdAt: true,
                        },
                        with: {
                            toothConditions: {
                                columns: {
                                    id: true,
                                    toothId: true,
                                }
                            }
                        }
                    }
                }
            }
        }
    })
   
    return treatment
})


