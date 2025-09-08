"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MessageSquare, BarChart3, Shield, Smartphone, Zap } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Calendar,
      title: "Agendamento Inteligente",
      description: "Sistema automatizado que otimiza sua agenda, evita conflitos e maximiza sua produtividade diária.",
    },
    {
      icon: MessageSquare,
      title: "Lembretes Automáticos",
      description: "Reduza faltas em até 98% com lembretes por WhatsApp, SMS e e-mail personalizados.",
    },
    {
      icon: BarChart3,
      title: "Relatórios Avançados",
      description: "Dashboards completos com métricas de desempenho, faturamento e análise de pacientes.",
    },
    {
      icon: Shield,
      title: "Segurança LGPD",
      description: "Proteção total dos dados dos pacientes com criptografia e conformidade com a LGPD.",
    },
    {
      icon: Smartphone,
      title: "App Mobile",
      description: "Gerencie sua clínica de qualquer lugar com nosso aplicativo mobile intuitivo.",
    },
    {
      icon: Zap,
      title: "Integração Completa",
      description: "Conecte com sistemas de pagamento, prontuário eletrônico e outras ferramentas.",
    },
  ]

  return (
    <section id="recursos" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Tudo que você precisa para
            <span className="text-primary"> modernizar sua clínica</span>
          </h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
            Ferramentas poderosas e intuitivas que transformam a gestão da sua clínica médica
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-card/50 backdrop-blur-sm"
              style={{
                animationDelay: `${index * 0.1}s`,
                animation: "fadeInUp 0.6s ease-out forwards",
              }}
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground text-pretty">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
