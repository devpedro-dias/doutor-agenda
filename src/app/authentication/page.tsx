import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { cookies } from "next/headers";
import LoginForm from "./_components/login-form";
import { redirect } from "next/navigation";
import Link from "next/link";

const AuthenticationPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ trial?: string }>;
}) => {
  const resolvedSearchParams = await searchParams;
  let session;

  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    console.log("Erro ao obter sessão:", error);
    session = null;
  }

  // Verificar se o usuário já está logado e tem plano válido
  if (session?.user && (session.user.plan || session.user.plan === "trial")) {
    redirect("/dashboard");
  }

  // Definir cookie de trial se vier com parâmetro trial=true
  if (resolvedSearchParams.trial === "true") {
    const cookieStore = await cookies();
    cookieStore.set("isTrial", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Entrar na sua conta</h1>
          <p className="text-muted-foreground mt-2">
            Digite suas credenciais para acessar o sistema
          </p>
        </div>
        <LoginForm />
        <div className="text-muted-foreground text-center text-sm">
          <p>
            Não tem uma conta?{" "}
            <Link href="/" className="text-primary hover:underline">
              Escolha um plano
            </Link>{" "}
            para começar
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationPage;
