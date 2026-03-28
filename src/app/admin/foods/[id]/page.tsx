import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { foods, foodGroups } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { updateFood } from "@/actions/foods";
import { FoodForm } from "../_components/food-form";
import { EditFoodDeleteSection } from "./_components/edit-food-delete-section";

export default async function EditFoodPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [row] = await db
    .select({
      food: foods,
    })
    .from(foods)
    .where(eq(foods.id, id))
    .limit(1);

  if (!row) notFound();

  const groups = await db
    .select({ id: foodGroups.id, name: foodGroups.name })
    .from(foodGroups)
    .orderBy(asc(foodGroups.displayOrder), asc(foodGroups.name));

  const { food } = row;
  const update = updateFood.bind(null, id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-start gap-4">
        <Button
          variant="ghost"
          size="icon-sm"
          className="mt-0.5 shrink-0"
          render={<Link href="/admin/foods" />}
        >
          <ArrowLeft className="size-4" />
          <span className="sr-only">Back to foods</span>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit food</h1>
          <p className="text-muted-foreground">Update {food.name}.</p>
        </div>
      </div>

      <FoodForm
        groups={groups}
        action={update}
        submitLabel="Save changes"
        defaults={{
          name: food.name,
          foodGroupId: food.foodGroupId,
          baseServingQty:
            food.baseServingQty != null ? String(food.baseServingQty) : null,
          baseServingUnit: food.baseServingUnit,
          calories: food.calories != null ? String(food.calories) : null,
          proteinG: food.proteinG != null ? String(food.proteinG) : null,
          carbsG: food.carbsG != null ? String(food.carbsG) : null,
          fatG: food.fatG != null ? String(food.fatG) : null,
          fiberG: food.fiberG != null ? String(food.fiberG) : null,
          isFree: food.isFree ?? false,
          notes: food.notes,
        }}
      />

      <EditFoodDeleteSection foodId={id} foodName={food.name} />
    </div>
  );
}
