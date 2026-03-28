"use server";

import { z } from "zod/v4";
import { db } from "@/lib/db";
import { appointments } from "@/lib/db/schema";

const appointmentSchema = z.object({
  clientName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.email("Ingresa un email válido"),
  phone: z.string().optional(),
  serviceType: z.enum([
    "personalized_nutrition",
    "weight_loss",
    "sports_nutrition",
    "body_composition",
    "pre_competition",
    "individual_coaching",
  ]),
  preferredDate: z.string().optional(),
  message: z.string().optional(),
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;

export async function createAppointment(
  data: AppointmentInput
): Promise<{ success: boolean; error?: string }> {
  const result = appointmentSchema.safeParse(data);

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
      message: result.data.message ?? null,
    });

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Error al agendar la cita. Por favor intenta de nuevo.",
    };
  }
}
