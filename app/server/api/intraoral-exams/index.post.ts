import { db, tables } from "~/server/database"
import { getToken } from '#auth'
import { type OmitIdAndTimestamps } from "~/utils/types"
import { type TMDOptions, type PeriodentalScreeningOptions } from "~/utils/records/intraoralExam"

interface IntraoralExam {
    dentalChart: {
        id: number
    }
    toothConditions: Omit<OmitIdAndTimestamps<typeof tables.toothCondition.$inferSelect>, 'intraoralExamId'>[]
    TMD: Record<TMDOptions, boolean>
    xrayTaken: OmitIdAndTimestamps<typeof tables.xrayTaken.$inferSelect>
    periodentalScreening: Record<PeriodentalScreeningOptions, boolean>
    appliances: OmitIdAndTimestamps<typeof tables.appliances.$inferSelect>
    otherAppliances: string
    occlusion: OmitIdAndTimestamps<typeof tables.occlusion.$inferSelect>
}

export default roleHandler(['admin', 'doctor'], async (event) => {
    const body = await readBody<IntraoralExam>(event)
    console.log('body', body)

    const result = await db.transaction(async (tx) => {
        const tmd = await tx.insert(tables.TMD).values(body.TMD).returning().then(takeUniqueOrThrow)
        const xrayTaken = await tx.insert(tables.xrayTaken).values(body.xrayTaken).returning().then(takeUniqueOrThrow)
        const periodentalScreening = await tx.insert(tables.periodentalScreening).values(body.periodentalScreening).returning().then(takeUniqueOrThrow)
        const appliances = await tx.insert(tables.appliances).values({
            orthodontic: body.appliances.orthodontic,
            stayplate: body.appliances.stayplate,
            others: body.appliances.others ? body.otherAppliances : '',
        }).returning().then(takeUniqueOrThrow)

        const occlusion = await tx.insert(tables.occlusion).values(body.occlusion).returning().then(takeUniqueOrThrow)
        const intraoralExam = await tx.insert(tables.intraoralExam).values({
            dentalChartId: body.dentalChart.id,
            periodentalScreeningId: periodentalScreening.id,
            occlusionId: occlusion.id,
            appliancesId: appliances.id,
            TMDId: tmd.id,
            xrayTakenId: xrayTaken.id,
        }).returning().then(takeUniqueOrThrow)

        // Insert the tooth conditions last
        const withIntraoralExam = body.toothConditions.map(
            toothCondition => ({ intraoralExamId: intraoralExam.id, ...toothCondition, }))
        const toothConditions = await tx.insert(tables.toothCondition)
            .values(withIntraoralExam).returning()

        return {
            intraoralExam,
            toothConditions,
            xrayTaken,
            periodentalScreening,
            appliances,
            occlusion,
        }
    })

    return result
})
