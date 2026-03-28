import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  FileDown,
  Trash2,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import { mealPlans, recipes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { updateMealPlanStatus, deleteMealPlan } from "@/actions/meal-plans";

const statusStyles: Record<string, string> = {
  draft: "bg-amber-100 text-amber-700",
  active: "bg-brand/15 text-brand-dark",
  completed: "bg-slate-100 text-slate-700",
};

export default async function MealPlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const plan = await db.query.mealPlans.findFirst({
    where: eq(mealPlans.id, id),
    with: {
      client: true,
      template: true,
      days: {
        with: {
          meals: {
            with: {
              options: true,
            },
          },
        },
      },
      supplementProtocols: true,
      hydrationProtocols: true,
    },
  });

  if (!plan) notFound();

  const recipeIds = plan.days
    .flatMap((d) => d.meals.flatMap((m) => m.options.map((o) => o.recipeId)))
    .filter(Boolean);

  let recipeMap: Record<string, string> = {};
  if (recipeIds.length > 0) {
    const allRecipes = await db
      .select({ id: recipes.id, name: recipes.name })
      .from(recipes);
    recipeMap = Object.fromEntries(allRecipes.map((r) => [r.id, r.name]));
  }

  const sortedDays = [...plan.days].sort((a, b) => a.dayNumber - b.dayNumber);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          render={<Link href="/admin/meal-plans" />}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{plan.name}</h1>
          <p className="text-muted-foreground">
            {plan.client?.name ?? "Unknown client"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            render={<Link href={`/admin/meal-plans/${id}/export`} />}
          >
            <FileDown className="size-4" />
            Export
          </Button>
          <form
            action={async () => {
              "use server";
              await deleteMealPlan(id);
            }}
          >
            <Button variant="destructive" size="sm" type="submit">
              <Trash2 className="size-4" />
              Delete
            </Button>
          </form>
        </div>
      </div>

      {/* Overview cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card size="sm">
          <CardContent className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/30">
              <User className="size-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Client</p>
              <p className="font-medium">{plan.client?.name ?? "—"}</p>
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="flex items-center gap-3">
            <div className="rounded-lg bg-brand/10 p-2 text-brand dark:bg-brand/10">
              <Calendar className="size-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Date Range</p>
              <p className="font-medium">
                {plan.startDate && plan.endDate
                  ? `${plan.startDate} → ${plan.endDate}`
                  : "Not set"}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent>
            <p className="text-xs text-muted-foreground">Status</p>
            <div className="mt-1 flex items-center gap-2">
              <Badge
                variant="secondary"
                className={statusStyles[plan.status] ?? ""}
              >
                {plan.status}
              </Badge>
              <StatusToggle planId={id} currentStatus={plan.status} />
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent>
            <p className="text-xs text-muted-foreground">Calorie Target</p>
            <p className="text-2xl font-bold text-brand">
              {plan.calorieTarget ?? "—"}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                kcal
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Macro targets */}
      {(plan.proteinGPerKg || plan.carbsGPerKg || plan.fatGPerKg) && (
        <Card>
          <CardHeader>
            <CardTitle>Macro Targets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-bold">{plan.proteinGPerKg ?? "—"}</p>
                <p className="text-xs text-muted-foreground">
                  Protein (g/kg)
                </p>
              </div>
              <div>
                <p className="text-lg font-bold">{plan.carbsGPerKg ?? "—"}</p>
                <p className="text-xs text-muted-foreground">Carbs (g/kg)</p>
              </div>
              <div>
                <p className="text-lg font-bold">{plan.fatGPerKg ?? "—"}</p>
                <p className="text-xs text-muted-foreground">Fat (g/kg)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Days & Meals */}
      {sortedDays.map((day) => {
        const sortedMeals = [...day.meals].sort(
          (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
        );
        return (
          <Card key={day.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {day.dayLabel ?? `Day ${day.dayNumber}`}
                {day.dayType && (
                  <Badge variant="outline" className="capitalize">
                    {day.dayType}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sortedMeals.length === 0 ? (
                <p className="text-sm text-muted-foreground">No meals.</p>
              ) : (
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Meal</TableHead>
                        <TableHead className="text-center">Cereals</TableHead>
                        <TableHead className="text-center">Proteins</TableHead>
                        <TableHead className="text-center">Fats</TableHead>
                        <TableHead className="text-center">Veggies</TableHead>
                        <TableHead>Recipes</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedMeals.map((meal) => (
                        <TableRow key={meal.id}>
                          <TableCell className="font-medium">
                            {meal.slotName}
                          </TableCell>
                          <TableCell className="text-center">
                            {meal.cerealPortions ?? "—"}
                          </TableCell>
                          <TableCell className="text-center">
                            {meal.proteinPortions ?? "—"}
                          </TableCell>
                          <TableCell className="text-center">
                            {meal.fatPortions ?? "—"}
                          </TableCell>
                          <TableCell className="text-center">
                            {meal.veggiePortions ?? "—"}
                          </TableCell>
                          <TableCell>
                            {meal.options.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {meal.options.map((opt) => (
                                  <Badge
                                    key={opt.id}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {recipeMap[opt.recipeId] ?? "Unknown"}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate text-muted-foreground">
                            {meal.notes ?? "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {/* Supplements */}
      {plan.supplementProtocols.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Supplements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplement</TableHead>
                    <TableHead>Dose</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Timing</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plan.supplementProtocols.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">
                        {s.supplementName}
                      </TableCell>
                      <TableCell>{s.dose ?? "—"}</TableCell>
                      <TableCell>{s.frequency ?? "—"}</TableCell>
                      <TableCell>{s.timing ?? "—"}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {s.notes ?? "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hydration */}
      {plan.hydrationProtocols.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Hydration</CardTitle>
          </CardHeader>
          <CardContent>
            {plan.hydrationProtocols.map((h) => (
              <div key={h.id} className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Daily Water</p>
                  <p className="font-medium">
                    {h.dailyWaterMl ? `${h.dailyWaterMl} mL` : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Electrolyte Brand
                  </p>
                  <p className="font-medium">{h.electrolyteBrand ?? "—"}</p>
                </div>
                {h.duringTraining && (
                  <div className="sm:col-span-2">
                    <p className="text-xs text-muted-foreground">
                      During Training
                    </p>
                    <p className="text-sm">{h.duringTraining}</p>
                  </div>
                )}
                {h.notes && (
                  <div className="sm:col-span-2">
                    <p className="text-xs text-muted-foreground">Notes</p>
                    <p className="text-sm">{h.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* General recommendations */}
      {plan.generalRecommendations && (
        <Card>
          <CardHeader>
            <CardTitle>General Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm">
              {plan.generalRecommendations}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatusToggle({
  planId,
  currentStatus,
}: {
  planId: string;
  currentStatus: string;
}) {
  const nextStatusMap: Record<string, { label: string; value: string }> = {
    draft: { label: "Activate", value: "active" },
    active: { label: "Complete", value: "completed" },
    completed: { label: "Reopen", value: "draft" },
  };

  const next = nextStatusMap[currentStatus];
  if (!next) return null;

  return (
    <form
      action={async () => {
        "use server";
        await updateMealPlanStatus(
          planId,
          next.value as "draft" | "active" | "completed"
        );
      }}
    >
      <Button variant="outline" size="xs" type="submit">
        {next.label}
      </Button>
    </form>
  );
}
