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
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err);
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
          } catch (error) {
            console.error("❌ Error during user creation:", error);
          }
        }
        break;
      }

      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("🎯 CUSTOMER SUBSCRIPTION CREATED received!");
        console.log("🔗 Subscription ID:", subscription.id);
        console.log("👤 Customer ID:", subscription.customer);
        console.log("📊 Status:", subscription.status);
        console.log("📅 Trial end:", subscription.trial_end);
        console.log("📋 Metadata:", subscription.metadata);

        // Verificar se é trial
        const isTrial = subscription.metadata?.isTrial === "true";
        console.log("🔍 Trial check:", {
          isTrial,
          metadataIsTrial: subscription.metadata?.isTrial,
          metadataKeys: Object.keys(subscription.metadata || {}),
        });

        // Atualizar usuário com informações da subscription
        if (isTrial) {
          console.log("✅ Processing trial subscription update...");
          try {
            await updateUserWithSubscription(subscription);
            console.log("✅ Trial subscription update completed!");
          } catch (error) {
            console.error("❌ Error in trial subscription update:", error);
            console.error(
              "Stack:",
              error instanceof Error ? error.stack : "No stack",
            );
          }
        } else {
          console.log("❌ Not a trial subscription - skipping update");
        }
        break;
      }

      case "setup_intent.succeeded": {
        const setupIntent = event.data.object as Stripe.SetupIntent;
        console.log("🔧 Setup intent succeeded:", setupIntent.id);
        console.log("👤 Customer ID:", setupIntent.customer);
        console.log("💳 Payment method:", setupIntent.payment_method);

        // Aqui podemos fazer alguma ação quando o setup for concluído
        // Como ativar a subscription ou enviar confirmação
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }
}

async function handleTrialUserCreation(session: Stripe.Checkout.Session) {
  try {
    console.log("🚀 Starting trial user creation process...");
    const { email, name, phone, planId } = session.metadata!;

    console.log("📝 User data from session:", { email, name, phone, planId });

    // Validar dados obrigatórios
    if (!email || !name) {
      console.error("❌ Missing required user data:", { email, name });
      throw new Error("Missing required user data");
    }

    // Verificar se usuário já existe
    const existingUser = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    });

    if (existingUser) {
      console.log("User already exists:", email);
      return;
    }

    // Verificar se temos um customer ID
    const customerId = session.customer as string;
    if (!customerId) {
      console.error("No customer ID found in session");
      throw new Error("No customer ID found in session");
    }

    // Criar usuário usando server action
    console.log("🔄 Calling createTrialUser server action...");
    const result = await createTrialUser({
      email,
      name,
      phone,
      planId: planId || "basic",
      customerId,
    });

    console.log("📋 Server action result:", result);

    if (!result?.data?.success) {
      console.error("❌ Server action failed:", result);
      throw new Error("Failed to create trial user");
    }

    console.log("✅ Trial user created via server action:", result.data.user);

    // Enviar email de boas-vindas/verificação
    // Você pode implementar isso com um serviço de email como Resend, SendGrid, etc.
  } catch (error) {
    console.error("Error creating trial user:", error);
    throw error;
  }
}

