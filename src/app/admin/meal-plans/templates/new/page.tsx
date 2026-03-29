import { db } from "@/lib/db";
import { foodGroups } from "@/lib/db/schema";
import { TemplateForm } from "../_components/template-form";
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n";

export default async function NewTemplatePage() {
  const locale = await getLocale();
  const d = await getDictionary(locale);

  const allFoodGroups = await db
    .select()
    .from(foodGroups)
    .orderBy(foodGroups.displayOrder);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{d.admin.mealPlans.templates.newTemplate.title}</h1>
        <p className="text-muted-foreground">
          {d.admin.mealPlans.templates.newTemplate.subtitle}
        </p>
      </div>

      <TemplateForm foodGroups={allFoodGroups} />
    </div>
  );
}
