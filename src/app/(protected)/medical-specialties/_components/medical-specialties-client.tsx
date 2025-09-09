"use client";

import { Plus, Sparkles } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import {
  getMedicalSpecialtiesAction,
  seedMedicalSpecialtiesAction,
} from "@/src/_actions/medical-specialties";
import { Button } from "@/src/_components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/_components/ui/select";
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

type StatusFilter = "all" | "active" | "inactive";

export function MedicalSpecialtiesClient({
  initialSpecialties,
}: MedicalSpecialtiesClientProps) {
  const [specialties, setSpecialties] =
    useState<MedicalSpecialty[]>(initialSpecialties);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("active");

  const loadSpecialties = useCallback(async () => {
    setIsLoading(true);
    try {
      const updatedSpecialties = await getMedicalSpecialtiesAction();
      setSpecialties(updatedSpecialties);
      } catch {
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
      } catch {
      toast.error("Erro ao popular especialidades");
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar especialidades baseado no status
  const filteredSpecialties = specialties.filter((specialty) => {
    if (statusFilter === "active") return specialty.isActive;
    if (statusFilter === "inactive") return !specialty.isActive;
    return true; // "all"
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            <Select
              value={statusFilter}
              onValueChange={(value: StatusFilter) => setStatusFilter(value)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativas</SelectItem>
                <SelectItem value="inactive">Inativas</SelectItem>
                <SelectItem value="all">Todas</SelectItem>
              </SelectContent>
            </Select>
          </div>
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

      <SpecialtiesTable
        specialties={specialties}
        filteredSpecialties={filteredSpecialties}
        statusFilter={statusFilter}
        isLoading={isLoading}
        onSpecialtyChange={loadSpecialties}
      />

      <CreateSpecialtyDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={handleSpecialtyCreated}
      />
    </div>
  );
}
