import { eq } from "drizzle-orm"
import { QueryResult } from "pg"
import { db, tables } from "~/server/database"
import getRouteIntParam from "~/server/utils/getRouteParamInt"
import { FormRequest } from "~/utils/records"
import { normalizePatientInfo, combineAndNormalizeDentalMedicalHistory } from "../index.post"

interface UpdateFormRequst {
    id: number
    patientInfo: FormRequest['patientInfo'] & { id: number }
    dentalHistory: FormRequest['dentalHistory'] & { id: number }
    medicalHistory: FormRequest['medicalHistory'] & { id: number }
}
type DentalChart = { id: number } & typeof tables.dentalChart.$inferInsert
export default eventHandler(async (event) => {
    const { patientInfo, dentalHistory, medicalHistory, ...body } = await readBody<UpdateFormRequst>(event)
    const dentalChartId = getRouteIntParam(event, 'id')
    if (body.id !== dentalChartId) {
        // Mismatch
        throw createError({
            status: 400,
            statusMessage: 'ID in body does not match ID in URL query',
        })
    }
    // update patient
    console.log("updating patient")
    const patient: QueryResult<never> = await db
        .update(tables.patient)
        .set({
            ...normalizePatientInfo(patientInfo),
            updatedAt: undefined,
            createdAt: undefined,
        })
        .where(eq(tables.patient.id, patientInfo.id))
    console.log("updated patient info")
    console.log("updating dental chart")
    const result: QueryResult<never> = await db
        .update(tables.dentalChart)
        .set({
            ...combineAndNormalizeDentalMedicalHistory({ dentalHistory, medicalHistory }),
            updatedAt: undefined,
            createdAt: undefined,
        })
        .where(eq(tables.dentalChart.id, dentalChartId))
    console.log("PATCHED")
})



