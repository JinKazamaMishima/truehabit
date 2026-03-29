import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getClientByLinkedUser, getClientMeasurements } from "@/actions/customer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  UserCircle,
  Mail,
  Phone,
  Cake,
  Target,
  Activity,
  Medal,
  Scale,
  Ruler,
} from "lucide-react";
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n";

const goalColors: Record<string, string> = {
  fat_loss: "bg-red-50 text-red-700 border-red-200",
  muscle_gain: "bg-blue-50 text-blue-700 border-blue-200",
  weight_cut: "bg-orange-50 text-orange-700 border-orange-200",
  maintenance: "bg-green-50 text-green-700 border-green-200",
  pre_competition: "bg-purple-50 text-purple-700 border-purple-200",
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const locale = await getLocale();
  const d = await getDictionary(locale);

  const client = await getClientByLinkedUser(session.user.id!);
  if (!client) redirect("/dashboard");

  const measurements = await getClientMeasurements(client.id);
  const latest = measurements[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-charcoal">
          {d.dashboard.profile.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          {d.dashboard.profile.subtitle}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="border-0 shadow-sm lg:col-span-1">
          <CardContent className="flex flex-col items-center pt-8 pb-6 text-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-3xl font-bold text-white">
              {client.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="mt-4 text-xl font-bold text-charcoal">{client.name}</h2>
            {client.goal && (
              <Badge
                className={`mt-2 border ${goalColors[client.goal] ?? "bg-muted"}`}
              >
                <Target className="mr-1 size-3" />
                {d.dashboard.goalLabels[client.goal as keyof typeof d.dashboard.goalLabels] ?? client.goal}
              </Badge>
            )}
            <Badge variant="outline" className="mt-1.5 text-xs capitalize">
              {client.status === "active" ? d.common.active : d.common.inactive}
            </Badge>
          </CardContent>
        </Card>

        {/* Personal Info */}
        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <UserCircle className="size-5 text-brand" />
              {d.dashboard.profile.personalInfo}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoRow
                icon={<Mail className="size-4 text-muted-foreground" />}
                label={d.common.email}
                value={client.email}
              />
              <InfoRow
                icon={<Phone className="size-4 text-muted-foreground" />}
                label={d.common.phone}
                value={client.phone}
              />
              <InfoRow
                icon={<Cake className="size-4 text-muted-foreground" />}
                label={d.dashboard.profile.dateOfBirth}
                value={client.dateOfBirth}
              />
              <InfoRow
                icon={<UserCircle className="size-4 text-muted-foreground" />}
                label={d.dashboard.profile.sex}
                value={
                  client.sex === "male"
                    ? d.dashboard.profile.male
                    : client.sex === "female"
                      ? d.dashboard.profile.female
                      : null
                }
              />
              <InfoRow
                icon={<Activity className="size-4 text-muted-foreground" />}
                label={d.dashboard.profile.activityLevel}
                value={client.activityLevel}
              />
              <InfoRow
                icon={<Medal className="size-4 text-muted-foreground" />}
                label={d.dashboard.profile.sport}
                value={client.sport}
              />
            </div>
            {client.notes && (
              <div className="mt-4 rounded-lg bg-muted/50 p-3">
                <p className="text-xs font-medium text-muted-foreground mb-1">{d.common.notes}</p>
                <p className="text-sm text-charcoal">{client.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Goal & Latest Measurements */}
      {client.goal && (
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="size-5 text-brand" />
              {d.dashboard.profile.currentGoal}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
              <div
                className={`flex items-center gap-3 rounded-xl border px-5 py-4 ${goalColors[client.goal] ?? "bg-muted"}`}
              >
                <Target className="size-8" />
                <div>
                  <p className="text-lg font-bold">
                    {d.dashboard.goalLabels[client.goal as keyof typeof d.dashboard.goalLabels] ?? client.goal}
                  </p>
                  <p className="text-xs opacity-70">{d.dashboard.profile.goalDescription}</p>
                </div>
              </div>

              {latest && (
                <div className="flex flex-wrap gap-4">
                  <MeasurementPill
                    icon={<Scale className="size-4" />}
                    label={d.dashboard.profile.weight}
                    value={
                      latest.weightKg
                        ? `${Number(latest.weightKg).toFixed(1)}${d.dashboard.kgSuffix}`
                        : null
                    }
                  />
                  <MeasurementPill
                    icon={<Ruler className="size-4" />}
                    label={d.dashboard.height}
                    value={
                      latest.heightCm
                        ? `${Number(latest.heightCm).toFixed(0)}${d.dashboard.cmSuffix}`
                        : null
                    }
                  />
                  <MeasurementPill
                    icon={<Activity className="size-4" />}
                    label={d.dashboard.bmi}
                    value={latest.bmi ? Number(latest.bmi).toFixed(1) : null}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border/40 bg-white p-3">
      {icon}
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium text-charcoal">
          {value ?? "—"}
        </p>
      </div>
    </div>
  );
}

function MeasurementPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-4 py-2">
      {icon}
      <div>
        <p className="text-[10px] text-muted-foreground">{label}</p>
        <p className="text-sm font-bold text-charcoal">{value ?? "—"}</p>
      </div>
    </div>
  );
}
