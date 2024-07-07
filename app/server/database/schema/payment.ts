import { serial, timestamp, pgTable, integer, pgEnum } from "drizzle-orm/pg-core";
import { treatment } from "./treatment";
import { relations } from "drizzle-orm";
// Cant use ~ cause schema can't find the module
import { PaymentMethodEnumValues, PaymentMethodTypes } from "../../../utils/payment";

// SQL for sample treatment:
// INSERT INTO treatment (doctor_id, patient_id, amount_charged, procedure, tooth_numbers) VALUES (1, 2, 10000, 'Cleaning', '[54, 55, 56]');

export const PaymentMethodEnum = pgEnum<PaymentMethodTypes, [PaymentMethodTypes, ...PaymentMethodTypes[]]>("method", PaymentMethodEnumValues);
export const payment = pgTable("payment", {
  id: serial("id").primaryKey(),
  treatmentId: serial("treatment_id")
    .references(() => treatment.id),
  amountPaidCentavos: integer("amount").notNull(),
  method: PaymentMethodEnum('method').notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  voidedAt: timestamp("voided_at"), //optional
});

export const paymentRelations = relations(payment, ({ one }) => ({
  treatment: one(treatment, {fields: [payment.treatmentId], references: [treatment.id]})
}))
