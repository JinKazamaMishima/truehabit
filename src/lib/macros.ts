export interface MacroTargets {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export function computeDailyTargets(
  weightKg: number,
  proteinGPerKg: number,
  carbsGPerKg: number,
  fatGPerKg: number
): MacroTargets {
  const proteinG = weightKg * proteinGPerKg;
  const carbsG = weightKg * carbsGPerKg;
  const fatG = weightKg * fatGPerKg;
  const calories = proteinG * 4 + carbsG * 4 + fatG * 9;

  return {
    calories: Math.round(calories),
    proteinG: Math.round(proteinG * 10) / 10,
    carbsG: Math.round(carbsG * 10) / 10,
    fatG: Math.round(fatG * 10) / 10,
  };
}

export interface IngredientMacros {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
}

export function scaleIngredient(
  baseMacros: IngredientMacros,
  baseQty: number,
  targetQty: number
): IngredientMacros {
  if (baseQty === 0) return { calories: 0, proteinG: 0, carbsG: 0, fatG: 0, fiberG: 0 };
  const factor = targetQty / baseQty;
  return {
    calories: Math.round(baseMacros.calories * factor * 10) / 10,
    proteinG: Math.round(baseMacros.proteinG * factor * 10) / 10,
    carbsG: Math.round(baseMacros.carbsG * factor * 10) / 10,
    fatG: Math.round(baseMacros.fatG * factor * 10) / 10,
    fiberG: Math.round(baseMacros.fiberG * factor * 10) / 10,
  };
}

export function sumMacros(items: IngredientMacros[]): IngredientMacros {
  return items.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      proteinG: acc.proteinG + item.proteinG,
      carbsG: acc.carbsG + item.carbsG,
      fatG: acc.fatG + item.fatG,
      fiberG: acc.fiberG + item.fiberG,
    }),
    { calories: 0, proteinG: 0, carbsG: 0, fatG: 0, fiberG: 0 }
  );
}

export function scaleRecipeByPortions(
  ingredients: Array<{
    macros: IngredientMacros;
    baseQty: number;
    ratioGroup: string | null;
  }>,
  portionMultipliers: Record<string, number>
): IngredientMacros {
  const scaled = ingredients.map((ing) => {
    const multiplier =
      ing.ratioGroup && portionMultipliers[ing.ratioGroup]
        ? portionMultipliers[ing.ratioGroup]
        : 1;
    return scaleIngredient(ing.macros, ing.baseQty, ing.baseQty * multiplier);
  });
  return sumMacros(scaled);
}