async function updateUserWithSubscription(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string;
    const subscriptionId = subscription.id;

    console.log("🔄 STARTING subscription update process");
    console.log("📊 Subscription details:", {
      id: subscriptionId,
      customerId,
      status: subscription.status,
      trialEnd: subscription.trial_end,
      metadata: subscription.metadata,
    });

    // Verificar se temos um customerId válido
    if (!customerId) {
      console.error("❌ No customer ID found in subscription");
      return;
    }

    console.log("🔍 MULTI-STRATEGY USER SEARCH...");

    // Estratégia 1: Buscar por customerId
    let existingUser = await db.query.usersTable.findFirst({
      where: eq(usersTable.stripeCustomerId, customerId),
    });

    console.log("📋 Strategy 1 - Search by customerId:", {
      found: !!existingUser,
      customerId,
      userId: existingUser?.id,
      userEmail: existingUser?.email,
      userCurrentSubscription: existingUser?.stripeSubscriptionId,
    });

    // Estratégia 2: Se não encontrou, tentar buscar pelo email nos metadados
    if (!existingUser && subscription.metadata?.email) {
      console.log("🔄 Strategy 2 - CustomerId failed, trying email lookup");
      console.log("📧 Searching by email:", subscription.metadata.email);

      existingUser = await db.query.usersTable.findFirst({
        where: eq(usersTable.email, subscription.metadata.email),
      });

      console.log("📋 Strategy 2 - Search by email result:", {
        found: !!existingUser,
        email: subscription.metadata.email,
        userId: existingUser?.id,
        userCustomerId: existingUser?.stripeCustomerId,
        userCurrentSubscription: existingUser?.stripeSubscriptionId,
      });

      // Se encontrou pelo email, atualizar o customerId
      if (existingUser && !existingUser.stripeCustomerId) {
        console.log(
          "📝 Strategy 2 - User found by email but missing customerId - updating...",
        );
        await db
          .update(usersTable)
          .set({
            stripeCustomerId: customerId,
            updatedAt: new Date(),
          })
          .where(eq(usersTable.id, existingUser.id));

        console.log(
          "✅ Strategy 2 - CustomerId updated for user:",
          existingUser.id,
        );
      }
    }

    // Estratégia 3: Timing issue - buscar usuários criados recentemente
    if (!existingUser) {
      console.log(
        "🔄 Strategy 3 - Timing issue detected, searching recent users...",
      );

      // Buscar usuários criados nos últimos 10 minutos
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

      const recentUsers = await db.query.usersTable.findMany({
        where: (users, { gte }) => gte(users.createdAt, tenMinutesAgo),
      });

      console.log(`📋 Strategy 3 - Found ${recentUsers.length} recent users`);
      console.log(
        "📋 Recent users:",
        recentUsers.map((u) => ({
          id: u.id,
          email: u.email,
          customerId: u.stripeCustomerId,
          subscriptionId: u.stripeSubscriptionId,
          createdAt: u.createdAt,
        })),
      );

      // Procurar por email entre usuários recentes
      if (subscription.metadata?.email) {
        existingUser = recentUsers.find(
          (user) => user.email === subscription.metadata?.email,
        );
        if (existingUser) {
          console.log(
            "✅ Strategy 3 - Found user by email in recent users:",
            existingUser.id,
          );

          // Atualizar customerId se necessário
          if (!existingUser.stripeCustomerId) {
            console.log("📝 Strategy 3 - Updating missing customerId...");
            await db
              .update(usersTable)
              .set({
                stripeCustomerId: customerId,
                updatedAt: new Date(),
              })
              .where(eq(usersTable.id, existingUser.id));
            console.log("✅ Strategy 3 - CustomerId updated");
          }
        }
      }

      // Procurar por customerId entre usuários recentes
      if (!existingUser) {
        existingUser = recentUsers.find(
          (user) => user.stripeCustomerId === customerId,
        );
        if (existingUser) {
          console.log(
            "✅ Strategy 3 - Found user by customerId in recent users:",
            existingUser.id,
          );
        }
      }
    }

    if (!existingUser) {
      console.error("❌ CRITICAL: User not found for subscription update!", {
        customerId,
        email: subscription.metadata?.email,
        subscriptionId,
      });
      return;
    }

    console.log("🎯 User found! Preparing to update subscription...");
    console.log("📊 Current user data:", {
      id: existingUser.id,
      email: existingUser.email,
      currentSubscriptionId: existingUser.stripeSubscriptionId,
      currentPlan: existingUser.plan,
    });

    // Atualizar usuário com subscription ID
    console.log("💾 Executing database update...");

    const updateResult = await db
      .update(usersTable)
      .set({
        stripeSubscriptionId: subscriptionId,
        plan: subscription.metadata?.planId || "basic",
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, existingUser.id));

    console.log("✅ Database update executed:", updateResult);

    // Verificar se a atualização foi bem-sucedida
    const updatedUser = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, existingUser.id),
    });

    console.log("🔍 VERIFICATION - Updated user data:", {
      id: updatedUser?.id,
      email: updatedUser?.email,
      stripeSubscriptionId: updatedUser?.stripeSubscriptionId,
      plan: updatedUser?.plan,
      stripeCustomerId: updatedUser?.stripeCustomerId,
    });

    if (updatedUser?.stripeSubscriptionId === subscriptionId) {
      console.log("🎉 SUCCESS: Subscription ID updated correctly!");
    } else {
      console.error("❌ FAILURE: Subscription ID was not updated!", {
        expected: subscriptionId,
        actual: updatedUser?.stripeSubscriptionId,
      });
    }
  } catch (error) {
    console.error("❌ CRITICAL ERROR in updateUserWithSubscription:", error);
    console.error(
      "Stack trace:",
      error instanceof Error ? error.stack : "No stack trace",
    );
    throw error;
  }
}

    if (existingUser) {
      console.log("User already exists:", email);
      return;
    }

    // Verificar se temos um customer ID
    const customerId = session.customer as string;
    if (!customerId) {
      console.error("No customer ID found in session");
      throw new Error("No customer ID found in session");
    }

    // Criar usuário usando server action
    console.log("🔄 Calling createTrialUser server action...");
    const result = await createTrialUser({
      email,
      name,
      phone,
      planId: planId || "basic",
      customerId,
    });

    console.log("📋 Server action result:", result);

    if (!result?.data?.success) {
      console.error("❌ Server action failed:", result);
      throw new Error("Failed to create trial user");
    }

    console.log("✅ Trial user created via server action:", result.data.user);

    // Enviar email de boas-vindas/verificação
    // Você pode implementar isso com um serviço de email como Resend, SendGrid, etc.
  } catch (error) {
    console.error("Error creating trial user:", error);
    throw error;
  }
}

