"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarClock, Pencil, Plus } from "lucide-react";
import { updateAppointmentStatus } from "@/actions/appointments-admin";
import { cn } from "@/lib/utils";
import { useDictionary } from "@/lib/i18n/context";
import { AppointmentFormDialog } from "./appointment-form-dialog";

type Appointment = {
  id: string;
  clientName: string;
  email: string;
  phone: string | null;
  serviceType: string;
  preferredDate: string | null;
  preferredTime: string | null;
  message: string | null;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: Date;
};

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  completed: "bg-brand/15 text-brand-dark",
  cancelled: "bg-red-100 text-red-700",
};

export function AppointmentsTable({
  appointments,
  currentFilter,
}: {
  appointments: Appointment[];
  currentFilter: string;
}) {
  const router = useRouter();
  const d = useDictionary();

  const serviceLabels = d.admin.appointments.serviceLabels as Record<string, string>;

  const filterTabs = [
    { value: "all", label: d.admin.appointments.filterTabs.all },
    { value: "pending", label: d.admin.appointments.filterTabs.pending },
    { value: "confirmed", label: d.admin.appointments.filterTabs.confirmed },
    { value: "completed", label: d.admin.appointments.filterTabs.completed },
    { value: "cancelled", label: d.admin.appointments.filterTabs.cancelled },
  ];

  async function handleStatusChange(
    id: string,
    status: "pending" | "confirmed" | "completed" | "cancelled"
  ) {
    await updateAppointmentStatus(id, status);
    router.refresh();
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {filterTabs.map((tab) => (
          <Link
            key={tab.value}
            href={
              tab.value === "all"
                ? "/admin/appointments"
                : `/admin/appointments?status=${tab.value}`
            }
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              currentFilter === tab.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </Link>
        ))}
        </div>

        <AppointmentFormDialog>
          <Button className="bg-brand text-white hover:bg-brand-dark">
            <Plus className="size-4" />
            {d.admin.appointments.newAppointment}
          </Button>
        </AppointmentFormDialog>
      </div>

      {appointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <CalendarClock className="mb-3 size-10 text-muted-foreground/50" />
          <p className="text-sm font-medium text-muted-foreground">
            {d.admin.appointments.noAppointments}
          </p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{d.admin.appointments.tableHeaders.name}</TableHead>
                <TableHead>{d.admin.appointments.tableHeaders.email}</TableHead>
                <TableHead>{d.admin.appointments.tableHeaders.service}</TableHead>
                <TableHead>{d.admin.appointments.tableHeaders.date}</TableHead>
                <TableHead>{d.admin.appointments.tableHeaders.status}</TableHead>
                <TableHead className="text-right">{d.admin.appointments.tableHeaders.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((apt) => (
                <TableRow key={apt.id}>
                  <TableCell className="font-medium">
                    {apt.clientName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {apt.email}
                  </TableCell>
                  <TableCell>
                    {serviceLabels[apt.serviceType] ?? apt.serviceType}
                  </TableCell>
                  <TableCell>
                    {apt.preferredDate ?? d.common.emDash}
                    {apt.preferredTime && `${d.admin.appointments.atTime}${apt.preferredTime}`}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={statusColors[apt.status] ?? ""}
                    >
                      {apt.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <AppointmentFormDialog appointment={apt}>
                        <Button size="xs" variant="outline">
                          <Pencil className="size-3" />
                          {d.admin.appointments.editButton}
                        </Button>
                      </AppointmentFormDialog>
                      {apt.status === "pending" && (
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() =>
                            handleStatusChange(apt.id, "confirmed")
                          }
                        >
                          {d.admin.appointments.confirmButton}
                        </Button>
                      )}
                      {(apt.status === "pending" ||
                        apt.status === "confirmed") && (
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() =>
                            handleStatusChange(apt.id, "completed")
                          }
                        >
                          {d.admin.appointments.completeButton}
                        </Button>
                      )}
                      {apt.status !== "cancelled" &&
                        apt.status !== "completed" && (
                          <Button
                            size="xs"
                            variant="destructive"
                            onClick={() =>
                              handleStatusChange(apt.id, "cancelled")
                            }
                          >
                            {d.admin.appointments.cancelButton}
                          </Button>
                        )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
