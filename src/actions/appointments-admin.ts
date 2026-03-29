"use server";

import { z } from "zod/v4";
import { db } from "@/lib/db";
import { appointments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const serviceTypes = [
  "personalized_nutrition",
  "weight_loss",
  "sports_nutrition",
  "body_composition",
  "pre_competition",
  "individual_coaching",
] as const;

const statuses = ["pending", "confirmed", "completed", "cancelled"] as const;

const appointmentAdminSchema = z.object({
  clientName: z.string().min(2),
  email: z.email(),
  phone: z.string().optional(),
  serviceType: z.enum(serviceTypes),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  message: z.string().optional(),
  status: z.enum(statuses).optional(),
});

export type AppointmentAdminInput = z.infer<typeof appointmentAdminSchema>;

export async function createAppointmentAdmin(
  data: AppointmentAdminInput
): Promise<{ success: boolean; error?: string }> {
  const result = appointmentAdminSchema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      error: result.error.issues.map((i) => i.message).join(", "),
    };
  }

  try {
    await db.insert(appointments).values({
      clientName: result.data.clientName,
      email: result.data.email,
      phone: result.data.phone ?? null,
      serviceType: result.data.serviceType,
      preferredDate: result.data.preferredDate ?? null,
      preferredTime: result.data.preferredTime ?? null,
      message: result.data.message ?? null,
      status: result.data.status ?? "pending",
    });

    revalidatePath("/admin/appointments");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to create appointment." };
  }
}

export async function updateAppointment(
  id: string,
  data: AppointmentAdminInput
): Promise<{ success: boolean; error?: string }> {
  const result = appointmentAdminSchema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      error: result.error.issues.map((i) => i.message).join(", "),
    };
  }

  try {
    await db
      .update(appointments)
      .set({
        clientName: result.data.clientName,
        email: result.data.email,
        phone: result.data.phone ?? null,
        serviceType: result.data.serviceType,
        preferredDate: result.data.preferredDate ?? null,
        preferredTime: result.data.preferredTime ?? null,
        message: result.data.message ?? null,
        status: result.data.status ?? "pending",
      })
      .where(eq(appointments.id, id));

    revalidatePath("/admin/appointments");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update appointment." };
  }
}

export async function updateAppointmentStatus(
  id: string,
  status: "pending" | "confirmed" | "completed" | "cancelled"
) {
  await db
    .update(appointments)
    .set({ status })
    .where(eq(appointments.id, id));

  revalidatePath("/admin/appointments");
}
