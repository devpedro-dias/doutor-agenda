"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { randomUUID } from "crypto";

import { db } from "@/src/db";
import { usersTable, usersToClinicsTable } from "@/src/db/schema";
import { auth } from "@/src/lib/auth";
import { actionClient } from "@/src/lib/next-safe-action";
import { eq, and } from "drizzle-orm";

import { upsertUserSchema } from "./schema";

export const upsertAction = actionClient
  .schema(upsertUserSchema)
  .action(async ({ parsedInput }) => {
    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session?.user) {
        throw new Error("Unauthorized");
      }
      if (!session?.user.clinic?.id) {
        throw new Error("Clinic not found");
      }

      // Verificar se o usuário atual é OWNER ou MANAGER da clínica
      const userRole = session.user.clinics?.find(
        (clinic) => clinic.id === session.user.clinic?.id,
      )?.role;

      if (userRole !== "OWNER" && userRole !== "MANAGER") {
        throw new Error("Only clinic owners and managers can manage users");
      }

      // Se é uma edição (id existe)
      if (parsedInput.id) {
        // Verificar se o usuário a ser editado é OWNER
        const targetUserRole = await db
          .select({ role: usersToClinicsTable.role })
          .from(usersToClinicsTable)
          .where(
            and(
              eq(usersToClinicsTable.userId, parsedInput.id),
              eq(usersToClinicsTable.clinicId, session.user.clinic.id),
            ),
          )
          .limit(1);

        // Se for OWNER, apenas permitir editar o nome, não a role
        if (
          targetUserRole[0]?.role === "OWNER" &&
          parsedInput.role !== "OWNER"
        ) {
          throw new Error("Cannot change owner role");
        }

        // Não permitir promover para OWNER se não for OWNER
        if (userRole === "MANAGER" && parsedInput.role === "OWNER") {
          throw new Error("Managers cannot promote users to owner");
        }

        // Verificar se CPF já existe em outro usuário (se fornecido)
        if (parsedInput.cpf) {
          const existingCPF = await db
            .select({ id: usersTable.id })
            .from(usersTable)
            .where(eq(usersTable.cpf, parsedInput.cpf))
            .limit(1);

          if (existingCPF.length > 0 && existingCPF[0].id !== parsedInput.id) {
            throw new Error("CPF já cadastrado para outro usuário.");
          }
        }

        // Atualizar dados do usuário
        await db
          .update(usersTable)
          .set({
            name: parsedInput.name,
            cpf: parsedInput.cpf || null,
            phoneNumber: parsedInput.phoneNumber || null,
            cep: parsedInput.cep || null,
            street: parsedInput.street || null,
            number: parsedInput.number || null,
            complement: parsedInput.complement || null,
            neighborhood: parsedInput.neighborhood || null,
            city: parsedInput.city || null,
            state: parsedInput.state || null,
            address: parsedInput.address || null,
          })
          .where(eq(usersTable.id, parsedInput.id));

        // Atualizar role na relação clínica-usuário
        await db
          .update(usersToClinicsTable)
          .set({ role: parsedInput.role })
          .where(
            and(
              eq(usersToClinicsTable.userId, parsedInput.id),
              eq(usersToClinicsTable.clinicId, session.user.clinic.id),
            ),
          );
      } else {
        // Se é uma criação (id não existe)
        // Verificar se o usuário atual é OWNER da clínica para criar usuários
        if (userRole !== "OWNER") {
          throw new Error("Only clinic owners can create users");
        }

        // Verificar se CPF já existe (se fornecido)
        if (parsedInput.cpf) {
          const existingCPF = await db
            .select({ id: usersTable.id })
            .from(usersTable)
            .where(eq(usersTable.cpf, parsedInput.cpf))
            .limit(1);

          if (existingCPF.length > 0) {
            throw new Error("CPF já cadastrado para outro usuário.");
          }
        }

        // Verificar se já existe um usuário com este email
        const existingUser = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.email, parsedInput.email))
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

          // Atualizar nome do usuário existente (se necessário)
          await db
            .update(usersTable)
            .set({ name: parsedInput.name })
            .where(eq(usersTable.id, existingUser[0].id));

          // Associar usuário existente à clínica
          await db.insert(usersToClinicsTable).values({
            userId: existingUser[0].id,
            clinicId: session.user.clinic.id,
            role: parsedInput.role,
          });
        } else {
          // Usuário não existe no sistema - criar novo usuário

          // Gerar ID único para o novo usuário
          const newUserId = randomUUID();

          // Criar novo usuário
          await db.insert(usersTable).values({
            id: newUserId,
            name: parsedInput.name,
            email: parsedInput.email,
            emailVerified: false, // Será verificado quando receber convite
            cpf: parsedInput.cpf || null,
            phoneNumber: parsedInput.phoneNumber || null,
            cep: parsedInput.cep || null,
            street: parsedInput.street || null,
            number: parsedInput.number || null,
            complement: parsedInput.complement || null,
            neighborhood: parsedInput.neighborhood || null,
            city: parsedInput.city || null,
            state: parsedInput.state || null,
            address: parsedInput.address || null,
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          // Associar usuário à clínica
          await db.insert(usersToClinicsTable).values({
            userId: newUserId,
            clinicId: session.user.clinic.id,
            role: parsedInput.role,
          });

          // TODO: Aqui seria enviado um email de convite para o usuário
          // com link para definir senha e ativar conta
        }
      }

      revalidatePath("/users");
    } catch (error) {
      throw error; // Re-throw to let next-safe-action handle it
    }
  });
