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
import { useDictionary } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/language-switcher";

const initialState: LoginState = { error: null };

export default function LoginPage() {
  const d = useDictionary();
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState
  );

  return (
    <div className="w-full max-w-md">
      <div className="mb-4 flex justify-end">
        <LanguageSwitcher />
      </div>
      <div className="mb-8 text-center">
        <Link
          href="/"
          className="inline-flex items-baseline gap-1.5 text-2xl font-semibold tracking-tight text-brand dark:text-brand"
        >
          <span className="font-heading">TrueHabit</span>
          <span className="text-sm font-normal text-muted-foreground">
            {d.auth.nutrition}
          </span>
        </Link>
        <p className="mt-2 text-sm text-muted-foreground">
          {d.auth.signInToTrack}
        </p>
      </div>

      <Card className="border-brand/15 shadow-sm ring-brand/10">
        <CardHeader className="space-y-1">
          <CardTitle>{d.auth.welcomeBack}</CardTitle>
          <CardDescription>
            {d.auth.enterEmailPassword}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">{d.auth.emailLabel}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder={d.auth.emailPlaceholder}
                required
                disabled={isPending}
                aria-invalid={state.error ? true : undefined}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">{d.auth.passwordLabel}</Label>
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
              {isPending ? d.auth.signingIn : d.auth.signIn}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
