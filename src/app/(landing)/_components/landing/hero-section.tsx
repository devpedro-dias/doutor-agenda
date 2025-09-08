"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/src/_components/ui/button";
import { Input } from "@/src/_components/ui/input";
import { Card, CardContent } from "@/src/_components/ui/card";
import { Calendar, Clock, Users, ArrowRight } from "lucide-react";

export function HeroSection() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[v0] Lead captured:", { name, email, phone });
    // Here you would typically send the data to your backend
  };

  return (
    <section className="from-primary/5 via-background to-accent/5 bg-gradient-to-br px-4 pt-24 pb-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left Column - Content */}
          <div className="animate-fade-in-up space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl leading-tight font-bold text-balance sm:text-5xl lg:text-6xl">
                Revolucione a gestão da sua
                <span className="text-primary"> clínica médica</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl text-xl text-pretty">
                Simplifique agendamentos, otimize seu tempo e ofereça uma
                experiência excepcional aos seus pacientes com nossa plataforma
                inteligente.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-primary/10 mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg">
                  <Calendar className="text-primary h-6 w-6" />
                </div>
                <div className="text-foreground text-2xl font-bold">98%</div>
                <div className="text-muted-foreground text-sm">
                  Redução de faltas
                </div>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg">
                  <Clock className="text-primary h-6 w-6" />
                </div>
                <div className="text-foreground text-2xl font-bold">5h</div>
                <div className="text-muted-foreground text-sm">
                  Economizadas/semana
                </div>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg">
                  <Users className="text-primary h-6 w-6" />
                </div>
                <div className="text-foreground text-2xl font-bold">10k+</div>
                <div className="text-muted-foreground text-sm">
                  Médicos confiam
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Lead Capture Form */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <Card className="bg-card/50 animate-float border-0 p-8 shadow-2xl backdrop-blur-sm">
              <CardContent className="space-y-6 p-0">
                <div className="space-y-2 text-center">
                  <h3 className="text-foreground text-2xl font-bold">
                    Teste grátis por 30 dias
                  </h3>
                  <p className="text-muted-foreground">
                    Sem compromisso. Cancele quando quiser.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      placeholder="Seu nome completo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-12 text-base"
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Seu melhor e-mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 text-base"
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="tel"
                      placeholder="Seu WhatsApp"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-12 text-base"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground group h-12 w-full text-base"
                  >
                    Começar teste grátis
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </form>

                <div className="text-muted-foreground text-center text-sm">
                  ✓ Sem cartão de crédito • ✓ Configuração em 5 minutos
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
