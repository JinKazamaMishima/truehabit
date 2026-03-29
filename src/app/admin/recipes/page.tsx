import Link from "next/link";
import { ChefHat, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { db } from "@/lib/db";
import { recipes } from "@/lib/db/schema";
import { and, arrayContains, desc, like } from "drizzle-orm";
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n";

const MEAL_FILTER_VALUES = [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
  "pre_workout",
  "recovery",
] as const;

const MEAL_KEY_MAP: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
  pre_workout: "Pre-workout",
  recovery: "Recovery",
  pre_competition: "Pre-competition",
};

export default async function AdminRecipesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; meal?: string }>;
}) {
  const { q, meal } = await searchParams;
  const locale = await getLocale();
  const d = await getDictionary(locale);
  const mealLabels = d.admin.recipes.mealLabels as Record<string, string>;

  const mealFilter =
    meal && MEAL_FILTER_VALUES.includes(meal as (typeof MEAL_FILTER_VALUES)[number])
      ? meal
      : undefined;

  const conditions = [];
  if (q?.trim()) {
    conditions.push(like(recipes.name, `%${q.trim()}%`));
  }
  if (mealFilter) {
    conditions.push(arrayContains(recipes.mealTypes, [mealFilter]));
  }

  const whereClause =
    conditions.length === 1
      ? conditions[0]
      : conditions.length > 1
        ? and(...conditions)
        : undefined;

  const list = whereClause
    ? await db
        .select()
        .from(recipes)
        .where(whereClause)
        .orderBy(desc(recipes.createdAt))
    : await db.select().from(recipes).orderBy(desc(recipes.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{d.admin.recipes.title}</h1>
          <p className="text-muted-foreground">
            {d.admin.recipes.subtitle}
          </p>
        </div>
        <Button
          className="bg-brand text-white hover:bg-brand-dark"
          render={<Link href="/admin/recipes/new" />}
        >
          <Plus className="size-4" />
          {d.admin.recipes.newRecipe}
        </Button>
      </div>

      <form className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="q"
            placeholder={d.admin.recipes.searchPlaceholder}
            defaultValue={q ?? ""}
            className="pl-9"
          />
        </div>
        <div className="flex w-full flex-col gap-1.5 sm:w-48">
          <label htmlFor="meal" className="text-xs font-medium text-muted-foreground">
            {d.admin.recipes.mealTypeLabel}
          </label>
          <select
            id="meal"
            name="meal"
            defaultValue={meal ?? ""}
            className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">{d.admin.recipes.allMealTypes}</option>
            {MEAL_FILTER_VALUES.map((m) => (
              <option key={m} value={m}>
                {mealLabels[MEAL_KEY_MAP[m]] ?? m}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" variant="secondary" size="sm" className="w-full sm:w-auto">
          {d.admin.recipes.apply}
        </Button>
      </form>

      {list.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
          <ChefHat className="mb-3 size-10 text-muted-foreground/50" />
          <p className="text-sm font-medium text-muted-foreground">
            {q || mealFilter
              ? d.admin.recipes.noMatch
              : d.admin.recipes.noRecipesYet}
          </p>
          {!q && !mealFilter && (
            <Button
              variant="outline"
              className="mt-4"
              render={<Link href="/admin/recipes/new" />}
            >
              <Plus className="size-4" />
              {d.admin.recipes.createFirstRecipe}
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {list.map((recipe) => (
            <Link
              key={recipe.id}
              href={`/admin/recipes/${recipe.id}`}
              className="group block h-full outline-none"
            >
              <Card className="h-full transition-all group-hover:shadow-md group-hover:ring-1 group-hover:ring-brand/25 group-focus-visible:ring-2 group-focus-visible:ring-brand">
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h2 className="font-heading text-base font-semibold leading-snug group-hover:text-brand-dark">
                      {recipe.name}
                    </h2>
                    {recipe.prepTimeMin != null && (
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {recipe.prepTimeMin}{d.admin.recipes.minSuffix}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {(recipe.mealTypes ?? []).length === 0 ? (
                      <Badge variant="outline" className="text-xs font-normal">
                        {d.admin.recipes.anyMeal}
                      </Badge>
                    ) : (
                      recipe.mealTypes!.map((m) => (
                        <Badge
                          key={m}
                          variant="secondary"
                          className="bg-brand/10 text-xs font-normal text-brand-dark dark:bg-brand/10 dark:text-brand"
                        >
                          {mealLabels[MEAL_KEY_MAP[m]] ?? m}
                        </Badge>
                      ))
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {recipe.description?.trim()
                      ? recipe.description
                      : d.admin.recipes.noDescription}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
