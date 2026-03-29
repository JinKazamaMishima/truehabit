import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  getClientByLinkedUser,
  getClientAppointments,
} from "@/actions/customer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CalendarCheck,
} from "lucide-react";

const serviceLabels: Record<string, string> = {
  personalized_nutrition: "Nutrición Personalizada",
  weight_loss: "Pérdida de Peso",
  sports_nutrition: "Nutrición Deportiva",
  body_composition: "Composición Corporal",
  pre_competition: "Pre-competencia",
  individual_coaching: "Coaching Individual",
};

const statusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive"; icon: typeof CheckCircle2 }
> = {
  pending: { label: "Pendiente", variant: "secondary", icon: AlertCircle },
  confirmed: { label: "Confirmada", variant: "default", icon: CalendarCheck },
  completed: { label: "Completada", variant: "outline", icon: CheckCircle2 },
  cancelled: { label: "Cancelada", variant: "destructive", icon: XCircle },
};

export default async function AppointmentsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const client = await getClientByLinkedUser(session.user.id!);
  if (!client) redirect("/dashboard");

  const allAppointments = await getClientAppointments(client.email ?? "");

  const upcoming = allAppointments.filter(
    (a) => a.status === "pending" || a.status === "confirmed"
  );
  const past = allAppointments.filter(
    (a) => a.status === "completed" || a.status === "cancelled"
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-charcoal">Citas</h1>
        <p className="text-sm text-muted-foreground">
          Tus citas programadas y el historial de consultas anteriores.
        </p>
      </div>

      {allAppointments.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <div className="mb-4 rounded-full bg-purple-50 p-4">
            <CalendarDays className="size-8 text-purple-600" />
          </div>
          <p className="text-lg font-semibold text-charcoal">Sin citas registradas</p>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            Agenda una cita con tu nutriólogo a través de la página de contacto.
          </p>
        </div>
      ) : (
        <>
          {/* Upcoming */}
          <div className="space-y-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-charcoal">
              <CalendarCheck className="size-5 text-brand" />
              Próximas Citas
              {upcoming.length > 0 && (
                <Badge variant="default" className="ml-1 bg-brand text-white">
                  {upcoming.length}
                </Badge>
              )}
            </h2>

            {upcoming.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {upcoming.map((apt) => (
                  <AppointmentCard key={apt.id} appointment={apt} />
                ))}
              </div>
            ) : (
              <Card className="border-0 shadow-sm">
                <CardContent className="flex flex-col items-center py-8 text-center">
                  <CalendarDays className="mb-2 size-6 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">
                    No hay citas programadas
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Past */}
          {past.length > 0 && (
            <div className="space-y-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-charcoal">
                <Clock className="size-5 text-muted-foreground" />
                Historial
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {past.map((apt) => (
                  <AppointmentCard key={apt.id} appointment={apt} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function AppointmentCard({
  appointment,
}: {
  appointment: {
    id: string;
    clientName: string;
    serviceType: string;
    preferredDate: string | null;
    preferredTime: string | null;
    status: string;
    message: string | null;
  };
}) {
  const config = statusConfig[appointment.status] ?? statusConfig.pending;
  const Icon = config.icon;

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
              appointment.status === "confirmed" || appointment.status === "completed"
                ? "bg-brand-light"
                : appointment.status === "cancelled"
                  ? "bg-red-50"
                  : "bg-muted"
            }`}
          >
            <Icon
              className={`size-5 ${
                appointment.status === "confirmed" || appointment.status === "completed"
                  ? "text-brand-dark"
                  : appointment.status === "cancelled"
                    ? "text-red-500"
                    : "text-muted-foreground"
              }`}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate font-semibold text-charcoal">
                {serviceLabels[appointment.serviceType] ??
                  appointment.serviceType.replace(/_/g, " ")}
              </p>
              <Badge variant={config.variant} className="shrink-0 text-xs">
                {config.label}
              </Badge>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              {appointment.preferredDate && (
                <span className="flex items-center gap-1">
                  <CalendarDays className="size-3" />
                  {appointment.preferredDate}
                </span>
              )}
              {appointment.preferredTime && (
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {appointment.preferredTime}
                </span>
              )}
            </div>
            {appointment.message && (
              <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                {appointment.message}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
