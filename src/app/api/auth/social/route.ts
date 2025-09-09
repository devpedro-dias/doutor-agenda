"use server";

import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { db } from "@/src/db";
import { usersTable } from "@/src/db/schema";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get("provider");
  const email = searchParams.get("email");

  if (!provider || !email) {
    return NextResponse.json(
      { error: "Parâmetros obrigatórios não fornecidos" },
      { status: 400 },
    );
  }

  try {
    // Verificar se o usuário já existe
    const existingUser = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    });

    const cookieStore = await cookies();
    const isTrial = cookieStore.get("isTrial")?.value === "true";

    if (existingUser) {
      // Usuário já existe - verificar se tem plano ativo
      if (!existingUser.plan && existingUser.plan !== "trial") {
        return NextResponse.json(
          { error: "Usuário não autorizado para fazer login com provider" },
          { status: 403 },
        );
      }

      // Usuário tem plano ativo - permitir login
      return NextResponse.json({ success: true });
    } else {
      // Usuário não existe - verificar se está no contexto de trial
      if (!isTrial) {
        return NextResponse.json(
          {
            error:
              "Usuário deve ter um plano ativo para criar conta com provider",
          },
          { status: 403 },
        );
      }

      // Está no contexto de trial - permitir criação
      return NextResponse.json({ success: true, isNewUser: true });
    }
  } catch (error) {
    console.error("Erro ao verificar usuário:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
