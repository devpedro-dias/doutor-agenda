import { auth } from "@/src/lib/auth";
import { db } from "@/src/db";
import { usersTable } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    if (!code) {
      return NextResponse.redirect(new URL("/authentication?error=missing_code", request.url));
    }

    // Processar o callback do Google OAuth
    const response = await auth.api.signInSocial({
      body: {
        provider: "google",
        code,
        state,
      },
    });

    if (response.error) {
      console.error("Erro no callback do Google:", response.error);
      return NextResponse.redirect(new URL("/authentication?error=auth_failed", request.url));
    }

    // Verificar se o usuário foi criado e tem plano válido
    if (response.user) {
      const userData = await db.query.usersTable.findFirst({
        where: eq(usersTable.id, response.user.id),
      });

      if (!userData) {
        console.error(`Usuário criado mas não encontrado no banco: ${response.user.email}`);
        // Redirecionar para página inicial com erro
        return NextResponse.redirect(new URL("/?error=user_not_found", request.url));
      }

      if (!userData.plan && userData.plan !== "trial") {
        console.error(`Usuário sem plano válido: ${response.user.email}`);
        // Redirecionar para página inicial
        return NextResponse.redirect(new URL("/?error=no_plan", request.url));
      }
    }

    // Se tudo estiver OK, redirecionar para o dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));

  } catch (error) {
    console.error("Erro no callback do Google:", error);
    return NextResponse.redirect(new URL("/authentication?error=server_error", request.url));
  }
}
