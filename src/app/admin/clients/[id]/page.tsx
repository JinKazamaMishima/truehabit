import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { clients, clientMeasurements, mealPlans } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { ClientDetailTabs } from "./_components/client-detail-tabs";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [client] = await db
    .select()
    .from(clients)
    .where(eq(clients.id, id))
    .limit(1);

  if (!client) notFound();

  const measurements = await db
    .select()
    .from(clientMeasurements)
    .where(eq(clientMeasurements.clientId, id))
    .orderBy(desc(clientMeasurements.date));

  const plans = await db
    .select()
    .from(mealPlans)
    .where(eq(mealPlans.clientId, id))
    .orderBy(desc(mealPlans.createdAt));

  const goalLabels: Record<string, string> = {
    fat_loss: "Fat Loss",
    muscle_gain: "Muscle Gain",
    weight_cut: "Weight Cut",
    maintenance: "Maintenance",
    pre_competition: "Pre-Competition",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{client.name}</h1>
          <p className="text-muted-foreground">{client.email ?? "No email"}</p>
        </div>
        <Badge
          variant={client.status === "active" ? "default" : "secondary"}
          className={
            client.status === "active"
              ? "bg-emerald-100 text-emerald-700"
              : ""
          }
        >
          {client.status}
        </Badge>
      </div>

      <ClientDetailTabs
        client={client}
        measurements={measurements}
        mealPlans={plans}
        goalLabels={goalLabels}
      />
    </div>
  );
}
