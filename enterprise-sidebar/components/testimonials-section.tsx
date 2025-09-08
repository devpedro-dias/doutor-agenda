"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Dr. Maria Silva",
      specialty: "Cardiologista",
      location: "São Paulo, SP",
      content:
        "O Dr. Agenda revolucionou minha clínica. Reduzi as faltas em 95% e consegui atender 30% mais pacientes por mês. A automação dos lembretes é fantástica!",
      rating: 5,
      avatar: "/professional-woman-doctor.png",
    },
    {
      name: "Dr. João Santos",
      specialty: "Ortopedista",
      location: "Rio de Janeiro, RJ",
      content:
        "Economizo pelo menos 4 horas por semana com a gestão automatizada. Agora posso focar no que realmente importa: cuidar dos meus pacientes.",
      rating: 5,
      avatar: "/professional-man-doctor.png",
    },
    {
      name: "Dra. Ana Costa",
      specialty: "Pediatra",
      location: "Belo Horizonte, MG",
      content:
        "A interface é muito intuitiva e os relatórios me ajudam a tomar decisões estratégicas. Meu faturamento aumentou 35% no primeiro ano.",
      rating: 5,
      avatar: "/professional-woman-pediatrician.jpg",
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            O que nossos
            <span className="text-primary"> médicos dizem</span>
          </h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
            Histórias reais de profissionais que transformaram suas clínicas com o Dr. Agenda
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-card/50 backdrop-blur-sm"
              style={{
                animationDelay: `${index * 0.1}s`,
                animation: "fadeInUp 0.6s ease-out forwards",
              }}
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <div className="relative">
                  <Quote className="h-8 w-8 text-primary/20 absolute -top-2 -left-2" />
                  <p className="text-muted-foreground text-pretty italic pl-6">"{testimonial.content}"</p>
                </div>

                <div className="flex items-center space-x-3 pt-4 border-t border-border">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.specialty}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.location}</p>
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
