"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Star, Zap } from "lucide-react"

export function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "R$ 97",
      period: "/mês",
      description: "Perfeito para consultórios pequenos",
      features: [
        "Até 500 agendamentos/mês",
        "Lembretes automáticos",
        "Agenda online",
        "Suporte por email",
        "Relatórios básicos",
      ],
      popular: false,
      cta: "Começar teste grátis",
    },
    {
      name: "Professional",
      price: "R$ 197",
      period: "/mês",
      description: "Ideal para clínicas em crescimento",
      features: [
        "Agendamentos ilimitados",
        "Múltiplos profissionais",
        "App mobile completo",
        "Integração WhatsApp",
        "Relatórios avançados",
        "Suporte prioritário",
        "Prontuário eletrônico",
      ],
      popular: true,
      cta: "Começar teste grátis",
    },
    {
      name: "Enterprise",
      price: "R$ 397",
      period: "/mês",
      description: "Para grandes clínicas e hospitais",
      features: [
        "Tudo do Professional",
        "Múltiplas unidades",
        "API personalizada",
        "Integração com sistemas",
        "Suporte 24/7",
        "Treinamento dedicado",
        "Customizações",
      ],
      popular: false,
      cta: "Falar com consultor",
    },
  ]

  return (
    <section id="planos" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Escolha o plano ideal para
            <span className="text-primary"> sua clínica</span>
          </h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
            Todos os planos incluem 30 dias de teste grátis. Sem compromisso, cancele quando quiser.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 ${
                plan.popular ? "bg-gradient-to-br from-accent/5 to-primary/5 ring-2 ring-accent/20" : "bg-card/50"
              } backdrop-blur-sm`}
              style={{
                animationDelay: `${index * 0.1}s`,
                animation: "fadeInUp 0.6s ease-out forwards",
              }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Star className="h-4 w-4" />
                    <span>Mais Popular</span>
                  </div>
                </div>
              )}

              <CardHeader className="text-center space-y-4 pb-8">
                <CardTitle className="text-2xl font-bold text-foreground">{plan.name}</CardTitle>
                <div className="space-y-2">
                  <div className="flex items-baseline justify-center space-x-1">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground text-pretty">{plan.description}</p>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-pretty">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full h-12 text-base ${
                    plan.popular
                      ? "bg-accent hover:bg-accent/90 text-accent-foreground animate-pulse-glow"
                      : "bg-primary hover:bg-primary/90 text-primary-foreground"
                  }`}
                >
                  {plan.popular && <Zap className="mr-2 h-4 w-4" />}
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Precisa de algo personalizado?
            <Button variant="link" className="text-accent hover:text-accent/80 p-0 ml-1">
              Entre em contato conosco
            </Button>
          </p>
        </div>
      </div>
    </section>
  )
}
