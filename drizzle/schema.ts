import { pgTable, uuid, text, timestamp, foreignKey, unique, boolean, integer, time, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const appointmentCreationType = pgEnum("appointment_creation_type", ['MANUAL', 'AUTOMATION'])
export const patientSex = pgEnum("patient_sex", ['male', 'female'])
export const userRole = pgEnum("user_role", ['OWNER', 'MANAGER', 'STAFF', 'DOCTOR'])


export const clinics = pgTable("clinics", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const patients = pgTable("patients", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	clinicId: uuid("clinic_id").notNull(),
	name: text().notNull(),
	email: text().notNull(),
	phoneNumber: text("phone_number").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	sex: patientSex().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.clinicId],
			foreignColumns: [clinics.id],
			name: "patients_clinic_id_clinics_id_fk"
		}).onDelete("cascade"),
]);

export const verifications = pgTable("verifications", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
});

export const users = pgTable("users", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: boolean("email_verified").notNull(),
	image: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	stripeCustomerId: text("stripe_customer_id"),
	stripeSubscriptionId: text("stripe_subscription_id"),
	plan: text(),
	cpf: text(),
	phoneNumber: text("phone_number"),
	address: text(),
	cep: text(),
	street: text(),
	number: text(),
	complement: text(),
	neighborhood: text(),
	city: text(),
	state: text(),
}, (table) => [
	unique("users_email_unique").on(table.email),
	unique("users_cpf_unique").on(table.cpf),
]);

export const appointments = pgTable("appointments", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	date: timestamp({ mode: 'string' }).notNull(),
	clinicId: uuid("clinic_id").notNull(),
	patientId: uuid("patient_id").notNull(),
	doctorId: uuid("doctor_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	appointmentsPriceInCents: integer("appointments_price_in_cents").notNull(),
	createdByUserId: text("created_by_user_id"),
	createdByDoctorId: uuid("created_by_doctor_id"),
	creationType: appointmentCreationType("creation_type").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.clinicId],
			foreignColumns: [clinics.id],
			name: "appointments_clinic_id_clinics_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.patientId],
			foreignColumns: [patients.id],
			name: "appointments_patient_id_patients_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.doctorId],
			foreignColumns: [doctors.id],
			name: "appointments_doctor_id_doctors_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.createdByUserId],
			foreignColumns: [users.id],
			name: "appointments_created_by_user_id_users_id_fk"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.createdByDoctorId],
			foreignColumns: [doctors.id],
			name: "appointments_created_by_doctor_id_doctors_id_fk"
		}).onDelete("set null"),
]);

export const doctors = pgTable("doctors", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	clinicId: uuid("clinic_id").notNull(),
	name: text().notNull(),
	avatarImageUrl: text("avatar_image_url"),
	availableFromWeekDay: integer("available_from_week_day").notNull(),
	availableToWeekDay: integer("available_to_week_day").notNull(),
	availableFromTime: time("available_from_time").notNull(),
	availableToTime: time("available_to_time").notNull(),
	specialtyId: text("specialty_id").notNull(),
	appointmentPriceInCents: integer("appointment_price_in_cents").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	userId: text("user_id"),
}, (table) => [
	foreignKey({
			columns: [table.clinicId],
			foreignColumns: [clinics.id],
			name: "doctors_clinic_id_clinics_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "doctors_user_id_users_id_fk"
		}).onDelete("set null"),
]);

export const usersToClinics = pgTable("users_to_clinics", {
	userId: text("user_id").notNull(),
	clinicId: uuid("clinic_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	role: userRole().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "users_to_clinics_user_id_users_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.clinicId],
			foreignColumns: [clinics.id],
			name: "users_to_clinics_clinic_id_clinics_id_fk"
		}).onDelete("cascade"),
]);

export const accounts = pgTable("accounts", {
	id: text().primaryKey().notNull(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { mode: 'string' }),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { mode: 'string' }),
	scope: text(),
	password: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "accounts_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const sessions = pgTable("sessions", {
	id: text().primaryKey().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	token: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "sessions_user_id_users_id_fk"
		}).onDelete("cascade"),
	unique("sessions_token_unique").on(table.token),
]);

export const medicalSpecialties = pgTable("medical_specialties", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	clinicId: uuid("clinic_id").notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.clinicId],
			foreignColumns: [clinics.id],
			name: "medical_specialties_clinic_id_clinics_id_fk"
		}).onDelete("cascade"),
]);
