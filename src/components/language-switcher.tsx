"use client";

import { useTransition } from "react";
import { useLocale } from "@/lib/i18n/context";
import { setLocaleAction } from "@/lib/i18n/actions";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  function switchTo(target: Locale) {
    if (target === locale) return;
    startTransition(() => {
      setLocaleAction(target);
    });
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-md border border-border/50 p-0.5 text-xs font-medium",
        isPending && "opacity-60 pointer-events-none",
        className
      )}
    >
      <Globe className="ml-1.5 size-3.5 shrink-0 text-muted-foreground" />
      <button
        onClick={() => switchTo("es")}
        className={cn(
          "rounded px-2 py-1 transition-colors",
          locale === "es"
            ? "bg-brand text-white"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        ES
      </button>
      <button
        onClick={() => switchTo("en")}
        className={cn(
          "rounded px-2 py-1 transition-colors",
          locale === "en"
            ? "bg-brand text-white"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        EN
      </button>
    </div>
  );
}
