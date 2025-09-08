"use server";

import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { db } from "@/src/db";
import { usersToClinicsTable } from "@/src/db/schema";
import { auth } from "@/src/lib/auth";
import { actionClient } from "@/src/lib/next-safe-action";

export const deleteUser = actionClient
  .schema(
    z.object({
      userId: z.string().uuid(),
    }),
  )
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

    // Verificar se o usuário atual é OWNER ou MANAGER da clínica
    const userRole = session.user.clinics?.find(
      (clinic) => clinic.id === session.user.clinic?.id,
    )?.role;

    if (userRole !== "OWNER" && userRole !== "MANAGER") {
      throw new Error("Only clinic owners and managers can delete users");
    }

    // Verificar se o usuário a ser deletado é OWNER
    const targetUserRole = await db
      .select({ role: usersToClinicsTable.role })
      .from(usersToClinicsTable)
      .where(
        and(
          eq(usersToClinicsTable.userId, parsedInput.userId),
          eq(usersToClinicsTable.clinicId, session.user.clinic.id),
        ),
      )
      .limit(1);

    // NÃO permitir excluir OWNER
    if (targetUserRole[0]?.role === "OWNER") {
      throw new Error("Cannot delete clinic owner");
    }

    // Remover usuário da clínica (não deletar completamente, apenas da relação)
    await db
      .delete(usersToClinicsTable)
      .where(
        and(
          eq(usersToClinicsTable.userId, parsedInput.userId),
          eq(usersToClinicsTable.clinicId, session.user.clinic.id),
        ),
      );

    revalidatePath("/users");
  });
