CREATE TABLE IF NOT EXISTS "appointments" (
	"id" serial PRIMARY KEY NOT NULL,
	"firstName" text NOT NULL,
	"middleName" text,
	"lastName" text NOT NULL,
	"appointmentDate" date,
	"startTime" text NOT NULL,
	"endTime" text NOT NULL,
	"purpose" text NOT NULL,
	"notes" text,
	"status" text DEFAULT 'Scheduled' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cancelledAppointments" (
	"id" serial PRIMARY KEY NOT NULL,
	"firstName" text NOT NULL,
	"middleName" text,
	"lastName" text NOT NULL,
	"appointmentDate" date,
	"startTime" text NOT NULL,
	"endTime" text NOT NULL,
	"purpose" text NOT NULL,
	"notes" text,
	"status" text DEFAULT 'Cancelled' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "completedAppointments" (
	"id" serial PRIMARY KEY NOT NULL,
	"firstName" text NOT NULL,
	"middleName" text,
	"lastName" text NOT NULL,
	"appointmentDate" date,
	"startTime" text NOT NULL,
	"endTime" text NOT NULL,
	"purpose" text NOT NULL,
	"notes" text,
	"status" text DEFAULT 'Completed' NOT NULL
);
