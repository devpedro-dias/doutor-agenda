import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/src/_components/ui/page-container";
import { db } from "@/src/db";
import { usersTable, usersToClinicsTable } from "@/src/db/schema";
import { auth } from "@/src/lib/auth";

import AddUserButton from "./_components/add-user-button";
import UsersTableClient from "./_components/users-table-client";

const UsersPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/authentication");
  }
  if (!session.user.clinic) {
    redirect("/clinic-form");
  }
  if (!session.user.plan) {
    redirect("/new-subscription");
  }

  const userRole = session.user.clinics?.find(
    (clinic) => clinic.id === session.user.clinic?.id,
  )?.role;

  const canAddUsers = userRole === "OWNER" || userRole === "MANAGER";

  // Buscar usuários da clínica
  const clinicUsers = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      cpf: usersTable.cpf,
      phoneNumber: usersTable.phoneNumber,
      address: usersTable.address,
      role: usersToClinicsTable.role,
    })
    .from(usersToClinicsTable)
    .innerJoin(usersTable, eq(usersToClinicsTable.userId, usersTable.id))
    .where(eq(usersToClinicsTable.clinicId, session.user.clinic.id));

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Usuários</PageTitle>
          <PageDescription>
            Gerencie os usuários da sua clínica e suas permissões.
          </PageDescription>
        </PageHeaderContent>
        {canAddUsers && (
          <PageActions>
            <AddUserButton />
          </PageActions>
        )}
      </PageHeader>
      <PageContent>
        <UsersTableClient initialUsers={clinicUsers} />
      </PageContent>
    </PageContainer>
  );
};

export default UsersPage;
