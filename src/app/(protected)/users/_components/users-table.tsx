"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/src/_components/ui/badge";
import { DataTable } from "@/src/_components/ui/data-table";
import UserActions from "./user-actions";
import UpsertUserForm from "./upsert-user-form";
import { useState } from "react";
import { Dialog } from "@/src/_components/ui/dialog";

const formatCPF = (cpf: string | null): string => {
  if (!cpf) return "-";

  const cleanCPF = cpf.replace(/\D/g, "");
  if (cleanCPF.length !== 11) return cpf;

  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

const formatPhone = (phone: string | null): string => {
  if (!phone) return "-";

  const cleanPhone = phone.replace(/\D/g, "");
  if (cleanPhone.length < 10 || cleanPhone.length > 11) return phone;

  if (cleanPhone.length === 11) {
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }

  return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
};

interface User {
  id: string;
  name: string;
  email: string;
  cpf?: string | null;
  phoneNumber?: string | null;
  cep?: string | null;
  street?: string | null;
  number?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  address?: string | null;
  role: string;
}

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
  canEdit: boolean;
  onUsersChange?: () => void;
}

const columns = (
  onEditUser: (user: User) => void,
  onDeleteUser: () => void,
  canEdit: boolean,
): ColumnDef<User>[] => [
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => <div className="text-sm">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="text-foreground">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "cpf",
    header: "CPF",
    cell: ({ row }) => {
      const cpf = row.getValue("cpf") as string | null;
      const formattedCPF = formatCPF(cpf);
      return (
        <div
          className={`text-sm ${cpf ? "text-foreground" : "text-muted-foreground"}`}
        >
          {formattedCPF}
        </div>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Telefone",
    cell: ({ row }) => {
      const phone = row.getValue("phoneNumber") as string | null;
      const formattedPhone = formatPhone(phone);
      return (
        <div
          className={`text-sm ${phone ? "text-foreground" : "text-muted-foreground"}`}
        >
          {formattedPhone}
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Função",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return (
        <Badge
          variant={
            role === "OWNER"
              ? "default"
              : role === "MANAGER"
                ? "secondary"
                : role === "DOCTOR"
                  ? "outline"
                  : "outline"
          }
        >
          {role === "OWNER" && "Proprietário"}
          {role === "MANAGER" && "Gerente"}
          {role === "DOCTOR" && "Médico"}
          {role === "STAFF" && "Funcionário"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <UserActions
          user={user}
          onEdit={onEditUser}
          onDelete={onDeleteUser}
          canEdit={canEdit}
        />
      );
    },
  },
];

export const UsersTable = ({
  users,
  isLoading,
  canEdit,
  onUsersChange,
}: UsersTableProps) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDeleteUser = () => {
    // Recarregar usuários após exclusão
    if (onUsersChange) {
      onUsersChange();
    }
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

  if (users.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">
          Nenhum usuário encontrado nesta clínica.
        </p>
      </div>
    );
  }

  return (
    <>
      <DataTable
        columns={columns(handleEditUser, handleDeleteUser, canEdit)}
        data={users}
      />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <UpsertUserForm
          user={selectedUser}
          isOpen={isEditDialogOpen}
          onSuccess={() => {
            setIsEditDialogOpen(false);
            setSelectedUser(null);
          }}
          onUsersChange={onUsersChange}
        />
      </Dialog>
    </>
  );
};
