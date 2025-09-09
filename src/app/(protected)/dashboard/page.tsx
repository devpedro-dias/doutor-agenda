"use client";

import { Calendar } from "lucide-react";
import { Suspense } from "react";
import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/_components/ui/card";
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
import { getDashboardAction } from "@/src/_actions/get-dashboard";

import AppointmentsChart from "./_components/appointments-chart";
import { DatePicker } from "./_components/date-picker";
import TopDoctors from "./_components/top-doctors";
import TopSpecialties from "./_components/top-specialties";
import StatsCards from "./_components/stats-card";
import {
  AppointmentsChartSkeleton,
  StatsCardsSkeleton,
  TodayAppointmentsSkeleton,
  TopDoctorsSkeleton,
  TopSpecialtiesSkeleton,
} from "./_components/dashboard-skeletons";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import { appointmentsTableColumns } from "../appointments/_components/table-columns";
import { authClient } from "@/src/lib/auth-client";

interface TopDoctor {
  id: string;
  name: string;
  avatarImageUrl: string | null;
  specialty: string;
  appointments: number;
}

interface TopSpecialty {
  specialty: string;
  appointments: number;
}

interface DailyAppointmentData {
  date: string;
  appointments: number;
  revenue: number;
}

interface AppointmentWithRelations {
  id: string;
  date: Date;
  patient: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    sex: "male" | "female";
  };
  doctor: {
    id: string;
    name: string;
    specialty: {
      id: string;
      name: string;
      description: string | null;
      clinicId: string;
      isActive: boolean;
      createdAt: Date;
      updatedAt: Date;
    };
  };
}

interface DashboardData {
  totalRevenue: { total: string | null };
  totalAppointments: { total: number };
  totalPatients: { total: number };
  totalDoctors: { total: number };
  topDoctors: TopDoctor[];
  topSpecialties: TopSpecialty[];
  todayAppointments: AppointmentWithRelations[];
  dailyAppointmentsData: DailyAppointmentData[];
}

const DashboardContent = () => {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const session = authClient.useSession();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIsLoading(true);

        if (!session.data?.user) {
          window.location.href = "/authentication";
          return;
        }

        if (!session.data.user.clinic) {
          window.location.href = "/clinic-form";
          return;
        }

        if (!session.data.user.plan) {
          window.location.href = "/new-subscription";
          return;
        }

        const from = searchParams.get("from");
        const to = searchParams.get("to");

        if (!from || !to) {
          window.location.href = `/dashboard?from=${dayjs().format("YYYY-MM-DD")}&to=${dayjs().add(1, "month").format("YYYY-MM-DD")}`;
          return;
        }

        const data = await getDashboardAction({
          from,
          to,
        });

        setDashboardData(data);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    if (session.data) {
      loadDashboard();
    }
  }, [session.data, searchParams]);

  if (isLoading || !dashboardData) {
    return (
      <PageContainer>
        <PageHeader>
          <PageHeaderContent>
            <PageTitle>Dashboard</PageTitle>
            <PageDescription>
              Tenha uma visão geral da sua clínica.
            </PageDescription>
          </PageHeaderContent>
          <PageActions>
            <DatePicker />
          </PageActions>
        </PageHeader>
        <PageContent>
          <StatsCardsSkeleton />
          <div className="grid grid-cols-[2.25fr_1fr] gap-4">
            <AppointmentsChartSkeleton />
            <TopDoctorsSkeleton />
          </div>
          <div className="grid grid-cols-[2.25fr_1fr] gap-4">
            <TodayAppointmentsSkeleton />
            <TopSpecialtiesSkeleton />
          </div>
        </PageContent>
      </PageContainer>
    );
  }

  const {
    totalRevenue,
    totalAppointments,
    totalPatients,
    totalDoctors,
    topDoctors,
    topSpecialties,
    todayAppointments,
    dailyAppointmentsData,
  } = dashboardData;

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Dashboard</PageTitle>
          <PageDescription>
            Tenha uma visão geral da sua clínica.
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <DatePicker />
        </PageActions>
      </PageHeader>
      <PageContent>
        <StatsCards
          totalRevenue={totalRevenue.total ? Number(totalRevenue.total) : null}
          totalAppointments={totalAppointments.total}
          totalPatients={totalPatients.total}
          totalDoctors={totalDoctors.total}
        />
        <div className="grid grid-cols-[2.25fr_1fr] gap-4">
          <AppointmentsChart dailyAppointmentsData={dailyAppointmentsData} />
          <TopDoctors doctors={topDoctors} />
        </div>
        <div className="grid grid-cols-[2.25fr_1fr] gap-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Calendar className="text-muted-foreground" />
                <CardTitle className="text-base">
                  Agendamentos de hoje
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                columns={appointmentsTableColumns as any}
                data={todayAppointments}
              />
            </CardContent>
          </Card>
          <TopSpecialties topSpecialties={topSpecialties} />
        </div>
      </PageContent>
    </PageContainer>
  );
};

const DashboardPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
};

export default DashboardPage;
