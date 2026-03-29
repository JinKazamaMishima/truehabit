"use client";

import { useState, useEffect, useCallback } from "react";
import { Download, Share, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/lib/i18n/context";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "pwa-install-dismissed";
const DISMISS_DAYS = 30;

function isDismissed(): boolean {
  if (typeof window === "undefined") return true;
  const raw = localStorage.getItem(DISMISS_KEY);
  if (!raw) return false;
  const dismissedAt = Number(raw);
  const daysSince = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);
  return daysSince < DISMISS_DAYS;
}

function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !("MSStream" in window)
  );
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && (navigator as { standalone?: boolean }).standalone === true)
  );
}

export function InstallPrompt() {
  const d = useDictionary();
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const [visible, setVisible] = useState(false);

  const dismiss = useCallback(() => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setVisible(false);
    setDeferredPrompt(null);
    setShowIOSPrompt(false);
  }, []);

  useEffect(() => {
    if (isStandalone() || isDismissed()) return;

    if (isIOS()) {
      setShowIOSPrompt(true);
      setVisible(true);
      return;
    }

    function handleBeforeInstall(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () =>
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setVisible(false);
    }
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[100] animate-in slide-in-from-bottom duration-300 md:hidden"
      role="banner"
    >
      <div className="border-t border-brand/20 bg-white px-4 py-3 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand/10">
            <Download className="size-5 text-brand" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-charcoal">
              {d.pwa.installTitle}
            </p>
            {showIOSPrompt ? (
              <p className="text-xs text-muted-foreground">
                {d.pwa.iosInstructions.replace(
                  "{shareIcon}",
                  ""
                )}
                <Share className="mb-0.5 ml-0.5 inline size-3" />
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                {d.pwa.installDescription}
              </p>
            )}
          </div>

          {!showIOSPrompt && (
            <Button
              size="sm"
              className="shrink-0 bg-brand text-white hover:bg-brand-dark"
              onClick={handleInstall}
            >
              {d.pwa.installButton}
            </Button>
          )}

          <button
            onClick={dismiss}
            className="shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={d.pwa.dismiss}
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
