import Link from "next/link";
import { Button } from "@/src/_components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ErrorPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function ErrorPage({ searchParams }: ErrorPageProps) {
  const resolvedSearchParams = await searchParams;
  const error = resolvedSearchParams.error;

  const getErrorMessage = (error: string | undefined) => {
    switch (error) {
      case "missing_code":
        return "Código de autorização não encontrado.";
      case "auth_failed":
        return "Falha na autenticação com o Google.";
      case "server_error":
        return "Erro interno do servidor.";
      default:
        return "Ocorreu um erro durante a autenticação.";
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-red-600">
            Erro de Autenticação
          </h1>
          <p className="text-muted-foreground">{getErrorMessage(error)}</p>
        </div>

        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/authentication">Tentar Novamente</Link>
          </Button>

          <Button variant="outline" asChild className="w-full">
            <Link href="/">Voltar ao Início</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
