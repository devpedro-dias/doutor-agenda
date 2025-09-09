"use server";

import Stripe from "stripe";
import { actionClient } from "@/src/lib/next-safe-action";
import { z } from "zod";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

// Schema para validação dos dados do trial
const trialSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
});

export const createTrialCheckout = actionClient
  .schema(trialSchema)
  .action(async ({ parsedInput }) => {
    if (!process.env.STRIPE_BASIC_PLAN_PRICE_ID) {
      throw new Error("Stripe basic plan price ID not found");
    }

    console.log("🛒 Creating Stripe trial setup with data:", {
      email: parsedInput.email,
      name: parsedInput.name,
      phone: parsedInput.phone,
      priceId: process.env.STRIPE_BASIC_PLAN_PRICE_ID,
    });

    console.log("🔧 Environment check:", {
      hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
      hasPriceId: !!process.env.STRIPE_BASIC_PLAN_PRICE_ID,
    });

    // Primeiro, criar um customer
    const customer = await stripe.customers.create({
      email: parsedInput.email,
      name: parsedInput.name,
      phone: parsedInput.phone,
      metadata: {
        planId: "basic",
        isTrial: "true",
      },
    });

    console.log("👤 Customer created:", customer.id);

    // Depois, criar uma subscription com trial
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price: process.env.STRIPE_BASIC_PLAN_PRICE_ID,
          quantity: 1,
        },
      ],
      trial_period_days: 14,
      metadata: {
        email: parsedInput.email,
        name: parsedInput.name,
        phone: parsedInput.phone,
        planId: "basic",
        isTrial: "true",
      },
    });

    console.log("📝 Subscription created:", subscription.id);

    // Agora criar a sessão de checkout para coletar método de pagamento
    const sessionConfig = {
      mode: "setup" as const, // Mudar para setup para coletar payment method sem cobrança imediata
      payment_method_types: [
        "card",
      ] as Stripe.Checkout.SessionCreateParams.PaymentMethodType[],
      customer: customer.id,
      metadata: {
        email: parsedInput.email,
        name: parsedInput.name,
        phone: parsedInput.phone,
        planId: "basic",
        isTrial: "true",
        subscriptionId: subscription.id,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/trial-success?session_id={CHECKOUT_SESSION_ID}&subscription_id=${subscription.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
    };

    console.log("📋 Session config metadata:", sessionConfig.metadata);

    const { id: sessionId } =
      await stripe.checkout.sessions.create(sessionConfig);

    console.log("✅ Stripe setup session created:", sessionId);

    return {
      sessionId,
    };
  });
