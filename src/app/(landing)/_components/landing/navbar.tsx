"use client";

import { useState } from "react";
import { Button } from "@/src/_components/ui/button";
import { Menu, X, Stethoscope } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Recursos", href: "#recursos" },
    { name: "Benefícios", href: "#beneficios" },
    { name: "Planos", href: "#planos" },
    { name: "Contato", href: "#contato" },
  ];

  return (
    <nav className="bg-background/95 border-border fixed top-0 z-50 w-full border-b backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-primary rounded-lg p-2">
              <Stethoscope className="text-primary-foreground h-6 w-6" />
            </div>
            <span className="text-foreground text-xl font-bold">
              Dr. Agenda
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden items-center space-x-4 md:flex">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
            >
              <Link href="/authentication">Já sou cliente</Link>
            </Button>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground animate-pulse-glow" asChild>
              <Link href="#planos">Começar</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="bg-background border-border space-y-1 border-t px-2 pt-2 pb-3">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground block px-3 py-2 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="flex flex-col space-y-2 px-3 pt-4">
                <Button variant="ghost" className="justify-start" asChild>
                  <Link href="/authentication">Já sou cliente</Link>
                </Button>
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground justify-start">
                  <Link href="#planos">Começar</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
