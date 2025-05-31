import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import SignoutButton from "./_components/signout-button";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  return (
    <div>
      <h1>{session?.user?.name}</h1>
      <SignoutButton />
    </div>
  );
};

export default DashboardPage;
