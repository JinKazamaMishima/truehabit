"use client";

import Link from "next/link";
import { useCallback, useMemo, useState, useTransition } from "react";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { ArrowLeft, ChevronDown, Plus, Trash2, X, ImageIcon } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  createRecipe,
  deleteRecipe,
  updateRecipe,
  type RecipeIngredientInput,
  type RecipeSavePayload,
} from "@/actions/recipes";
import {
  scaleIngredient,
  sumMacros,
  type IngredientMacros,
} from "@/lib/macros";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useDictionary } from "@/lib/i18n/context";

export type FoodOption = {
  id: string;
  name: string;
  baseServingQty: string | null;
  baseServingUnit: string | null;
  calories: string | null;
  proteinG: string | null;
  carbsG: string | null;
  fatG: string | null;
  fiberG: string | null;
};

const MEAL_TYPE_VALUES = [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
  "pre_workout",
  "recovery",
  "pre_competition",
] as const;

const MEAL_LABEL_KEYS: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
  pre_workout: "Pre-workout",
  recovery: "Recovery",
  pre_competition: "Pre-competition",
};

const RATIO_VALUES = ["none", "cereales", "proteinas", "grasas", "vegetales", "frutas"] as const;

type IngredientRow = {
  key: string;
  foodId: string | null;
  name: string;
  baseQty: string;
  servingUnit: string;
  ratioGroup: string;
  isOptional: boolean;
};

function newRow(): IngredientRow {
  return {
    key: crypto.randomUUID(),
    foodId: null,
    name: "",
    baseQty: "",
    servingUnit: "",
    ratioGroup: "none",
    isOptional: false,
  };
}

