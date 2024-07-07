import { serial, text, timestamp, pgTable, integer } from "drizzle-orm/pg-core";
import { dentalChart } from "./dental_chart";
import { One, relations } from "drizzle-orm";
import { payment } from "./payment";

export const treatment = pgTable("treatment", {
  id: serial("id").primaryKey(),
  dentalChartId: serial("dental_record_id").references(() => dentalChart.id),
  amountChargedCentavos: integer("amount_charged").notNull(),
  procedure: text("procedure").notNull(),
  toothNumbers: text("tooth_numbers").notNull().default(""),
  // TODO: Should prolly be replaced w/ a reservation Id in the future
  nextAppointment: timestamp("next_appointment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const treatmentRelations = relations(treatment,({one,many} ) =>({
  dentalChart: one(dentalChart, {relationName: 'dentalChart', fields: [treatment.dentalChartId], references: [dentalChart.id]}),
  payments: many(payment),
}))
