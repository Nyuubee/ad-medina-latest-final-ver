import { serial, text, pgTable, date as pgDate } from "drizzle-orm/pg-core";

export const appointments = pgTable("appointments", {
    id: serial("id").primaryKey(),
    firstName: text("firstName").notNull(),
    middleName: text("middleName"), // optional
    lastName: text("lastName").notNull(),
    appointmentDate: pgDate("appointmentDate"),
    startTime: text("startTime").notNull(),
    endTime: text("endTime").notNull(),
    purpose: text("purpose").notNull(),
    notes: text("notes"), // optional
    status: text("status").default('Scheduled').notNull() // default value
});

export const cancelledAppointments = pgTable("cancelledAppointments", {
    id: serial("id").primaryKey(),
    firstName: text("firstName").notNull(),
    middleName: text("middleName"), // optional
    lastName: text("lastName").notNull(),
    appointmentDate: pgDate("appointmentDate"),
    startTime: text("startTime").notNull(),
    endTime: text("endTime").notNull(),
    purpose: text("purpose").notNull(),
    notes: text("notes"), // optional
    status: text("status").default('Cancelled').notNull() // default value
});

export const completedAppointments = pgTable("completedAppointments", {
    id: serial("id").primaryKey(),
    firstName: text("firstName").notNull(),
    middleName: text("middleName"), // optional
    lastName: text("lastName").notNull(),
    appointmentDate: pgDate("appointmentDate"),
    startTime: text("startTime").notNull(),
    endTime: text("endTime").notNull(),
    purpose: text("purpose").notNull(),
    notes: text("notes"), // optional
    status: text("status").default('Completed').notNull() // default value
});
