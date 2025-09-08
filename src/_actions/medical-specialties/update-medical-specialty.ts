"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/src/db";
import { medicalSpecialtiesTable } from "@/src/db/schema";
import { auth } from "@/src/lib/auth";
import { actionClient } from "@/src/lib/next-safe-action";
import { eq, and } from "drizzle-orm";
import { updateMedicalSpecialtySchema } from "./schema";

export const updateMedicalSpecialtyAction = actionClient
  .schema(updateMedicalSpecialtySchema)
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

    // Verificar se a especialidade existe e pertence à clínica
    const existingSpecialty = await db
      .select()
      .from(medicalSpecialtiesTable)
      .where(
        and(
          eq(medicalSpecialtiesTable.id, parsedInput.id),
          eq(medicalSpecialtiesTable.clinicId, session.user.clinic.id),
        ),
      )
      .limit(1);

    if (existingSpecialty.length === 0) {
      throw new Error("Especialidade não encontrada");
    }

    // Verificar se já existe outra especialidade com o mesmo nome na clínica
    if (parsedInput.name !== existingSpecialty[0].name) {
      const duplicateSpecialty = await db
        .select({ id: medicalSpecialtiesTable.id })
        .from(medicalSpecialtiesTable)
        .where(
          and(
            eq(medicalSpecialtiesTable.clinicId, session.user.clinic.id),
            eq(medicalSpecialtiesTable.name, parsedInput.name),
          ),
        )
        .limit(1);

      if (duplicateSpecialty.length > 0) {
        throw new Error(
          "Já existe uma especialidade com este nome nesta clínica",
        );
      }
    }

    // Atualizar especialidade
    await db
      .update(medicalSpecialtiesTable)
      .set({
        name: parsedInput.name,
        description: parsedInput.description || null,
        isActive: parsedInput.isActive ?? existingSpecialty[0].isActive,
        updatedAt: new Date(),
      })
      .where(eq(medicalSpecialtiesTable.id, parsedInput.id));

    revalidatePath("/medical-specialties");

    return {
      success: true,
    };
  });
