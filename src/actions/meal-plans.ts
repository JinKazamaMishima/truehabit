"use server";

import { db } from "@/lib/db";
import {
  mealPlanTemplates,
  mealTemplateSlots,
  slotFoodGroupPortions,
  mealPlans,
  mealPlanDays,
  mealPlanMeals,
  mealOptions,
  supplementProtocols,
  hydrationProtocols,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

// ─── Template Actions ───────────────────────────────────────────────────────

export interface TemplateSlotInput {
  slotName: string;
  dayType: "training" | "rest" | "competition";
  timeRange: string;
  displayOrder: number;
  notes: string;
  foodGroupPortions: { foodGroupId: string; portionCount: string }[];
}

export interface CreateTemplateInput {
  name: string;
  goalType:
    | "fat_loss"
    | "muscle_gain"
    | "weight_cut"
    | "maintenance"
    | "pre_competition"
    | null;
  description: string;
  dayTypes: string[];
  slots: TemplateSlotInput[];
}

export async function createTemplate(data: CreateTemplateInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const [template] = await db
    .insert(mealPlanTemplates)
    .values({
      name: data.name,
      goalType: data.goalType,
      description: data.description || null,
      dayTypes: data.dayTypes,
      createdBy: session.user.id,
    })
    .returning({ id: mealPlanTemplates.id });

  for (const slot of data.slots) {
    const [insertedSlot] = await db
      .insert(mealTemplateSlots)
      .values({
        templateId: template.id,
        dayType: slot.dayType,
        slotName: slot.slotName,
        timeRange: slot.timeRange || null,
        displayOrder: slot.displayOrder,
        notes: slot.notes || null,
      })
      .returning({ id: mealTemplateSlots.id });

    const portions = slot.foodGroupPortions.filter(
      (p) => p.foodGroupId && Number(p.portionCount) > 0
    );
    if (portions.length > 0) {
      await db.insert(slotFoodGroupPortions).values(
        portions.map((p) => ({
          slotId: insertedSlot.id,
          foodGroupId: p.foodGroupId,
          portionCount: p.portionCount,
        }))
      );
    }
  }

  revalidatePath("/admin/meal-plans");
  redirect("/admin/meal-plans");
}

// ─── Meal Plan Actions ──────────────────────────────────────────────────────

export interface MealInput {
  slotName: string;
  cerealPortions: string;
  proteinPortions: string;
  fatPortions: string;
  veggiePortions: string;
  displayOrder: number;
  notes: string;
  recipeIds: string[];
}

export interface DayInput {
  dayNumber: number;
  dayLabel: string;
  dayType: "training" | "rest" | "competition";
  meals: MealInput[];
}

export interface SupplementInput {
  supplementName: string;
  dose: string;
  frequency: string;
  timing: string;
  notes: string;
}

export interface HydrationInput {
  dailyWaterMl: number;
  duringTraining: string;
  electrolyteBrand: string;
  notes: string;
}

export interface CreateMealPlanInput {
  clientId: string;
  templateId: string | null;
  name: string;
  startDate: string;
  endDate: string;
  calorieTarget: number;
  proteinGPerKg: string;
  carbsGPerKg: string;
  fatGPerKg: string;
  generalRecommendations: string;
  days: DayInput[];
  supplements: SupplementInput[];
  hydration: HydrationInput | null;
}

export async function createMealPlan(data: CreateMealPlanInput) {
  const [plan] = await db
    .insert(mealPlans)
    .values({
      clientId: data.clientId,
      templateId: data.templateId || null,
      name: data.name,
      startDate: data.startDate || null,
      endDate: data.endDate || null,
      status: "draft",
      calorieTarget: data.calorieTarget || null,
      proteinGPerKg: data.proteinGPerKg || null,
      carbsGPerKg: data.carbsGPerKg || null,
      fatGPerKg: data.fatGPerKg || null,
      generalRecommendations: data.generalRecommendations || null,
    })
    .returning({ id: mealPlans.id });

  for (const day of data.days) {
    const [insertedDay] = await db
      .insert(mealPlanDays)
      .values({
        mealPlanId: plan.id,
        dayNumber: day.dayNumber,
        dayLabel: day.dayLabel || null,
        dayType: day.dayType,
      })
      .returning({ id: mealPlanDays.id });

    for (const meal of day.meals) {
      const [insertedMeal] = await db
        .insert(mealPlanMeals)
        .values({
          dayId: insertedDay.id,
          slotName: meal.slotName,
          cerealPortions: meal.cerealPortions || null,
          proteinPortions: meal.proteinPortions || null,
          fatPortions: meal.fatPortions || null,
          veggiePortions: meal.veggiePortions || null,
          displayOrder: meal.displayOrder,
          notes: meal.notes || null,
        })
        .returning({ id: mealPlanMeals.id });

      const validRecipeIds = meal.recipeIds.filter(Boolean);
      if (validRecipeIds.length > 0) {
        await db.insert(mealOptions).values(
          validRecipeIds.map((recipeId, idx) => ({
            mealId: insertedMeal.id,
            recipeId,
            displayOrder: idx,
            isPrimary: idx === 0,
          }))
        );
      }
    }
  }

  for (const supp of data.supplements) {
    if (!supp.supplementName) continue;
    await db.insert(supplementProtocols).values({
      clientId: data.clientId,
      mealPlanId: plan.id,
      supplementName: supp.supplementName,
      dose: supp.dose || null,
      frequency: supp.frequency || null,
      timing: supp.timing || null,
      notes: supp.notes || null,
    });
  }

  if (data.hydration) {
    await db.insert(hydrationProtocols).values({
      clientId: data.clientId,
      mealPlanId: plan.id,
      dailyWaterMl: data.hydration.dailyWaterMl || null,
      duringTraining: data.hydration.duringTraining || null,
      electrolyteBrand: data.hydration.electrolyteBrand || null,
      notes: data.hydration.notes || null,
    });
  }

  revalidatePath("/admin/meal-plans");
  redirect(`/admin/meal-plans/${plan.id}`);
}

export async function updateMealPlanStatus(
  id: string,
  status: "draft" | "active" | "completed"
) {
  await db.update(mealPlans).set({ status }).where(eq(mealPlans.id, id));
  revalidatePath(`/admin/meal-plans/${id}`);
  revalidatePath("/admin/meal-plans");
}

export async function deleteMealPlan(id: string) {
  await db.delete(mealPlans).where(eq(mealPlans.id, id));
  revalidatePath("/admin/meal-plans");
  redirect("/admin/meal-plans");
}
