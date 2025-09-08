CREATE TABLE "medical_specialties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"clinic_id" uuid NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "doctors" RENAME COLUMN "specialty" TO "specialty_id";--> statement-breakpoint
ALTER TABLE "medical_specialties" ADD CONSTRAINT "medical_specialties_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_specialty_id_medical_specialties_id_fk" FOREIGN KEY ("specialty_id") REFERENCES "public"."medical_specialties"("id") ON DELETE restrict ON UPDATE no action;