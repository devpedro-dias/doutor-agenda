import { Button } from "@/src/_components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/_components/ui/card"
import { Check } from "lucide-react"

export function PricingSection() {
  return (
    <section id="planos" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Planos feitos para sua clínica
          </h2>
          <p className="text-xl text-muted-foreground">
            Escolha o plano ideal para o tamanho da sua prática médica
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Plano Básico */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-center">Básico</CardTitle>
              <div className="text-center">
                <span className="text-3xl font-bold">R$ 99</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Até 500 agendamentos/mês</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Lembretes automáticos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>1 médico</span>
                </div>
              </div>
              <Button className="w-full">Começar teste grátis</Button>
            </CardContent>
          </Card>

          {/* Plano Profissional */}
          <Card className="border-2 border-primary relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
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
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Até 2000 agendamentos/mês</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Até 5 médicos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Relatórios avançados</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Suporte prioritário</span>
                </div>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90">Começar teste grátis</Button>
            </CardContent>
          </Card>

          {/* Plano Empresarial */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-center">Empresarial</CardTitle>
              <div className="text-center">
                <span className="text-3xl font-bold">R$ 399</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Agendamentos ilimitados</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Médicos ilimitados</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>API completa</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Consultoria especializada</span>
                </div>
              </div>
              <Button variant="outline" className="w-full">Falar com vendas</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
