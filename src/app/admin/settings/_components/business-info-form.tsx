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

const FIELDS = [
  { key: "business_name", label: "Business Name", placeholder: "TrueHabit" },
  { key: "business_tagline", label: "Tagline", placeholder: "Nutrición basada en ciencia" },
  { key: "business_phone", label: "Phone", placeholder: "+52 (664) 123-4567" },
  { key: "business_email", label: "Email", placeholder: "contacto@truehabit.mx" },
  { key: "business_address", label: "Address", placeholder: "Tijuana, B.C., México" },
  { key: "business_instagram", label: "Instagram URL", placeholder: "https://instagram.com/truehabit" },
  { key: "business_facebook", label: "Facebook URL", placeholder: "https://facebook.com/truehabit" },
  { key: "business_whatsapp", label: "WhatsApp Number", placeholder: "5210000000000" },
] as const;

export function BusinessInfoForm({
  initialValues,
}: {
  initialValues: Record<string, string>;
}) {
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [isPending, startTransition] = useTransition();

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
      toast.success("Business info updated");
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Information</CardTitle>
        <CardDescription>
          Contact details and social media links shown on the public site.
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
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
