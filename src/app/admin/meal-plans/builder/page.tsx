import { db } from "@/lib/db";
import {
  clients,
  mealPlanTemplates,
  mealTemplateSlots,
  recipes,
} from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { PlanBuilderForm } from "./_components/plan-builder-form";
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n";

export default async function BuilderPage() {
  const locale = await getLocale();
  const d = await getDictionary(locale);

  const [allClients, allTemplates, allRecipes] = await Promise.all([
    db
      .select({ id: clients.id, name: clients.name })
      .from(clients)
      .where(eq(clients.status, "active"))
      .orderBy(clients.name),
    db.query.mealPlanTemplates.findMany({
      with: { slots: true },
      orderBy: [desc(mealPlanTemplates.createdAt)],
    }),
    db
      .select({ id: recipes.id, name: recipes.name, mealTypes: recipes.mealTypes })
      .from(recipes)
      .orderBy(recipes.name),
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{d.admin.mealPlans.builder.title}</h1>
        <p className="text-muted-foreground">
          {d.admin.mealPlans.builder.subtitle}
        </p>
      </div>

      <PlanBuilderForm
        clients={allClients}
        templates={allTemplates}
        recipes={allRecipes}
      />
    </div>
  );
}
