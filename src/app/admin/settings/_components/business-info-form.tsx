"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { upsertSettings } from "@/actions/settings";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { useDictionary } from "@/lib/i18n/context";

export function BusinessInfoForm({
  initialValues,
}: {
  initialValues: Record<string, string>;
}) {
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [isPending, startTransition] = useTransition();
  const d = useDictionary();

  const FIELDS = [
    { key: "business_name", label: d.admin.settings.businessInfo.businessName, placeholder: d.admin.settings.businessInfo.placeholders.name },
    { key: "business_tagline", label: d.admin.settings.businessInfo.tagline, placeholder: d.admin.settings.businessInfo.placeholders.tagline },
    { key: "business_phone", label: d.admin.settings.businessInfo.phone, placeholder: d.admin.settings.businessInfo.placeholders.phone },
    { key: "business_email", label: d.admin.settings.businessInfo.email, placeholder: d.admin.settings.businessInfo.placeholders.email },
    { key: "business_address", label: d.admin.settings.businessInfo.address, placeholder: d.admin.settings.businessInfo.placeholders.address },
    { key: "business_instagram", label: d.admin.settings.businessInfo.instagramUrl, placeholder: d.admin.settings.businessInfo.placeholders.instagram },
    { key: "business_facebook", label: d.admin.settings.businessInfo.facebookUrl, placeholder: d.admin.settings.businessInfo.placeholders.facebook },
    { key: "business_whatsapp", label: d.admin.settings.businessInfo.whatsappNumber, placeholder: d.admin.settings.businessInfo.placeholders.whatsapp },
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await upsertSettings(
        FIELDS.map((f) => ({
          key: f.key,
          value: values[f.key] ?? "",
          section: "business",
        }))
      );
      toast.success(d.admin.settings.businessInfo.toast);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{d.admin.settings.businessInfo.cardTitle}</CardTitle>
        <CardDescription>
          {d.admin.settings.businessInfo.cardDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {FIELDS.map((f) => (
            <div key={f.key} className="space-y-1.5">
              <Label htmlFor={f.key}>{f.label}</Label>
              {f.key === "business_address" ? (
                <Textarea
                  id={f.key}
                  placeholder={f.placeholder}
                  value={values[f.key] ?? ""}
                  onChange={(e) =>
                    setValues((prev) => ({ ...prev, [f.key]: e.target.value }))
                  }
                />
              ) : (
                <Input
                  id={f.key}
                  placeholder={f.placeholder}
                  value={values[f.key] ?? ""}
                  onChange={(e) =>
                    setValues((prev) => ({ ...prev, [f.key]: e.target.value }))
                  }
                />
              )}
            </div>
          ))}
          <Button
            type="submit"
            disabled={isPending}
            className="bg-brand text-white hover:bg-brand-dark"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            {d.common.saveChanges}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
