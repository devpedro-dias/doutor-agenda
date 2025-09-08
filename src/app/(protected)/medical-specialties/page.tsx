import { Suspense } from "react";

import { getMedicalSpecialtiesAction } from "@/src/_actions/medical-specialties";
import { PageContainer } from "@/src/_components/ui/page-container";
import { auth } from "@/src/lib/auth";
import { MedicalSpecialtiesClient } from "./_components/medical-specialties-client";
import { headers } from "next/headers";

export const metadata = {
  title: "Especialidades Médicas",
  description: "Gerencie as especialidades médicas da sua clínica",
};

async function getMedicalSpecialties() {
  try {
    const specialties = await getMedicalSpecialtiesAction();
    return specialties;
  } catch (error) {
    console.error("Erro ao buscar especialidades:", error);
    return [];
  }
}

export default async function MedicalSpecialtiesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Verificar se o usuário é OWNER ou MANAGER
  const isOwnerOrManager =
    session?.user?.clinics?.some(
      (clinic) => clinic.role === "OWNER" || clinic.role === "MANAGER",
    ) || false;

  if (!isOwnerOrManager) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-destructive mb-4 text-2xl font-bold">
            Acesso Negado
          </h1>
          <p className="text-muted-foreground text-center">
            Apenas proprietários e gerentes podem gerenciar especialidades
            médicas.
          </p>
        </div>
      </PageContainer>
    );
  }

  const specialties = await getMedicalSpecialties();

  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Especialidades Médicas
          </h1>
          <p className="text-muted-foreground">
            Gerencie as especialidades médicas disponíveis na sua clínica
          </p>
        </div>

        <Suspense fallback={<div>Carregando...</div>}>
          <MedicalSpecialtiesClient initialSpecialties={specialties} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
