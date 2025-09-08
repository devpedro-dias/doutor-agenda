"use server";

import { eq } from "drizzle-orm";

import { auth } from "@/src/lib/auth";
import { db } from "@/src/db";
import {
  appointmentsTable,
  doctorsTable,
  patientsTable,
} from "@/src/db/schema";
import { headers } from "next/headers";

export const getAppointmentsAction = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  if (!session.user.clinic) {
    throw new Error("No clinic selected");
  }

  const appointments = await db.query.appointmentsTable.findMany({
    where: eq(appointmentsTable.clinicId, session.user.clinic.id),
    with: {
      patient: true,
      doctor: {
        with: {
          specialty: true,
        },
      },
    },
  });

  return appointments;
};

export const getPatientsAction = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  if (!session.user.clinic) {
    throw new Error("No clinic selected");
  }

  const patients = await db.query.patientsTable.findMany({
    where: eq(patientsTable.clinicId, session.user.clinic.id),
  });

  return patients;
};

export const getDoctorsAction = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  if (!session.user.clinic) {
    throw new Error("No clinic selected");
  }

  const doctors = await db.query.doctorsTable.findMany({
    where: eq(doctorsTable.clinicId, session.user.clinic.id),
  });

  return doctors;
};
