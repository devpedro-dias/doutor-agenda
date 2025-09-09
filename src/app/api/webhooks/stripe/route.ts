import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { eq } from "drizzle-orm";

import { db } from "@/src/db";
import { usersTable } from "@/src/db/schema";
import { createTrialUser } from "@/src/_actions/create-trial-user";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const sig = (await headers()).get("stripe-signature")!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch {
      return NextResponse.json(
        { error: "Webhook signature verification failed" },
        { status: 400 },
      );
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Verificar se é um trial
        const isTrial = session.metadata?.isTrial === "true";

        if (isTrial) {
          try {
            await handleTrialUserCreation(session);
          } catch {}
        }
        break;
      }

      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;

        // Verificar se é trial
        const isTrial = subscription.metadata?.isTrial === "true";

        // Atualizar usuário com informações da subscription
        if (isTrial) {
          try {
            await updateUserWithSubscription(subscription);
          } catch {}
        }
        break;
      }

      case "setup_intent.succeeded": {

        // Aqui podemos fazer alguma ação quando o setup for concluído
        // Como ativar a subscription ou enviar confirmação
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }
}

async function handleTrialUserCreation(session: Stripe.Checkout.Session) {
  try {
    const { email, name, phone, planId } = session.metadata!;

    // Validar dados obrigatórios
    if (!email || !name) {
      throw new Error("Missing required user data");
    }

    // Verificar se usuário já existe
    const existingUser = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    });

    if (existingUser) {
      return;
    }

    // Verificar se temos um customer ID
    const customerId = session.customer as string;
    if (!customerId) {
      throw new Error("No customer ID found in session");
    }

    // Criar usuário usando server action
    const result = await createTrialUser({
      email,
      name,
      phone,
      planId: planId || "basic",
      customerId,
    });

    if (!result?.data?.success) {
      throw new Error("Failed to create trial user");
    }

    // Enviar email de boas-vindas/verificação
    // Você pode implementar isso com um serviço de email como Resend, SendGrid, etc.
  } catch (error) {
    throw error;
  }
}

async function updateUserWithSubscription(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string;
    const subscriptionId = subscription.id;

    // Verificar se temos um customerId válido
    if (!customerId) {
      return;
    }

    // Estratégia 1: Buscar por customerId
    let existingUser = await db.query.usersTable.findFirst({
      where: eq(usersTable.stripeCustomerId, customerId),
    });

    // Estratégia 2: Se não encontrou, tentar buscar pelo email nos metadados
    if (!existingUser && subscription.metadata?.email) {
      existingUser = await db.query.usersTable.findFirst({
        where: eq(usersTable.email, subscription.metadata.email),
      });

      // Se encontrou pelo email, atualizar o customerId
      if (existingUser && !existingUser.stripeCustomerId) {
        await db
          .update(usersTable)
          .set({
            stripeCustomerId: customerId,
            updatedAt: new Date(),
          })
          .where(eq(usersTable.id, existingUser.id));
      }
    }

    // Estratégia 3: Timing issue - buscar usuários criados recentemente
    if (!existingUser) {
      // Buscar usuários criados nos últimos 10 minutos
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

      const recentUsers = await db.query.usersTable.findMany({
        where: (users, { gte }) => gte(users.createdAt, tenMinutesAgo),
      });

      // Procurar por email entre usuários recentes
      if (subscription.metadata?.email) {
        existingUser = recentUsers.find(
          (user) => user.email === subscription.metadata?.email,
        );
        if (existingUser) {
          // Atualizar customerId se necessário
          if (!existingUser.stripeCustomerId) {
            await db
              .update(usersTable)
              .set({
                stripeCustomerId: customerId,
                updatedAt: new Date(),
              })
              .where(eq(usersTable.id, existingUser.id));
          }
        }
      }

      // Procurar por customerId entre usuários recentes
      if (!existingUser) {
        existingUser = recentUsers.find(
          (user) => user.stripeCustomerId === customerId,
        );
      }
    }

    if (!existingUser) {
      return;
    }

    // Atualizar usuário com subscription ID
    await db
      .update(usersTable)
      .set({
        stripeSubscriptionId: subscriptionId,
        plan: subscription.metadata?.planId || "basic",
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, existingUser.id));

    // Verificar se a atualização foi bem-sucedida
    const updatedUser = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, existingUser.id),
    });

    if (updatedUser?.stripeSubscriptionId !== subscriptionId) {
      throw new Error("Subscription ID was not updated");
    }
  } catch (error) {
    throw error;
  }
}