async function updateUserWithSubscription(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string;
    const subscriptionId = subscription.id;

    console.log("🔄 STARTING subscription update process");
    console.log("📊 Subscription details:", {
      id: subscriptionId,
      customerId,
      status: subscription.status,
      trialEnd: subscription.trial_end,
      metadata: subscription.metadata,
    });

    // Verificar se temos um customerId válido
    if (!customerId) {
      console.error("❌ No customer ID found in subscription");
      return;
    }

    console.log("🔍 MULTI-STRATEGY USER SEARCH...");

    // Estratégia 1: Buscar por customerId
    let existingUser = await db.query.usersTable.findFirst({
      where: eq(usersTable.stripeCustomerId, customerId),
    });

    console.log("📋 Strategy 1 - Search by customerId:", {
      found: !!existingUser,
      customerId,
      userId: existingUser?.id,
      userEmail: existingUser?.email,
      userCurrentSubscription: existingUser?.stripeSubscriptionId,
    });

    // Estratégia 2: Se não encontrou, tentar buscar pelo email nos metadados
    if (!existingUser && subscription.metadata?.email) {
      console.log("🔄 Strategy 2 - CustomerId failed, trying email lookup");
      console.log("📧 Searching by email:", subscription.metadata.email);

      existingUser = await db.query.usersTable.findFirst({
        where: eq(usersTable.email, subscription.metadata.email),
      });

      console.log("📋 Strategy 2 - Search by email result:", {
        found: !!existingUser,
        email: subscription.metadata.email,
        userId: existingUser?.id,
        userCustomerId: existingUser?.stripeCustomerId,
        userCurrentSubscription: existingUser?.stripeSubscriptionId,
      });

      // Se encontrou pelo email, atualizar o customerId
      if (existingUser && !existingUser.stripeCustomerId) {
        console.log(
          "📝 Strategy 2 - User found by email but missing customerId - updating...",
        );
        await db
          .update(usersTable)
          .set({
            stripeCustomerId: customerId,
            updatedAt: new Date(),
          })
          .where(eq(usersTable.id, existingUser.id));

        console.log(
          "✅ Strategy 2 - CustomerId updated for user:",
          existingUser.id,
        );
      }
    }

    // Estratégia 3: Timing issue - buscar usuários criados recentemente
    if (!existingUser) {
      console.log(
        "🔄 Strategy 3 - Timing issue detected, searching recent users...",
      );

      // Buscar usuários criados nos últimos 10 minutos
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

      const recentUsers = await db.query.usersTable.findMany({
        where: (users, { gte }) => gte(users.createdAt, tenMinutesAgo),
      });

      console.log(`📋 Strategy 3 - Found ${recentUsers.length} recent users`);
      console.log(
        "📋 Recent users:",
        recentUsers.map((u) => ({
          id: u.id,
          email: u.email,
          customerId: u.stripeCustomerId,
          subscriptionId: u.stripeSubscriptionId,
          createdAt: u.createdAt,
        })),
      );

      // Procurar por email entre usuários recentes
      if (subscription.metadata?.email) {
        existingUser = recentUsers.find(
          (user) => user.email === subscription.metadata?.email,
        );
        if (existingUser) {
          console.log(
            "✅ Strategy 3 - Found user by email in recent users:",
            existingUser.id,
          );

          // Atualizar customerId se necessário
          if (!existingUser.stripeCustomerId) {
            console.log("📝 Strategy 3 - Updating missing customerId...");
            await db
              .update(usersTable)
              .set({
                stripeCustomerId: customerId,
                updatedAt: new Date(),
              })
              .where(eq(usersTable.id, existingUser.id));
            console.log("✅ Strategy 3 - CustomerId updated");
          }
        }
      }

      // Procurar por customerId entre usuários recentes
      if (!existingUser) {
        existingUser = recentUsers.find(
          (user) => user.stripeCustomerId === customerId,
        );
        if (existingUser) {
          console.log(
            "✅ Strategy 3 - Found user by customerId in recent users:",
            existingUser.id,
          );
        }
      }
    }

    if (!existingUser) {
      console.error("❌ CRITICAL: User not found for subscription update!", {
        customerId,
        email: subscription.metadata?.email,
        subscriptionId,
      });
      return;
    }

    console.log("🎯 User found! Preparing to update subscription...");
    console.log("📊 Current user data:", {
      id: existingUser.id,
      email: existingUser.email,
      currentSubscriptionId: existingUser.stripeSubscriptionId,
      currentPlan: existingUser.plan,
    });

    // Atualizar usuário com subscription ID
    console.log("💾 Executing database update...");

    const updateResult = await db
      .update(usersTable)
      .set({
        stripeSubscriptionId: subscriptionId,
        plan: subscription.metadata?.planId || "basic",
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, existingUser.id));

    console.log("✅ Database update executed:", updateResult);

    // Verificar se a atualização foi bem-sucedida
    const updatedUser = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, existingUser.id),
    });

    console.log("🔍 VERIFICATION - Updated user data:", {
      id: updatedUser?.id,
      email: updatedUser?.email,
      stripeSubscriptionId: updatedUser?.stripeSubscriptionId,
      plan: updatedUser?.plan,
      stripeCustomerId: updatedUser?.stripeCustomerId,
    });

    if (updatedUser?.stripeSubscriptionId === subscriptionId) {
      console.log("🎉 SUCCESS: Subscription ID updated correctly!");
    } else {
      console.error("❌ FAILURE: Subscription ID was not updated!", {
        expected: subscriptionId,
        actual: updatedUser?.stripeSubscriptionId,
      });
    }
  } catch (error) {
    console.error("❌ CRITICAL ERROR in updateUserWithSubscription:", error);
    console.error(
      "Stack trace:",
      error instanceof Error ? error.stack : "No stack trace",
    );
    throw error;
  }
}
