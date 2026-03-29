import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { foods, recipeIngredients, recipeTags, recipes } from "@/lib/db/schema";
import { RecipeForm } from "../_components/recipe-form";
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n";

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locale = await getLocale();
  const d = await getDictionary(locale);

  const [recipe] = await db
    .select()
    .from(recipes)
    .where(eq(recipes.id, id))
    .limit(1);

  if (!recipe) notFound();

  const [ingredientRows, tagRows, foodList] = await Promise.all([
    db
      .select()
      .from(recipeIngredients)
      .where(eq(recipeIngredients.recipeId, id))
      .orderBy(asc(recipeIngredients.displayOrder)),
    db.select().from(recipeTags).where(eq(recipeTags.recipeId, id)),
    db
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
      .orderBy(asc(foods.name)),
  ]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{d.admin.recipes.editRecipePage.title}</h1>
        <p className="text-muted-foreground">{recipe.name}</p>
      </div>
      <RecipeForm
        mode="edit"
        recipeId={id}
        initialRecipe={{
          name: recipe.name,
          description: recipe.description ?? "",
          prepInstructions: recipe.prepInstructions ?? "",
          prepTimeMin: recipe.prepTimeMin,
          mealTypes: recipe.mealTypes ?? [],
          imageUrl: recipe.imageUrl,
          ingredients: ingredientRows.map((row) => ({
            foodId: row.foodId,
            name: row.name ?? "",
            baseQty: row.baseQty ?? "",
            servingUnit: row.servingUnit ?? "",
            ratioGroup: row.ratioGroup ?? "none",
            isOptional: row.isOptional ?? false,
          })),
          tags: tagRows.map((t) => t.tag),
        }}
        foods={foodList}
      />
    </div>
  );
}
