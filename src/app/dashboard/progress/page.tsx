import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  getClientByLinkedUser,
  getClientMeasurements,
} from "@/actions/customer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Scale,
  Activity,
  Dumbbell,
  Heart,
} from "lucide-react";
import { MiniChart } from "./_components/progress-chart";
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n";

function TrendBadge({ current, previous }: { current?: string | null; previous?: string | null }) {
  if (!current || !previous) return null;
  const diff = Number(current) - Number(previous);
  if (diff === 0) return <Minus className="size-3.5 text-muted-foreground" />;
  if (diff < 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-green-600">
        <TrendingDown className="size-3" />
        {Math.abs(diff).toFixed(1)}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-xs font-medium text-red-500">
      <TrendingUp className="size-3" />
      {diff.toFixed(1)}
    </span>
  );
}

export default async function ProgressPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const locale = await getLocale();
  const d = await getDictionary(locale);

  const client = await getClientByLinkedUser(session.user.id!);
  if (!client) redirect("/dashboard");

  const measurements = await getClientMeasurements(client.id);

  const latest = measurements[0];
  const previous = measurements[1];

  const weightData = measurements.map((m) => ({
    date: m.date,
    value: m.weightKg ? Number(m.weightKg) : null,
  }));
  const bodyFatData = measurements.map((m) => ({
    date: m.date,
    value: m.bodyFatPct ? Number(m.bodyFatPct) : null,
  }));
  const muscleData = measurements.map((m) => ({
    date: m.date,
    value: m.muscleMassPct ? Number(m.muscleMassPct) : null,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-charcoal">
          {d.dashboard.progress.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          {d.dashboard.progress.subtitle}
        </p>
      </div>

      {measurements.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <div className="mb-4 rounded-full bg-blue-50 p-4">
            <Activity className="size-8 text-blue-600" />
          </div>
          <p className="text-lg font-semibold text-charcoal">{d.dashboard.progress.noMeasurements}</p>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {d.dashboard.progress.noMeasurementsMessage}
          </p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50">
                    <Scale className="size-5 text-blue-600" />
                  </div>
                  <TrendBadge current={latest?.weightKg} previous={previous?.weightKg} />
                </div>
                <p className="mt-3 text-2xl font-bold text-charcoal">
                  {latest?.weightKg ? `${Number(latest.weightKg).toFixed(1)}${d.dashboard.kgSuffix}` : d.common.emDash}
                </p>
                <p className="text-xs text-muted-foreground">{d.dashboard.profile.weight}</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-orange-50">
                    <Activity className="size-5 text-orange-600" />
                  </div>
                  <TrendBadge current={latest?.bodyFatPct} previous={previous?.bodyFatPct} />
                </div>
                <p className="mt-3 text-2xl font-bold text-charcoal">
                  {latest?.bodyFatPct ? `${Number(latest.bodyFatPct).toFixed(1)}%` : d.common.emDash}
                </p>
                <p className="text-xs text-muted-foreground">{d.dashboard.bodyFat}</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-green-50">
                    <Dumbbell className="size-5 text-green-600" />
                  </div>
                  <TrendBadge current={latest?.muscleMassPct} previous={previous?.muscleMassPct} />
                </div>
                <p className="mt-3 text-2xl font-bold text-charcoal">
                  {latest?.muscleMassPct
                    ? `${Number(latest.muscleMassPct).toFixed(1)}%`
                    : d.common.emDash}
                </p>
                <p className="text-xs text-muted-foreground">{d.dashboard.muscleMass}</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-purple-50">
                    <Heart className="size-5 text-purple-600" />
                  </div>
                  <TrendBadge current={latest?.bmi} previous={previous?.bmi} />
                </div>
                <p className="mt-3 text-2xl font-bold text-charcoal">
                  {latest?.bmi ? Number(latest.bmi).toFixed(1) : d.common.emDash}
                </p>
                <p className="text-xs text-muted-foreground">{d.dashboard.bmi}</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{d.dashboard.progress.weightKg}</CardTitle>
              </CardHeader>
              <CardContent>
                <MiniChart data={weightData} color="#3b82f6" height={120} />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{d.dashboard.progress.bodyFatPct}</CardTitle>
              </CardHeader>
              <CardContent>
                <MiniChart data={bodyFatData} color="#f97316" height={120} />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{d.dashboard.progress.muscleMassPct}</CardTitle>
              </CardHeader>
              <CardContent>
                <MiniChart data={muscleData} color="#22c55e" height={120} />
              </CardContent>
            </Card>
          </div>

          {/* Measurement History Table */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">{d.dashboard.progress.measurementHistory}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs text-muted-foreground">
                      <th className="pb-2 pr-4 font-medium">{d.dashboard.progress.dateHeader}</th>
                      <th className="pb-2 pr-4 font-medium">{d.dashboard.progress.weightHeader}</th>
                      <th className="pb-2 pr-4 font-medium">{d.dashboard.progress.fatHeader}</th>
                      <th className="pb-2 pr-4 font-medium">{d.dashboard.progress.muscleHeader}</th>
                      <th className="pb-2 pr-4 font-medium">{d.dashboard.progress.bmiHeader}</th>
                      <th className="pb-2 font-medium">{d.dashboard.progress.notesHeader}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {measurements.map((m) => (
                      <tr key={m.id} className="border-b border-border/40 last:border-0">
                        <td className="py-2.5 pr-4 font-medium">{m.date}</td>
                        <td className="py-2.5 pr-4">
                          {m.weightKg ? Number(m.weightKg).toFixed(1) : d.common.emDash}
                        </td>
                        <td className="py-2.5 pr-4">
                          {m.bodyFatPct ? Number(m.bodyFatPct).toFixed(1) : d.common.emDash}
                        </td>
                        <td className="py-2.5 pr-4">
                          {m.muscleMassPct ? Number(m.muscleMassPct).toFixed(1) : d.common.emDash}
                        </td>
                        <td className="py-2.5 pr-4">
                          {m.bmi ? Number(m.bmi).toFixed(1) : d.common.emDash}
                        </td>
                        <td className="py-2.5 max-w-[200px] truncate text-muted-foreground">
                          {m.notes ?? d.common.emDash}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
