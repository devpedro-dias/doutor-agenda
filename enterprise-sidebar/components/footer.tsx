"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Stethoscope, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer id="contato" className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-primary-foreground/10 p-2 rounded-lg">
                <Stethoscope className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Dr. Agenda</span>
            </div>
            <p className="text-primary-foreground/80 text-pretty">
              A plataforma completa para modernizar a gestão da sua clínica médica.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#recursos"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Recursos
                </a>
              </li>
              <li>
                <a
                  href="#beneficios"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Benefícios
                </a>
              </li>
              <li>
                <a
                  href="#planos"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Planos
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Suporte
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span className="text-primary-foreground/80">contato@dragenda.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span className="text-primary-foreground/80">(11) 9999-9999</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span className="text-primary-foreground/80">São Paulo, SP</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Newsletter</h3>
            <p className="text-primary-foreground/80 text-sm">Receba dicas e novidades sobre gestão médica.</p>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Seu e-mail"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
              />
              <Button variant="secondary" size="sm">
                Assinar
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center">
          <p className="text-primary-foreground/60 text-sm">© 2024 Dr. Agenda. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
