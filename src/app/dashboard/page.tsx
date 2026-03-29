import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  getClientByLinkedUser,
  getClientMealPlans,
  getClientMeasurements,
  getClientSupplements,
  getClientAppointments,
} from "@/actions/customer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Target,
  Scale,
  CalendarDays,
  UtensilsCrossed,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Dumbbell,
  Droplets,
  Clock,
} from "lucide-react";

const goalLabels: Record<string, string> = {
  fat_loss: "Pérdida de grasa",
  muscle_gain: "Ganancia muscular",
  weight_cut: "Corte de peso",
  maintenance: "Mantenimiento",
  pre_competition: "Pre-competencia",
};

export default async function DashboardHome() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const client = await getClientByLinkedUser(session.user.id!);

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 rounded-full bg-brand-light p-4">
          <UtensilsCrossed className="size-8 text-brand" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-charcoal">
          Bienvenido a TrueHabit
        </h1>
        <p className="mt-2 max-w-md text-muted-foreground">
          Tu cuenta aún no está vinculada a un perfil de cliente. Contacta a tu
          nutriólogo para completar la configuración.
        </p>
      </div>
    );
  }

  const [mealPlans, measurements, appointments] = await Promise.all([
    getClientMealPlans(client.id),
    getClientMeasurements(client.id),
    getClientAppointments(client.email ?? ""),
  ]);

  const activePlan = mealPlans.find((p) => p.status === "active");
  const latestMeasurement = measurements[0];
  const previousMeasurement = measurements[1];
  const upcomingAppointments = appointments.filter(
    (a) => a.status === "pending" || a.status === "confirmed"
  );

  const weightChange =
    latestMeasurement?.weightKg && previousMeasurement?.weightKg
      ? Number(latestMeasurement.weightKg) - Number(previousMeasurement.weightKg)
      : null;

  const firstName = client.name.split(" ")[0];

  const todayMeals = activePlan?.days?.[0]?.meals ?? [];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand to-brand-dark p-6 text-white sm:p-8">
        <div className="relative z-10">
          <p className="text-sm font-medium text-white/80">Buenos días</p>
          <h1 className="mt-1 font-heading text-3xl font-bold sm:text-4xl">
            ¡Hola, {firstName}!
          </h1>
          <p className="mt-2 max-w-lg text-sm text-white/80">
            {activePlan
              ? `Tu plan "${activePlan.name}" está activo. ¡Sigue con el buen trabajo!`
              : "No tienes un plan activo en este momento. Consulta con tu nutriólogo."}
          </p>
          {client.goal && (
            <Badge className="mt-3 border-white/20 bg-white/15 text-white hover:bg-white/25">
              <Target className="mr-1.5 size-3" />
              {goalLabels[client.goal] ?? client.goal}
            </Badge>
          )}
        </div>
        <div className="absolute -right-8 -top-8 size-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-12 -right-4 size-56 rounded-full bg-white/5" />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Scale className="size-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Peso Actual</p>
              <p className="text-2xl font-bold text-charcoal">
                {latestMeasurement?.weightKg
                  ? `${Number(latestMeasurement.weightKg).toFixed(1)} kg`
                  : "—"}
              </p>
              {weightChange !== null && (
                <p
                  className={`flex items-center gap-0.5 text-xs font-medium ${
                    weightChange < 0 ? "text-green-600" : weightChange > 0 ? "text-red-500" : "text-muted-foreground"
                  }`}
                >
                  {weightChange < 0 ? (
                    <TrendingDown className="size-3" />
                  ) : (
                    <TrendingUp className="size-3" />
                  )}
                  {Math.abs(weightChange).toFixed(1)} kg
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand-dark">
              <Target className="size-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Objetivo</p>
              <p className="text-lg font-bold text-charcoal">
                {client.goal ? goalLabels[client.goal] ?? client.goal : "Sin definir"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <UtensilsCrossed className="size-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Plan Activo</p>
              <p className="text-lg font-bold text-charcoal truncate max-w-[140px]">
                {activePlan?.name ?? "Ninguno"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <CalendarDays className="size-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Próximas Citas</p>
              <p className="text-2xl font-bold text-charcoal">
                {upcomingAppointments.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Meals */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg">Comidas de Hoy</CardTitle>
            {activePlan && (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-brand hover:text-brand-dark"
                render={<Link href="/dashboard/meal-plans" />}
              >
                Ver plan
                <ArrowRight className="size-3.5" />
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {todayMeals.length > 0 ? (
              <div className="space-y-3">
                {todayMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className="flex items-start gap-3 rounded-lg border border-border/50 bg-white p-3"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-light">
                      <UtensilsCrossed className="size-4 text-brand-dark" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-charcoal">
                        {meal.slotName}
                      </p>
                      {meal.options?.length > 0 ? (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {meal.options.map((opt) => (
                            <Badge
                              key={opt.id}
                              variant="secondary"
                              className="text-xs font-normal"
                            >
                              {opt.recipe?.name ?? "Receta"}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {[
                            meal.cerealPortions && `${meal.cerealPortions} cereal`,
                            meal.proteinPortions && `${meal.proteinPortions} proteína`,
                            meal.fatPortions && `${meal.fatPortions} grasa`,
                            meal.veggiePortions && `${meal.veggiePortions} vegetal`,
                          ]
                            .filter(Boolean)
                            .join(" · ") || "Sin detalles"}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-8 text-center">
                <UtensilsCrossed className="mb-2 size-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  No hay comidas para mostrar
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Info */}
        <div className="space-y-4">
          {/* Body Composition Snapshot */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg">Composición Corporal</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-brand hover:text-brand-dark"
                render={<Link href="/dashboard/progress" />}
              >
                Ver todo
                <ArrowRight className="size-3.5" />
              </Button>
            </CardHeader>
            <CardContent>
              {latestMeasurement ? (
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-xs text-muted-foreground">Grasa Corporal</p>
                    <p className="mt-1 text-xl font-bold text-charcoal">
                      {latestMeasurement.bodyFatPct
                        ? `${Number(latestMeasurement.bodyFatPct).toFixed(1)}%`
                        : "—"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-xs text-muted-foreground">Masa Muscular</p>
                    <p className="mt-1 text-xl font-bold text-charcoal">
                      {latestMeasurement.muscleMassPct
                        ? `${Number(latestMeasurement.muscleMassPct).toFixed(1)}%`
                        : "—"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-xs text-muted-foreground">IMC</p>
                    <p className="mt-1 text-xl font-bold text-charcoal">
                      {latestMeasurement.bmi
                        ? Number(latestMeasurement.bmi).toFixed(1)
                        : "—"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-xs text-muted-foreground">Estatura</p>
                    <p className="mt-1 text-xl font-bold text-charcoal">
                      {latestMeasurement.heightCm
                        ? `${Number(latestMeasurement.heightCm).toFixed(0)} cm`
                        : "—"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-6 text-center">
                  <Dumbbell className="mb-2 size-8 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">
                    Aún no hay mediciones registradas
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg">Próximas Citas</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-brand hover:text-brand-dark"
                render={<Link href="/dashboard/appointments" />}
              >
                Ver todas
                <ArrowRight className="size-3.5" />
              </Button>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-2">
                  {upcomingAppointments.slice(0, 3).map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center gap-3 rounded-lg border border-border/50 bg-white p-3"
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-purple-50">
                        <Clock className="size-4 text-purple-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {apt.serviceType.replace(/_/g, " ")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {apt.preferredDate ?? "Fecha por confirmar"}
                          {apt.preferredTime ? ` · ${apt.preferredTime}` : ""}
                        </p>
                      </div>
                      <Badge
                        variant={apt.status === "confirmed" ? "default" : "secondary"}
                        className="shrink-0 text-xs"
                      >
                        {apt.status === "confirmed" ? "Confirmada" : "Pendiente"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center py-6 text-center">
                  <CalendarDays className="mb-2 size-8 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">
                    No hay citas programadas
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
