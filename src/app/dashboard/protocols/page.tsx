import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  getClientByLinkedUser,
  getClientSupplements,
  getClientHydration,
} from "@/actions/customer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Pill,
  Droplets,
  Clock,
  Repeat,
  Beaker,
  GlassWater,
  Zap,
} from "lucide-react";
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n";

export default async function ProtocolsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const locale = await getLocale();
  const d = await getDictionary(locale);

  const client = await getClientByLinkedUser(session.user.id!);
  if (!client) redirect("/dashboard");

  const [supplements, hydration] = await Promise.all([
    getClientSupplements(client.id),
    getClientHydration(client.id),
  ]);

  const hasData = supplements.length > 0 || hydration.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-charcoal">
          {d.dashboard.protocols.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          {d.dashboard.protocols.subtitle}
        </p>
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center py-16 text-center">
          <div className="mb-4 rounded-full bg-emerald-50 p-4">
            <Pill className="size-8 text-emerald-600" />
          </div>
          <p className="text-lg font-semibold text-charcoal">
            {d.dashboard.protocols.noProtocols}
          </p>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {d.dashboard.protocols.noProtocolsMessage}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Supplements */}
          <div className="space-y-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-charcoal">
              <Pill className="size-5 text-emerald-600" />
              {d.dashboard.protocols.supplementation}
            </h2>
            {supplements.length > 0 ? (
              supplements.map((sup) => (
                <Card key={sup.id} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                        <Beaker className="size-5 text-emerald-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-charcoal">
                          {sup.supplementName}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {sup.dose && (
                            <Badge
                              variant="secondary"
                              className="gap-1 text-xs font-normal"
                            >
                              <Zap className="size-3" />
                              {sup.dose}
                            </Badge>
                          )}
                          {sup.frequency && (
                            <Badge
                              variant="secondary"
                              className="gap-1 text-xs font-normal"
                            >
                              <Repeat className="size-3" />
                              {sup.frequency}
                            </Badge>
                          )}
                          {sup.timing && (
                            <Badge
                              variant="secondary"
                              className="gap-1 text-xs font-normal"
                            >
                              <Clock className="size-3" />
                              {sup.timing}
                            </Badge>
                          )}
                        </div>
                        {sup.notes && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            {sup.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-0 shadow-sm">
                <CardContent className="flex flex-col items-center py-8 text-center">
                  <Pill className="mb-2 size-6 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">
                    {d.dashboard.protocols.noSupplements}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Hydration */}
          <div className="space-y-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-charcoal">
              <Droplets className="size-5 text-blue-600" />
              {d.dashboard.protocols.hydration}
            </h2>
            {hydration.length > 0 ? (
              hydration.map((h) => (
                <Card key={h.id} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                        <GlassWater className="size-5 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-charcoal">
                          {d.dashboard.protocols.hydrationProtocol}
                        </p>
                        <div className="mt-2 space-y-2">
                          {h.dailyWaterMl && (
                            <div className="flex items-center gap-2">
                              <Droplets className="size-4 text-blue-500" />
                              <span className="text-sm">
                                <strong>
                                  {(h.dailyWaterMl / 1000).toFixed(1)} L
                                </strong>{" "}
                                {d.dashboard.protocols.dailyWater}
                              </span>
                            </div>
                          )}
                          {h.duringTraining && (
                            <div className="rounded-lg bg-muted/50 p-2">
                              <p className="text-xs font-medium text-muted-foreground">
                                {d.dashboard.protocols.duringTraining}
                              </p>
                              <p className="text-sm text-charcoal">
                                {h.duringTraining}
                              </p>
                            </div>
                          )}
                          {h.electrolyteBrand && (
                            <Badge
                              variant="outline"
                              className="gap-1 text-xs font-normal"
                            >
                              <Beaker className="size-3" />
                              {h.electrolyteBrand}
                            </Badge>
                          )}
                          {h.notes && (
                            <p className="text-xs text-muted-foreground">
                              {h.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-0 shadow-sm">
                <CardContent className="flex flex-col items-center py-8 text-center">
                  <Droplets className="mb-2 size-6 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">
                    {d.dashboard.protocols.noHydrationProtocol}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
