"use client";

import { useState, useTransition } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Droplets,
  Pill,
  UtensilsCrossed,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { computeDailyTargets } from "@/lib/macros";
import {
  createMealPlan,
  type CreateMealPlanInput,
  type DayInput,
  type SupplementInput,
  type HydrationInput,
} from "@/actions/meal-plans";
import { useDictionary } from "@/lib/i18n/context";

interface Client {
  id: string;
  name: string;
}

interface TemplateSlot {
  id: string;
  templateId: string;
  dayType: "training" | "rest" | "competition" | null;
  slotName: string;
  timeRange: string | null;
  displayOrder: number;
  notes: string | null;
}

interface Template {
  id: string;
  name: string;
  goalType: string | null;
  description: string | null;
  dayTypes: string[] | null;
  slots: TemplateSlot[];
}

interface Recipe {
  id: string;
  name: string;
  mealTypes: string[] | null;
}

interface MealState {
  key: string;
  slotName: string;
  cerealPortions: string;
  proteinPortions: string;
  fatPortions: string;
  veggiePortions: string;
  notes: string;
  recipeIds: string[];
}

interface DayState {
  key: string;
  dayNumber: number;
  dayLabel: string;
  dayType: "training" | "rest" | "competition";
  meals: MealState[];
}

function makeMeal(slotName = ""): MealState {
  return {
    key: crypto.randomUUID(),
    slotName,
    cerealPortions: "",
    proteinPortions: "",
    fatPortions: "",
    veggiePortions: "",
    notes: "",
    recipeIds: [],
  };
}

function makeDay(dayNumber: number, dayPrefix: string, defaultSlotNames: string[]): DayState {
  return {
    key: crypto.randomUUID(),
    dayNumber,
    dayLabel: `${dayPrefix} ${dayNumber}`,
    dayType: "training",
    meals: defaultSlotNames.map((name) => makeMeal(name)),
  };
}

function makeSupplement(): SupplementInput {
  return {
    supplementName: "",
    dose: "",
    frequency: "",
    timing: "",
    notes: "",
  };
}

