import { NextRequest, NextResponse } from "next/server";

// Redirecionamento temporário para o webhook correto
export async function POST(request: NextRequest) {
  console.log(
    "⚠️  Webhook received at old endpoint (/api/stripe/webhook). Redirecting to new endpoint (/api/webhooks/stripe)...",
  );

  try {
    // Criar URL para o endpoint correto
    const url = new URL(request.url);
    url.pathname = "/api/webhooks/stripe";
    url.protocol = "http";
    url.host = "localhost:3000";

    console.log("🔄 Redirecting to:", url.toString());

    // Obter o corpo da requisição
    const body = await request.text();

    // Fazer a requisição para o endpoint correto
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "stripe-signature": request.headers.get("stripe-signature") || "",
        "user-agent": request.headers.get("user-agent") || "",
      },
      body: body,
    });

    const responseText = await response.text();
    console.log("✅ Webhook redirected successfully. Status:", response.status);
    console.log("📄 Response:", responseText);

    return new Response(responseText, {
      status: response.status,
      headers: response.headers,
    });
  } catch (error) {
    console.error("❌ Error redirecting webhook:", error);
    return NextResponse.json(
      {
        error: "Webhook redirection failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
