"use server";

import { db } from "@/lib/db";
import { foods, foodGroups } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const DEFAULT_FOOD_GROUPS: { name: string; displayOrder: number }[] = [
  { name: "Cereales", displayOrder: 0 },
  { name: "Proteínas", displayOrder: 1 },
  { name: "Grasas", displayOrder: 2 },
  { name: "Vegetales", displayOrder: 3 },
  { name: "Frutas", displayOrder: 4 },
  { name: "Lácteos", displayOrder: 5 },
  { name: "Suplementos", displayOrder: 6 },
];

function strOrNull(v: FormDataEntryValue | null): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
}

function optionalDecimal(v: FormDataEntryValue | null): string | null {
  return strOrNull(v);
}

function foodGroupIdFromForm(formData: FormData): string | null {
  const raw = strOrNull(formData.get("food_group_id"));
  if (!raw || raw === "__none__") return null;
  return raw;
}

export async function ensureDefaultFoodGroups() {
  const existing = await db.select({ name: foodGroups.name }).from(foodGroups);
  const have = new Set(existing.map((r) => r.name));
  const missing = DEFAULT_FOOD_GROUPS.filter((g) => !have.has(g.name));
  if (missing.length > 0) {
    await db.insert(foodGroups).values(missing);
    revalidatePath("/admin/foods");
    revalidatePath("/admin/foods/food-groups");
  }
}

export async function createFood(formData: FormData) {
  const name = strOrNull(formData.get("name"));
  if (!name) return;

  await db.insert(foods).values({
    foodGroupId: foodGroupIdFromForm(formData),
    name,
    baseServingQty: optionalDecimal(formData.get("base_serving_qty")),
    baseServingUnit: strOrNull(formData.get("base_serving_unit")),
    calories: optionalDecimal(formData.get("calories")),
    proteinG: optionalDecimal(formData.get("protein_g")),
    carbsG: optionalDecimal(formData.get("carbs_g")),
    fatG: optionalDecimal(formData.get("fat_g")),
    fiberG: optionalDecimal(formData.get("fiber_g")),
    isFree:
      formData.get("is_free") === "on" || formData.get("is_free") === "true",
    notes: strOrNull(formData.get("notes")),
  });

  revalidatePath("/admin/foods");
  redirect("/admin/foods");
}

export async function updateFood(id: string, formData: FormData) {
  const name = strOrNull(formData.get("name"));
  if (!name) return;

  await db
    .update(foods)
    .set({
      foodGroupId: foodGroupIdFromForm(formData),
      name,
      baseServingQty: optionalDecimal(formData.get("base_serving_qty")),
      baseServingUnit: strOrNull(formData.get("base_serving_unit")),
      calories: optionalDecimal(formData.get("calories")),
      proteinG: optionalDecimal(formData.get("protein_g")),
      carbsG: optionalDecimal(formData.get("carbs_g")),
      fatG: optionalDecimal(formData.get("fat_g")),
      fiberG: optionalDecimal(formData.get("fiber_g")),
      isFree:
        formData.get("is_free") === "on" || formData.get("is_free") === "true",
      notes: strOrNull(formData.get("notes")),
    })
    .where(eq(foods.id, id));

  revalidatePath("/admin/foods");
  revalidatePath(`/admin/foods/${id}`);
}

export async function deleteFood(id: string, _formData?: FormData) {
  await db.delete(foods).where(eq(foods.id, id));
  revalidatePath("/admin/foods");
  redirect("/admin/foods");
}

export async function createFoodGroup(formData: FormData) {
  const name = strOrNull(formData.get("name"));
  if (!name) return;

  const orderRaw = formData.get("display_order");
  const displayOrder =
    orderRaw != null && String(orderRaw).trim() !== ""
      ? Number(orderRaw)
      : 0;

  await db.insert(foodGroups).values({
    name,
    displayOrder: Number.isFinite(displayOrder) ? displayOrder : 0,
  });

  revalidatePath("/admin/foods");
  revalidatePath("/admin/foods/food-groups");
}

export async function updateFoodGroup(id: string, formData: FormData) {
  const name = strOrNull(formData.get("name"));
  if (!name) return;

  const orderRaw = formData.get("display_order");
  const displayOrder =
    orderRaw != null && String(orderRaw).trim() !== ""
      ? Number(orderRaw)
      : 0;

  await db
    .update(foodGroups)
    .set({
      name,
      displayOrder: Number.isFinite(displayOrder) ? displayOrder : 0,
    })
    .where(eq(foodGroups.id, id));

  revalidatePath("/admin/foods");
  revalidatePath("/admin/foods/food-groups");
}

export async function deleteFoodGroup(id: string, _formData?: FormData) {
  await db.delete(foodGroups).where(eq(foodGroups.id, id));
  revalidatePath("/admin/foods");
  revalidatePath("/admin/foods/food-groups");
}
