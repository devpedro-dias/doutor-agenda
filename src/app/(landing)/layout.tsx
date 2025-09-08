import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "@/src/app/globals.css"

export const metadata: Metadata = {
  title: "Dr. Agenda - Revolucione sua Clínica Médica",
  description: "Simplifique agendamentos, otimize seu tempo e ofereça uma experiência excepcional aos seus pacientes com nossa plataforma inteligente.",
  keywords: ["clínica médica", "agendamento", "saúde", "médicos", "pacientes", "gestão"],
  authors: [{ name: "FullStackClub" }],
  openGraph: {
    title: "Dr. Agenda - Revolucione sua Clínica Médica",
    description: "Plataforma inteligente para gestão de clínicas médicas",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
