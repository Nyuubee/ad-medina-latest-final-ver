import {getToken}  from "#auth";
import { db, tables } from "~/server/database";
import { desc, inArray, sql } from "drizzle-orm";
import { patientSearch } from "./count.get"

export default eventHandler(async (event) => {
    const token = (await getToken({event}))!
    let { limit, offset = 0, ...query } = getQueryWithLimitOffset(event)
    limit = applyGlobalLimit(limit)
    let patientIdsSubQuery = db.select({
        id: tables.patient.id,
    }).from(tables.patient)
    .where(transformSearch(patientSearch, query))
    const dentalCharts = await db.query.dentalChart.findMany({
        columns: {
            id: true,
            updatedAt: true,
            createdAt: true,
        },
        orderBy: [desc(tables.dentalChart.updatedAt)],
        where: sql`COALESCE(${inArray(tables.dentalChart.patientId, patientIdsSubQuery)})`,
        limit,
        offset,
        with: {
            patient: {
                columns: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    middleName: true,
                },
            },
            intraoralExam: {
                columns: {
                    id:true
                }
            },
            treatment: {
                columns: {
                    id:true,
                    procedure:true,
                    updatedAt:true,
                    createdAt: true,
                }
            }
        },
    })
    return dentalCharts
})
