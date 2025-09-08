"use server";

import { auth } from "@/src/lib/auth";
import { db } from "@/src/db";
import { usersTable, usersToClinicsTable } from "@/src/db/schema";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

interface CreateUserData {
  name: string;
  email: string;
  role: "OWNER" | "MANAGER" | "DOCTOR" | "STAFF";
}

export const createUserAction = async (data: CreateUserData) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  if (!session.user.clinic) {
    throw new Error("No clinic selected");
  }

  // Verificar se o usuário atual é OWNER da clínica
  const userRole = session.user.clinics?.find(
    (clinic) => clinic.id === session.user.clinic?.id,
  )?.role;

  if (userRole !== "OWNER") {
    throw new Error("Only clinic owners can create users");
  }

  // Verificar se já existe um usuário com este email
  const existingUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, data.email))
    .limit(1);

  if (existingUser.length > 0) {
    // Usuário já existe, verificar se já está associado à clínica
    const existingRelation = await db
      .select()
      .from(usersToClinicsTable)
      .where(
        and(
          eq(usersToClinicsTable.userId, existingUser[0].id),
          eq(usersToClinicsTable.clinicId, session.user.clinic.id),
        ),
      )
      .limit(1);

    if (existingRelation.length > 0) {
      throw new Error("User is already associated with this clinic");
    }

    // Associar usuário existente à clínica
    await db.insert(usersToClinicsTable).values({
      userId: existingUser[0].id,
      clinicId: session.user.clinic.id,
      role: data.role,
    });
  } else {
    // Por enquanto, apenas usuários existentes podem ser associados
    // Em produção, implementar sistema de convite por email
    throw new Error(
      "Usuário não encontrado. Apenas usuários existentes podem ser associados à clínica.",
    );
  }
  revalidatePath("/users");
};
