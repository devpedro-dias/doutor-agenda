"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/src/_components/ui/badge";
import { DataTable } from "@/src/_components/ui/data-table";
import UserActions from "./user-actions";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
  onUserCreated: () => void;
  onEditUser: (user: User) => void;
  onDeleteUser: () => void;
  canEdit: boolean;
}

const columns = (
  onEditUser: (user: User) => void,
  onDeleteUser: () => void,
  canEdit: boolean
): ColumnDef<User>[] => [
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.getValue("email")}</div>
    ),
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
  onEditUser,
  onDeleteUser,
  canEdit
}: UsersTableProps) => {
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
    <DataTable
      columns={columns(onEditUser, onDeleteUser, canEdit)}
      data={users}
    />
  );
};
