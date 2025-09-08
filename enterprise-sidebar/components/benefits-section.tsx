"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, TrendingUp, Clock, Heart } from "lucide-react"

export function BenefitsSection() {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Aumente seu faturamento em até 40%",
      description: "Otimize sua agenda, reduza faltas e atenda mais pacientes com nossa tecnologia inteligente.",
      stats: "+40% faturamento",
    },
    {
      icon: Clock,
      title: "Economize 5 horas por semana",
      description: "Automatize tarefas repetitivas e foque no que realmente importa: cuidar dos seus pacientes.",
      stats: "5h economizadas",
    },
    {
      icon: Heart,
      title: "Melhore a experiência do paciente",
      description: "Ofereça um atendimento moderno e eficiente que seus pacientes vão adorar.",
      stats: "98% satisfação",
    },
    {
      icon: CheckCircle,
      title: "Reduza erros administrativos",
      description: "Elimine conflitos de agenda, dados duplicados e outros problemas comuns da gestão manual.",
      stats: "Zero conflitos",
    },
  ]

  return (
    <section id="beneficios" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Por que mais de
            <span className="text-primary"> 10.000 médicos</span> confiam no Dr. Agenda?
          </h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
            Resultados comprovados que transformam clínicas médicas em todo o Brasil
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm"
              style={{
                animationDelay: `${index * 0.15}s`,
                animation: "fadeInUp 0.6s ease-out forwards",
              }}
            >
              <CardContent className="p-8 space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                    <benefit.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-foreground text-balance">{benefit.title}</h3>
                      <span className="text-sm font-medium text-accent bg-accent/10 px-3 py-1 rounded-full">
                        {benefit.stats}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-pretty">{benefit.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
