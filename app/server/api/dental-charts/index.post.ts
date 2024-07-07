import { getToken } from "#auth"
import { db, tables } from "~/server/database"
import { FormRequest } from "~/utils/records"

export function normalizePatientInfo(patientInfo: FormRequest['patientInfo']): typeof tables.patient.$inferInsert {
    return {
        ...patientInfo,
        email: patientInfo.email ?? '',
        homeNumber: patientInfo.homeNumber ?? '',
        parentGuardian: patientInfo.parentGuardian ?? '',
        parentGuardianOccupation: patientInfo.parentGuardianOccupation ?? '',
        effectiveDate: patientInfo.effectiveDate == '' ? null : patientInfo.effectiveDate,
    }
}

export function combineAndNormalizeDentalMedicalHistory({ dentalHistory, medicalHistory }: { dentalHistory: FormRequest['dentalHistory'], medicalHistory: FormRequest['medicalHistory'] }): typeof tables.dentalChart.$inferInsert{
    return {
        // Dental history
        previousDentist: dentalHistory.previousDentist,
        lastDentalVisit: dentalHistory.lastDentalVisit,

        // Medical History
        physician: medicalHistory.physician,
        specialty: medicalHistory.specialty,
        officeNumber: medicalHistory.officeNumber,
        officeAddress: medicalHistory.officeAddress,
        isInGoodHealth: medicalHistory.isInGoodHealth,
        medicalCondition: medicalHistory.underMedicalTreatment ? medicalHistory.medicalCondition : '',
        illnessOperation: medicalHistory.seriousIllnessOrOperation ? medicalHistory.illnessOperation : '',
        lastHospitalization: medicalHistory.lastHospitalization,
        hospitalizationReason: medicalHistory.hospitalized ? medicalHistory.hospitalizationReason : '',
        prescribedOrNonprescribedMedicine: medicalHistory.takingMedication ? medicalHistory.prescribedOrNonprescribedMedicine : '',
        usesTobacco: medicalHistory.usesTobacco,
        consumesAlcohol: medicalHistory.consumesAlcohol,
        usesDangerousDrugs: medicalHistory.usesDangerousDrugs,
        allergies: medicalHistory.allergies,
        otherAllergy: medicalHistory.otherAllergy,
        bleedingTime: medicalHistory.bleedingTime,

        isPregnant: medicalHistory.isPregnant ?? false,
        isNursing: medicalHistory.isNursing ?? false,
        isTakingBirthControl: medicalHistory.isTakingBirthControl ?? false,

        bloodType: medicalHistory.bloodType,
        bloodSystolicPressure: medicalHistory.bloodPressure.systolic,
        bloodDiastolicPressure: medicalHistory.bloodPressure.diastolic,
        manyConditions: medicalHistory.manyConditions ?? [],
    }
}

export default eventHandler(async (event) => {
    const { dentalHistory, medicalHistory, patientInfo }: FormRequest = await readBody(event)
    const token = await getToken({ event })
    console.log(token, dentalHistory, medicalHistory, patientInfo)
    if (patientInfo.sex == 'female' || patientInfo.sex == 'male') {
        //pass        // // Dental history

    } else {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid sex'
        })
    }
    const patient = await db.insert(tables.patient).values(normalizePatientInfo(patientInfo))
        .returning()
        .then(takeUniqueOrThrow)
    console.log("patient", patient)
    const dentalChart = await db.insert(tables.dentalChart).values({
        ...combineAndNormalizeDentalMedicalHistory({ dentalHistory, medicalHistory }),
        patientId: patient.id,
        doctorId: token?.id,
    }).returning()
        .then(takeUniqueOrThrow)
    console.log("dentalChart", dentalChart)
    return dentalChart
})
