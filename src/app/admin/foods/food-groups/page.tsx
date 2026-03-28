import { db } from "@/lib/db";
import { foodGroups } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { ensureDefaultFoodGroups } from "@/actions/foods";
import { FoodGroupsManager } from "./_components/food-groups-manager";

export default async function FoodGroupsPage() {
  await ensureDefaultFoodGroups();

  const groups = await db
    .select()
    .from(foodGroups)
    .orderBy(asc(foodGroups.displayOrder), asc(foodGroups.name));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Food groups</h1>
        <p className="text-muted-foreground">
          Categories used to organize foods. Default groups are created automatically
          when this page is first opened.
        </p>
      </div>

      <FoodGroupsManager groups={groups} />
    </div>
  );
}
