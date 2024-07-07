import { relations } from "drizzle-orm"
import { serial, text, timestamp, pgTable, date as pgDate, boolean, json, integer, } from "drizzle-orm/pg-core";
import { BloodType } from "~/utils/records/medicalHistory"
import { user,patient } from "./user"
import { intraoralExam } from "./intraoral_exam";
import { treatment } from "./treatment";

export const dentalChart = pgTable("dental_chart", {
    id: serial("id").primaryKey(),
    patientId: serial("patient_id").references(() => patient.id),
    doctorId: serial("doctor_id").references(() => user.id),
    // dentalhistory
    previousDentist: text("previous_dentist"),//optional
    lastDentalVisit: pgDate("last_dental_visit"),//optional
  
    // Medical History
    physician: text("physician"),//optional
    specialty: text("specialty"),//optional
    officeAddress: text("office_address"),//optional
    officeNumber: text("office_number"),//optional
    isInGoodHealth: boolean("is_in_good_health").notNull(),//optional
    medicalCondition: text("medicalCondition").notNull(),//optional
    illnessOperation: text("illness_operation").notNull(),//optional
    lastHospitalization: pgDate("last_hospitalization"),//optional
    hospitalizationReason: text("hospitalization_reason").notNull(),//optional
    prescribedOrNonprescribedMedicine: text("prescribed_or_nonprescribed_medicine").notNull(),//optional
    usesTobacco: boolean("uses_tobacco").notNull(),//optional
    consumesAlcohol: boolean("consumes_alcohol").notNull(),//optional
    usesDangerousDrugs: boolean("uses_dangerous_drugs").notNull(),//optional
    allergies: json("allergies").$type<string[]>().default([]),//optional
    otherAllergy: text("other_allergy"),//optional
    bleedingTime: integer("bleeding_time").notNull(),//optional
    isPregnant: boolean("is_pregnant").notNull(),//optional
    isNursing: boolean("is_nursing").notNull(),//optional
    isTakingBirthControl: boolean("is_taking_birth_control").notNull(),//optional
    bloodType: text("blood_type", { enum: ['A-', 'A+', 'B-', 'B+', 'AB-', 'AB+', 'O-', 'O+'] as [BloodType, ...BloodType[]] }),//optional
    bloodSystolicPressure: integer("blood_systolic_pressure").notNull(),//optional // numerator
    bloodDiastolicPressure: integer("blood_diastolic_pressure").notNull(),//optional // denominator
    manyConditions: json("many_conditions").$type<string[]>(),//optional
  
    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  })
  
  export const dentalChartRelations = relations(dentalChart, ({ many, one }) => ({
    user: one(user, { relationName: 'user', fields: [dentalChart.doctorId], references: [user.id] },),
    patient: one(patient, { relationName: 'patient', fields: [dentalChart.patientId], references: [patient.id] },),
    intraoralExam: one(intraoralExam),
    treatment: many(treatment),
  }))
