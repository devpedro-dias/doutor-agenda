"use server";

import { eq } from "drizzle-orm";

import { auth } from "@/src/lib/auth";
import { db } from "@/src/db";
import { doctorsTable, medicalSpecialtiesTable } from "@/src/db/schema";
import { headers } from "next/headers";

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

  const doctors = await db
    .select({
      id: doctorsTable.id,
      name: doctorsTable.name,
      userId: doctorsTable.userId,
      clinicId: doctorsTable.clinicId,
      avatarImageUrl: doctorsTable.avatarImageUrl,
      availableFromWeekDay: doctorsTable.availableFromWeekDay,
      availableToWeekDay: doctorsTable.availableToWeekDay,
      availableFromTime: doctorsTable.availableFromTime,
      availableToTime: doctorsTable.availableToTime,
      appointmentPriceInCents: doctorsTable.appointmentPriceInCents,
      specialtyId: doctorsTable.specialtyId,
      createdAt: doctorsTable.createdAt,
      updatedAt: doctorsTable.updatedAt,
      specialty: {
        id: medicalSpecialtiesTable.id,
        name: medicalSpecialtiesTable.name,
        description: medicalSpecialtiesTable.description,
        clinicId: medicalSpecialtiesTable.clinicId,
        isActive: medicalSpecialtiesTable.isActive,
        createdAt: medicalSpecialtiesTable.createdAt,
        updatedAt: medicalSpecialtiesTable.updatedAt,
      },
    })
    .from(doctorsTable)
    .leftJoin(
      medicalSpecialtiesTable,
      eq(doctorsTable.specialtyId, medicalSpecialtiesTable.id),
    )
    .where(eq(doctorsTable.clinicId, session.user.clinic.id));

  return doctors;
};
