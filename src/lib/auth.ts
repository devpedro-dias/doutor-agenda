import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { customSession } from "better-auth/plugins";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

import { db } from "@/src/db";
import * as schema from "@/src/db/schema";
import { usersTable, usersToClinicsTable } from "@/src/db/schema";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    schema,
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    customSession(async ({ user, session }) => {
      try {
        // TODO: colocar cache
        const [userData, clinics] = await Promise.all([
          db.query.usersTable.findFirst({
            where: eq(usersTable.id, user.id),
          }),
          db.query.usersToClinicsTable.findMany({
            where: eq(usersToClinicsTable.userId, user.id),
            with: {
              clinic: true,
              user: true,
            },
          }),
        ]);

        // Verificar se o usuário existe no banco
        if (!userData) {
          return {
            user: { ...user, plan: null, clinic: null, clinics: [] },
            session,
          };
        }

        // Verificar se o usuário tem plano ativo (validação adicional)
        if (!userData.plan && userData.plan !== "trial") {
          return {
            user: { ...user, plan: null, clinic: null, clinics: [] },
            session,
          };
        }

        // Incluir todas as clínicas do usuário
        const userClinics =
          clinics?.map((userClinic) => ({
            id: userClinic.clinicId,
            name: userClinic.clinic?.name,
            role: userClinic.role,
          })) || [];

        // Verificar clínica selecionada no cookie
        let selectedClinic = userClinics[0]; // Padrão: primeira clínica

        try {
          const cookieStore = await cookies();
          const selectedClinicCookie = cookieStore.get("selectedClinic")?.value;

          if (selectedClinicCookie) {
            const parsedClinic = JSON.parse(selectedClinicCookie);

            // Verificar se a clínica ainda existe e o usuário tem acesso
            const clinicExists = userClinics.find(
              (c) => c.id === parsedClinic.id,
            );

            if (clinicExists) {
              selectedClinic = parsedClinic;
            }
          }
        } catch {
          // Se houver erro ao ler o cookie, usar a primeira clínica
        }

        return {
          user: {
            ...user,
            plan: userData?.plan,
            clinic: selectedClinic,
            clinics: userClinics,
          },
          session,
        };
      } catch (error) {
        // Log do erro para debug
        console.error("Erro na validação da sessão:", error);

        // Em caso de erro, retornar dados básicos para segurança
        return {
          user: {
            ...user,
            plan: null,
            clinic: null,
            clinics: [],
          },
          session,
        };
      }
    }),
  ],
  user: {
    modelName: "usersTable",
    additionalFields: {
      stripeCustomerId: {
        type: "string",
        fieldName: "stripeCustomerId",
        required: false,
      },
      stripeSubscriptionId: {
        type: "string",
        fieldName: "stripeSubscriptionId",
        required: false,
      },
      plan: {
        type: "string",
        fieldName: "plan",
        required: false,
      },
    },
  },
  session: {
    modelName: "sessionsTable",
  },
  account: {
    modelName: "accountsTable",
  },
  verification: {
    modelName: "verificationsTable",
  },
  emailAndPassword: {
    enabled: true,
  },
});
