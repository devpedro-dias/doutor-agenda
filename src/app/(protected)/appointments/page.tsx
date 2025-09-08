import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { DataTable } from "@/src/_components/ui/data-table";
import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/src/_components/ui/page-container";
import { auth } from "@/src/lib/auth";

import AddAppointmentButton from "./_components/add-appointment-button";
import { appointmentsTableColumns } from "./_components/table-columns";
import {
  getAppointmentsAction,
  getDoctorsAction,
  getPatientsAction,
} from "@/src/_actions/get-appointments";

const AppointmentsPage = async () => {
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

  const [patients, doctors, appointments] = await Promise.all([
    getPatientsAction(),
    getDoctorsAction(),
    getAppointmentsAction(),
  ]);

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Agendamentos</PageTitle>
          <PageDescription>
            Gerencie os agendamentos da sua clínica
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddAppointmentButton patients={patients} doctors={doctors} />
        </PageActions>
      </PageHeader>
      <PageContent>
        <DataTable data={appointments} columns={appointmentsTableColumns} />
      </PageContent>
    </PageContainer>
  );
};

export default AppointmentsPage;
