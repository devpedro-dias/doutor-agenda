"use server";

import { auth } from "@/src/lib/auth";
import { db } from "@/src/db";
import { medicalSpecialtiesTable } from "@/src/db/schema";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";

export const getMedicalSpecialtiesAction = async (includeInactive = false) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  if (!session.user.clinic) {
    throw new Error("No clinic selected");
  }

  // Buscar especialidades da clínica atual
  const specialties = await db
    .select({
      id: medicalSpecialtiesTable.id,
      name: medicalSpecialtiesTable.name,
      description: medicalSpecialtiesTable.description,
      isActive: medicalSpecialtiesTable.isActive,
      createdAt: medicalSpecialtiesTable.createdAt,
      updatedAt: medicalSpecialtiesTable.updatedAt,
    })
    .from(medicalSpecialtiesTable)
    .where(
      and(
        eq(medicalSpecialtiesTable.clinicId, session.user.clinic.id),
        includeInactive
          ? undefined
          : eq(medicalSpecialtiesTable.isActive, true),
      ),
    )
    .orderBy(medicalSpecialtiesTable.name);

  return specialties;
};
