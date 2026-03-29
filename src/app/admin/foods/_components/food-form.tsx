"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDictionary } from "@/lib/i18n/context";

export type FoodGroupOption = { id: string; name: string };

export type FoodFormDefaults = {
  name?: string;
  foodGroupId?: string | null;
  baseServingQty?: string | null;
  baseServingUnit?: string | null;
  calories?: string | null;
  proteinG?: string | null;
  carbsG?: string | null;
  fatG?: string | null;
  fiberG?: string | null;
  isFree?: boolean;
  notes?: string | null;
};

type FoodFormProps = {
  groups: FoodGroupOption[];
  action: (formData: FormData) => Promise<void>;
  defaults?: FoodFormDefaults;
  submitLabel: string;
};

function decString(v: string | null | undefined) {
  return v != null && v !== "" ? String(v) : "";
}

export function FoodForm({
  groups,
  action,
  defaults,
  submitLabel,
}: FoodFormProps) {
  const d = useDictionary();
  const [isFree, setIsFree] = useState(defaults?.isFree ?? false);

  return (
    <Card className="border-brand/15">
      <CardHeader className="border-b border-brand/10">
        <CardTitle>{d.admin.foods.form.cardTitle}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form action={action} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">{d.admin.foods.form.name}</Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="e.g. Avena integral"
                defaultValue={defaults?.name ?? ""}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label>{d.admin.foods.form.foodGroup}</Label>
              <Select
                name="food_group_id"
                defaultValue={defaults?.foodGroupId ?? "__none__"}
                items={{
                  __none__: d.admin.foods.form.noGroup,
                  ...Object.fromEntries(groups.map((g) => [g.id, g.name])),
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={d.admin.foods.form.noGroup} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">{d.admin.foods.form.noGroup}</SelectItem>
                  {groups.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="base_serving_qty">{d.admin.foods.form.baseServingQty}</Label>
              <Input
                id="base_serving_qty"
                name="base_serving_qty"
                type="text"
                inputMode="decimal"
                placeholder="100"
                defaultValue={decString(defaults?.baseServingQty)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="base_serving_unit">{d.admin.foods.form.baseServingUnit}</Label>
              <Input
                id="base_serving_unit"
                name="base_serving_unit"
                placeholder={d.admin.foods.form.baseServingUnitPlaceholder}
                defaultValue={defaults?.baseServingUnit ?? ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="calories">{d.admin.foods.form.caloriesPerServing}</Label>
              <Input
                id="calories"
                name="calories"
                type="text"
                inputMode="decimal"
                placeholder="0"
                defaultValue={decString(defaults?.calories)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="protein_g">{d.admin.foods.form.proteinG}</Label>
              <Input
                id="protein_g"
                name="protein_g"
                type="text"
                inputMode="decimal"
                placeholder="0"
                defaultValue={decString(defaults?.proteinG)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carbs_g">{d.admin.foods.form.carbsG}</Label>
              <Input
                id="carbs_g"
                name="carbs_g"
                type="text"
                inputMode="decimal"
                placeholder="0"
                defaultValue={decString(defaults?.carbsG)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fat_g">{d.admin.foods.form.fatG}</Label>
              <Input
                id="fat_g"
                name="fat_g"
                type="text"
                inputMode="decimal"
                placeholder="0"
                defaultValue={decString(defaults?.fatG)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fiber_g">{d.admin.foods.form.fiberG}</Label>
              <Input
                id="fiber_g"
                name="fiber_g"
                type="text"
                inputMode="decimal"
                placeholder="0"
                defaultValue={decString(defaults?.fiberG)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-brand/20 bg-brand/5 px-4 py-3">
            <Checkbox
              id="is_free"
              checked={isFree}
              onCheckedChange={(v) => setIsFree(v === true)}
            />
            <input type="hidden" name="is_free" value={isFree ? "true" : "false"} />
            <Label htmlFor="is_free" className="cursor-pointer font-normal">
              {d.admin.foods.form.freeFood}
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">{d.admin.foods.form.notes}</Label>
            <Textarea
              id="notes"
              name="notes"
              rows={4}
              placeholder={d.admin.foods.form.notesPlaceholder}
              defaultValue={defaults?.notes ?? ""}
            />
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              render={<Link href="/admin/foods" />}
            >
              {d.common.cancel}
            </Button>
            <Button
              type="submit"
              className="bg-brand hover:bg-brand-dark dark:bg-brand dark:hover:bg-brand"
            >
              {submitLabel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
