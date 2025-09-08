"use server";

import { auth } from "@/src/lib/auth";
import { db } from "@/src/db";
import { usersToClinicsTable } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

interface DeleteUserData {
  userId: string;
}

export const deleteUser = async (data: DeleteUserData) => {
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

  // Verificar se o usuário a ser deletado não é OWNER
  const targetUserRole = session.user.clinics?.find(
    (clinic) => clinic.id === session.user.clinic?.id,
  )?.role;

  if (targetUserRole === "OWNER") {
    throw new Error("Cannot delete clinic owner");
  }

  // Remover usuário da clínica (não deletar completamente, apenas da relação)
  await db
    .delete(usersToClinicsTable)
    .where(eq(usersToClinicsTable.userId, data.userId))
    .where(eq(usersToClinicsTable.clinicId, session.user.clinic.id));
};
