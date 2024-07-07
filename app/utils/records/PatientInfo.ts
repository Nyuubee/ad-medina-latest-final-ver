import { type FormKitGroupValue } from "@formkit/core";
export interface FullName {
  firstName: string
  lastName: string
  middleName?: string | null
  suffix?: string | null
}

export interface NewTreatmentRecord extends FormKitGroupValue {
  toothNumberStr: string,
  procedure: string,
  doctor: string,
  amountChargedPesos: number,
  amountPaidPesos: number,
  nextAppointment: Date
}


export function fullName(user: FullName) {
  return `${user.firstName} ${user.middleName ?? ''} ${user.lastName} ${user.suffix ?? ''}`
}


export interface PatientInfo {
  lastName: string;
  firstName: string;
  middleName: string;
  suffix: string;
  birthDate: string;
  religion: string;
  nationality: string;
  homeAddress: string;
  occupation: string;
  insurance: string;
  effectiveDate: string;
  parentGuardian: string;
  parentGuardianOccupation?: string;
  referrer: string;
  consultationReason: string;
  sex: 'male' | 'female';
  nickName: string;
  homeNumber: string;
  officeNumber: string;
  mobileNumber: string;
  email: string;
}

export function createPatientInfo(): Partial<PatientInfo> {
  return {
    lastName: '',
    firstName: '',
    middleName: '',
    birthDate: '',
    religion: '',
    suffix: '',
    nationality: 'Filipino',
    homeAddress: '',
    occupation: '',
    insurance: '',
    effectiveDate: '',
    referrer: '',
    consultationReason: '',
    parentGuardian: '',
    parentGuardianOccupation: '',
    sex: undefined,
    nickName: '',
    homeNumber: '',
    officeNumber: '',
    mobileNumber: '',
    email: '',
  };
}
