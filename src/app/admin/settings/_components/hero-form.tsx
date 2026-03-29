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
import { ImageUpload } from "@/components/ui/image-upload";
import { upsertSettings } from "@/actions/settings";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { useDictionary } from "@/lib/i18n/context";

export function HeroForm({
  initialValues,
}: {
  initialValues: Record<string, string>;
}) {
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [isPending, startTransition] = useTransition();
  const d = useDictionary();

  const TEXT_FIELDS = [
    { key: "hero_badge", label: d.admin.settings.hero.badgeText, placeholder: d.admin.settings.hero.placeholders.badge, type: "input" as const },
    { key: "hero_heading", label: d.admin.settings.hero.heading, placeholder: d.admin.settings.hero.placeholders.heading, type: "input" as const },
    { key: "hero_subheading", label: d.admin.settings.hero.subheading, placeholder: d.admin.settings.hero.placeholders.subheading, type: "textarea" as const },
    { key: "hero_cta_primary", label: d.admin.settings.hero.primaryCta, placeholder: d.admin.settings.hero.placeholders.primaryCta, type: "input" as const },
    { key: "hero_cta_secondary", label: d.admin.settings.hero.secondaryCta, placeholder: d.admin.settings.hero.placeholders.secondaryCta, type: "input" as const },
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const settings = [
        ...TEXT_FIELDS.map((f) => ({
          key: f.key,
          value: values[f.key] ?? "",
          section: "hero",
        })),
        {
          key: "hero_image_url",
          value: values.hero_image_url ?? "",
          section: "hero",
        },
      ];
      await upsertSettings(settings);
      toast.success(d.admin.settings.hero.toast);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{d.admin.settings.hero.cardTitle}</CardTitle>
        <CardDescription>
          {d.admin.settings.hero.cardDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <Label>{d.admin.settings.hero.heroImage}</Label>
            <ImageUpload
              folder="heroes"
              currentUrl={values.hero_image_url || undefined}
              onUpload={(_key, proxyUrl) =>
                setValues((prev) => ({ ...prev, hero_image_url: proxyUrl }))
              }
              onRemove={() =>
                setValues((prev) => ({ ...prev, hero_image_url: "" }))
              }
            />
            <p className="text-xs text-muted-foreground">
              {d.admin.settings.hero.orEnterUrl}
            </p>
            <Input
              placeholder="https://..."
              value={values.hero_image_url ?? ""}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, hero_image_url: e.target.value }))
              }
            />
          </div>

          {TEXT_FIELDS.map((f) => (
            <div key={f.key} className="space-y-1.5">
              <Label htmlFor={f.key}>{f.label}</Label>
              {f.type === "textarea" ? (
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
