"use client";

import { useState, useEffect, useCallback } from "react";
import { UsersTable } from "./users-table";
import { getUsersAction } from "@/src/_actions/get-users";
import { authClient } from "@/src/lib/auth-client";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UsersTableClientProps {
  initialUsers: User[];
}

const UsersTableClient = ({ initialUsers }: UsersTableClientProps) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isLoading, setIsLoading] = useState(false);
  const session = authClient.useSession();

  const loadUsers = useCallback(async () => {
    if (!session.data?.user) return;

    try {
      setIsLoading(true);
      const data = await getUsersAction();
      setUsers(data);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    } finally {
      setIsLoading(false);
    }
  }, [session.data?.user]);

  // Recarregar usuários quando a sessão mudar
  useEffect(() => {
    if (session.data?.user) {
      loadUsers();
    }
  }, [session.data?.user, loadUsers]);

  // Função para recarregar usuários após operações
  const handleUsersChange = () => {
    loadUsers();
  };

  return (
    <UsersTable
      users={users}
      isLoading={isLoading}
      onUsersChange={handleUsersChange}
    />
  );
};

export default UsersTableClient;
