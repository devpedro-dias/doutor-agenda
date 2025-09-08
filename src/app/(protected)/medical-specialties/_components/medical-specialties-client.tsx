"use client";

import { useState, useCallback } from "react";
import { Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/src/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/_components/ui/card";
import {
  getMedicalSpecialtiesAction,
  seedMedicalSpecialtiesAction,
} from "@/src/_actions/medical-specialties";

import { SpecialtiesTable } from "./specialties-table";
import { CreateSpecialtyDialog } from "./create-specialty-dialog";

interface MedicalSpecialty {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface MedicalSpecialtiesClientProps {
  initialSpecialties: MedicalSpecialty[];
}

export function MedicalSpecialtiesClient({
  initialSpecialties,
}: MedicalSpecialtiesClientProps) {
  const [specialties, setSpecialties] =
    useState<MedicalSpecialty[]>(initialSpecialties);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadSpecialties = useCallback(async () => {
    setIsLoading(true);
    try {
      const updatedSpecialties = await getMedicalSpecialtiesAction();
      setSpecialties(updatedSpecialties);
    } catch (error) {
      console.error("Erro ao recarregar especialidades:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSpecialtyCreated = () => {
    setIsCreateDialogOpen(false);
    loadSpecialties();
  };

  const handleSeedSpecialties = async () => {
    try {
      setIsLoading(true);
      const result = await seedMedicalSpecialtiesAction();

      if (result.success) {
        toast.success(result.message);
        loadSpecialties();
      }
    } catch (error) {
      console.error("Erro ao popular especialidades:", error);
      toast.error("Erro ao popular especialidades");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Especialidades Médicas</CardTitle>
              <CardDescription>
                Gerencie as especialidades disponíveis para os médicos da sua
                clínica
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleSeedSpecialties}
                disabled={isLoading}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Popular Especialidades
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Especialidade
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <SpecialtiesTable specialties={specialties} isLoading={isLoading} />
        </CardContent>
      </Card>

      <CreateSpecialtyDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={handleSpecialtyCreated}
      />
    </div>
  );
}
