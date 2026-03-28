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
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/ui/image-upload";
import { upsertSettings } from "@/actions/settings";
import { Loader2, Save, Plus, X } from "lucide-react";
import { toast } from "sonner";

export function AboutForm({
  initialValues,
}: {
  initialValues: Record<string, string>;
}) {
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [credentials, setCredentials] = useState<string[]>(() => {
    try {
      return JSON.parse(initialValues.about_credentials || "[]");
    } catch {
      return [];
    }
  });
  const [isPending, startTransition] = useTransition();

  function set(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const entries = [
        { key: "about_name", value: values.about_name ?? "", section: "about" },
        { key: "about_title", value: values.about_title ?? "", section: "about" },
        { key: "about_bio_1", value: values.about_bio_1 ?? "", section: "about" },
        { key: "about_bio_2", value: values.about_bio_2 ?? "", section: "about" },
        { key: "about_bio_3", value: values.about_bio_3 ?? "", section: "about" },
        { key: "about_credentials", value: JSON.stringify(credentials), section: "about" },
        { key: "about_stat_clients", value: values.about_stat_clients ?? "500", section: "about" },
        { key: "about_stat_years", value: values.about_stat_years ?? "10", section: "about" },
        { key: "about_stat_satisfaction", value: values.about_stat_satisfaction ?? "98", section: "about" },
        { key: "about_image_url", value: values.about_image_url ?? "", section: "about" },
      ];
      await upsertSettings(entries);
      toast.success("About section updated");
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>About / Bio</CardTitle>
        <CardDescription>
          Nutritionist profile shown on the home and about pages.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="about_name">Full Name</Label>
              <Input
                id="about_name"
                placeholder="LN. Enya Marrero"
                value={values.about_name ?? ""}
                onChange={(e) => set("about_name", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="about_title">Title</Label>
              <Input
                id="about_title"
                placeholder="Tu Nutrióloga"
                value={values.about_title ?? ""}
                onChange={(e) => set("about_title", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Profile Image</Label>
            <ImageUpload
              folder="about"
              currentUrl={values.about_image_url || undefined}
              onUpload={(_key, proxyUrl) => set("about_image_url", proxyUrl)}
              onRemove={() => set("about_image_url", "")}
              aspectRatio="portrait"
            />
            <p className="text-xs text-muted-foreground">Or enter a URL directly:</p>
            <Input
              id="about_image_url"
              placeholder="https://..."
              value={values.about_image_url ?? ""}
              onChange={(e) => set("about_image_url", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="about_bio_1">Bio Paragraph 1</Label>
            <Textarea
              id="about_bio_1"
              placeholder="Main bio paragraph..."
              value={values.about_bio_1 ?? ""}
              onChange={(e) => set("about_bio_1", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="about_bio_2">Bio Paragraph 2</Label>
            <Textarea
              id="about_bio_2"
              placeholder="Second paragraph..."
              value={values.about_bio_2 ?? ""}
              onChange={(e) => set("about_bio_2", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="about_bio_3">Bio Paragraph 3</Label>
            <Textarea
              id="about_bio_3"
              placeholder="Third paragraph (optional)..."
              value={values.about_bio_3 ?? ""}
              onChange={(e) => set("about_bio_3", e.target.value)}
            />
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="about_stat_clients">Clients Count</Label>
              <Input
                id="about_stat_clients"
                type="number"
                placeholder="500"
                value={values.about_stat_clients ?? ""}
                onChange={(e) => set("about_stat_clients", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="about_stat_years">Years Experience</Label>
              <Input
                id="about_stat_years"
                type="number"
                placeholder="10"
                value={values.about_stat_years ?? ""}
                onChange={(e) => set("about_stat_years", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="about_stat_satisfaction">Satisfaction %</Label>
              <Input
                id="about_stat_satisfaction"
                type="number"
                placeholder="98"
                value={values.about_stat_satisfaction ?? ""}
                onChange={(e) => set("about_stat_satisfaction", e.target.value)}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Credentials / Certifications</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCredentials((prev) => [...prev, ""])}
              >
                <Plus className="size-3.5" />
                Add
              </Button>
            </div>
            {credentials.map((cred, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  value={cred}
                  placeholder="Credential or certification..."
                  onChange={(e) =>
                    setCredentials((prev) =>
                      prev.map((c, j) => (j === i ? e.target.value : c))
                    )
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() =>
                    setCredentials((prev) => prev.filter((_, j) => j !== i))
                  }
                >
                  <X className="size-3.5" />
                </Button>
              </div>
            ))}
            {credentials.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No credentials added yet.
              </p>
            )}
          </div>

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
