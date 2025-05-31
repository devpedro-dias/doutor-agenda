import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import SignoutButton from "./_components/signout-button";
import { redirect } from "next/navigation";
import { db } from "@/src/db";
import { eq } from "drizzle-orm";
import { usersToClinicsTable } from "@/src/db/schema";

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  const clinics = await db.query.usersToClinicsTable.findMany({
    where: eq(usersToClinicsTable.userId, session.user.id),
  });

  if (clinics.length === 0) {
    redirect("/clinic-form");
  }
  return (
    <div>
      <h1>{session?.user?.name}</h1>
      <SignoutButton />
    </div>
  );
};

export default DashboardPage;
