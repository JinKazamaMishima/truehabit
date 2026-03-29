import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  getClientByLinkedUser,
  getClientMealPlans,
} from "@/actions/customer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  UtensilsCrossed,
  CalendarRange,
  FileDown,
  ChevronDown,
  Flame,
  Beef,
  Wheat,
  Droplet,
} from "lucide-react";
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n";

export default async function MealPlansPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const locale = await getLocale();
  const d = await getDictionary(locale);

  const client = await getClientByLinkedUser(session.user.id!);
  if (!client) redirect("/dashboard");

  const mealPlans = await getClientMealPlans(client.id);

  if (mealPlans.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-charcoal">
            {d.dashboard.mealPlans.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {d.dashboard.mealPlans.subtitle}
          </p>
        </div>
        <div className="flex flex-col items-center py-16 text-center">
          <div className="mb-4 rounded-full bg-brand-light p-4">
            <UtensilsCrossed className="size-8 text-brand" />
          </div>
          <p className="text-lg font-semibold text-charcoal">{d.dashboard.mealPlans.noPlans}</p>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {d.dashboard.mealPlans.noPlansMessage}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-charcoal">
          {d.dashboard.mealPlans.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          {d.dashboard.mealPlans.consultMessage}
        </p>
      </div>

      {mealPlans.map((plan) => {
        const statusLabel = d.dashboard.mealPlans.statusLabels[plan.status as keyof typeof d.dashboard.mealPlans.statusLabels];
        const statusVariant = plan.status === "active" ? "default" as const : plan.status === "completed" ? "outline" as const : "secondary" as const;
        return (
          <Card key={plan.id} className="border-0 shadow-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-brand-light/40 to-transparent">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <Badge variant={statusVariant}>{statusLabel ?? plan.status}</Badge>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    {plan.startDate && (
                      <span className="flex items-center gap-1">
                        <CalendarRange className="size-3" />
                        {plan.startDate}
                        {plan.endDate ? ` — ${plan.endDate}` : ""}
                      </span>
                    )}
                    {plan.calorieTarget && (
                      <span className="flex items-center gap-1">
                        <Flame className="size-3" />
                        {plan.calorieTarget}{d.dashboard.mealPlans.kcalSuffix}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 shrink-0"
                  render={
                    <a
                      href={`/api/meal-plans/${plan.id}/pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  <FileDown className="size-4" />
                  {d.dashboard.mealPlans.downloadPdf}
                </Button>
              </div>

              {/* Macro targets */}
              {(plan.proteinGPerKg || plan.carbsGPerKg || plan.fatGPerKg) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {plan.proteinGPerKg && (
                    <Badge variant="secondary" className="gap-1 text-xs font-normal">
                      <Beef className="size-3" />
                      {d.dashboard.mealPlans.proteinLabel}{plan.proteinGPerKg}g/kg
                    </Badge>
                  )}
                  {plan.carbsGPerKg && (
                    <Badge variant="secondary" className="gap-1 text-xs font-normal">
                      <Wheat className="size-3" />
                      {d.dashboard.mealPlans.carbsLabel}{plan.carbsGPerKg}g/kg
                    </Badge>
                  )}
                  {plan.fatGPerKg && (
                    <Badge variant="secondary" className="gap-1 text-xs font-normal">
                      <Droplet className="size-3" />
                      {d.dashboard.mealPlans.fatLabel}{plan.fatGPerKg}g/kg
                    </Badge>
                  )}
                </div>
              )}
            </CardHeader>

            <CardContent className="pt-4">
              {plan.generalRecommendations && (
                <div className="mb-4 rounded-lg bg-muted/50 p-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    {d.dashboard.mealPlans.generalRecommendations}
                  </p>
                  <p className="text-sm text-charcoal">
                    {plan.generalRecommendations}
                  </p>
                </div>
              )}

              {plan.days.length > 0 ? (
                <div className="space-y-4">
                  {plan.days.map((day) => (
                    <details key={day.id} className="group">
                      <summary className="flex cursor-pointer items-center gap-2 rounded-lg border border-border/60 bg-white px-4 py-3 text-sm font-semibold text-charcoal transition-colors hover:bg-muted/30">
                        <ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" />
                        <span>
                          {day.dayLabel ?? `${d.dashboard.mealPlans.dayPrefix}${day.dayNumber}`}
                        </span>
                        {day.dayType && (
                          <Badge variant="outline" className="ml-auto text-xs capitalize">
                            {day.dayType === "training"
                              ? d.dashboard.mealPlans.training
                              : day.dayType === "rest"
                                ? d.dashboard.mealPlans.rest
                                : d.dashboard.mealPlans.competition}
                          </Badge>
                        )}
                      </summary>

                      <div className="mt-2 space-y-2 pl-6">
                        {day.meals.map((meal) => (
                          <div
                            key={meal.id}
                            className="rounded-lg border border-border/40 bg-white p-3"
                          >
                            <p className="text-sm font-semibold text-charcoal">
                              {meal.slotName}
                            </p>

                            {/* Portions */}
                            <div className="mt-1.5 flex flex-wrap gap-2">
                              {meal.cerealPortions && (
                                <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
                                  <Wheat className="size-3" />
                                  {meal.cerealPortions}{d.dashboard.cereal}
                                </span>
                              )}
                              {meal.proteinPortions && (
                                <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-0.5 text-xs text-red-700">
                                  <Beef className="size-3" />
                                  {meal.proteinPortions}{d.dashboard.protein}
                                </span>
                              )}
                              {meal.fatPortions && (
                                <span className="inline-flex items-center gap-1 rounded-md bg-yellow-50 px-2 py-0.5 text-xs text-yellow-700">
                                  <Droplet className="size-3" />
                                  {meal.fatPortions}{d.dashboard.fat}
                                </span>
                              )}
                              {meal.veggiePortions && (
                                <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-0.5 text-xs text-green-700">
                                  🥬 {meal.veggiePortions}{d.dashboard.vegetable}
                                </span>
                              )}
                            </div>

                            {/* Recipe Options */}
                            {meal.options?.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {meal.options.map((opt) => (
                                  <div
                                    key={opt.id}
                                    className="flex items-center gap-2 text-xs text-muted-foreground"
                                  >
                                    <UtensilsCrossed className="size-3 text-brand" />
                                    <span className="font-medium text-charcoal">
                                      {opt.recipe?.name ?? d.dashboard.recipe}
                                    </span>
                                    {opt.isPrimary && (
                                      <Badge className="h-4 text-[10px]">{d.dashboard.mealPlans.primary}</Badge>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            {meal.notes && (
                              <p className="mt-1.5 text-xs italic text-muted-foreground">
                                {meal.notes}
                              </p>
                            )}
                          </div>
                        ))}
                        {day.meals.length === 0 && (
                          <p className="py-3 text-sm text-muted-foreground">
                            {d.dashboard.mealPlans.noMealsForDay}
                          </p>
                        )}
                      </div>
                    </details>
                  ))}
                </div>
              ) : (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  {d.dashboard.mealPlans.noDaysConfigured}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
