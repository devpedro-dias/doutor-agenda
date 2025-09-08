import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import LoginForm from "./_components/login-form";
import { redirect } from "next/navigation";
import Link from "next/link";

const AuthenticationPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    redirect("/dashboard");
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
