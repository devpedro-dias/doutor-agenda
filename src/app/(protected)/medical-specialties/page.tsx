import { Suspense } from "react";

import { getMedicalSpecialtiesAction } from "@/src/_actions/medical-specialties";
import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/src/_components/ui/page-container";
import { MedicalSpecialtiesClient } from "./_components/medical-specialties-client";

// Skeleton component for loading state
function MedicalSpecialtiesSkeleton() {
  return (
    <div className="space-y-6">
      {/* Filter and Actions Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-muted h-4 w-12 animate-pulse rounded" />
            <div className="bg-muted h-8 w-24 animate-pulse rounded" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="bg-muted h-9 w-40 animate-pulse rounded" />
          <div className="bg-muted h-9 w-44 animate-pulse rounded" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="rounded-md border">
        {/* Table Header */}
        <div className="bg-muted/50 border-b px-4 py-3">
          <div className="flex gap-4">
            <div className="bg-muted h-4 w-16 animate-pulse rounded" />
            <div className="bg-muted h-4 w-20 animate-pulse rounded" />
            <div className="bg-muted h-4 w-24 animate-pulse rounded" />
            <div className="bg-muted h-4 w-20 animate-pulse rounded" />
            <div className="bg-muted ml-auto h-4 w-12 animate-pulse rounded" />
          </div>
        </div>

        {/* Table Rows */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border-b px-4 py-4">
            <div className="flex items-center gap-4">
              <div className="bg-muted h-6 w-16 animate-pulse rounded-full" />
              <div className="bg-muted h-4 w-32 animate-pulse rounded" />
              <div className="bg-muted h-4 w-40 animate-pulse rounded" />
              <div className="bg-muted h-4 w-20 animate-pulse rounded" />
              <div className="bg-muted ml-auto h-8 w-8 animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

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
  const specialties = await getMedicalSpecialties();

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Especialidades Médicas</PageTitle>
          <PageDescription>
            Gerencie as especialidades médicas disponíveis na sua clínica
          </PageDescription>
        </PageHeaderContent>
      </PageHeader>
      <PageContent>
        <Suspense fallback={<MedicalSpecialtiesSkeleton />}>
          <MedicalSpecialtiesClient initialSpecialties={specialties} />
        </Suspense>
      </PageContent>
    </PageContainer>
  );
}
