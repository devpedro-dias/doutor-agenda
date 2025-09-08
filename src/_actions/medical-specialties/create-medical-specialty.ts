"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { randomUUID } from "crypto";

import { db } from "@/src/db";
import { medicalSpecialtiesTable } from "@/src/db/schema";
import { auth } from "@/src/lib/auth";
import { actionClient } from "@/src/lib/next-safe-action";
import { createMedicalSpecialtySchema } from "./schema";
import { and, eq } from "drizzle-orm";

export const createMedicalSpecialtyAction = actionClient
  .schema(createMedicalSpecialtySchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    if (!session.user.clinic) {
      throw new Error("No clinic selected");
    }

    // Verificar se o usuário é OWNER ou MANAGER
    const userRole = session.user.clinics?.find(
      (clinic) => clinic.id === session.user.clinic?.id,
    )?.role;

    if (userRole !== "OWNER" && userRole !== "MANAGER") {
      throw new Error("Only clinic owners and managers can manage specialties");
    }

    // Verificar se já existe uma especialidade com o mesmo nome na clínica
    const existingSpecialty = await db
      .select({ id: medicalSpecialtiesTable.id })
      .from(medicalSpecialtiesTable)
      .where(
        and(
          eq(medicalSpecialtiesTable.clinicId, session.user.clinic.id),
          eq(medicalSpecialtiesTable.name, parsedInput.name),
        ),
      )
      .limit(1);

    if (existingSpecialty.length > 0) {
      throw new Error(
        "Já existe uma especialidade com este nome nesta clínica",
      );
    }

    // Criar nova especialidade
    const newSpecialtyId = randomUUID();

    await db.insert(medicalSpecialtiesTable).values({
      id: newSpecialtyId,
      name: parsedInput.name,
      description: parsedInput.description || null,
      clinicId: session.user.clinic.id,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    revalidatePath("/medical-specialties");

    return {
      success: true,
      specialtyId: newSpecialtyId,
    };
  });
