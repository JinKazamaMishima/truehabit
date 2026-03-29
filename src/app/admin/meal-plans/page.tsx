import Link from "next/link";
import {
  Plus,
  Calendar,
  ClipboardList,
  LayoutTemplate,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { db } from "@/lib/db";
import {
  mealPlanTemplates,
  mealPlans,
  clients,
} from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n";

const statusStyles: Record<string, string> = {
  draft: "bg-amber-100 text-amber-700",
  active: "bg-brand/15 text-brand-dark",
  completed: "bg-slate-100 text-slate-700",
};

export default async function MealPlansPage() {
  const locale = await getLocale();
  const d = await getDictionary(locale);
  const goalLabels = d.admin.mealPlans.templates.form.goalLabels;

  const [templates, plans] = await Promise.all([
    db
      .select()
      .from(mealPlanTemplates)
      .orderBy(desc(mealPlanTemplates.createdAt)),
    db
      .select({
        id: mealPlans.id,
        name: mealPlans.name,
        status: mealPlans.status,
        startDate: mealPlans.startDate,
        endDate: mealPlans.endDate,
        createdAt: mealPlans.createdAt,
        clientName: clients.name,
      })
      .from(mealPlans)
      .leftJoin(clients, eq(mealPlans.clientId, clients.id))
      .orderBy(desc(mealPlans.createdAt)),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{d.admin.mealPlans.title}</h1>
          <p className="text-muted-foreground">
            {d.admin.mealPlans.subtitle}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            render={<Link href="/admin/meal-plans/templates/new" />}
          >
            <LayoutTemplate className="size-4" />
            {d.admin.mealPlans.newTemplate}
          </Button>
          <Button render={<Link href="/admin/meal-plans/builder" />}>
            <Plus className="size-4" />
            {d.admin.mealPlans.newPlan}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="templates">
        <TabsList>
          <TabsTrigger value="templates">{d.admin.mealPlans.templatesTab}</TabsTrigger>
          <TabsTrigger value="plans">{d.admin.mealPlans.clientPlansTab}</TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          {templates.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
              <LayoutTemplate className="mb-3 size-10 text-muted-foreground/50" />
              <p className="text-sm font-medium text-muted-foreground">
                {d.admin.mealPlans.noTemplatesYet}
              </p>
              <Button
                variant="outline"
                className="mt-4"
                render={<Link href="/admin/meal-plans/templates/new" />}
              >
                <Plus className="size-4" />
                {d.admin.mealPlans.createFirstTemplate}
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {templates.map((t) => (
                <Card key={t.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ClipboardList className="size-4 text-brand" />
                      {t.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {t.goalType && (
                      <Badge variant="secondary">
                        {goalLabels[t.goalType as keyof typeof goalLabels] ?? t.goalType}
                      </Badge>
                    )}
                    {t.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {t.description}
                      </p>
                    )}
                    {t.dayTypes && t.dayTypes.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {t.dayTypes.map((dt) => (
                          <Badge key={dt} variant="outline" className="text-xs capitalize">
                            {dt}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="plans">
          {plans.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
              <Calendar className="mb-3 size-10 text-muted-foreground/50" />
              <p className="text-sm font-medium text-muted-foreground">
                {d.admin.mealPlans.noPlansYet}
              </p>
              <Button
                variant="outline"
                className="mt-4"
                render={<Link href="/admin/meal-plans/builder" />}
              >
                <Plus className="size-4" />
                {d.admin.mealPlans.createFirstPlan}
              </Button>
            </div>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{d.admin.mealPlans.tableHeaders.planName}</TableHead>
                    <TableHead>{d.admin.mealPlans.tableHeaders.client}</TableHead>
                    <TableHead>{d.admin.mealPlans.tableHeaders.status}</TableHead>
                    <TableHead>{d.admin.mealPlans.tableHeaders.startDate}</TableHead>
                    <TableHead>{d.admin.mealPlans.tableHeaders.endDate}</TableHead>
                    <TableHead className="text-right">{d.admin.mealPlans.tableHeaders.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/admin/meal-plans/${plan.id}`}
                          className="hover:underline"
                        >
                          {plan.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {plan.clientName ?? d.common.emDash}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={statusStyles[plan.status] ?? ""}
                        >
                          {plan.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {plan.startDate ?? d.common.emDash}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {plan.endDate ?? d.common.emDash}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          render={<Link href={`/admin/meal-plans/${plan.id}`} />}
                        >
                          {d.common.view}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
