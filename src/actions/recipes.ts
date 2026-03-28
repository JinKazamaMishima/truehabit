"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  recipes,
  recipeIngredients,
  recipeTags,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type RecipeIngredientInput = {
  foodId: string | null;
  name: string;
  baseQty: string;
  servingUnit: string;
  ratioGroup: string;
  isOptional: boolean;
};

export type RecipeSavePayload = {
  name: string;
  description: string;
  prepInstructions: string;
  prepTimeMin: number | null;
  mealTypes: string[];
  imageUrl?: string | null;
  ingredients: RecipeIngredientInput[];
  tags: string[];
};

function normalizeIngredient(ing: RecipeIngredientInput) {
  const name = ing.name.trim();
  const hasFood = Boolean(ing.foodId);
  if (!hasFood && !name) return null;
  return {
    foodId: ing.foodId,
    name: hasFood ? (name || null) : name || null,
    baseQty: ing.baseQty.trim() ? ing.baseQty.trim() : null,
    servingUnit: ing.servingUnit.trim() || null,
    ratioGroup:
      ing.ratioGroup && ing.ratioGroup !== "none" ? ing.ratioGroup : null,
    isOptional: ing.isOptional,
  };
}

function validatePayload(data: RecipeSavePayload) {
  if (!data.name.trim()) {
    throw new Error("Recipe name is required.");
  }
  const normalized = data.ingredients
    .map(normalizeIngredient)
    .filter(Boolean) as NonNullable<ReturnType<typeof normalizeIngredient>>[];

  if (normalized.length === 0) {
    throw new Error("Add at least one ingredient with a name or a linked food.");
  }

  for (const ing of normalized) {
    if (!ing.foodId && !ing.name) {
      throw new Error("Each ingredient needs a name or a food from the database.");
    }
  }

  const tags = [
    ...new Set(
      data.tags
        .map((t) => t.trim())
        .filter(Boolean)
    ),
  ];

  return {
    name: data.name.trim(),
    description: data.description.trim() || null,
    prepInstructions: data.prepInstructions.trim() || null,
    prepTimeMin:
      data.prepTimeMin !== null && !Number.isNaN(data.prepTimeMin)
        ? Math.max(0, Math.round(data.prepTimeMin))
        : null,
    mealTypes: data.mealTypes.length > 0 ? data.mealTypes : null,
    ingredients: normalized,
    tags,
  };
}

export async function createRecipe(data: RecipeSavePayload) {
  const session = await auth();
  const v = validatePayload(data);

  const recipeId = await db.transaction(async (tx) => {
    const [recipe] = await tx
      .insert(recipes)
      .values({
        name: v.name,
        description: v.description,
        prepInstructions: v.prepInstructions,
        prepTimeMin: v.prepTimeMin,
        mealTypes: v.mealTypes,
        imageUrl: data.imageUrl ?? null,
        createdBy:
          (session?.user as { id?: string } | undefined)?.id ?? null,
      })
      .returning({ id: recipes.id });

    if (!recipe) throw new Error("Failed to create recipe.");

    await tx.insert(recipeIngredients).values(
      v.ingredients.map((ing, i) => ({
        recipeId: recipe.id,
        foodId: ing.foodId,
        name: ing.name,
        baseQty: ing.baseQty,
        servingUnit: ing.servingUnit,
        ratioGroup: ing.ratioGroup,
        isOptional: ing.isOptional,
        displayOrder: i,
      }))
    );

    if (v.tags.length > 0) {
      await tx.insert(recipeTags).values(
        v.tags.map((tag) => ({
          recipeId: recipe.id,
          tag,
        }))
      );
    }

    return recipe.id;
  });

  revalidatePath("/admin/recipes");
  redirect(`/admin/recipes/${recipeId}`);
}

export async function updateRecipe(id: string, data: RecipeSavePayload) {
  const v = validatePayload(data);

  await db.transaction(async (tx) => {
    await tx
      .update(recipes)
      .set({
        name: v.name,
        description: v.description,
        prepInstructions: v.prepInstructions,
        prepTimeMin: v.prepTimeMin,
        imageUrl: data.imageUrl ?? null,
        mealTypes: v.mealTypes,
      })
      .where(eq(recipes.id, id));

    await tx
      .delete(recipeIngredients)
      .where(eq(recipeIngredients.recipeId, id));
    await tx.delete(recipeTags).where(eq(recipeTags.recipeId, id));

    await tx.insert(recipeIngredients).values(
      v.ingredients.map((ing, i) => ({
        recipeId: id,
        foodId: ing.foodId,
        name: ing.name,
        baseQty: ing.baseQty,
        servingUnit: ing.servingUnit,
        ratioGroup: ing.ratioGroup,
        isOptional: ing.isOptional,
        displayOrder: i,
      }))
    );

    if (v.tags.length > 0) {
      await tx.insert(recipeTags).values(
        v.tags.map((tag) => ({
          recipeId: id,
          tag,
        }))
      );
    }
  });

  revalidatePath("/admin/recipes");
  revalidatePath(`/admin/recipes/${id}`);
}

export async function deleteRecipe(id: string) {
  await db.delete(recipes).where(eq(recipes.id, id));
  revalidatePath("/admin/recipes");
  redirect("/admin/recipes");
}
