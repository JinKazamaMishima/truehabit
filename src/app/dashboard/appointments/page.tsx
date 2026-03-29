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
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n";
import type { Dictionary } from "@/lib/i18n";

function getStatusConfig(d: Dictionary) {
  return {
    pending: { label: d.common.pending, variant: "secondary" as const, icon: AlertCircle },
    confirmed: { label: d.common.confirmed, variant: "default" as const, icon: CalendarCheck },
    completed: { label: d.common.completed, variant: "outline" as const, icon: CheckCircle2 },
    cancelled: { label: d.common.cancelled, variant: "destructive" as const, icon: XCircle },
  };
}

export default async function AppointmentsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const locale = await getLocale();
  const d = await getDictionary(locale);

  const client = await getClientByLinkedUser(session.user.id!);
  if (!client) redirect("/dashboard");

  const allAppointments = await getClientAppointments(client.email ?? "");

  const upcoming = allAppointments.filter(
    (a) => a.status === "pending" || a.status === "confirmed"
  );
  const past = allAppointments.filter(
    (a) => a.status === "completed" || a.status === "cancelled"
  );

  const statusConfig = getStatusConfig(d);
  const serviceLabels = d.dashboard.appointments.serviceLabels;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-charcoal">{d.dashboard.appointments.title}</h1>
        <p className="text-sm text-muted-foreground">
          {d.dashboard.appointments.subtitle}
        </p>
      </div>

      {allAppointments.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <div className="mb-4 rounded-full bg-purple-50 p-4">
            <CalendarDays className="size-8 text-purple-600" />
          </div>
          <p className="text-lg font-semibold text-charcoal">{d.dashboard.appointments.noAppointments}</p>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {d.dashboard.appointments.noAppointmentsMessage}
          </p>
        </div>
      ) : (
        <>
          {/* Upcoming */}
          <div className="space-y-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-charcoal">
              <CalendarCheck className="size-5 text-brand" />
              {d.dashboard.appointments.upcoming}
              {upcoming.length > 0 && (
                <Badge variant="default" className="ml-1 bg-brand text-white">
                  {upcoming.length}
                </Badge>
              )}
            </h2>

            {upcoming.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {upcoming.map((apt) => (
                  <AppointmentCard key={apt.id} appointment={apt} statusConfig={statusConfig} serviceLabels={serviceLabels} />
                ))}
              </div>
            ) : (
              <Card className="border-0 shadow-sm">
                <CardContent className="flex flex-col items-center py-8 text-center">
                  <CalendarDays className="mb-2 size-6 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">
                    {d.dashboard.appointments.noUpcoming}
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
                {d.dashboard.appointments.history}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {past.map((apt) => (
                  <AppointmentCard key={apt.id} appointment={apt} statusConfig={statusConfig} serviceLabels={serviceLabels} />
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
  statusConfig,
  serviceLabels,
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
  statusConfig: ReturnType<typeof getStatusConfig>;
  serviceLabels: Record<string, string>;
}) {
  const config = statusConfig[appointment.status as keyof typeof statusConfig] ?? statusConfig.pending;
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
                {serviceLabels[appointment.serviceType as keyof typeof serviceLabels] ??
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
