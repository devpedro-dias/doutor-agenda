"use client";

import { Calendar, Clock, Users, Shield, Zap, Heart } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Agendamento Inteligente",
      description:
        "Sistema avançado de agendamento com confirmação automática e lembretes inteligentes.",
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Gestão de Tempo",
      description:
        "Otimize horários médicos e reduza tempo de espera com nossa inteligência artificial.",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Gestão de Pacientes",
      description:
        "Base completa de pacientes com histórico médico e dados importantes centralizados.",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Segurança Total",
      description:
        "Dados criptografados e conformidade com LGPD e HIPAA para máxima proteção.",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Automação Completa",
      description:
        "Automatize lembretes, confirmações e relatórios para focar no que importa.",
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Experiência Excepcional",
      description:
        "Interface intuitiva tanto para médicos quanto para pacientes.",
    },
  ];

  return (
    <section id="recursos" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="text-foreground mb-4 text-3xl font-bold sm:text-4xl">
            Recursos que revolucionam sua prática médica
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
            Tecnologia de ponta para modernizar sua clínica e encantar seus
            pacientes
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card rounded-lg border p-6 transition-shadow hover:shadow-lg"
            >
              <div className="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
