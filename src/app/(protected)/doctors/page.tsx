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
import { doctorsTable, medicalSpecialtiesTable } from "@/src/db/schema";
import { auth } from "@/src/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AddDoctorButton from "./_components/add-doctor-button";
import DoctorCard from "./_components/doctor-card";

const DoctorsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/authentication");
  }
  if (!session?.user.clinic) {
    redirect("/clinic-form");
  }
  if (!session.user.plan) {
    redirect("/new-subscription");
  }
  const doctors = await db
    .select({
      id: doctorsTable.id,
      name: doctorsTable.name,
      userId: doctorsTable.userId,
      clinicId: doctorsTable.clinicId,
      avatarImageUrl: doctorsTable.avatarImageUrl,
      availableFromWeekDay: doctorsTable.availableFromWeekDay,
      availableToWeekDay: doctorsTable.availableToWeekDay,
      availableFromTime: doctorsTable.availableFromTime,
      availableToTime: doctorsTable.availableToTime,
      appointmentPriceInCents: doctorsTable.appointmentPriceInCents,
      specialtyId: doctorsTable.specialtyId,
      createdAt: doctorsTable.createdAt,
      updatedAt: doctorsTable.updatedAt,
      specialty: {
        id: medicalSpecialtiesTable.id,
        name: medicalSpecialtiesTable.name,
        description: medicalSpecialtiesTable.description,
        clinicId: medicalSpecialtiesTable.clinicId,
        isActive: medicalSpecialtiesTable.isActive,
        createdAt: medicalSpecialtiesTable.createdAt,
        updatedAt: medicalSpecialtiesTable.updatedAt,
      },
    })
    .from(doctorsTable)
    .leftJoin(
      medicalSpecialtiesTable,
      eq(doctorsTable.specialtyId, medicalSpecialtiesTable.id),
    )
    .where(eq(doctorsTable.clinicId, session.user.clinic.id));

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Médicos</PageTitle>
          <PageDescription>Gerencie os médicos da sua clínica</PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddDoctorButton />
        </PageActions>
      </PageHeader>
      <PageContent>
        <div className="grid grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default DoctorsPage;
