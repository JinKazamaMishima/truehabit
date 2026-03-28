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
import { CalendarClock } from "lucide-react";
import { updateAppointmentStatus } from "@/actions/appointments-admin";
import { cn } from "@/lib/utils";

type Appointment = {
  id: string;
  clientName: string;
  email: string;
  phone: string | null;
  serviceType: string;
  preferredDate: string | null;
  preferredTime: string | null;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: Date;
};

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

const serviceLabels: Record<string, string> = {
  personalized_nutrition: "Personalized Nutrition",
  weight_loss: "Weight Loss",
  sports_nutrition: "Sports Nutrition",
  body_composition: "Body Composition",
  pre_competition: "Pre-Competition",
  individual_coaching: "Individual Coaching",
};

const filterTabs = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function AppointmentsTable({
  appointments,
  currentFilter,
}: {
  appointments: Appointment[];
  currentFilter: string;
}) {
  const router = useRouter();

  async function handleStatusChange(
    id: string,
    status: "pending" | "confirmed" | "completed" | "cancelled"
  ) {
    await updateAppointmentStatus(id, status);
    router.refresh();
  }

  return (
    <>
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

      {appointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <CalendarClock className="mb-3 size-10 text-muted-foreground/50" />
          <p className="text-sm font-medium text-muted-foreground">
            No appointments found.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
                    {apt.preferredDate ?? "—"}
                    {apt.preferredTime && ` at ${apt.preferredTime}`}
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
                      {apt.status === "pending" && (
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() =>
                            handleStatusChange(apt.id, "confirmed")
                          }
                        >
                          Confirm
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
                          Complete
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
                            Cancel
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
