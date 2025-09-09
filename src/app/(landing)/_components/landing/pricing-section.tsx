"use client";

import { Button } from "@/src/_components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/_components/ui/card";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

export function PricingSection() {
  const router = useRouter();

  const handleBasicTrial = () => {
    // Redireciona para a seção do formulário no hero
    document.getElementById("trial-form")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const handleProfessionalTrial = () => {
    // Por enquanto, redireciona para contato
    router.push("/#contato");
  };

  const handleEnterpriseContact = () => {
    router.push("/#contato");
  };

  return (
    <section id="planos" className="bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="text-foreground mb-4 text-3xl font-bold sm:text-4xl">
            Planos feitos para sua clínica
          </h2>
          <p className="text-muted-foreground text-xl">
            Escolha o plano ideal para o tamanho da sua prática médica
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Plano Básico */}
          <Card className="flex min-h-[500px] flex-col border-2">
            <CardHeader>
              <CardTitle className="text-center">Básico</CardTitle>
              <div className="text-center">
                <span className="text-3xl font-bold">R$ 99</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Check className="text-primary h-5 w-5 flex-shrink-0" />
                  <span>Até 500 agendamentos/mês</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="text-primary h-5 w-5 flex-shrink-0" />
                  <span>Lembretes automáticos</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="text-primary h-5 w-5 flex-shrink-0" />
                  <span>1 médico</span>
                </div>
              </div>
              <Button className="mt-6 w-full" onClick={handleBasicTrial}>
                Começar teste grátis
              </Button>
            </CardContent>
          </Card>

          {/* Plano Profissional */}
          <Card className="border-primary relative flex min-h-[500px] flex-col border-2">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
              <span className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-sm font-semibold">
                Mais Popular
              </span>
            </div>
            <CardHeader>
              <CardTitle className="text-center">Profissional</CardTitle>
              <div className="text-center">
                <span className="text-3xl font-bold">R$ 199</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Check className="text-primary h-5 w-5 flex-shrink-0" />
                  <span>Até 2000 agendamentos/mês</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="text-primary h-5 w-5 flex-shrink-0" />
                  <span>Até 5 médicos</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="text-primary h-5 w-5 flex-shrink-0" />
                  <span>Relatórios avançados</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="text-primary h-5 w-5 flex-shrink-0" />
                  <span>Suporte prioritário</span>
                </div>
              </div>
              <Button
                className="bg-primary hover:bg-primary/90 mt-6 w-full"
                onClick={handleProfessionalTrial}
              >
                Fazer upgrade
              </Button>
            </CardContent>
          </Card>

          {/* Plano Empresarial */}
          <Card className="flex min-h-[500px] flex-col border-2">
            <CardHeader>
              <CardTitle className="text-center">Empresarial</CardTitle>
              <div className="text-center">
                <span className="text-3xl font-bold">A combinar</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Check className="text-primary h-5 w-5 flex-shrink-0" />
                  <span>Agendamentos ilimitados</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="text-primary h-5 w-5 flex-shrink-0" />
                  <span>Médicos ilimitados</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="text-primary h-5 w-5 flex-shrink-0" />
                  <span>API completa</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="text-primary h-5 w-5 flex-shrink-0" />
                  <span>Consultoria especializada</span>
                </div>
              </div>
              <Button
                variant="outline"
                className="mt-6 w-full"
                onClick={handleEnterpriseContact}
              >
                Falar com vendas
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
