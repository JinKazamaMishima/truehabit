import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PrintButton } from "./_print-button";
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
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n";

export default async function ExportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locale = await getLocale();
  const d = await getDictionary(locale);
  const ex = d.admin.mealPlans.export;
  const dt = d.admin.mealPlans.detail;

  const plan = await db.query.mealPlans.findFirst({
    where: eq(mealPlans.id, id),
    with: {
      client: true,
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

  const allRecipes = await db
    .select({ id: recipes.id, name: recipes.name })
    .from(recipes);
  const recipeMap = Object.fromEntries(allRecipes.map((r) => [r.id, r.name]));

  const sortedDays = [...plan.days].sort((a, b) => a.dayNumber - b.dayNumber);

  return (
    <div className="mx-auto max-w-4xl space-y-6 print:max-w-none print:space-y-4">
      <div className="flex items-center gap-3 print:hidden">
        <Button
          variant="ghost"
          size="icon"
          render={<Link href={`/admin/meal-plans/${id}`} />}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{ex.title}</h1>
          <p className="text-muted-foreground">
            {ex.subtitle}
          </p>
        </div>
        <Button
          className="gap-2"
          render={<a href={`/api/meal-plans/${id}/pdf`} />}
        >
          <Download className="size-4" />
          {ex.downloadPdf}
        </Button>
        <PrintButton />
      </div>

      {/* Print header */}
      <div className="rounded-lg border bg-brand/10 p-6 dark:bg-brand/10">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-brand-dark dark:text-brand">
              {plan.name}
            </h2>
            <p className="mt-1 text-sm text-brand dark:text-brand">
              {ex.clientLabel} {plan.client?.name ?? d.common.emDash}
            </p>
            {plan.startDate && plan.endDate && (
              <p className="text-sm text-brand/70 dark:text-brand/70">
                {plan.startDate} → {plan.endDate}
              </p>
            )}
          </div>
          <div className="text-right">
            {plan.calorieTarget && (
              <p className="text-2xl font-bold text-brand-dark dark:text-brand">
                {plan.calorieTarget} kcal
              </p>
            )}
            <div className="mt-1 flex gap-3 text-sm text-brand dark:text-brand">
              {plan.proteinGPerKg && <span>{ex.macroP} {plan.proteinGPerKg} g/kg</span>}
              {plan.carbsGPerKg && <span>{ex.macroC} {plan.carbsGPerKg} g/kg</span>}
              {plan.fatGPerKg && <span>{ex.macroF} {plan.fatGPerKg} g/kg</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Days */}
      {sortedDays.map((day) => {
        const sortedMeals = [...day.meals].sort(
          (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
        );
        return (
          <Card key={day.id} className="print:break-inside-avoid">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                {day.dayLabel ?? `Day ${day.dayNumber}`}
                {day.dayType && (
                  <Badge variant="outline" className="capitalize">
                    {day.dayType}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{dt.mealHeaders.meal}</TableHead>
                      <TableHead className="text-center">{dt.mealHeaders.cereals}</TableHead>
                      <TableHead className="text-center">{dt.mealHeaders.proteins}</TableHead>
                      <TableHead className="text-center">{dt.mealHeaders.fats}</TableHead>
                      <TableHead className="text-center">{dt.mealHeaders.veggies}</TableHead>
                      <TableHead>{dt.mealHeaders.recipes}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedMeals.map((meal) => (
                      <TableRow key={meal.id}>
                        <TableCell className="font-medium">
                          {meal.slotName}
                        </TableCell>
                        <TableCell className="text-center">
                          {meal.cerealPortions ?? d.common.emDash}
                        </TableCell>
                        <TableCell className="text-center">
                          {meal.proteinPortions ?? d.common.emDash}
                        </TableCell>
                        <TableCell className="text-center">
                          {meal.fatPortions ?? d.common.emDash}
                        </TableCell>
                        <TableCell className="text-center">
                          {meal.veggiePortions ?? d.common.emDash}
                        </TableCell>
                        <TableCell>
                          {meal.options.length > 0
                            ? meal.options
                                .map(
                                  (o) => recipeMap[o.recipeId] ?? dt.unknown
                                )
                                .join(", ")
                            : d.common.emDash}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Supplements */}
      {plan.supplementProtocols.length > 0 && (
        <Card className="print:break-inside-avoid">
          <CardHeader>
            <CardTitle>{dt.supplements}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{dt.supplementHeaders.supplement}</TableHead>
                    <TableHead>{dt.supplementHeaders.dose}</TableHead>
                    <TableHead>{dt.supplementHeaders.frequency}</TableHead>
                    <TableHead>{dt.supplementHeaders.timing}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plan.supplementProtocols.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">
                        {s.supplementName}
                      </TableCell>
                      <TableCell>{s.dose ?? d.common.emDash}</TableCell>
                      <TableCell>{s.frequency ?? d.common.emDash}</TableCell>
                      <TableCell>{s.timing ?? d.common.emDash}</TableCell>
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
        <Card className="print:break-inside-avoid">
          <CardHeader>
            <CardTitle>{dt.hydration}</CardTitle>
          </CardHeader>
          <CardContent>
            {plan.hydrationProtocols.map((h) => (
              <div key={h.id} className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">{dt.dailyWater}</p>
                  <p className="font-medium">
                    {h.dailyWaterMl ? `${h.dailyWaterMl} mL` : d.common.emDash}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    {dt.electrolyteBrand}
                  </p>
                  <p className="font-medium">{h.electrolyteBrand ?? d.common.emDash}</p>
                </div>
                {h.duringTraining && (
                  <div className="sm:col-span-2">
                    <p className="text-xs text-muted-foreground">
                      {dt.duringTraining}
                    </p>
                    <p className="text-sm">{h.duringTraining}</p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* General recommendations */}
      {plan.generalRecommendations && (
        <Card className="print:break-inside-avoid">
          <CardHeader>
            <CardTitle>{dt.generalRecommendations}</CardTitle>
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
