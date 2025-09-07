"use server";

import { auth } from "@/src/lib/auth";
import { getDashboard } from "@/src/data/get-dashboard";
import { headers } from "next/headers";

interface GetDashboardParams {
  from: string;
  to: string;
}

export const getDashboardAction = async ({ from, to }: GetDashboardParams) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  if (!session.user.clinic) {
    throw new Error("No clinic selected");
  }

  return getDashboard({
    from,
    to,
    session: {
      user: {
        clinic: {
          id: session.user.clinic.id,
        },
      },
    },
  });
};
