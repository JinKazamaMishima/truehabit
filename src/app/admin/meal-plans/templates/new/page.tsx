import { db } from "@/lib/db";
import { foodGroups } from "@/lib/db/schema";
import { TemplateForm } from "../_components/template-form";

export default async function NewTemplatePage() {
  const allFoodGroups = await db
    .select()
    .from(foodGroups)
    .orderBy(foodGroups.displayOrder);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">New Template</h1>
        <p className="text-muted-foreground">
          Create a reusable meal plan template with day types and meal slots.
        </p>
      </div>

      <TemplateForm foodGroups={allFoodGroups} />
    </div>
  );
}
