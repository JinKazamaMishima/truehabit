"use server";

import { db } from "@/lib/db";
import { clients, clientMeasurements } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function createClient(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.insert(clients).values({
    userId: session.user.id,
    name: formData.get("name") as string,
    email: (formData.get("email") as string) || null,
    phone: (formData.get("phone") as string) || null,
    dateOfBirth: (formData.get("dateOfBirth") as string) || null,
    sex: (formData.get("sex") as "male" | "female") || null,
    goal:
      (formData.get("goal") as
        | "fat_loss"
        | "muscle_gain"
        | "weight_cut"
        | "maintenance"
        | "pre_competition") || null,
    activityLevel: (formData.get("activityLevel") as string) || null,
    sport: (formData.get("sport") as string) || null,
    notes: (formData.get("notes") as string) || null,
    status: "active",
  });

  revalidatePath("/admin/clients");
  redirect("/admin/clients");
}

export async function updateClient(id: string, formData: FormData) {
  await db
    .update(clients)
    .set({
      name: formData.get("name") as string,
      email: (formData.get("email") as string) || null,
      phone: (formData.get("phone") as string) || null,
      dateOfBirth: (formData.get("dateOfBirth") as string) || null,
      sex: (formData.get("sex") as "male" | "female") || null,
      goal:
        (formData.get("goal") as
          | "fat_loss"
          | "muscle_gain"
          | "weight_cut"
          | "maintenance"
          | "pre_competition") || null,
      activityLevel: (formData.get("activityLevel") as string) || null,
      sport: (formData.get("sport") as string) || null,
      notes: (formData.get("notes") as string) || null,
    })
    .where(eq(clients.id, id));

  revalidatePath(`/admin/clients/${id}`);
  revalidatePath("/admin/clients");
}

export async function deleteClient(id: string) {
  await db.delete(clients).where(eq(clients.id, id));
  revalidatePath("/admin/clients");
  redirect("/admin/clients");
}

export async function addMeasurement(clientId: string, formData: FormData) {
  await db.insert(clientMeasurements).values({
    clientId,
    date: formData.get("date") as string,
    weightKg: (formData.get("weightKg") as string) || null,
    bodyFatPct: (formData.get("bodyFatPct") as string) || null,
    muscleMassPct: (formData.get("muscleMassPct") as string) || null,
    bmi: (formData.get("bmi") as string) || null,
    heightCm: (formData.get("heightCm") as string) || null,
    notes: (formData.get("notes") as string) || null,
  });

  revalidatePath(`/admin/clients/${clientId}`);
}
