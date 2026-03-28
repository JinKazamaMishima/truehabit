import Link from "next/link";
import {
  Users,
  ClipboardList,
  CalendarClock,
  ChefHat,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { clients, mealPlans, appointments, recipes } from "@/lib/db/schema";
import { eq, count } from "drizzle-orm";

export default async function AdminDashboardPage() {
  const [
    [{ value: totalClients }],
    [{ value: activePlans }],
    [{ value: pendingAppointments }],
    [{ value: totalRecipes }],
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
  ]);

  const stats = [
    {
      label: "Total Clients",
      value: totalClients,
      icon: Users,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Active Plans",
      value: activePlans,
      icon: ClipboardList,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Pending Appointments",
      value: pendingAppointments,
      icon: CalendarClock,
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: "Total Recipes",
      value: totalRecipes,
      icon: ChefHat,
      color: "text-purple-600 bg-purple-50",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your nutrition practice.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <div className={`rounded-lg p-2 ${stat.color}`}>
                <stat.icon className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No recent activity to display.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button variant="outline" className="justify-start gap-2" render={<Link href="/admin/clients/new" />}>
              <Plus className="size-4" />
              New Client
            </Button>
            <Button variant="outline" className="justify-start gap-2" render={<Link href="/admin/recipes" />}>
              <Plus className="size-4" />
              New Recipe
            </Button>
            <Button variant="outline" className="justify-start gap-2" render={<Link href="/admin/meal-plans" />}>
              <Plus className="size-4" />
              New Meal Plan
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