function parseNum(s: string | null | undefined): number {
  if (s == null || s === "") return 0;
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

function foodToMacros(food: FoodOption): IngredientMacros {
  return {
    calories: parseNum(food.calories),
    proteinG: parseNum(food.proteinG),
    carbsG: parseNum(food.carbsG),
    fatG: parseNum(food.fatG),
    fiberG: parseNum(food.fiberG),
  };
}

type RecipeFormProps =
  | {
      mode: "create";
      foods: FoodOption[];
      recipeId?: undefined;
      initialRecipe?: undefined;
    }
  | {
      mode: "edit";
      recipeId: string;
      foods: FoodOption[];
      initialRecipe: {
        name: string;
        description: string;
        prepInstructions: string;
        prepTimeMin: number | null;
        mealTypes: string[];
        imageUrl?: string | null;
        ingredients: Omit<IngredientRow, "key">[];
        tags: string[];
      };
    };

export function RecipeForm(props: RecipeFormProps) {
  const { mode, foods } = props;
  const d = useDictionary();
  const f = d.admin.recipes.form;
  const mealLabels = d.admin.recipes.mealLabels as Record<string, string>;
  const ratioGroups = f.ratioGroups as Record<string, string>;

  const foodById = useMemo(() => new Map(foods.map((f) => [f.id, f])), [foods]);

  const [name, setName] = useState(props.initialRecipe?.name ?? "");
  const [description, setDescription] = useState(
    props.initialRecipe?.description ?? ""
  );
  const [prepInstructions, setPrepInstructions] = useState(
    props.initialRecipe?.prepInstructions ?? ""
  );
  const [prepTimeMin, setPrepTimeMin] = useState(
    props.initialRecipe?.prepTimeMin != null
      ? String(props.initialRecipe.prepTimeMin)
      : ""
  );
  const [imageUrl, setImageUrl] = useState(
    props.initialRecipe?.imageUrl ?? ""
  );
  const [mealTypes, setMealTypes] = useState<string[]>(
    props.initialRecipe?.mealTypes ?? []
  );
  const [ingredients, setIngredients] = useState<IngredientRow[]>(() => {
    const initial = props.initialRecipe?.ingredients;
    if (initial && initial.length > 0) {
      return initial.map((row) => ({
        ...row,
        key: crypto.randomUUID(),
        ratioGroup: row.ratioGroup || "none",
      }));
    }
    return [newRow()];
  });
  const [tags, setTags] = useState<string[]>(
    props.initialRecipe?.tags ?? []
  );
  const [tagInput, setTagInput] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const toggleMealType = (value: string) => {
    setMealTypes((prev) =>
      prev.includes(value) ? prev.filter((m) => m !== value) : [...prev, value]
    );
  };

  const macroPreview = useMemo(() => {
    const items: IngredientMacros[] = [];
    for (const row of ingredients) {
      if (!row.foodId) continue;
      const food = foodById.get(row.foodId);
      if (!food) continue;
      const qty = parseNum(row.baseQty);
      if (qty <= 0) continue;
      const baseRef = parseNum(food.baseServingQty);
      if (baseRef <= 0) continue;
      const baseMacros = foodToMacros(food);
      items.push(scaleIngredient(baseMacros, baseRef, qty));
    }
    if (items.length === 0) return null;
    return sumMacros(items);
  }, [ingredients, foodById]);

  const addTagFromInput = useCallback(() => {
    const parts = tagInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (parts.length === 0) return;
    setTags((prev) => [...new Set([...prev, ...parts])]);
    setTagInput("");
  }, [tagInput]);

  const buildPayload = (): RecipeSavePayload => {
    const ptm = prepTimeMin.trim() === "" ? null : Number(prepTimeMin);
    const ingredientsPayload: RecipeIngredientInput[] = ingredients.map(
      (row) => ({
        foodId: row.foodId,
        name: row.name,
        baseQty: row.baseQty,
        servingUnit: row.servingUnit,
        ratioGroup: row.ratioGroup,
        isOptional: row.isOptional,
      })
    );

    return {
      name,
      description,
      prepInstructions,
      prepTimeMin:
        ptm !== null && Number.isFinite(ptm) ? Math.max(0, ptm) : null,
      mealTypes,
      imageUrl: imageUrl.trim() || null,
      ingredients: ingredientsPayload,
      tags,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const payload = buildPayload();
    startTransition(async () => {
      try {
        if (mode === "create") {
          await createRecipe(payload);
        } else {
          await updateRecipe(props.recipeId, payload);
        }
      } catch (err) {
        if (isRedirectError(err)) throw err;
        setFormError(
          err instanceof Error ? err.message : f.somethingWrong
        );
      }
    });
  };

  const handleDelete = () => {
    if (mode !== "edit") return;
    if (!confirm(f.deleteConfirm)) {
      return;
    }
    setFormError(null);
    startTransition(async () => {
      try {
        await deleteRecipe(props.recipeId);
      } catch (err) {
        if (isRedirectError(err)) throw err;
        setFormError(
          err instanceof Error ? err.message : f.couldNotDelete
        );
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-1 text-muted-foreground"
          render={<Link href="/admin/recipes" />}
        >
          <ArrowLeft className="size-4" />
          {f.recipesButton}
        </Button>
      </div>

      {formError && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {formError}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{f.basicsCard}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipe-name">{f.name}</Label>
            <Input
              id="recipe-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={f.namePlaceholder}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recipe-desc">{f.description}</Label>
            <Textarea
              id="recipe-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder={f.descriptionPlaceholder}
            />
          </div>
          <div className="space-y-2">
            <Label>{f.recipeImage}</Label>
            <ImageUpload
              folder="recipes"
              currentUrl={imageUrl || undefined}
              onUpload={(_key, proxyUrl) => setImageUrl(proxyUrl)}
              onRemove={() => setImageUrl("")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recipe-prep">{f.prepInstructions}</Label>
            <Textarea
              id="recipe-prep"
              value={prepInstructions}
              onChange={(e) => setPrepInstructions(e.target.value)}
              rows={4}
              placeholder={f.prepInstructionsPlaceholder}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="prep-time">{f.prepTime}</Label>
              <Input
                id="prep-time"
                type="number"
                min={0}
                step={1}
                value={prepTimeMin}
                onChange={(e) => setPrepTimeMin(e.target.value)}
                placeholder={d.common.optional}
              />
            </div>
          </div>
          <div className="space-y-3">
            <Label>{f.mealTypes}</Label>
            <div className="grid gap-3 sm:grid-cols-2">
              {MEAL_TYPE_VALUES.map((value) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-center gap-2 text-sm"
                >
                  <Checkbox
                    checked={mealTypes.includes(value)}
                    onCheckedChange={() => toggleMealType(value)}
                    className="data-checked:border-brand data-checked:bg-brand data-checked:text-white"
                  />
                  <span>{mealLabels[MEAL_LABEL_KEYS[value]] ?? value}</span>
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle>{f.ingredientsCard}</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIngredients((prev) => [...prev, newRow()])}
          >
            <Plus className="size-4" />
            {f.addIngredient}
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {ingredients.map((row, index) => (
            <div
              key={row.key}
              className="rounded-lg border border-border/80 bg-muted/20 p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {f.ingredientN} {index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-destructive hover:text-destructive"
                  disabled={ingredients.length <= 1}
                  onClick={() =>
                    setIngredients((prev) =>
                      prev.filter((r) => r.key !== row.key)
                    )
                  }
                  aria-label={f.removeIngredient}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <div className="grid gap-3 lg:grid-cols-12 lg:items-end">
                <div className="space-y-2 lg:col-span-4">
                  <Label>{f.name}</Label>
                  <Input
                    value={row.name}
                    onChange={(e) =>
                      setIngredients((prev) =>
                        prev.map((r) =>
                          r.key === row.key
                            ? { ...r, name: e.target.value }
                            : r
                        )
                      )
                    }
                    placeholder={f.ingredientName}
                  />
                </div>
                <div className="space-y-2 lg:col-span-4">
                  <Label>{f.fromDatabase}</Label>
                  <FoodCombobox
                    foods={foods}
                    value={row.foodId}
                    selectedLabel={
                      row.foodId ? foodById.get(row.foodId)?.name : null
                    }
                    onSelect={(food) => {
                      setIngredients((prev) =>
                        prev.map((r) =>
                          r.key === row.key
                            ? {
                                ...r,
                                foodId: food.id,
                                name: food.name,
                                servingUnit:
                                  r.servingUnit ||
                                  food.baseServingUnit ||
                                  "",
                                baseQty:
                                  r.baseQty ||
                                  (food.baseServingQty != null
                                    ? String(food.baseServingQty)
                                    : ""),
                              }
                            : r
                        )
                      );
                    }}
                    onClear={() => {
                      setIngredients((prev) =>
                        prev.map((r) =>
                          r.key === row.key ? { ...r, foodId: null } : r
                        )
                      );
                    }}
                  />
                </div>
                <div className="space-y-2 lg:col-span-2">
                  <Label>{f.baseQty}</Label>
                  <Input
                    type="number"
                    min={0}
                    step="any"
                    value={row.baseQty}
                    onChange={(e) =>
                      setIngredients((prev) =>
                        prev.map((r) =>
                          r.key === row.key
                            ? { ...r, baseQty: e.target.value }
                            : r
                        )
                      )
                    }
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2 lg:col-span-2">
                  <Label>{f.unit}</Label>
                  <Input
                    value={row.servingUnit}
                    onChange={(e) =>
                      setIngredients((prev) =>
                        prev.map((r) =>
                          r.key === row.key
                            ? { ...r, servingUnit: e.target.value }
                            : r
                        )
                      )
                    }
                    placeholder={f.unitPlaceholder}
                  />
                </div>
                <div className="space-y-2 lg:col-span-3">
                  <Label>{f.ratioGroup}</Label>
                  <Select
                    value={row.ratioGroup}
                    onValueChange={(v) =>
                      setIngredients((prev) =>
                        prev.map((r) =>
                          r.key === row.key
                            ? { ...r, ratioGroup: v ?? "none" }
                            : r
                        )
                      )
                    }
                    items={Object.fromEntries(RATIO_VALUES.map((v) => [v, ratioGroups[v] ?? v]))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={f.groupPlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {RATIO_VALUES.map((value) => (
                        <SelectItem key={value} value={value}>
                          {ratioGroups[value] ?? value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <label className="flex cursor-pointer items-center gap-2 text-sm lg:col-span-2">
                  <Checkbox
                    checked={row.isOptional}
                    onCheckedChange={(c) =>
                      setIngredients((prev) =>
                        prev.map((r) =>
                          r.key === row.key
                            ? { ...r, isOptional: Boolean(c) }
                            : r
                        )
                      )
                    }
                    className="data-checked:border-brand data-checked:bg-brand data-checked:text-white"
                  />
                  {f.optionalIngredient}
                </label>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{f.tagsCard}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <Badge
                key={t}
                variant="secondary"
                className="gap-1 pr-1 font-normal"
              >
                {t}
                <button
                  type="button"
                  className="rounded p-0.5 hover:bg-muted"
                  onClick={() =>
                    setTags((prev) => prev.filter((x) => x !== t))
                  }
                  aria-label={`${f.removeTag} ${t}`}
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTagFromInput();
              }
            }}
            onBlur={addTagFromInput}
            placeholder={f.tagsPlaceholder}
          />
          <p className="text-xs text-muted-foreground">
            {f.tagsHelp}
          </p>
        </CardContent>
      </Card>

      <Card className="border-brand/20 bg-brand/10 dark:bg-brand/10">
        <CardHeader>
          <CardTitle className="text-foreground dark:text-foreground">
            {f.macroPreview}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {macroPreview ? (
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              <div>
                <dt className="text-xs text-muted-foreground">{f.macroCalories}</dt>
                <dd className="font-medium tabular-nums">
                  {Math.round(macroPreview.calories)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">{f.macroProtein}</dt>
                <dd className="font-medium tabular-nums">
                  {macroPreview.proteinG}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">{f.macroCarbs}</dt>
                <dd className="font-medium tabular-nums">
                  {macroPreview.carbsG}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">{f.macroFat}</dt>
                <dd className="font-medium tabular-nums">{macroPreview.fatG}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">{f.macroFiber}</dt>
                <dd className="font-medium tabular-nums">
                  {macroPreview.fiberG}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">
              {f.macroHelp}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        {mode === "edit" && (
          <Button
            type="button"
            variant="destructive"
            className="sm:mr-auto"
            disabled={pending}
            onClick={handleDelete}
          >
            {f.deleteRecipe}
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          disabled={pending}
          render={<Link href="/admin/recipes" />}
        >
          {d.common.cancel}
        </Button>
        <Button
          type="submit"
          className="bg-brand text-white hover:bg-brand-dark"
          disabled={pending}
        >
          {pending ? d.common.saving : mode === "create" ? f.createRecipe : d.common.saveChanges}
        </Button>
      </div>
    </form>
  );
}

function FoodCombobox({
  foods,
  value,
  selectedLabel,
  onSelect,
  onClear,
}: {
  foods: FoodOption[];
  value: string | null;
  selectedLabel: string | null | undefined;
  onSelect: (food: FoodOption) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const d = useDictionary();
  const f = d.admin.recipes.form;

  return (
    <div className="flex gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          type="button"
          className={cn(
            buttonVariants({ variant: "outline", size: "default" }),
            "h-8 min-w-0 flex-1 justify-between px-2.5 font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <span className="truncate text-left">
            {value && selectedLabel ? selectedLabel : f.searchFoods}
          </span>
          <ChevronDown className="size-4 shrink-0 opacity-50" />
        </PopoverTrigger>
        <PopoverContent className="w-[min(100vw-2rem,22rem)] p-0" align="start">
          <Command>
            <CommandInput placeholder={f.searchFoods} />
            <CommandList>
              <CommandEmpty>{f.noFoodsFound}</CommandEmpty>
              <CommandGroup>
                {foods.map((food) => (
                  <CommandItem
                    key={food.id}
                    value={`${food.name} ${food.id}`}
                    onSelect={() => {
                      onSelect(food);
                      setOpen(false);
                    }}
                  >
                    <span className="truncate">{food.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {value ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="shrink-0"
          onClick={onClear}
        >
          {f.clear}
        </Button>
      ) : null}
    </div>
  );
}
