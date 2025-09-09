import { NextRequest, NextResponse } from "next/server";

// Este callback é apenas para redirecionamento personalizado
// A validação real acontece no customSession do Better Auth
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const error = url.searchParams.get("error");

    // Se houve erro no OAuth, redirecionar para página de erro
    if (error) {
      return NextResponse.redirect(
        new URL(`/authentication/error?error=${error}`, request.url),
      );
    }

    // Se não houve erro, deixar o Better Auth processar normalmente
    // e depois redirecionar com base na validação do customSession
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    console.error("Erro no callback do Google:", error);
    return NextResponse.redirect(
      new URL("/authentication/error?error=server_error", request.url),
    );
  }
}
