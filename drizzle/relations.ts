import { relations } from "drizzle-orm/relations";
import { clinics, patients, appointments, doctors, users, usersToClinics, accounts, sessions, medicalSpecialties } from "./schema";

export const patientsRelations = relations(patients, ({one, many}) => ({
	clinic: one(clinics, {
		fields: [patients.clinicId],
		references: [clinics.id]
	}),
	appointments: many(appointments),
}));

export const clinicsRelations = relations(clinics, ({many}) => ({
	patients: many(patients),
	appointments: many(appointments),
	doctors: many(doctors),
	usersToClinics: many(usersToClinics),
	medicalSpecialties: many(medicalSpecialties),
}));

export const appointmentsRelations = relations(appointments, ({one}) => ({
	clinic: one(clinics, {
		fields: [appointments.clinicId],
		references: [clinics.id]
	}),
	patient: one(patients, {
		fields: [appointments.patientId],
		references: [patients.id]
	}),
	doctor_doctorId: one(doctors, {
		fields: [appointments.doctorId],
		references: [doctors.id],
		relationName: "appointments_doctorId_doctors_id"
	}),
	user: one(users, {
		fields: [appointments.createdByUserId],
		references: [users.id]
	}),
	doctor_createdByDoctorId: one(doctors, {
		fields: [appointments.createdByDoctorId],
		references: [doctors.id],
		relationName: "appointments_createdByDoctorId_doctors_id"
	}),
}));

export const doctorsRelations = relations(doctors, ({one, many}) => ({
	appointments_doctorId: many(appointments, {
		relationName: "appointments_doctorId_doctors_id"
	}),
	appointments_createdByDoctorId: many(appointments, {
		relationName: "appointments_createdByDoctorId_doctors_id"
	}),
	clinic: one(clinics, {
		fields: [doctors.clinicId],
		references: [clinics.id]
	}),
	user: one(users, {
		fields: [doctors.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	appointments: many(appointments),
	doctors: many(doctors),
	usersToClinics: many(usersToClinics),
	accounts: many(accounts),
	sessions: many(sessions),
}));

export const usersToClinicsRelations = relations(usersToClinics, ({one}) => ({
	user: one(users, {
		fields: [usersToClinics.userId],
		references: [users.id]
	}),
	clinic: one(clinics, {
		fields: [usersToClinics.clinicId],
		references: [clinics.id]
	}),
}));

export const accountsRelations = relations(accounts, ({one}) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id]
	}),
}));

export const sessionsRelations = relations(sessions, ({one}) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	}),
}));

export const medicalSpecialtiesRelations = relations(medicalSpecialties, ({one}) => ({
	clinic: one(clinics, {
		fields: [medicalSpecialties.clinicId],
		references: [clinics.id]
	}),
}));