import { db } from "@/lib/db";
import { foodGroups } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { ensureDefaultFoodGroups } from "@/actions/foods";
import { FoodGroupsManager } from "./_components/food-groups-manager";
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n";

export default async function FoodGroupsPage() {
  await ensureDefaultFoodGroups();

  const locale = await getLocale();
  const d = await getDictionary(locale);

  const groups = await db
    .select()
    .from(foodGroups)
    .orderBy(asc(foodGroups.displayOrder), asc(foodGroups.name));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{d.admin.foods.foodGroupsPage.title}</h1>
        <p className="text-muted-foreground">
          {d.admin.foods.foodGroupsPage.subtitle}
        </p>
      </div>

      <FoodGroupsManager groups={groups} />
    </div>
  );
}
