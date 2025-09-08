"use client";

import { EditIcon, MoreVerticalIcon, TrashIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

import { deleteUser } from "@/src/_actions/delete-user";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/_components/ui/alert-dialog";
import { Button } from "@/src/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/_components/ui/dropdown-menu";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UserActionsProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: () => void;
  canEdit: boolean;
}

const UserActions = ({ user, onEdit, onDelete, canEdit }: UserActionsProps) => {
  const deleteUserAction = useAction(deleteUser, {
    onSuccess: () => {
      toast.success("Usuário removido com sucesso.");
      onDelete();
    },
    onError: (error) => {
      // Tratamento específico de erros
      if (error.error?.serverError) {
        if (error.error.serverError.includes("Cannot delete clinic owner")) {
          toast.error("Não é possível excluir o proprietário da clínica.");
        } else if (error.error.serverError.includes("Only clinic owners")) {
          toast.error(
            "Apenas proprietários e gerentes podem excluir usuários.",
          );
        } else {
          toast.error(error.error.serverError);
        }
      } else {
        toast.error("Erro ao remover usuário.");
      }
    },
  });

  const handleDeleteUserClick = () => {
    if (!user) return;
    deleteUserAction.execute({ userId: user.id });
  };

  if (!canEdit) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVerticalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {/* Sempre mostrar editar, mas role será readonly para OWNER */}
        <DropdownMenuItem onClick={() => onEdit(user)}>
          <EditIcon />
          Editar
        </DropdownMenuItem>
        {/* Não permitir excluir OWNER */}
        {user.role !== "OWNER" && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <TrashIcon />
                Excluir
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Tem certeza que deseja deletar este usuário?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Essa ação não pode ser revertida. Isso irá deletar o usuário
                  permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteUserClick}>
                  Deletar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserActions;
