import type React from "react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Manrope } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import "./globals.css";
import { Toaster } from "@/src/_components/ui/sonner";
import { ReactQueryProvider } from "../providers/react-query";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dr. Agenda - Revolucione sua Clínica Médica",
  description:
    "Simplifique agendamentos, otimize seu tempo e ofereça uma experiência excepcional aos seus pacientes com nossa plataforma inteligente.",
  keywords: [
    "clínica médica",
    "agendamento",
    "saúde",
    "médicos",
    "pacientes",
    "gestão",
  ],
  authors: [{ name: "FullStackClub" }],
  openGraph: {
    title: "Dr. Agenda - Revolucione sua Clínica Médica",
    description: "Plataforma inteligente para gestão de clínicas médicas",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${manrope.variable} font-sans antialiased`}>
        <ReactQueryProvider>
          <NuqsAdapter>
            <Suspense fallback={null}>{children}</Suspense>
          </NuqsAdapter>
        </ReactQueryProvider>
        <Toaster theme="light" richColors position="bottom-center" />
      </body>
    </html>
  );
}
