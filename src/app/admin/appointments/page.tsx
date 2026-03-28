import { db } from "@/lib/db";
import { appointments } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { AppointmentsTable } from "./_components/appointments-table";

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  const validStatuses = ["pending", "confirmed", "completed", "cancelled"] as const;
  const filterStatus = validStatuses.includes(status as typeof validStatuses[number])
    ? (status as typeof validStatuses[number])
    : null;

  const allAppointments = filterStatus
    ? await db
        .select()
        .from(appointments)
        .where(eq(appointments.status, filterStatus))
        .orderBy(desc(appointments.createdAt))
    : await db
        .select()
        .from(appointments)
        .orderBy(desc(appointments.createdAt));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
        <p className="text-muted-foreground">
          Manage client appointment requests.
        </p>
      </div>

      <AppointmentsTable
        appointments={allAppointments}
        currentFilter={filterStatus ?? "all"}
      />
    </div>
  );
}
