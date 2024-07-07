import { db } from "~/server/database"
import getRouteIntParam from "~/server/utils/getRouteParamInt"
export default eventHandler(async (event) => {
    const dentalChartId = getRouteIntParam(event, 'id')
    const dentalChart = await db.query.dentalChart.findFirst({
        where: (dentalChart, { eq }) => (eq(dentalChart.id, dentalChartId)),
        with: {
            intraoralExam: {
                columns: {
                    id: true,
                },
            },
            treatment: {
                columns: {
                    id: true,
                },
            },
            user: true,
            patient: true,
        }
    })
    console.log(dentalChart)
    if (dentalChart == undefined) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Dental Chart Not Found',
        })
    }
    const {patient, user:doctor,lastDentalVisit,previousDentist,allergies:_allergies, intraoralExam, ...medicalHistory} = dentalChart
    const allergies = _allergies ?? []

    if (medicalHistory.otherAllergy) {
        allergies.push(medicalHistory.otherAllergy)
    }
    return {
        id: dentalChartId,
        doctor,
        patientInfo: patient,
        intraoralExam,
        medicalHistory: {
            ...medicalHistory,
            underMedicalTreatment: medicalHistory.medicalCondition.length > 0,
            takingMedication: medicalHistory.prescribedOrNonprescribedMedicine.length >0,
            seriousIllnessOrOperation: medicalHistory.illnessOperation.length > 0,
            illnessOperation: medicalHistory.illnessOperation,
            hospitalized: medicalHistory.hospitalizationReason.length > 0,
            allergies,
            bloodPressure: {
                diastolic: medicalHistory.bloodDiastolicPressure,
                systolic: medicalHistory.bloodSystolicPressure,
            }
        },
        dentalHistory: {
            lastDentalVisit: lastDentalVisit,
            previousDentist: previousDentist,
        }
    }
})
