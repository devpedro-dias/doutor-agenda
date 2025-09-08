"use server";

import { auth } from "@/src/lib/auth";
import { db } from "@/src/db";
import { usersTable, usersToClinicsTable } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export const getUsersAction = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  if (!session.user.clinic) {
    throw new Error("No clinic selected");
  }

  // Buscar todos os usuários associados à clínica atual
  const clinicUsers = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      cpf: usersTable.cpf,
      phoneNumber: usersTable.phoneNumber,
      cep: usersTable.cep,
      street: usersTable.street,
      number: usersTable.number,
      complement: usersTable.complement,
      neighborhood: usersTable.neighborhood,
      city: usersTable.city,
      state: usersTable.state,
      address: usersTable.address,
      role: usersToClinicsTable.role,
    })
    .from(usersToClinicsTable)
    .innerJoin(usersTable, eq(usersToClinicsTable.userId, usersTable.id))
    .where(eq(usersToClinicsTable.clinicId, session.user.clinic.id));

  return clinicUsers;
};
