"use server";

import { cookies } from "next/headers";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";

export const switchClinic = async (clinicId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const userClinics = session.user.clinics || [];
  const hasAccess = userClinics.some((clinic) => clinic.id === clinicId);

  if (!hasAccess) {
    throw new Error("Access denied to this clinic");
  }

  const selectedClinic = userClinics.find((clinic) => clinic.id === clinicId);
  if (!selectedClinic) {
    throw new Error("Clinic not found");
  }

  const cookieStore = await cookies();

  cookieStore.set("selectedClinic", JSON.stringify(selectedClinic), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });

  console.log(
    "Clínica alterada para:",
    selectedClinic.name,
    "ID:",
    selectedClinic.id,
  );

  return { success: true, clinic: selectedClinic };
};
