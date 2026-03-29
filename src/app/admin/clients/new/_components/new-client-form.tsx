"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createClient } from "@/actions/clients";
import { NewClientFormSelects } from "./new-client-form-selects";
import { useDictionary } from "@/lib/i18n/context";
import { Copy, Check } from "lucide-react";

export function NewClientForm() {
  const d = useDictionary();
  const nc = d.admin.clients.newClient;
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(
    null,
  );
  const [copied, setCopied] = useState(false);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createClient(formData);
      if (result.success) {
        setGeneratedPassword(result.generatedPassword!);
      } else {
        const errorKey = result.error as keyof typeof nc;
        setError((nc[errorKey] as string) ?? result.error);
      }
    });
  }

  async function handleCopy() {
    if (!generatedPassword) return;
    await navigator.clipboard.writeText(generatedPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{nc.cardTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">{nc.fullName}</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder={nc.fullNamePlaceholder}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{nc.email}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder={nc.emailPlaceholder}
                />
                <p className="text-xs text-muted-foreground">
                  {nc.emailRequired}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{nc.phone}</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder={nc.phonePlaceholder}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">{nc.dateOfBirth}</Label>
                <Input id="dateOfBirth" name="dateOfBirth" type="date" />
              </div>
              <NewClientFormSelects />
              <div className="space-y-2">
                <Label htmlFor="activityLevel">{nc.activityLevel}</Label>
                <Input
                  id="activityLevel"
                  name="activityLevel"
                  placeholder={nc.activityLevelPlaceholder}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sport">{nc.sport}</Label>
                <Input
                  id="sport"
                  name="sport"
                  placeholder={nc.sportPlaceholder}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">{nc.notes}</Label>
              <Textarea
                id="notes"
                name="notes"
                rows={4}
                placeholder={nc.notesPlaceholder}
              />
            </div>

            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}

            <div className="flex justify-end gap-2">
              <Button type="submit" disabled={isPending}>
                {nc.createButton}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Dialog
        open={generatedPassword !== null}
        onOpenChange={(open) => {
          if (!open) {
            setGeneratedPassword(null);
            router.push("/admin/clients");
          }
        }}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{nc.successTitle}</DialogTitle>
            <DialogDescription>{nc.successMessage}</DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-2">
            <Input
              readOnly
              value={generatedPassword ?? ""}
              className="font-mono"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
            </Button>
          </div>

          <DialogFooter>
            <Button onClick={() => router.push("/admin/clients")}>
              {nc.done}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
