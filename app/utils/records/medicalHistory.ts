import { useCustomFormkitSchema, when } from "../formkit";

function boolOpts() {
    return [{ value: true, label: "Yes" }, { value: false, label: 'No' }]
}

export interface DentalHistory {
    previousDentist: string,
    lastDentalVisit: Date,
}

export function useDentalHistorySchema() {
    return useCustomFormkitSchema({
        $formkit: 'group',
        id: 'dentalHistory',
        name: 'dentalHistory',
        nested: [
            {
                id: 'previousDentist',
                $formkit: 'text',
                label: 'Previous Dentist',
                placeholder: 'Dr.'
            },
            // last dental visit
            {
                id: 'lastDentalVisit',
                $formkit: 'date',
                label: 'Last Dental Visit',
            },
        ]
    })
}

export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
export interface MedicalHistory {
    physician: string,
    specialty: string,
    officeAddress: string,
    officeNumber: string,
    isInGoodHealth: boolean,
    underMedicalTreatment: boolean,
    medicalCondition: string,
    seriousIllnessOrOperation: boolean,
    illnessOperation: string,
    hospitalized: boolean,
    lastHospitalization: Date,
    hospitalizationReason: string,
    takingMedication: boolean,
    prescribedOrNonprescribedMedicine: string,
    usesTobacco: boolean,
    consumesAlcohol: boolean,
    usesDangerousDrugs: boolean,
    allergies: string[],
    otherAllergy: string,
    bleedingTime: number,
    // womenOnly: {
    // TODO: fix womenOnly is not under a group
    isPregnant: boolean,
    isNursing: boolean,
    isTakingBirthControl: boolean,
    // },
    bloodType: BloodType,
    bloodPressure: {
        systolic: number,
        diastolic: number,
    }
    manyConditions: string[],

}

