"use server";

import { headers } from "next/headers";

import { db } from "@/src/db";
import { doctorsTable, medicalSpecialtiesTable } from "@/src/db/schema";
import { auth } from "@/src/lib/auth";
import { actionClient } from "@/src/lib/next-safe-action";
import { and, eq } from "drizzle-orm";
import { deleteMedicalSpecialtySchema } from "./schema";

export const deleteMedicalSpecialtyAction = actionClient
  .schema(deleteMedicalSpecialtySchema)
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

    // Verificar se existem médicos usando esta especialidade
    const doctorsUsingSpecialty = await db
      .select({ count: doctorsTable.id })
      .from(doctorsTable)
      .where(
        and(
          eq(doctorsTable.specialtyId, parsedInput.id),
          eq(doctorsTable.clinicId, session.user.clinic.id),
        ),
      )
      .limit(1);

    if (doctorsUsingSpecialty.length > 0) {
      // Se existem médicos usando, apenas desativar
      await db
        .update(medicalSpecialtiesTable)
        .set({
          isActive: false,
          updatedAt: new Date(),
        })
        .where(eq(medicalSpecialtiesTable.id, parsedInput.id));

      return {
        success: true,
        message:
          "Especialidade desativada com sucesso (ainda possui médicos associados)",
      };
    } else {
      // Se não existem médicos usando, pode excluir fisicamente
      await db
        .delete(medicalSpecialtiesTable)
        .where(eq(medicalSpecialtiesTable.id, parsedInput.id));

      return {
        success: true,
        message: "Especialidade excluída com sucesso",
      };
    }
  });
