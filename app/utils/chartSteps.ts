export const chartSteps = [
  'Basic Patient Information',
  'Dental History',
  'Medical History',
  'Informed Consent',
  'Dental Record Chart',
  'Treatment Record'
]

export type ProgressKeys = "BasicPatientInformation" | "DentalHistory" | "MedicalHistory" | "InformedConsent" | "DentalRecordChart" | "TreatmentRecord"
export type ProgressRecord = Record<ProgressKeys, {
  status: boolean,
  readonly label: string
}>
export function makeProgress(): ProgressRecord {
  return {
    BasicPatientInformation: {
      status: false,
      label: 'Basic Patient Information'
    },
    DentalHistory: {
      status: false,
      label: 'Dental History'
    },
    MedicalHistory: {
      status: false,
      label: 'Medical History'
    },
    InformedConsent: {
      status: false,
      label: 'Informed Consent'
    },
    DentalRecordChart: {
      status: false,
      label: 'Dental Record Chart'
    },
    TreatmentRecord: {
      status: false,
      label: 'Treatment Record'
    }
  }
}
export const progressRecord = ref<ProgressRecord>(makeProgress())

