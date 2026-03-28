"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

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

  let callbackUrl = "/admin";
  try {
    callbackUrl = (await signIn("credentials", {
      email: trimmedEmail,
      password,
      redirect: false,
      redirectTo: "/admin",
    })) as string;
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw error;
  }

  redirect(callbackUrl);
}
