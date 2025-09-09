import type React from "react"
import type { Metadata } from "next"
import { Manrope } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dr. Agenda - Revolucione sua Clínica Médica",
  description: "Simplifique agendamentos, otimize seu tempo e ofereça uma experiência excepcional aos seus pacientes com nossa plataforma inteligente.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${manrope.variable} font-sans antialiased`}>
        <Suspense fallback={null}>{children}</Suspense>
      </body>
    </html>
  );
}