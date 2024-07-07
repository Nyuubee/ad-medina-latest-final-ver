import { db, tables } from "~/server/database"
import getRouteIntParam from "~/server/utils/getRouteParamInt"
import { boolRecordWithBasisToList } from "~/utils/BoolRecord"
import { APPLIANCES_OPTIONS, OCCLUSION_OPTIONS, PERIODENTAL_SCREENING_OPTIONS, TMD_OPTIONS } from "~/utils/records/intraoralExam"

export default eventHandler(async (event) => {
    const intraoralExamId = getRouteIntParam(event, 'id')
    const intraoralExam = await db.query.intraoralExam.findFirst({
        where: (intraoralExam, { eq }) => (eq(intraoralExam.id, intraoralExamId)),
        columns: {
            id: true,
            createdAt: true,
            updatedAt: true,
        },
        with: {
            appliances: true,
            occlusion: true,
            periodentalScreening: true,
            TMD: true,
            xrayTaken: true,
            dentalChart: {
                columns: {
                    id:true,
                },
                with: {
                    patient: true
                }
            },
            toothConditions: true,
        }
    })
    if (intraoralExam == null) {
        throw createError({
            status: 404,
            message: 'Intraoral exam not found',
        })
    }
    return {
        ...intraoralExam,
        ids: {
            TMD: intraoralExam.TMD.id,
            periodentalScreening: intraoralExam.periodentalScreening.id,
            appliances: intraoralExam.appliances.id,
        },
        TMD: boolRecordWithBasisToList(TMD_OPTIONS, intraoralExam.TMD),
        periodentalScreening: boolRecordWithBasisToList(PERIODENTAL_SCREENING_OPTIONS, intraoralExam.periodentalScreening),
        appliances: boolRecordWithBasisToList(APPLIANCES_OPTIONS, intraoralExam.appliances),
        occlusion: {
            ...intraoralExam.occlusion,
            occlusion: boolRecordWithBasisToList(OCCLUSION_OPTIONS, intraoralExam.occlusion),
            otherAppliances: intraoralExam.appliances.others,
        }
    }
})
