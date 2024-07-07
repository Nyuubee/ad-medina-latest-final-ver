import { and, eq, notInArray, sql } from "drizzle-orm"
import { db, tables } from "~/server/database"
import getRouteIntParam from "~/server/utils/getRouteParamInt"

export interface IntraoralExam {
    dentalChart: {
        id: number
    }
    toothConditions: Omit<typeof tables.toothCondition.$inferSelect, 'intraoralExamId'>[]
    TMD: typeof tables.TMD.$inferSelect
    xrayTaken: typeof tables.xrayTaken.$inferSelect
    periodentalScreening: typeof tables.periodentalScreening.$inferSelect
    appliances: typeof tables.appliances.$inferSelect
    otherappliances: string
    occlusion: typeof tables.occlusion.$inferSelect
}

async function updateTeethConditions(intraoralExamId: number, toothConditions: IntraoralExam['toothConditions']) {
    // delete teeth conditions belong to the intraoral exam and not in the updated list
    console.log({intraoralExamId, toothConditions})
    return await db.transaction(async (tx) => {
        const withIntraoralExam = toothConditions.map(
            toothCondition => ({
                ...toothCondition,
                intraoralExamId: intraoralExamId,
            }))

        // delete teeth conditions belong to the intraoral exam and not in the updated list
        // filter null ids
        const UPDATED_TOOTH_RECORD_IDs = withIntraoralExam.map(tc => tc.id).filter(id => id != null)
        const deletedToothConditions = await tx.delete(tables.toothCondition)
            .where(
                and(
                    eq(tables.toothCondition.intraoralExamId, intraoralExamId), // belongs to the intraoral exam
                    // not in the updated list, when the updated list is empty, delete all
                    UPDATED_TOOTH_RECORD_IDs.length > 0 ? notInArray(tables.toothCondition.id, UPDATED_TOOTH_RECORD_IDs): sql`true`, 
                ))
            .returning();
        console.log('deleted tooth conditions', deletedToothConditions)

        for (const toothCondition of withIntraoralExam) {
            console.log('updating tooth condition', toothCondition)
            await tx.insert(tables.toothCondition).values({
                id: toothCondition.id,
                intraoralExamId: toothCondition.intraoralExamId,
                toothId: toothCondition.toothId,
                region: toothCondition.region,
                states: toothCondition.states,
            }).onConflictDoUpdate({
                target: tables.toothCondition.id,
                set: {
                    region: toothCondition.region,
                    states: toothCondition.states,
                    updatedAt: new Date(),
                },
            })
            console.log('updated tooth condition')
        }
    })
}
export default roleHandler(['doctor', 'admin'], async (event) => {
    // get the intraoral exam id from the route
    const intraoralExamId = getRouteIntParam(event, 'id')
    const intraoralExam = await readBody<IntraoralExam>(event)
    console.log("tooth conditions", intraoralExam.toothConditions)

    // Update teeth conditions in a transaction
    console.log("-- updating intraoral exam:teeth conditions -- ")
    if (intraoralExam.toothConditions.length === 0) {
        console.log('no teeth conditions to update')
    } else {
       await updateTeethConditions(intraoralExamId, intraoralExam.toothConditions)
    }
    console.log("-- updated intraoral exam:teeth conditions --")

    console.log('-- updating intraoral exam --')
    await db.transaction(async (tx) => {
        // update tmd
        console.log('updating tmd', intraoralExam.TMD)
        await tx.update(tables.TMD).set({
            id: intraoralExam.TMD.id,
            clenching: intraoralExam.TMD.clenching,
            clicking: intraoralExam.TMD.clicking,
            trismus: intraoralExam.TMD.trismus,
            muscleSpasm: intraoralExam.TMD.muscleSpasm,
            updatedAt: new Date(),
        }).where(eq(tables.TMD.id, intraoralExam.TMD.id))
        console.log('updated tmd')
        // update xray taken
        console.log('updating xray taken', intraoralExam.xrayTaken)
        await tx.update(tables.xrayTaken).set({
            id: intraoralExam.xrayTaken.id,
            cephalometric: intraoralExam.xrayTaken.cephalometric,
            panoramic: intraoralExam.xrayTaken.panoramic,
            periapical: intraoralExam.xrayTaken.periapical,
            tthNo: intraoralExam.xrayTaken.tthNo,
            occlusal: intraoralExam.xrayTaken.occlusal,
            others: intraoralExam.xrayTaken.others,
            updatedAt: new Date(),
        }).where(eq(tables.xrayTaken.id, intraoralExam.xrayTaken.id))
        console.log('updated xray taken')

        // update periodental screening
        console.log('updating periodental screening', intraoralExam.periodentalScreening)
        await tx.update(tables.periodentalScreening).set({
            id: intraoralExam.periodentalScreening.id,
            advancedPeriodontitis: intraoralExam.periodentalScreening.advancedPeriodontitis,
            earlyPeriodontitis: intraoralExam.periodentalScreening.earlyPeriodontitis,
            gingivitis: intraoralExam.periodentalScreening.gingivitis,
            moderatePeriodontitis: intraoralExam.periodentalScreening.moderatePeriodontitis,
            updatedAt: new Date(),
        }).where(eq(tables.periodentalScreening.id, intraoralExam.periodentalScreening.id))
        console.log('updated periodental screening')

        // // update appliances
        console.log('updating appliances', intraoralExam.appliances)
        await tx.update(tables.appliances).set({
            id: intraoralExam.appliances.id,
            orthodontic: intraoralExam.appliances.orthodontic,
            stayplate: intraoralExam.appliances.stayplate,
            others: intraoralExam.appliances.others,
            updatedAt: new Date(),
        }).where(eq(tables.appliances.id, intraoralExam.appliances.id))
        console.log('updated appliances')

        // update occlusion
        console.log('updating occlusion', intraoralExam.occlusion)
        await tx.update(tables.occlusion).set({
            id: intraoralExam.occlusion.id,
            crossbite: intraoralExam.occlusion.crossbite,
            midlineDeviation: intraoralExam.occlusion.midlineDeviation,
            molarClass: intraoralExam.occlusion.molarClass,
            overbite: intraoralExam.occlusion.overbite,
            overjet: intraoralExam.occlusion.overjet,
            updatedAt: new Date(),
        }).where(eq(tables.occlusion.id, intraoralExam.occlusion.id))
        console.log('updated occlusion')

        // update intraoral exam, currently only updating the updatedAt field since the other fields are foreign keys
        await tx.update(tables.intraoralExam).set({
            updatedAt: new Date(),
        }).where(eq(tables.intraoralExam.id, intraoralExamId))
        console.log('updated intraoral exam')
    })
    console.log('-- updated intraoral exam --')
})
