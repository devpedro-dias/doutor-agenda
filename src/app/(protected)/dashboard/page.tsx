import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SignoutButton from "./_components/signout-button";

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  if (!session?.user.clinic) {
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
