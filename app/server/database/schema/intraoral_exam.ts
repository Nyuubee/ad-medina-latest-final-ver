import { serial, text, timestamp, pgTable, integer, json, smallint, pgEnum, numeric, boolean } from "drizzle-orm/pg-core";
import { patient, user } from "./user";
import { relations } from "drizzle-orm";
import { Region, ToothCategory, ToothRegionState,SimplifiedTooth } from "~/utils/peri/Tooth";
import { dentalChart } from "./dental_chart";
/**
 * The real form has toothNumbers field, this can be queried from the toothCondition table
 */
export const intraoralExam = pgTable("intraoralExam", {
  id: serial("id").primaryKey(),
  dentalChartId: serial("dental_chart_id").references(() => dentalChart.id),
  periodentalScreeningId: serial("periodental_screening_id").references(() => periodentalScreening.id),
  occlusionId: serial("occlusion_id").references(() => occlusion.id),
  appliancesId: serial("appliances_id").references(() => appliances.id),
  TMDId: serial("TMD_id").references(() => TMD.id),
  xrayTakenId: serial("xray_taken_id").references(() => xrayTaken.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const intraoralExamRelations = relations(intraoralExam, ({ many, one }) => ({
  dentalChart: one(dentalChart, { relationName: 'dentalChart', fields: [intraoralExam.dentalChartId], references: [dentalChart.id] },),
  periodentalScreening: one(periodentalScreening, { relationName: 'periodentalScreening', fields: [intraoralExam.periodentalScreeningId], references: [periodentalScreening.id] },),
  occlusion: one(occlusion, { relationName: 'occlusion', fields: [intraoralExam.occlusionId], references: [occlusion.id] },),
  appliances: one(appliances, { relationName: 'appliances', fields: [intraoralExam.appliancesId], references: [appliances.id] },),
  TMD: one(TMD, { relationName: 'TMD', fields: [intraoralExam.TMDId], references: [TMD.id] },),
  xrayTaken: one(xrayTaken, { relationName: 'xrayTaken', fields: [intraoralExam.xrayTakenId], references: [xrayTaken.id] },),
  toothConditions: many(toothCondition),
}))

/**
 * don't confuse `id` with `toothId`
 */
export const toothCondition = pgTable("tooth_condition", {
  id: serial("id").primaryKey(),
  intraoralExamId: serial("intraoral_exam_id").references(() => intraoralExam.id),
  // Tooth id is a smallint due to the number of teeth humans have.
  toothId: smallint("tooth_id").notNull(),
  region: json("region").$type<Region<ToothRegionState>>().notNull(),
  states: json("states").$type<SimplifiedTooth['states']>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})
export const toothConditionRelations = relations(toothCondition, ({ one }) => ({
  dentalRecord: one(intraoralExam, { relationName: 'dentalRecord', fields: [toothCondition.intraoralExamId], references: [intraoralExam.id] },),
}))

export const periodentalScreening = pgTable("periodental_screening", {
  id: serial("id").primaryKey(),
  gingivitis: boolean("gingivitis").notNull(),
  earlyPeriodontitis: boolean("early_periodontitis").notNull(),
  moderatePeriodontitis: boolean("moderate_periodontitis").notNull(),
  advancedPeriodontitis: boolean("advanced_periodontitis").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})


export const OcclusionMolarClass = pgEnum("occlusion_molar_class", ['Normal', 'I', 'II', 'III'])
export const occlusion = pgTable("occlusion", {
  id: serial("id").primaryKey(),
  molarClass: OcclusionMolarClass('molar_class'),
  overjet: boolean("overjet"),
  overbite: boolean("overbite"),
  midlineDeviation: boolean("midline_deviation"),
  crossbite: boolean("crossbite"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const appliances = pgTable("appliances", {
  id: serial("id").primaryKey(),
  orthodontic: boolean("orthodontic").notNull().default(false),
  stayplate: boolean("stayplate").notNull().default(false),
  others: text("others_content"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const TMD = pgTable("TMD", {
  id: serial("id").primaryKey(),
  clenching: boolean("clenching").notNull().default(false),
  clicking: boolean("clicking").notNull().default(false),
  trismus: boolean("trismus").notNull().default(false),
  muscleSpasm: boolean("muscle_spasm").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const xrayTaken = pgTable("xray_taken", {
  id: serial("id").primaryKey(),
  periapical: text("periapical"),
  tthNo: numeric("tth_no"),
  panoramic: boolean("panoramic"),
  cephalometric: boolean("cephalometric"),
  occlusal: text("occlusal", { enum: ['None', 'Upper', 'Lower'] }),
  others: text("others"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})
