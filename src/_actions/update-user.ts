"use server";

import { auth } from "@/src/lib/auth";
import { db } from "@/src/db";
import { usersTable, usersToClinicsTable } from "@/src/db/schema";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";

interface UpdateUserData {
  userId: string;
  name: string;
  role: "OWNER" | "MANAGER" | "DOCTOR" | "STAFF";
}

export const updateUser = async (data: UpdateUserData) => {
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
    throw new Error("Only clinic owners and managers can update users");
  }

  // Verificar se o usuário a ser editado é OWNER
  const targetUserRole = session.user.clinics?.find(
    (clinic) => clinic.id === session.user.clinic?.id,
  )?.role;

  // Se for OWNER, apenas permitir editar o nome, não a role
  if (targetUserRole === "OWNER" && data.role !== "OWNER") {
    throw new Error("Cannot change owner role");
  }

  // Não permitir promover para OWNER se não for OWNER
  if (userRole === "MANAGER" && data.role === "OWNER") {
    throw new Error("Managers cannot promote users to owner");
  }

  // Atualizar nome do usuário
  await db
    .update(usersTable)
    .set({ name: data.name })
    .where(eq(usersTable.id, data.userId));

  // Atualizar role na relação clínica-usuário
  await db
    .update(usersToClinicsTable)
    .set({ role: data.role })
    .where(
      and(
        eq(usersToClinicsTable.userId, data.userId),
        eq(usersToClinicsTable.clinicId, session.user.clinic.id),
      ),
    );
};
