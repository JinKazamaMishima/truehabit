import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { foodGroups } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { createFood } from "@/actions/foods";
import { FoodForm } from "../_components/food-form";
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n";

export default async function NewFoodPage() {
  const locale = await getLocale();
  const d = await getDictionary(locale);

  const groups = await db
    .select({ id: foodGroups.id, name: foodGroups.name })
    .from(foodGroups)
    .orderBy(asc(foodGroups.displayOrder), asc(foodGroups.name));

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-start gap-4">
        <Button
          variant="ghost"
          size="icon-sm"
          className="mt-0.5 shrink-0"
          render={<Link href="/admin/foods" />}
        >
          <ArrowLeft className="size-4" />
          <span className="sr-only">{d.admin.foods.newFood.backToFoods}</span>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{d.admin.foods.newFood.title}</h1>
          <p className="text-muted-foreground">
            {d.admin.foods.newFood.subtitle}
          </p>
        </div>
      </div>

      <FoodForm groups={groups} action={createFood} submitLabel={d.admin.foods.newFood.createFood} />
    </div>
  );
}
