"use client";

import { Plus } from "lucide-react";

import { Button } from "@/src/_components/ui/button";
import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/src/_components/ui/page-container";

import { authClient } from "@/src/lib/auth-client";
import { useState, useEffect } from "react";
import { getUsersAction } from "@/src/_actions/get-users";
import { UsersTable } from "./_components/users-table";
import { CreateUserDialog } from "./_components/create-user-dialog";
import { EditUserDialog } from "./_components/edit-user-dialog";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const session = authClient.useSession();

  const isOwnerOrManager = session.data?.user.clinics?.some(
    (clinic) => clinic.role === "OWNER" || clinic.role === "MANAGER",
  );

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        if (!session.data?.user) return;

        const data = await getUsersAction();
        setUsers(data);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session.data) {
      loadUsers();
    }
  }, [session.data]);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDeleteUser = () => {
    // Recarregar usuários após exclusão
    const loadUsers = async () => {
      try {
        const data = await getUsersAction();
        setUsers(data);
      } catch (error) {
        console.error("Erro ao recarregar usuários:", error);
      }
    };
    loadUsers();
  };

  if (!isOwnerOrManager) {
    return (
      <PageContainer>
        <PageHeader>
          <PageHeaderContent>
            <PageTitle>Usuários</PageTitle>
            <PageDescription>
              Você não tem permissão para gerenciar usuários.
            </PageDescription>
          </PageHeaderContent>
        </PageHeader>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Usuários</PageTitle>
          <PageDescription>
            Gerencie os usuários da sua clínica e suas permissões.
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Usuário
          </Button>
        </PageActions>
      </PageHeader>
      <PageContent>
        <UsersTable
          users={users}
          isLoading={isLoading}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
          canEdit={!!isOwnerOrManager}
        />
      </PageContent>

      <CreateUserDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onUserCreated={() => {
          setIsCreateDialogOpen(false);
          // Recarregar usuários após criação
          const loadUsers = async () => {
            try {
              const data = await getUsersAction();
              setUsers(data);
            } catch (error) {
              console.error("Erro ao recarregar usuários:", error);
            }
          };
          loadUsers();
        }}
      />

      <EditUserDialog
        user={selectedUser}
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            setSelectedUser(null);
          }
        }}
        onUserUpdated={() => {
          setIsEditDialogOpen(false);
          setSelectedUser(null);
          // Recarregar usuários após edição
          const loadUsers = async () => {
            try {
              const data = await getUsersAction();
              setUsers(data);
            } catch (error) {
              console.error("Erro ao recarregar usuários:", error);
            }
          };
          loadUsers();
        }}
      />
    </PageContainer>
  );
};

export default UsersPage;
