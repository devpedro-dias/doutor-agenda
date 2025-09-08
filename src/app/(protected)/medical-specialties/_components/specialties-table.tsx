"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";

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
  isLoading: boolean;
}



export function SpecialtiesTable({
  specialties,
  isLoading,
}: SpecialtiesTableProps) {
  const handleEdit = (specialty: MedicalSpecialty) => {
    // TODO: Implementar edição
    console.log("Editar especialidade:", specialty);
  };

  const handleDelete = (specialty: MedicalSpecialty) => {
    // TODO: Implementar exclusão
    console.log("Excluir especialidade:", specialty);
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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Criada em</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {specialties.map((specialty) => (
            <TableRow key={specialty.id}>
              <TableCell>
                <div className="font-medium">
                  <span>{specialty.name}</span>
                </div>
              </TableCell>
              <TableCell className="max-w-xs truncate">
                {specialty.description || "Sem descrição"}
              </TableCell>
              <TableCell>
                <Badge variant={specialty.isActive ? "default" : "secondary"}>
                  {specialty.isActive ? "Ativa" : "Inativa"}
                </Badge>
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
                      <Trash2 className="mr-2 h-4 w-4" />
                      {specialty.isActive ? "Desativar" : "Excluir"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
