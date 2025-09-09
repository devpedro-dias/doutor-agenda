import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

import { auth } from "@/src/lib/auth";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/src/_components/ui/button";

export default async function TrialSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; subscription_id?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const sessionId = resolvedSearchParams.session_id;
  const subscriptionId = resolvedSearchParams.subscription_id;

  console.log("🎯 Trial success page loaded:", {
    sessionId,
    subscriptionId,
  });

  if (!sessionId) {
    redirect("/");
  }

  // Verificar se o usuário já está logado
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 to-white p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        {/* Success Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Bem-vindo à Doutor Agenda!
          </h1>
          <p className="text-gray-600">
            Seu teste gratuito de 14 dias foi ativado com sucesso.
          </p>
        </div>

        {/* Trial Info */}
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <h3 className="mb-2 font-semibold text-green-800">
            🎉 Seu período de teste começou!
          </h3>
          <p className="text-sm text-green-700">
            Você tem 14 dias gratuitos para explorar todas as funcionalidades da
            plataforma. Não é necessário inserir dados de cartão de crédito
            neste período.
          </p>
        </div>

        {/* Next Steps */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Próximos passos:</h3>
          <div className="space-y-3 text-left">
            <div className="flex items-start space-x-3">
              <div className="bg-primary mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full">
                <span className="text-xs font-bold text-white">1</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  Configure sua clínica
                </p>
                <p className="text-sm text-gray-600">
                  Adicione as informações da sua clínica e médicos
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-primary mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full">
                <span className="text-xs font-bold text-white">2</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Convide sua equipe</p>
                <p className="text-sm text-gray-600">
                  Adicione médicos e recepcionistas à plataforma
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-primary mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full">
                <span className="text-xs font-bold text-white">3</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Comece a agendar</p>
                <p className="text-sm text-gray-600">
                  Configure horários e comece a receber agendamentos
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <Button asChild className="w-full">
          <Link href={session ? "/dashboard" : "/authentication"}>
            {session ? "Ir para o Dashboard" : "Fazer Login"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>

        {/* Support */}
        <p className="text-sm text-gray-500">
          Precisa de ajuda? Entre em contato conosco através do{" "}
          <Link href="#contato" className="text-primary hover:underline">
            suporte
          </Link>
        </p>
      </div>
    </div>
  );
}
