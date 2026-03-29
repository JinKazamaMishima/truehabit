import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { foods } from "@/lib/db/schema";
import { RecipeForm } from "../_components/recipe-form";
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n";

export default async function NewRecipePage() {
  const locale = await getLocale();
  const d = await getDictionary(locale);

  const foodList = await db
    .select({
      id: foods.id,
      name: foods.name,
      baseServingQty: foods.baseServingQty,
      baseServingUnit: foods.baseServingUnit,
      calories: foods.calories,
      proteinG: foods.proteinG,
      carbsG: foods.carbsG,
      fatG: foods.fatG,
      fiberG: foods.fiberG,
    })
    .from(foods)
    .orderBy(asc(foods.name));

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{d.admin.recipes.newRecipePage.title}</h1>
        <p className="text-muted-foreground">
          {d.admin.recipes.newRecipePage.subtitle}
        </p>
      </div>
      <RecipeForm mode="create" foods={foodList} />
    </div>
  );
}