export type ExplicitAllergy = 'penicillin' | 'aspirin' | 'codeine' | 'latex' | 'sulfa drugs' | 'local anesthetics'
export const explicitAllergies: ExplicitAllergy[] = [
    'penicillin',
    'aspirin',
    'codeine',
    'latex',
    'sulfa drugs',
    'local anesthetics',
]
export function useMedicalHistorySchema() {
    const schema = ref({
        $formkit: 'group',
        id: 'medicalHistory',
        name: 'medicalHistory',
        children: [
            {
                $el: 'div',
                attrs: {
                    class: 'flex flex-col lg:flex-row print:flex-row gap-x-4',
                },
                children: [
                    {
                        // name of phyisician
                        id: 'physician',
                        name: 'physician',
                        $formkit: 'text',
                        label: 'Name of Physician',
                        placeholder: 'Dr.',
                    },
                    {
                        id: 'specialty',
                        name: 'specialty',
                        $formkit: 'text',
                        label: "Specialty, if applicable:"
                    },
                ]
            },
            {
                $el: 'div',
                attrs: {
                    class: 'flex flex-col lg:flex-row gap-x-4',
                },
                children: [
                    {
                        id: 'officeAddress',
                        name: 'officeAddress',
                        $formkit: 'text',
                        label: 'Office Address',
                    },
                    {
                        id: 'officeNumber',
                        name: 'officeNumber',
                        $formkit: 'text',
                        label: 'Office Number',
                    },
                ]
            },
            {
                id: 'isInGoodHealth',
                name: 'isInGoodHealth',
                $formkit: 'radio',
                label: '1. Are you in good health?',
                options: boolOpts(),
                validation: 'required'
            },
            {
                id: 'underMedicalTreatment',
                name: 'underMedicalTreatment',
                $formkit: 'radio',
                label: '2. Are you under medical treatment now?',
                options: boolOpts(),
                validation: 'required',
            },
            {
                id: 'medicalCondition',
                name: 'medicalCondition',
                $formkit: 'text',
                // if: when('underMedicalTreatment', true),
                label: 'If so, what is the condition being treated?',
                // validation: 'required',
            },
            {
                id: 'seriousIllnessOrOperation',
                name: 'seriousIllnessOrOperation',
                $formkit: 'radio',
                label: '3. Have you ever had a serious illness or major operation?',
                options: boolOpts(),
                validation: 'required',
            },
            {
                id: 'illnessOperation',
                name: 'illnessOperation',
                $formkit: 'text',
                // if: `$get(seriousIllnessOrOperation).value == true`,
                label: 'If so, what was the illness or operation?',
                // validation: 'required',
            },
            {
                id: 'hospitalized',
                name: 'hospitalized',
                $formkit: 'radio',
                label: '4. Have you ever been hospitalized?',
                options: boolOpts(),
                validation: 'required',
            },
            {
                id: 'lastHospitalization',
                name: 'lastHospitalization',
                $formkit: 'date',
                if: when('hospitalized', true),
                label: 'If so, when?',
            },
            {
                id: 'hospitalizationReason',
                name: 'hospitalizationReason',
                $formkit: 'text',
                if: when('hospitalized', true),
                label: 'Reason',
                validation: 'required',
            },
            {
                id: 'takingMedication',
                name: 'takingMedication',
                $formkit: 'radio',
                label: '5. Are you taking any prescription/non-prescription medication?',
                options: boolOpts(),
                validation: 'required',
            },
            {
                id: 'prescribedOrNonprescribedMedicine',
                name: 'prescribedOrNonprescribedMedicine',
                $formkit: 'text',
                // if: when('takingMedication', true),
                label: 'If so, what is the medication?',
                // validation: 'required',
            },
            {
                id: 'usesTobacco',
                name: 'usesTobacco',
                $formkit: 'radio',
                label: '6. Do you use tobacco?',
                options: boolOpts(),
                validation: 'required',
            },
            {
                id: 'consumesAlcohol',
                name: 'consumesAlcohol',
                $formkit: 'radio',
                label: '7. Do you consume alcohol?',
                options: boolOpts(),
                validation: 'required',
            },
            {
                id: 'usesDangerousDrugs',
                name: 'usesDangerousDrugs',
                $formkit: 'radio',
                label: '8. Do you use dangerous drugs?',
                options: boolOpts(),
                validation: 'required',
            },
            {
                id: 'allergies',
                name: 'allergies',
                $formkit: 'checkbox',
                optionsClass: "flex flex-col lg:flex-wrap print:flex-wrap print:max-h-16 lg:max-h-16",
                label: '9. Are you allergic to any of the following?',
                options: [
                    { value: 'penicillin', label: 'Penicillin' },
                    { value: 'aspirin', label: 'Aspirin' },
                    { value: 'codeine', label: 'Codeine' },
                    { value: 'latex', label: 'Latex' },
                    { value: 'sulfa drugs', label: 'Sulfa drugs' },
                    { value: 'local anesthetics', label: 'Local anesthetics' },
                    { value: 'other', label: 'Other' },
                ] as { value: ExplicitAllergy, label: string }[]
            },
            {
                id: 'otherAllergy',
                name: 'otherAllergy',
                $formkit: 'text',
                when: ["allergies", "other"],
                wrapperClass: "!flex-row",
                label: 'Other allergy',
                labelClass: "my-auto w-[12em]",
            },
            {
                id: 'bleedingTime',
                name: 'bleedingTime',
                $formkit: 'number',
                validation: 'required',
                min: 0,
                labelClass: "my-auto w-[12em]",
                wrapperClass: "!flex-row",
                label: '10. Bleeding Time',
            },
            {
                $el: 'div',
                children: [
                    '11. For women only:',
                    {
                        $el: 'p',
                        if: when("sex", "male"),
                        attrs: {
                            class: 'ml-4',
                            textContent: 'Skipped, patient is a male.'
                        }
                    },
                ]
            },
            {
                id: 'isPregnant',
                name: 'isPregnant',
                $formkit: 'radio',
                outerClass: 'ml-4',
                label: 'Are you pregnant?',
                if: when("sex", "female"),

                options: boolOpts(),
                validation: 'required',
            },
            {
                id: 'isNursing',
                name: 'isNursing',
                $formkit: 'radio',
                outerClass: 'ml-4',
                label: 'Are you nursing?',
                if: when("sex", "female"),
                options: boolOpts(),
                validation: 'required',
            },
            {
                id: 'isTakingBirthControl',
                name: 'isTakingBirthControl',
                if: when("sex", "female"),
                $formkit: 'radio',
                outerClass: 'ml-4',
                label: 'Are you on birth control?',
                options: boolOpts(),
                validation: 'required',
            },
            {
                id: 'bloodType',
                name: 'bloodType',
                $formkit: 'select',
                wrapperClass: "flex",
                labelClass: "my-auto",
                label: '12. Blood Type',
                validation: 'required',
                options: [
                    { value: '', label: 'Type', disabled: true, selected: true },
                    { value: 'A+', label: 'A+' },
                    { value: 'A-', label: 'A-' },
                    { value: 'B+', label: 'B+' },
                    { value: 'B-', label: 'B-' },
                    { value: 'AB+', label: 'AB+' },
                    { value: 'AB-', label: 'AB-' },
                    { value: 'O+', label: 'O+' },
                    { value: 'O-', label: 'O-' },
                ],
            },
            {
                $el: 'div',
                attrs: {
                    class: 'flex items-center w-max'
                },
                children: [
                    {
                        $el: 'div',
                        attrs: {
                            class: 'self-start m-auto font-bold'
                        },
                        children: [
                            '13. Blood Pressure (mmHg)',
                            {
                                $el: 'span',
                                attrs: {
                                    class: 'text-error',
                                },
                                children: ['*']
                            }
                        ]
                    },
                    {
                        id: 'bloodPressure',
                        name: 'bloodPressure',
                        $formkit: 'group',
                        children: [
                            {
                                id: 'systolic',
                                $formkit: 'text',
                                inputClass: 'max-w-12 p-0 grow-0 border-none input-ghost text-end',
                                name: 'systolic',
                                validation: 'required|number',
                                placeholder: '000',
                                validationVisibility: 'hidden',
                            },
                            {
                                $el: 'span',
                                attrs: {
                                    class: 'text-lg align-center ',
                                },
                                children: ['/'],
                            },
                            {
                                id: 'diastolic',
                                inputClass: 'max-w-12 p-0 border-none input-ghost',
                                name: 'diastolic',
                                placeholder: '000',
                                $formkit: 'text',
                                validation: 'required|number',
                                validationVisibility: 'hidden'
                            }
                        ]
                    }

                ]
            },
            {
                id: "manyConditions",
                name: "manyConditions",
                $formkit: 'checkbox',
                optionsClass: 'flex flex-col lg:flex-wrap print:flex-wrap print:max-h-96 lg:max-h-96',
                label: '14. Do you have or have you had any of the following? Check which apply',
                options: [
                    { value: 'highBloodPressure', label: 'High Blood Pressure' },
                    { value: 'lowBloodPressure', label: 'Low Blood Pressure' },
                    { value: 'hiv', label: 'HIV Infection' },
                    { value: 'aids', label: 'AIDS Infection' },
                    { value: 'std', label: 'Sexually Transmitted Disease' },
                    { value: 'stomachProblems', label: 'Stomach Problems' },
                    { value: 'faintingSeizures', label: 'Fainting Seizures' },
                    { value: 'rapidWeightLoss', label: 'Rapid Weight Loss' },
                    { value: 'radiationTherapy', label: 'Radiation Therapy' },
                    { value: 'jointReplacement', label: 'Joint Replacement' },
                    { value: 'heartSurgery', label: 'Heart Surgery' },
                    { value: 'heartAttack', label: 'Heart Attack' },
                    { value: 'thyroidProblems', label: 'Thyroid Problems' },

                    { value: 'heartDisease', label: 'Heart Disease' },
                    { value: 'heartMurmer', label: 'Heart Murmer' },
                    { value: 'hepatitis', label: 'Hepatitis / Liver Disease' },
                    { value: 'rheumaticFever', label: 'Rheumatic Fever' },
                    { value: 'hayFever', label: 'Hay Fever / Allergies' },
                    { value: 'tuberculosis', label: 'Tuberculosis' },
                    { value: 'swollenAnkles', label: 'Swollen Ankles' },
                    { value: 'kidneyDisease', label: 'Kidney Disease' },
                    { value: 'diabetes', label: 'Diabetes' },
                    { value: 'chestPain', label: 'Chest Pain' },
                    { value: 'stroke', label: 'Stroke' },
                    { value: 'cancer', label: 'Cancer / Tumors' },
                    { value: 'anemia', label: 'Anemia' },
                    { value: 'angina', label: 'Angina' },
                    { value: 'asthma', label: 'Asthma' },
                    { value: 'emphysema', label: 'Emphysema' },
                    { value: 'bleedingProblems', label: 'Bleeding Problems' },
                    { value: 'bloodDiseases', label: 'Blood Diseases' },
                    { value: 'headInjuries', label: 'Head Injuries' },
                    { value: 'arthritis', label: 'Arthritis / Rheumatism' },
                    { value: 'other', label: 'Other' },
                ],
            }
        ]
    })

    return { schema }
}
