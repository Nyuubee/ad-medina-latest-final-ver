DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('admin', 'doctor', 'inventory_manager', 'receptionist');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."sex" AS ENUM('male', 'female');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."method" AS ENUM('cash', 'credit', 'debit', 'check', 'gcash', 'maya');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."occlusion_molar_class" AS ENUM('Normal', 'I', 'II', 'III');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"salt" text NOT NULL,
	CONSTRAINT "auth_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "treatment" (
	"id" serial PRIMARY KEY NOT NULL,
	"dental_record_id" serial NOT NULL,
	"amount_charged" integer NOT NULL,
	"procedure" text NOT NULL,
	"tooth_numbers" text DEFAULT '' NOT NULL,
	"next_appointment" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "forgot_password" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"code" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "forgot_password_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "google" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"oauth_id" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "oauth" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"access_token" text NOT NULL,
	"refresh_token" text NOT NULL,
	"expires_at" text,
	"scope" text NOT NULL,
	"token_type" text NOT NULL,
	"id_token" text NOT NULL,
	"type" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "oauth_email_unique" UNIQUE("email"),
	CONSTRAINT "oauth_provider_account_id_unique" UNIQUE("provider_account_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "patients" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"middle_name" text DEFAULT '' NOT NULL,
	"suffix" text DEFAULT '' NOT NULL,
	"nick_name" text DEFAULT '',
	"email" text NOT NULL,
	"sex" "sex" NOT NULL,
	"birth_date" date,
	"religion" text DEFAULT '' NOT NULL,
	"nationality" text DEFAULT '',
	"home_address" text DEFAULT '' NOT NULL,
	"home_number" text DEFAULT '' NOT NULL,
	"occupation" text DEFAULT '' NOT NULL,
	"insurance" text DEFAULT '' NOT NULL,
	"effective_date" date,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"referrer" text DEFAULT '' NOT NULL,
	"office_number" text DEFAULT '' NOT NULL,
	"mobile_number" text DEFAULT '' NOT NULL,
	"consultation_reason" text DEFAULT '' NOT NULL,
	"parent_guardian" text DEFAULT '' NOT NULL,
	"parent_guardian_occupation" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" text DEFAULT '' NOT NULL,
	"last_name" text DEFAULT '' NOT NULL,
	"middle_name" text DEFAULT '' NOT NULL,
	"suffix" text DEFAULT '' NOT NULL,
	"nick_name" text DEFAULT '',
	"email" text,
	"phone" text NOT NULL,
	"sex" "sex" NOT NULL,
	"birth_date" date,
	"address" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "email" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_role" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"role" "role" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payment" (
	"id" serial PRIMARY KEY NOT NULL,
	"treatment_id" serial NOT NULL,
	"amount" integer NOT NULL,
	"method" "method" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"voided_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "TMD" (
	"id" serial PRIMARY KEY NOT NULL,
	"clenching" boolean DEFAULT false NOT NULL,
	"clicking" boolean DEFAULT false NOT NULL,
	"trismus" boolean DEFAULT false NOT NULL,
	"muscle_spasm" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "appliances" (
	"id" serial PRIMARY KEY NOT NULL,
	"orthodontic" boolean DEFAULT false NOT NULL,
	"stayplate" boolean DEFAULT false NOT NULL,
	"others_content" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "intraoralExam" (
	"id" serial PRIMARY KEY NOT NULL,
	"dental_chart_id" serial NOT NULL,
	"periodental_screening_id" serial NOT NULL,
	"occlusion_id" serial NOT NULL,
	"appliances_id" serial NOT NULL,
	"TMD_id" serial NOT NULL,
	"xray_taken_id" serial NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "occlusion" (
	"id" serial PRIMARY KEY NOT NULL,
	"molar_class" "occlusion_molar_class",
	"overjet" boolean,
	"overbite" boolean,
	"midline_deviation" boolean,
	"crossbite" boolean,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "periodental_screening" (
	"id" serial PRIMARY KEY NOT NULL,
	"gingivitis" boolean NOT NULL,
	"early_periodontitis" boolean NOT NULL,
	"moderate_periodontitis" boolean NOT NULL,
	"advanced_periodontitis" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tooth_condition" (
	"id" serial PRIMARY KEY NOT NULL,
	"intraoral_exam_id" serial NOT NULL,
	"tooth_id" smallint NOT NULL,
	"region" json NOT NULL,
	"states" json NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "xray_taken" (
	"id" serial PRIMARY KEY NOT NULL,
	"periapical" text,
	"tth_no" numeric,
	"panoramic" boolean,
	"cephalometric" boolean,
	"occlusal" text,
	"others" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dental_chart" (
	"id" serial PRIMARY KEY NOT NULL,
	"patient_id" serial NOT NULL,
	"doctor_id" serial NOT NULL,
	"previous_dentist" text,
	"last_dental_visit" date,
	"physician" text,
	"specialty" text,
	"office_address" text,
	"office_number" text,
	"is_in_good_health" boolean NOT NULL,
	"medicalCondition" text NOT NULL,
	"illness_operation" text NOT NULL,
	"last_hospitalization" date,
	"hospitalization_reason" text NOT NULL,
	"prescribed_or_nonprescribed_medicine" text NOT NULL,
	"uses_tobacco" boolean NOT NULL,
	"consumes_alcohol" boolean NOT NULL,
	"uses_dangerous_drugs" boolean NOT NULL,
	"allergies" json DEFAULT '[]'::json,
	"other_allergy" text,
	"bleeding_time" integer NOT NULL,
	"is_pregnant" boolean NOT NULL,
	"is_nursing" boolean NOT NULL,
	"is_taking_birth_control" boolean NOT NULL,
	"blood_type" text,
	"blood_systolic_pressure" integer NOT NULL,
	"blood_diastolic_pressure" integer NOT NULL,
	"many_conditions" json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "banlist" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "banlist_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "maintenance" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_registration_enabled" boolean DEFAULT true NOT NULL,
	"reset_verification_token_validity_in_seconds" integer DEFAULT 300 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_actions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"method" text,
	"path" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth" ADD CONSTRAINT "auth_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "treatment" ADD CONSTRAINT "treatment_dental_record_id_dental_chart_id_fk" FOREIGN KEY ("dental_record_id") REFERENCES "public"."dental_chart"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "forgot_password" ADD CONSTRAINT "forgot_password_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "google" ADD CONSTRAINT "google_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "google" ADD CONSTRAINT "google_oauth_id_oauth_id_fk" FOREIGN KEY ("oauth_id") REFERENCES "public"."oauth"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_role" ADD CONSTRAINT "user_role_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payment" ADD CONSTRAINT "payment_treatment_id_treatment_id_fk" FOREIGN KEY ("treatment_id") REFERENCES "public"."treatment"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "intraoralExam" ADD CONSTRAINT "intraoralExam_dental_chart_id_dental_chart_id_fk" FOREIGN KEY ("dental_chart_id") REFERENCES "public"."dental_chart"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "intraoralExam" ADD CONSTRAINT "intraoralExam_periodental_screening_id_periodental_screening_id_fk" FOREIGN KEY ("periodental_screening_id") REFERENCES "public"."periodental_screening"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "intraoralExam" ADD CONSTRAINT "intraoralExam_occlusion_id_occlusion_id_fk" FOREIGN KEY ("occlusion_id") REFERENCES "public"."occlusion"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "intraoralExam" ADD CONSTRAINT "intraoralExam_appliances_id_appliances_id_fk" FOREIGN KEY ("appliances_id") REFERENCES "public"."appliances"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "intraoralExam" ADD CONSTRAINT "intraoralExam_TMD_id_TMD_id_fk" FOREIGN KEY ("TMD_id") REFERENCES "public"."TMD"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "intraoralExam" ADD CONSTRAINT "intraoralExam_xray_taken_id_xray_taken_id_fk" FOREIGN KEY ("xray_taken_id") REFERENCES "public"."xray_taken"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tooth_condition" ADD CONSTRAINT "tooth_condition_intraoral_exam_id_intraoralExam_id_fk" FOREIGN KEY ("intraoral_exam_id") REFERENCES "public"."intraoralExam"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dental_chart" ADD CONSTRAINT "dental_chart_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dental_chart" ADD CONSTRAINT "dental_chart_doctor_id_user_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "banlist" ADD CONSTRAINT "banlist_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_actions" ADD CONSTRAINT "user_actions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
