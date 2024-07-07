import type { PatientInfo } from "./PatientInfo";
import type { DentalHistory, MedicalHistory } from "./medicalHistory";
import {type FormKitGroupValue} from "@formkit/core";
export interface FormRequest extends FormKitGroupValue {
    dentalHistory: DentalHistory
    medicalHistory: MedicalHistory
    patientInfo: PatientInfo
}

/**
 * It's fine to make subfields optional, but the top level fields should be defined as {}.
 */
export interface PartialFormRequest extends FormKitGroupValue {
    dentalHistory: Partial<DentalHistory>
    medicalHistory: Partial<MedicalHistory>
    patientInfo: Partial<PatientInfo>
}

export const CONTACT_NUMBER = {
    mobile: {
        matches: "matches:/^09[0-9]{2}-[0-9]{4}-[0-9]{3}$/",
        placeholder: "09XX-XXXX-XXX",
    },
    landline: {
        matches: "matches:/^0[0-9]{2}-[0-9]{3}-[0-9]{4}$/",
        placeholder: "0XX-XXX-YYYY",
    },
}
