"use server";

import { db } from "@/lib/db";
import { users, clients } from "@/lib/db/schema";
import { eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function getUsers() {
  return db.select().from(users).orderBy(users.createdAt);
}

export async function getUnlinkedClients() {
  return db
    .select({ id: clients.id, name: clients.name, email: clients.email })
    .from(clients)
    .where(isNull(clients.linkedUserId));
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: "admin" | "nutritionist" | "customer";
  linkedClientId?: string;
}) {
  const passwordHash = await bcrypt.hash(data.password, 10);

  const [newUser] = await db
    .insert(users)
    .values({
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role,
    })
    .returning({ id: users.id });

  if (data.role === "customer" && data.linkedClientId && newUser) {
    await db
      .update(clients)
      .set({ linkedUserId: newUser.id })
      .where(eq(clients.id, data.linkedClientId));
  }

  revalidatePath("/admin/settings");
  return { success: true };
}

export async function resetUserPassword(userId: string, newPassword: string) {
  const passwordHash = await bcrypt.hash(newPassword, 10);
  await db
    .update(users)
    .set({ passwordHash })
    .where(eq(users.id, userId));
  revalidatePath("/admin/settings");
  return { success: true };
}

export async function deleteUser(userId: string) {
  await db.delete(users).where(eq(users.id, userId));
  revalidatePath("/admin/settings");
  return { success: true };
}
