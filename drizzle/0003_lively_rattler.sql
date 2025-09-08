ALTER TABLE "users" ADD COLUMN "street" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "number" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "complement" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "neighborhood" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "city" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "state" text;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_cpf_unique" UNIQUE("cpf");