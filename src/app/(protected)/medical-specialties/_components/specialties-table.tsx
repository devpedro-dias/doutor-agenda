"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MoreHorizontal, Edit, Trash2, CircleX } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/src/_components/ui/badge";
import { Button } from "@/src/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/_components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/_components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/_components/ui/alert-dialog";
import { useAction } from "next-safe-action/hooks";
import {
  deleteMedicalSpecialtyAction,
  updateMedicalSpecialtyAction,
} from "@/src/_actions/medical-specialties";

interface MedicalSpecialty {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface SpecialtiesTableProps {
  specialties: MedicalSpecialty[];
  filteredSpecialties: MedicalSpecialty[];
  statusFilter: "all" | "active" | "inactive";
  isLoading: boolean;
  onSpecialtyChange?: () => void;
}

export function SpecialtiesTable({
  specialties,
  filteredSpecialties,
  statusFilter,
  isLoading,
  onSpecialtyChange,
}: SpecialtiesTableProps) {
  const [selectedSpecialty, setSelectedSpecialty] =
    useState<MedicalSpecialty | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [specialtyToDelete, setSpecialtyToDelete] =
    useState<MedicalSpecialty | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const updateSpecialtyAction = useAction(updateMedicalSpecialtyAction, {
    onSuccess: () => {
      toast.success("Especialidade atualizada com sucesso!");
      setIsEditDialogOpen(false);
      setSelectedSpecialty(null);
      onSpecialtyChange?.();
    },
    onError: (error) => {
      if (error.error?.serverError) {
        toast.error(error.error.serverError);
      } else {
        toast.error("Erro ao atualizar especialidade");
      }
    },
  });

  const deleteSpecialtyAction = useAction(deleteMedicalSpecialtyAction, {
    onSuccess: (result) => {
      toast.success(
        result.data?.message || "Especialidade removida com sucesso!",
      );
      setIsDeleteDialogOpen(false);
      setSpecialtyToDelete(null);
      onSpecialtyChange?.();
    },
    onError: (error) => {
      if (error.error?.serverError) {
        toast.error(error.error.serverError);
      } else {
        toast.error("Erro ao remover especialidade");
      }
      setIsDeleteDialogOpen(false);
      setSpecialtyToDelete(null);
    },
  });

  const handleEdit = (specialty: MedicalSpecialty) => {
    setSelectedSpecialty(specialty);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (specialty: MedicalSpecialty) => {
    setSpecialtyToDelete(specialty);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (specialtyToDelete) {
      deleteSpecialtyAction.execute({ id: specialtyToDelete.id });
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setSpecialtyToDelete(null);
  };

  const handleEditSubmit = (data: {
    name: string;
    description?: string;
    isActive: boolean;
  }) => {
    if (!selectedSpecialty) return;

    updateSpecialtyAction.execute({
      id: selectedSpecialty.id,
      name: data.name,
      description: data.description,
      isActive: data.isActive,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex items-center space-x-4 rounded-lg border p-4"
          >
            <div className="bg-muted h-10 w-10 animate-pulse rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="bg-muted h-4 animate-pulse rounded" />
              <div className="bg-muted h-3 w-1/2 animate-pulse rounded" />
            </div>
            <div className="bg-muted h-6 w-20 animate-pulse rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (specialties.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">
          Nenhuma especialidade encontrada.
        </p>
        <p className="text-muted-foreground mt-2 text-sm">
          Clique em &quot;Nova Especialidade&quot; para começar.
        </p>
      </div>
    );
  }

  // Se após filtrar não há especialidades, mostrar mensagem apropriada
  if (filteredSpecialties.length === 0) {
    const filterMessage = {
      active: "Nenhuma especialidade ativa encontrada.",
      inactive: "Nenhuma especialidade inativa encontrada.",
      all: "Nenhuma especialidade encontrada.",
    };

    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">{filterMessage[statusFilter]}</p>
        <p className="text-muted-foreground mt-2 text-sm">
          {statusFilter === "active"
            ? "Altere o filtro para ver todas as especialidades."
            : 'Clique em "Nova Especialidade" para adicionar uma nova.'}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Criada em</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSpecialties.map((specialty) => (
            <TableRow key={specialty.id}>
              <TableCell>
                <Badge variant={specialty.isActive ? "default" : "secondary"}>
                  {specialty.isActive ? "Ativa" : "Inativa"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="font-medium">
                  <span>{specialty.name}</span>
                </div>
              </TableCell>
              <TableCell className="max-w-xs truncate">
                {specialty.description || "Sem descrição"}
              </TableCell>
              <TableCell>
                {format(specialty.createdAt, "dd/MM/yyyy", { locale: ptBR })}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(specialty)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(specialty)}
                      className="text-destructive"
                    >
                      {specialty.isActive ? (
                        <CircleX className="mr-2 h-4 w-4" />
                      ) : (
                        <Trash2 className="mr-2 h-4 w-4" />
                      )}
                      {specialty.isActive ? "Desativar" : "Excluir"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Dialog */}
      {selectedSpecialty && (
        <EditSpecialtyDialog
          specialty={selectedSpecialty}
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedSpecialty(null);
          }}
          onSubmit={handleEditSubmit}
          isPending={updateSpecialtyAction.isPending}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {specialtyToDelete?.isActive ? "Desativar" : "Excluir"}{" "}
              Especialidade
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja{" "}
              {specialtyToDelete?.isActive ? "desativar" : "excluir"} a
              especialidade
              <strong>&ldquo;{specialtyToDelete?.name}&rdquo;</strong>?
              {specialtyToDelete?.isActive
                ? " A especialidade será marcada como inativa."
                : " Esta ação não pode ser desfeita."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteSpecialtyAction.isPending}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              {deleteSpecialtyAction.isPending
                ? "Processando..."
                : specialtyToDelete?.isActive
                  ? "Desativar"
                  : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Componente de edição inline
function EditSpecialtyDialog({
  specialty,
  isOpen,
  onClose,
  onSubmit,
  isPending,
}: {
  specialty: MedicalSpecialty;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description?: string;
    isActive: boolean;
  }) => void;
  isPending: boolean;
}) {
  const [name, setName] = useState(specialty.name);
  const [description, setDescription] = useState(specialty.description || "");
  const [isActive, setIsActive] = useState(specialty.isActive);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, description: description || undefined, isActive });
  };

  const handleClose = () => {
    setName(specialty.name);
    setDescription(specialty.description || "");
    setIsActive(specialty.isActive);
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "block" : "hidden"}`}>
      <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
      <div className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Editar Especialidade</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              value={isActive ? "active" : "inactive"}
              onChange={(e) => setIsActive(e.target.value === "active")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="active">Ativa</option>
              <option value="inactive">Inativa</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Nome da especialidade <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Ex: Cardiologia, Dermatologia, etc."
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Descrição</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Descreva brevemente a especialidade..."
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isPending}
              className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
