"use server";

import { db } from "@/lib/db";
import { clients, clientMeasurements, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export type CreateClientResult = {
  success: boolean;
  generatedPassword?: string;
  error?: string;
};

function generatePassword(length = 12): string {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  const bytes = crypto.randomBytes(length);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

export async function createClient(
  formData: FormData,
): Promise<CreateClientResult> {
  const session = await auth();
  const staffUserId = session?.user?.id;
  if (!staffUserId) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const email = (formData.get("email") as string)?.trim();

  if (!email) {
    return { success: false, error: "emailMissing" };
  }

  const plainPassword = generatePassword();
  const passwordHash = await bcrypt.hash(plainPassword, 10);

  try {
    await db.transaction(async (tx) => {
      const [newUser] = await tx
        .insert(users)
        .values({ name, email, passwordHash, role: "customer" })
        .returning({ id: users.id });

      await tx.insert(clients).values({
        userId: staffUserId,
        linkedUserId: newUser.id,
        name,
        email,
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
    });
  } catch (err: unknown) {
    const pgError = err as { code?: string };
    if (pgError.code === "23505") {
      return { success: false, error: "emailAlreadyExists" };
    }
    throw err;
  }

  revalidatePath("/admin/clients");
  return { success: true, generatedPassword: plainPassword };
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
  const [client] = await db
    .select({ linkedUserId: clients.linkedUserId })
    .from(clients)
    .where(eq(clients.id, id))
    .limit(1);

  await db.delete(clients).where(eq(clients.id, id));

  if (client?.linkedUserId) {
    await db.delete(users).where(eq(users.id, client.linkedUserId));
  }

  revalidatePath("/admin/clients");
  return { success: true };
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
