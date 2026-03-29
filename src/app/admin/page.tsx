import Link from "next/link";
import {
  Users,
  ClipboardList,
  CalendarClock,
  ChefHat,
  Plus,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { clients, mealPlans, appointments, recipes } from "@/lib/db/schema";
import { eq, count, desc } from "drizzle-orm";
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n";

export default async function AdminDashboardPage() {
  const locale = await getLocale();
  const d = await getDictionary(locale);

  const [
    [{ value: totalClients }],
    [{ value: activePlans }],
    [{ value: pendingAppointments }],
    [{ value: totalRecipes }],
    recentClients,
  ] = await Promise.all([
    db.select({ value: count() }).from(clients),
    db
      .select({ value: count() })
      .from(mealPlans)
      .where(eq(mealPlans.status, "active")),
    db
      .select({ value: count() })
      .from(appointments)
      .where(eq(appointments.status, "pending")),
    db.select({ value: count() }).from(recipes),
    db.select({ id: clients.id, name: clients.name, goal: clients.goal, createdAt: clients.createdAt })
      .from(clients)
      .orderBy(desc(clients.createdAt))
      .limit(5),
  ]);

  const stats = [
    {
      label: d.admin.dashboard.totalClients,
      value: totalClients,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-l-blue-500",
    },
    {
      label: d.admin.dashboard.activePlans,
      value: activePlans,
      icon: ClipboardList,
      color: "text-brand",
      bg: "bg-brand/10",
      border: "border-l-brand",
    },
    {
      label: d.admin.dashboard.pendingAppointments,
      value: pendingAppointments,
      icon: CalendarClock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-l-amber-500",
    },
    {
      label: d.admin.dashboard.totalRecipes,
      value: totalRecipes,
      icon: ChefHat,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-l-purple-500",
    },
  ];

  const goalLabels = d.admin.clients.goalLabels;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">{d.admin.dashboard.title}</h1>
          <p className="text-sm text-muted-foreground">
            {d.admin.dashboard.subtitle}
          </p>
        </div>
        <Button
          className="bg-brand text-white hover:bg-brand-dark"
          render={<Link href="/admin/clients/new" />}
        >
          <Plus className="size-4" />
          {d.admin.dashboard.newClient}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className={`border-l-4 ${stat.border}`}>
            <CardHeader className="flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </CardTitle>
              <div className={`rounded-lg p-2.5 ${stat.bg}`}>
                <stat.icon className={`size-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="size-3 text-brand" />
                <span>{d.admin.dashboard.updated}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">{d.admin.dashboard.recentClients}</CardTitle>
            <Button variant="ghost" size="sm" className="text-brand" render={<Link href="/admin/clients" />}>
              {d.admin.dashboard.viewAll}
              <ArrowRight className="ml-1 size-3" />
            </Button>
          </CardHeader>
          <CardContent>
            {recentClients.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Users className="mb-2 size-8 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">
                  {d.admin.dashboard.noClientsYet}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentClients.map((client) => (
                  <Link
                    key={client.id}
                    href={`/admin/clients/${client.id}`}
                    className="flex items-center justify-between rounded-lg border border-transparent p-3 transition-colors hover:border-brand/20 hover:bg-brand/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand">
                        {client.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{client.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {client.goal ? goalLabels[client.goal as keyof typeof goalLabels] ?? client.goal : d.admin.dashboard.noGoal}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="size-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">{d.admin.dashboard.quickActions}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button variant="outline" className="justify-start gap-2 border-brand/20 hover:bg-brand/5 hover:text-brand" render={<Link href="/admin/clients/new" />}>
              <Plus className="size-4" />
              {d.admin.dashboard.newClient}
            </Button>
            <Button variant="outline" className="justify-start gap-2 border-brand/20 hover:bg-brand/5 hover:text-brand" render={<Link href="/admin/recipes/new" />}>
              <Plus className="size-4" />
              {d.admin.dashboard.newRecipe}
            </Button>
            <Button variant="outline" className="justify-start gap-2 border-brand/20 hover:bg-brand/5 hover:text-brand" render={<Link href="/admin/meal-plans/builder" />}>
              <Plus className="size-4" />
              {d.admin.dashboard.newMealPlan}
            </Button>
            <Button variant="outline" className="justify-start gap-2 border-brand/20 hover:bg-brand/5 hover:text-brand" render={<Link href="/admin/appointments" />}>
              <CalendarClock className="size-4" />
              {d.admin.dashboard.viewAppointments}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
