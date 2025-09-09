"use server";

import { actionClient } from "@/src/lib/next-safe-action";
import { db } from "@/src/db";
import { usersTable } from "@/src/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";

// Schema para validação dos dados do usuário trial
const createTrialUserSchema = z.object({
  email: z.string().email("Email inválido"),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  phone: z.string().optional(),
  planId: z.string().default("basic"),
  customerId: z.string(),
});

export const createTrialUser = actionClient
  .schema(createTrialUserSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { email, name, phone, planId, customerId } = parsedInput;

      // Verificar se usuário já existe
      const existingUser = await db.query.usersTable.findFirst({
        where: eq(usersTable.email, email),
      });

      if (existingUser) {

        // Atualizar dados do usuário existente se necessário
        if (!existingUser.stripeCustomerId) {
          await db
            .update(usersTable)
            .set({
              stripeCustomerId: customerId,
              plan: planId,
              phoneNumber: phone,
              updatedAt: new Date(),
            })
            .where(eq(usersTable.id, existingUser.id));
        }

        return {
          success: true,
          user: {
            id: existingUser.id,
            email: existingUser.email,
            name: existingUser.name,
            plan: existingUser.plan,
          },
        };
      }

      // Criar usuário diretamente no banco
      const userId = crypto.randomUUID();

      const [newUser] = await db
        .insert(usersTable)
        .values({
          id: userId,
          name,
          email,
          phoneNumber: phone,
          plan: planId,
          stripeCustomerId: customerId,
          emailVerified: false, // Usuário precisa verificar email depois
          cpf: null,
          address: null,
          cep: null,
          street: null,
          number: null,
          complement: null,
          neighborhood: null,
          city: null,
          state: null,
          image: null,
          stripeSubscriptionId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        plan: newUser.plan,
        stripeCustomerId: newUser.stripeCustomerId,
      });

      return {
        success: true,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          plan: newUser.plan,
        },
      };
    } catch (error) {
      throw new Error("Falha ao criar usuário trial");
    }
  });
