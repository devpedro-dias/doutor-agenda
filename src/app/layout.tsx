import "./globals.css";

import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Toaster } from "@/src/_components/ui/sonner";
import { ReactQueryProvider } from "../providers/react-query";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Doutor Agenda",
  description: "SaaS criado no Bootcamp SaaS de Agendamentos para Clínicas pelo FullStackClub.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} antialiased`}
      >
        <ReactQueryProvider>
          <NuqsAdapter>{children}</NuqsAdapter>
        </ReactQueryProvider>
        <Toaster theme="light" richColors position="bottom-center" />
      </body>
    </html>
  );
}
