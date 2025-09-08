"use server";

import { db } from "@/src/db";
import { doctorsTable, medicalSpecialtiesTable } from "@/src/db/schema";
import { auth } from "@/src/lib/auth";
import { actionClient } from "@/src/lib/next-safe-action";
import { headers } from "next/headers";
import { upsertDoctorSchema } from "./schema";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

dayjs.extend(utc);

export const upsertDoctor = actionClient
  .schema(upsertDoctorSchema)
  .action(async ({ parsedInput }) => {
    const availableFromTime = parsedInput.availableFromTime;
    const availableToTime = parsedInput.availableToTime;

    const availableFromTimeFormatted = dayjs()
      .set("hour", parseInt(availableFromTime.split(":")[0]))
      .set("minute", parseInt(availableFromTime.split(":")[1]))
      .set("second", parseInt(availableFromTime.split(":")[2]));

    const availableToTimeFormatted = dayjs()
      .set("hour", parseInt(availableToTime.split(":")[0]))
      .set("minute", parseInt(availableToTime.split(":")[1]))
      .set("second", parseInt(availableToTime.split(":")[2]));

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    if (!session?.user.clinic) {
      throw new Error("Clinic not found");
    }

    // Buscar specialtyId pelo nome da especialidade
    const specialty = await db
      .select({ id: medicalSpecialtiesTable.id })
      .from(medicalSpecialtiesTable)
      .where(eq(medicalSpecialtiesTable.name, parsedInput.specialty))
      .limit(1);

    if (specialty.length === 0) {
      throw new Error("Especialidade não encontrada");
    }

    const specialtyId = specialty[0].id;

    await db
      .insert(doctorsTable)
      .values({
        name: parsedInput.name,
        clinicId: session?.user.clinic?.id,
        availableFromTime: availableFromTimeFormatted.format("HH:mm:ss"),
        availableToTime: availableToTimeFormatted.format("HH:mm:ss"),
        availableFromWeekDay: parsedInput.availableFromWeekDay,
        availableToWeekDay: parsedInput.availableToWeekDay,
        specialtyId,
        appointmentPriceInCents: parsedInput.appointmentPriceInCents,
      })
      .onConflictDoUpdate({
        target: [doctorsTable.id],
        set: {
          name: parsedInput.name,
          availableFromTime: availableFromTimeFormatted.format("HH:mm:ss"),
          availableToTime: availableToTimeFormatted.format("HH:mm:ss"),
          availableFromWeekDay: parsedInput.availableFromWeekDay,
          availableToWeekDay: parsedInput.availableToWeekDay,
          specialtyId,
          appointmentPriceInCents: parsedInput.appointmentPriceInCents,
        },
      });

    revalidatePath("/doctors");
  });