export function PlanBuilderForm({
  clients,
  templates,
  recipes,
}: {
  clients: Client[];
  templates: Template[];
  recipes: Recipe[];
}) {
  const d = useDictionary();
  const b = d.admin.mealPlans.builder;
  const s1 = b.step1;
  const s2 = b.step2;
  const s3 = b.step3;
  const s4 = b.step4;

  const defaultSlotNames = [
    b.defaultSlots.breakfast,
    b.defaultSlots.lunch,
    b.defaultSlots.dinner,
  ];

  const dayTypeLabels: Record<string, string> = {
    training: s3.training,
    rest: s3.rest,
    competition: s3.competition,
  };

  const steps = [
    { label: b.steps.clientTemplate, icon: UtensilsCrossed },
    { label: b.steps.macroTargets, icon: UtensilsCrossed },
    { label: b.steps.daysMeals, icon: UtensilsCrossed },
    { label: b.steps.recommendations, icon: UtensilsCrossed },
  ];

  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState(0);

  // Step 1
  const [clientId, setClientId] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [planName, setPlanName] = useState("");

  // Step 2
  const [proteinGPerKg, setProteinGPerKg] = useState("2.0");
  const [carbsGPerKg, setCarbsGPerKg] = useState("4.0");
  const [fatGPerKg, setFatGPerKg] = useState("1.0");
  const [clientWeight, setClientWeight] = useState("70");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Step 3
  const [days, setDays] = useState<DayState[]>(() => [
    makeDay(1, s3.dayN, defaultSlotNames),
  ]);

  // Step 4
  const [generalRecommendations, setGeneralRecommendations] = useState("");
  const [supplements, setSupplements] = useState<SupplementInput[]>([]);
  const [hydration, setHydration] = useState<HydrationInput>({
    dailyWaterMl: 3000,
    duringTraining: "",
    electrolyteBrand: "",
    notes: "",
  });

  const weight = parseFloat(clientWeight) || 0;
  const macros = computeDailyTargets(
    weight,
    parseFloat(proteinGPerKg) || 0,
    parseFloat(carbsGPerKg) || 0,
    parseFloat(fatGPerKg) || 0
  );

  function applyTemplate(tplId: string) {
    setTemplateId(tplId);
    const tpl = templates.find((t) => t.id === tplId);
    if (!tpl) return;

    const dtypes = tpl.dayTypes ?? ["training"];
    const newDays: DayState[] = dtypes.map((dt, idx) => {
      const slotsForDay = tpl.slots
        .filter((s) => s.dayType === dt)
        .sort((a, b) => a.displayOrder - b.displayOrder);
      return {
        key: crypto.randomUUID(),
        dayNumber: idx + 1,
        dayLabel: dayTypeLabels[dt] ?? dt,
        dayType: dt as DayState["dayType"],
        meals:
          slotsForDay.length > 0
            ? slotsForDay.map((s) => makeMeal(s.slotName))
            : defaultSlotNames.map((name) => makeMeal(name)),
      };
    });
    setDays(newDays);
  }

  function addDay() {
    setDays((prev) => [...prev, makeDay(prev.length + 1, s3.dayN, defaultSlotNames)]);
  }

  function removeDay(key: string) {
    setDays((prev) =>
      prev
        .filter((d) => d.key !== key)
        .map((d, i) => ({ ...d, dayNumber: i + 1 }))
    );
  }

  function updateDay(key: string, field: keyof DayState, value: string) {
    setDays((prev) =>
      prev.map((d) => (d.key === key ? { ...d, [field]: value } : d))
    );
  }

  function addMealToDay(dayKey: string) {
    setDays((prev) =>
      prev.map((d) =>
        d.key === dayKey ? { ...d, meals: [...d.meals, makeMeal()] } : d
      )
    );
  }

  function removeMealFromDay(dayKey: string, mealKey: string) {
    setDays((prev) =>
      prev.map((d) =>
        d.key === dayKey
          ? { ...d, meals: d.meals.filter((m) => m.key !== mealKey) }
          : d
      )
    );
  }

  function updateMeal(
    dayKey: string,
    mealKey: string,
    field: keyof MealState,
    value: string
  ) {
    setDays((prev) =>
      prev.map((d) =>
        d.key === dayKey
          ? {
              ...d,
              meals: d.meals.map((m) =>
                m.key === mealKey ? { ...m, [field]: value } : m
              ),
            }
          : d
      )
    );
  }

  function addRecipeToMeal(dayKey: string, mealKey: string, recipeId: string) {
    if (!recipeId) return;
    setDays((prev) =>
      prev.map((d) =>
        d.key === dayKey
          ? {
              ...d,
              meals: d.meals.map((m) =>
                m.key === mealKey && !m.recipeIds.includes(recipeId)
                  ? { ...m, recipeIds: [...m.recipeIds, recipeId] }
                  : m
              ),
            }
          : d
      )
    );
  }

  function removeRecipeFromMeal(
    dayKey: string,
    mealKey: string,
    recipeId: string
  ) {
    setDays((prev) =>
      prev.map((d) =>
        d.key === dayKey
          ? {
              ...d,
              meals: d.meals.map((m) =>
                m.key === mealKey
                  ? {
                      ...m,
                      recipeIds: m.recipeIds.filter((r) => r !== recipeId),
                    }
                  : m
              ),
            }
          : d
      )
    );
  }

  function addSupplement() {
    setSupplements((prev) => [...prev, makeSupplement()]);
  }

  function removeSupplement(idx: number) {
    setSupplements((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateSupplement(
    idx: number,
    field: keyof SupplementInput,
    value: string
  ) {
    setSupplements((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s))
    );
  }

  function handleSubmit() {
    const data: CreateMealPlanInput = {
      clientId,
      templateId: templateId || null,
      name: planName,
      startDate,
      endDate,
      calorieTarget: macros.calories,
      proteinGPerKg,
      carbsGPerKg,
      fatGPerKg,
      generalRecommendations,
      days: days.map(
        (d): DayInput => ({
          dayNumber: d.dayNumber,
          dayLabel: d.dayLabel,
          dayType: d.dayType,
          meals: d.meals.map((m, mIdx) => ({
            slotName: m.slotName,
            cerealPortions: m.cerealPortions,
            proteinPortions: m.proteinPortions,
            fatPortions: m.fatPortions,
            veggiePortions: m.veggiePortions,
            displayOrder: mIdx,
            notes: m.notes,
            recipeIds: m.recipeIds,
          })),
        })
      ),
      supplements: supplements.filter((s) => s.supplementName.trim()),
      hydration:
        hydration.dailyWaterMl ||
        hydration.duringTraining ||
        hydration.electrolyteBrand
          ? hydration
          : null,
    };

    startTransition(() => {
      createMealPlan(data);
    });
  }

  const canProceed = [
    () => clientId && planName.trim(),
    () => true,
    () => days.length > 0,
    () => true,
  ];

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <nav className="flex items-center gap-2 overflow-x-auto">
        {steps.map((s, i) => (
          <button
            key={i}
            onClick={() => i < step && setStep(i)}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              i === step
                ? "bg-brand text-white"
                : i < step
                  ? "bg-brand/10 text-brand-dark hover:bg-brand/15"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            <span className="flex size-6 items-center justify-center rounded-full border text-xs font-bold">
              {i < step ? <Check className="size-3" /> : i + 1}
            </span>
            <span className="hidden sm:inline">{s.label}</span>
          </button>
        ))}
      </nav>

      {/* Step 1: Client & Template */}
      {step === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{s1.cardTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{s1.client}</Label>
                <Select
                  value={clientId}
                  onValueChange={(v) => setClientId(v ?? "")}
                  items={Object.fromEntries(clients.map((c) => [c.id, c.name]))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={s1.selectClient} />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>
                  {s1.template}{" "}
                  <span className="font-normal text-muted-foreground">
                    ({d.common.optional})
                  </span>
                </Label>
                <Select
                  value={templateId}
                  onValueChange={(v) => v && applyTemplate(v)}
                  items={Object.fromEntries(templates.map((t) => [t.id, t.name]))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={s1.selectTemplate} />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan-name">{s1.planName}</Label>
              <Input
                id="plan-name"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                placeholder={s1.planNamePlaceholder}
                required
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Macro Targets */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>{s2.cardTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="start-date">{s2.startDate}</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">{s2.endDate}</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="client-weight">{s2.clientWeight}</Label>
                <Input
                  id="client-weight"
                  type="number"
                  step="0.1"
                  value={clientWeight}
                  onChange={(e) => setClientWeight(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="protein">{s2.proteinGPerKg}</Label>
                <Input
                  id="protein"
                  type="number"
                  step="0.1"
                  value={proteinGPerKg}
                  onChange={(e) => setProteinGPerKg(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="carbs">{s2.carbsGPerKg}</Label>
                <Input
                  id="carbs"
                  type="number"
                  step="0.1"
                  value={carbsGPerKg}
                  onChange={(e) => setCarbsGPerKg(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fat">{s2.fatGPerKg}</Label>
                <Input
                  id="fat"
                  type="number"
                  step="0.1"
                  value={fatGPerKg}
                  onChange={(e) => setFatGPerKg(e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-lg border bg-brand/10 p-4 dark:bg-brand/10">
              <p className="mb-3 text-sm font-medium text-brand-dark dark:text-brand">
                {s2.computedTargets}
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div>
                  <p className="text-2xl font-bold text-brand-dark dark:text-brand">
                    {macros.calories}
                  </p>
                  <p className="text-xs text-muted-foreground">kcal</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {macros.proteinG}g
                  </p>
                  <p className="text-xs text-muted-foreground">{s2.protein}</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {macros.carbsG}g
                  </p>
                  <p className="text-xs text-muted-foreground">{s2.carbs}</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {macros.fatG}g
                  </p>
                  <p className="text-xs text-muted-foreground">{s2.fat}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Days & Meals */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{s3.cardTitle}</h2>
            <Button variant="outline" size="sm" onClick={addDay}>
              <Plus className="size-4" />
              {s3.addDay}
            </Button>
          </div>

          {days.map((day) => (
            <Card key={day.key}>
              <CardHeader className="flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-base">
                    {s3.dayN} {day.dayNumber}
                  </CardTitle>
                  <Input
                    value={day.dayLabel}
                    onChange={(e) =>
                      updateDay(day.key, "dayLabel", e.target.value)
                    }
                    className="w-40"
                    placeholder={s3.dayLabelPlaceholder}
                  />
                  <Select
                    value={day.dayType}
                    onValueChange={(v) => v && updateDay(day.key, "dayType", v)}
                    items={{ training: s3.training, rest: s3.rest, competition: s3.competition }}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="training">{s3.training}</SelectItem>
                      <SelectItem value="rest">{s3.rest}</SelectItem>
                      <SelectItem value="competition">{s3.competition}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addMealToDay(day.key)}
                  >
                    <Plus className="size-4" />
                    {s3.addMeal}
                  </Button>
                  {days.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive"
                      onClick={() => removeDay(day.key)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {day.meals.map((meal) => (
                  <div
                    key={meal.key}
                    className="space-y-3 rounded-lg border bg-muted/30 p-3"
                  >
                    <div className="flex items-start gap-2">
                      <div className="grid flex-1 gap-3 sm:grid-cols-5">
                        <div className="space-y-1">
                          <Label className="text-xs">{s3.slot}</Label>
                          <Input
                            value={meal.slotName}
                            onChange={(e) =>
                              updateMeal(
                                day.key,
                                meal.key,
                                "slotName",
                                e.target.value
                              )
                            }
                            placeholder={s3.mealNamePlaceholder}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">{s3.cereals}</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.5"
                            value={meal.cerealPortions}
                            onChange={(e) =>
                              updateMeal(
                                day.key,
                                meal.key,
                                "cerealPortions",
                                e.target.value
                              )
                            }
                            placeholder="0"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">{s3.proteins}</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.5"
                            value={meal.proteinPortions}
                            onChange={(e) =>
                              updateMeal(
                                day.key,
                                meal.key,
                                "proteinPortions",
                                e.target.value
                              )
                            }
                            placeholder="0"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">{s3.fats}</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.5"
                            value={meal.fatPortions}
                            onChange={(e) =>
                              updateMeal(
                                day.key,
                                meal.key,
                                "fatPortions",
                                e.target.value
                              )
                            }
                            placeholder="0"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">{s3.veggies}</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.5"
                            value={meal.veggiePortions}
                            onChange={(e) =>
                              updateMeal(
                                day.key,
                                meal.key,
                                "veggiePortions",
                                e.target.value
                              )
                            }
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="mt-5 text-destructive"
                        onClick={() => removeMealFromDay(day.key, meal.key)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs">{s3.mealNotes}</Label>
                      <Input
                        value={meal.notes}
                        onChange={(e) =>
                          updateMeal(
                            day.key,
                            meal.key,
                            "notes",
                            e.target.value
                          )
                        }
                        placeholder={s3.mealNotesPlaceholder}
                      />
                    </div>

                    {/* Recipe selector */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-xs">{s3.recipeOptions}</Label>
                        <Select
                          onValueChange={(v) =>
                            v && addRecipeToMeal(day.key, meal.key, v as string)
                          }
                          items={Object.fromEntries(recipes.map((r) => [r.id, r.name]))}
                        >
                          <SelectTrigger className="h-7 w-48 text-xs">
                            <SelectValue placeholder={s3.addRecipe} />
                          </SelectTrigger>
                          <SelectContent>
                            {recipes
                              .filter(
                                (r) => !meal.recipeIds.includes(r.id)
                              )
                              .map((r) => (
                                <SelectItem key={r.id} value={r.id}>
                                  {r.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {meal.recipeIds.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {meal.recipeIds.map((rid) => {
                            const recipe = recipes.find((r) => r.id === rid);
                            return (
                              <Badge
                                key={rid}
                                variant="secondary"
                                className="gap-1 pr-1"
                              >
                                {recipe?.name ?? rid}
                                <button
                                  className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
                                  onClick={() =>
                                    removeRecipeFromMeal(
                                      day.key,
                                      meal.key,
                                      rid
                                    )
                                  }
                                >
                                  <Trash2 className="size-3" />
                                </button>
                              </Badge>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {day.meals.length === 0 && (
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    {s3.noMeals}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Step 4: Recommendations */}
      {step === 3 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{s4.cardTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={generalRecommendations}
                onChange={(e) => setGeneralRecommendations(e.target.value)}
                rows={5}
                placeholder={s4.placeholder}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Pill className="size-4 text-brand" />
                {s4.supplements}
              </CardTitle>
              <Button variant="outline" size="sm" onClick={addSupplement}>
                <Plus className="size-4" />
                {d.common.add}
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {supplements.length === 0 && (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  {s4.noSupplements}
                </p>
              )}
              {supplements.map((supp, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 rounded-lg border bg-muted/30 p-3"
                >
                  <div className="grid flex-1 gap-3 sm:grid-cols-4">
                    <div className="space-y-1">
                      <Label className="text-xs">{s4.supplementName}</Label>
                      <Input
                        value={supp.supplementName}
                        onChange={(e) =>
                          updateSupplement(idx, "supplementName", e.target.value)
                        }
                        placeholder={s4.supplementNamePlaceholder}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">{s4.dose}</Label>
                      <Input
                        value={supp.dose}
                        onChange={(e) =>
                          updateSupplement(idx, "dose", e.target.value)
                        }
                        placeholder={s4.dosePlaceholder}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">{s4.frequency}</Label>
                      <Input
                        value={supp.frequency}
                        onChange={(e) =>
                          updateSupplement(idx, "frequency", e.target.value)
                        }
                        placeholder={s4.frequencyPlaceholder}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">{s4.timing}</Label>
                      <Input
                        value={supp.timing}
                        onChange={(e) =>
                          updateSupplement(idx, "timing", e.target.value)
                        }
                        placeholder={s4.timingPlaceholder}
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="mt-5 text-destructive"
                    onClick={() => removeSupplement(idx)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="size-4 text-blue-600" />
                {s4.hydration}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="daily-water">{s4.dailyWater}</Label>
                  <Input
                    id="daily-water"
                    type="number"
                    min="0"
                    step="100"
                    value={hydration.dailyWaterMl}
                    onChange={(e) =>
                      setHydration((prev) => ({
                        ...prev,
                        dailyWaterMl: parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="electrolyte-brand">{s4.electrolyteBrand}</Label>
                  <Input
                    id="electrolyte-brand"
                    value={hydration.electrolyteBrand}
                    onChange={(e) =>
                      setHydration((prev) => ({
                        ...prev,
                        electrolyteBrand: e.target.value,
                      }))
                    }
                    placeholder={s4.electrolytePlaceholder}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="during-training">{s4.duringTraining}</Label>
                <Textarea
                  id="during-training"
                  value={hydration.duringTraining}
                  onChange={(e) =>
                    setHydration((prev) => ({
                      ...prev,
                      duringTraining: e.target.value,
                    }))
                  }
                  rows={2}
                  placeholder={s4.duringTrainingPlaceholder}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hydration-notes">{s4.hydrationNotes}</Label>
                <Textarea
                  id="hydration-notes"
                  value={hydration.notes}
                  onChange={(e) =>
                    setHydration((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  rows={2}
                  placeholder={s4.hydrationNotesPlaceholder}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between border-t pt-4">
        <Button
          variant="outline"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
        >
          <ChevronLeft className="size-4" />
          {d.common.back}
        </Button>
        <div className="flex gap-2">
          {step < steps.length - 1 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed[step]()}
            >
              {d.common.next}
              <ChevronRight className="size-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isPending || !clientId || !planName.trim()}
              className="bg-brand hover:bg-brand-dark"
            >
              {isPending ? d.common.saving : b.createMealPlan}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
