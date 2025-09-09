"use server";

import { actionClient } from "@/src/lib/next-safe-action";
import { db } from "@/src/db";
import { usersTable } from "@/src/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";

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

      const existingUser = await db.query.usersTable.findFirst({
        where: eq(usersTable.email, email),
      });

      if (existingUser) {
        // Se o usuário existe mas não tem customerId ou subscriptionId, atualiza
        if (!existingUser.stripeCustomerId || !existingUser.stripeSubscriptionId) {
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

      const userId = crypto.randomUUID();

      const result = await db.insert(usersTable).values({
        id: userId,
        name,
        email,
        phoneNumber: phone,
        plan: planId,
        stripeCustomerId: customerId,
        stripeSubscriptionId: null,
        emailVerified: false,
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
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();

      const newUser = result[0];

      return {
        success: true,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          plan: newUser.plan,
        },
      };
    } catch {
      throw new Error("Falha ao criar usuário trial");
    }
  });