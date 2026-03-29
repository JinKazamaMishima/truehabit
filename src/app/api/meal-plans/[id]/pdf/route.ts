import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  MealPlanPdfDocument,
  type MealPlanPdfData,
  type MealPlanPdfDay,
  type MealPlanPdfHydration,
  type MealPlanPdfIngredient,
  type MealPlanPdfMeal,
  type MealPlanPdfMealOption,
  type MealPlanPdfMeasurement,
  type MealPlanPdfRecipe,
  type MealPlanPdfSupplement,
} from "@/components/pdf/meal-plan-pdf";
import { clientMeasurements, mealPlans } from "@/lib/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import { NextResponse } from "next/server";
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function mapIngredient(row: {
  name: string | null;
  baseQty: string | null;
  servingUnit: string | null;
  ratioGroup: string | null;
  isOptional: boolean | null;
  notes: string | null;
  displayOrder: number | null;
}): MealPlanPdfIngredient & { sort: number } {
  return {
    name: row.name,
    baseQty: row.baseQty,
    servingUnit: row.servingUnit,
    ratioGroup: row.ratioGroup,
    isOptional: row.isOptional,
    notes: row.notes,
    sort: row.displayOrder ?? 0,
  };
}

function mapRecipe(r: {
  name: string;
  description: string | null;
  prepInstructions: string | null;
  ingredients: Array<Parameters<typeof mapIngredient>[0]>;
}): MealPlanPdfRecipe {
  const ingredients = [...r.ingredients]
    .map(mapIngredient)
    .sort((a, b) => a.sort - b.sort)
    .map(({ sort: _s, ...ing }) => ing);
  return {
    name: r.name,
    description: r.description,
    prepInstructions: r.prepInstructions,
    ingredients,
  };
}

function mapMealOption(o: {
  displayOrder?: number | null;
  isPrimary: boolean | null;
  recipe: {
    name: string;
    description: string | null;
    prepInstructions: string | null;
    ingredients: Array<Parameters<typeof mapIngredient>[0]>;
  };
}): MealPlanPdfMealOption & { sort: number } {
  return {
    isPrimary: Boolean(o.isPrimary),
    recipe: mapRecipe(o.recipe),
    sort: o.displayOrder ?? 0,
  };
}

function mapMeal(m: {
  slotName: string;
  cerealPortions: string | null;
  proteinPortions: string | null;
  fatPortions: string | null;
  veggiePortions: string | null;
  notes: string | null;
  displayOrder: number | null;
  options: Array<Parameters<typeof mapMealOption>[0]>;
}): MealPlanPdfMeal & { sort: number } {
  const options = [...m.options]
    .map(mapMealOption)
    .sort((a, b) => a.sort - b.sort)
    .map(({ sort: _s, ...opt }) => opt);
  return {
    slotName: m.slotName,
    cerealPortions: m.cerealPortions,
    proteinPortions: m.proteinPortions,
    fatPortions: m.fatPortions,
    veggiePortions: m.veggiePortions,
    notes: m.notes,
    options,
    sort: m.displayOrder ?? 0,
  };
}

function mapDay(d: {
  dayNumber: number;
  dayLabel: string | null;
  dayType: string | null;
  meals: Array<Parameters<typeof mapMeal>[0]>;
}): MealPlanPdfDay {
  const meals = [...d.meals]
    .map(mapMeal)
    .sort((a, b) => a.sort - b.sort)
    .map(({ sort: _s, ...meal }) => meal);
  return {
    dayNumber: d.dayNumber,
    dayLabel: d.dayLabel,
    dayType: d.dayType,
    meals,
  };
}

function mapMeasurement(row: {
  date: string;
  weightKg: string | null;
  heightCm: string | null;
  bmi: string | null;
  bodyFatPct: string | null;
  fatKg: string | null;
  muscleMassPct: string | null;
  muscleKg: string | null;
  visceralFat: string | null;
}): MealPlanPdfMeasurement {
  return {
    date: row.date,
    weightKg: row.weightKg,
    heightCm: row.heightCm,
    bmi: row.bmi,
    bodyFatPct: row.bodyFatPct,
    fatKg: row.fatKg,
    muscleMassPct: row.muscleMassPct,
    muscleKg: row.muscleKg,
    visceralFat: row.visceralFat,
  };
}

function safeFilename(name: string): string {
  const base = name
    .replace(/[^\w\s-áéíóúñüÁÉÍÓÚÑÜ]/gi, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
  return base || "esquema-alimentacion";
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const plan = await db.query.mealPlans.findFirst({
    where: eq(mealPlans.id, id),
    with: {
      client: true,
      days: {
        orderBy: (d, { asc: ascOp }) => [ascOp(d.dayNumber)],
        with: {
          meals: {
            orderBy: (m, { asc: ascOp }) => [
              ascOp(m.displayOrder),
              ascOp(m.slotName),
            ],
            with: {
              options: {
                orderBy: (o, { asc: ascOp }) => [ascOp(o.displayOrder)],
                with: {
                  recipe: {
                    with: {
                      ingredients: {
                        orderBy: (ing, { asc: ascOp }) => [
                          ascOp(ing.displayOrder),
                          ascOp(ing.name),
                        ],
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      supplementProtocols: true,
      hydrationProtocols: true,
    },
  });

  if (!plan || !plan.client) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const [latestMeasurement] = await db
    .select()
    .from(clientMeasurements)
    .where(eq(clientMeasurements.clientId, plan.clientId))
    .orderBy(desc(clientMeasurements.date), asc(clientMeasurements.id))
    .limit(1);

  const days: MealPlanPdfDay[] = [...plan.days]
    .sort((a, b) => a.dayNumber - b.dayNumber)
    .map(mapDay);

  const supplements: MealPlanPdfSupplement[] = plan.supplementProtocols.map(
    (s) => ({
      supplementName: s.supplementName,
      dose: s.dose,
      frequency: s.frequency,
      timing: s.timing,
      notes: s.notes,
    })
  );

  const hydration: MealPlanPdfHydration[] = plan.hydrationProtocols.map(
    (h) => ({
      dailyWaterMl: h.dailyWaterMl,
      duringTraining: h.duringTraining,
      electrolyteBrand: h.electrolyteBrand,
      notes: h.notes,
    })
  );

  const data: MealPlanPdfData = {
    planName: plan.name,
    clientName: plan.client.name,
    clientGoal: plan.client.goal,
    calorieTarget: plan.calorieTarget,
    proteinGPerKg: plan.proteinGPerKg,
    carbsGPerKg: plan.carbsGPerKg,
    fatGPerKg: plan.fatGPerKg,
    generalRecommendations: plan.generalRecommendations,
    days,
    supplements,
    hydration,
    measurement: latestMeasurement
      ? mapMeasurement(latestMeasurement)
      : null,
  };

  const locale = await getLocale();
  const dict = await getDictionary(locale);

  const buffer = await renderToBuffer(
    createElement(MealPlanPdfDocument, { data, labels: dict.pdf }) as Parameters<
      typeof renderToBuffer
    >[0]
  );

  const filename = `${safeFilename(plan.name)}.pdf`;

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
