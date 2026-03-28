"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type LoginState } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: LoginState = { error: null };

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState
  );

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <Link
          href="/"
          className="inline-flex items-baseline gap-1.5 text-2xl font-semibold tracking-tight text-brand dark:text-brand"
        >
          <span className="font-heading">TrueHabit</span>
          <span className="text-sm font-normal text-muted-foreground">
            Nutrition
          </span>
        </Link>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to track habits and nutrition
        </p>
      </div>

      <Card className="border-brand/15 shadow-sm ring-brand/10">
        <CardHeader className="space-y-1">
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>
            Enter your email and password to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                disabled={isPending}
                aria-invalid={state.error ? true : undefined}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                disabled={isPending}
                aria-invalid={state.error ? true : undefined}
              />
            </div>

            {state.error ? (
              <p
                className="text-sm text-destructive"
                role="alert"
                aria-live="polite"
              >
                {state.error}
              </p>
            ) : null}

            <Button
              type="submit"
              disabled={isPending}
              className="h-9 w-full bg-brand text-white hover:bg-brand/90 dark:bg-brand dark:hover:bg-brand/90"
            >
              {isPending ? "Signing in…" : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
