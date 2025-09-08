"use client"

import { Calendar, Clock, Users, Shield, Zap, Heart } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Agendamento Inteligente",
      description: "Sistema avançado de agendamento com confirmação automática e lembretes inteligentes."
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Gestão de Tempo",
      description: "Otimize horários médicos e reduza tempo de espera com nossa inteligência artificial."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Gestão de Pacientes",
      description: "Base completa de pacientes com histórico médico e dados importantes centralizados."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Segurança Total",
      description: "Dados criptografados e conformidade com LGPD e HIPAA para máxima proteção."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Automação Completa",
      description: "Automatize lembretes, confirmações e relatórios para focar no que importa."
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Experiência Excepcional",
      description: "Interface intuitiva tanto para médicos quanto para pacientes."
    }
  ]

  return (
    <section id="recursos" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Recursos que revolucionam sua prática médica
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tecnologia de ponta para modernizar sua clínica e encantar seus pacientes
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 bg-card rounded-lg border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
