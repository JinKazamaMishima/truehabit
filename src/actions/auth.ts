"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export type LoginState = { error: string | null };

export async function loginAction(
  _prevState: LoginState | undefined,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return { error: "Invalid form submission." };
  }

  const trimmedEmail = email.trim();
  if (!trimmedEmail || !password) {
    return { error: "Email and password are required." };
  }

  const [user] = await db
    .select({ role: users.role, locale: users.locale })
    .from(users)
    .where(eq(users.email, trimmedEmail))
    .limit(1);

  const destination = user?.role === "customer" ? "/dashboard" : "/admin";

  try {
    await signIn("credentials", {
      email: trimmedEmail,
      password,
      redirect: false,
      redirectTo: destination,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw error;
  }

  if (user?.locale) {
    const cookieStore = await cookies();
    cookieStore.set("NEXT_LOCALE", user.locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  redirect(destination);
}
