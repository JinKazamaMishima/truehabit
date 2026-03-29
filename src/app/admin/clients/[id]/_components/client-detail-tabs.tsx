"use client";

import Link from "next/link";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateClient, addMeasurement, deleteClient } from "@/actions/clients";
import { Plus, Trash2 } from "lucide-react";
import { useDictionary } from "@/lib/i18n/context";

type Client = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  dateOfBirth: string | null;
  sex: "male" | "female" | null;
  goal: string | null;
  activityLevel: string | null;
  sport: string | null;
  notes: string | null;
  status: "active" | "inactive";
};

type Measurement = {
  id: string;
  date: string;
  weightKg: string | null;
  bodyFatPct: string | null;
  muscleMassPct: string | null;
  bmi: string | null;
  heightCm: string | null;
  notes: string | null;
};

type MealPlan = {
  id: string;
  name: string;
  status: "draft" | "active" | "completed";
  startDate: string | null;
  endDate: string | null;
  calorieTarget: number | null;
};

const planStatusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  active: "bg-brand/15 text-brand-dark",
  completed: "bg-blue-100 text-blue-700",
};

export function ClientDetailTabs({
  client,
  measurements,
  mealPlans,
  goalLabels,
}: {
  client: Client;
  measurements: Measurement[];
  mealPlans: MealPlan[];
  goalLabels: Record<string, string>;
}) {
  const d = useDictionary();
  const nc = d.admin.clients.newClient;
  const dt = d.admin.clients.detail;
  const mh = dt.measurementHeaders;

  const [showMeasurementForm, setShowMeasurementForm] = useState(false);

  const goalOptions = Object.entries(d.admin.clients.goalLabels).map(
    ([value, label]) => ({ value, label }),
  );

  const sexOptions = [
    { value: "male", label: nc.male },
    { value: "female", label: nc.female },
  ];

  const updateClientWithId = updateClient.bind(null, client.id);
  const addMeasurementWithId = addMeasurement.bind(null, client.id);
  const deleteClientWithId = deleteClient.bind(null, client.id);

  return (
    <Tabs defaultValue="profile">
      <TabsList>
        <TabsTrigger value="profile">{dt.tabs.profile}</TabsTrigger>
        <TabsTrigger value="measurements">{dt.tabs.measurements}</TabsTrigger>
        <TabsTrigger value="meal-plans">{dt.tabs.mealPlans}</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>{dt.profileCard}</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={updateClientWithId} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">{nc.fullName}</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={client.name}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{nc.email}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={client.email ?? ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{nc.phone}</Label>
                  <Input
                    id="phone"
                    name="phone"
                    defaultValue={client.phone ?? ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">{nc.dateOfBirth}</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    defaultValue={client.dateOfBirth ?? ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{nc.sex}</Label>
                  <Select name="sex" defaultValue={client.sex ?? ""}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={nc.selectSex} />
                    </SelectTrigger>
                    <SelectContent>
                      {sexOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{nc.goal}</Label>
                  <Select name="goal" defaultValue={client.goal ?? ""}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={nc.selectGoal} />
                    </SelectTrigger>
                    <SelectContent>
                      {goalOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activityLevel">{nc.activityLevel}</Label>
                  <Input
                    id="activityLevel"
                    name="activityLevel"
                    defaultValue={client.activityLevel ?? ""}
                    placeholder={nc.activityLevelPlaceholder}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sport">{nc.sport}</Label>
                  <Input
                    id="sport"
                    name="sport"
                    defaultValue={client.sport ?? ""}
                    placeholder={nc.sportPlaceholder}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">{nc.notes}</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  defaultValue={client.notes ?? ""}
                  rows={4}
                />
              </div>
              <div className="flex justify-between">
                <form action={deleteClientWithId}>
                  <Button type="submit" variant="destructive" size="sm">
                    <Trash2 className="size-4" />
                    {dt.deleteClient}
                  </Button>
                </form>
                <Button type="submit">{d.common.saveChanges}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="measurements">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>{dt.measurementsTitle}</CardTitle>
            <Button
              size="sm"
              onClick={() => setShowMeasurementForm(!showMeasurementForm)}
            >
              <Plus className="size-4" />
              {dt.addMeasurement}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {showMeasurementForm && (
              <form
                action={async (formData) => {
                  await addMeasurementWithId(formData);
                  setShowMeasurementForm(false);
                }}
                className="space-y-4 rounded-lg border bg-muted/30 p-4"
              >
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="m-date">{mh.date}</Label>
                    <Input id="m-date" name="date" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="m-weight">{mh.weightKg}</Label>
                    <Input
                      id="m-weight"
                      name="weightKg"
                      type="number"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="m-height">{mh.heightCm}</Label>
                    <Input
                      id="m-height"
                      name="heightCm"
                      type="number"
                      step="0.1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="m-bfp">{mh.bodyFatPct}</Label>
                    <Input
                      id="m-bfp"
                      name="bodyFatPct"
                      type="number"
                      step="0.1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="m-mm">{mh.muscleMassPct}</Label>
                    <Input
                      id="m-mm"
                      name="muscleMassPct"
                      type="number"
                      step="0.1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="m-bmi">{mh.bmi}</Label>
                    <Input
                      id="m-bmi"
                      name="bmi"
                      type="number"
                      step="0.01"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="m-notes">{mh.notes}</Label>
                  <Textarea id="m-notes" name="notes" rows={2} />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="sm">
                    {d.common.save}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMeasurementForm(false)}
                  >
                    {d.common.cancel}
                  </Button>
                </div>
              </form>
            )}

            {measurements.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                {dt.noMeasurements}
              </p>
            ) : (
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{mh.date}</TableHead>
                      <TableHead>{mh.weightKg}</TableHead>
                      <TableHead>{mh.bodyFatPct}</TableHead>
                      <TableHead>{mh.muscleMassPct}</TableHead>
                      <TableHead>{mh.bmi}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {measurements.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell className="font-medium">{m.date}</TableCell>
                        <TableCell>{m.weightKg ?? d.common.emDash}</TableCell>
                        <TableCell>{m.bodyFatPct ?? d.common.emDash}</TableCell>
                        <TableCell>{m.muscleMassPct ?? d.common.emDash}</TableCell>
                        <TableCell>{m.bmi ?? d.common.emDash}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="meal-plans">
        <Card>
          <CardHeader>
            <CardTitle>{dt.assignedMealPlans}</CardTitle>
          </CardHeader>
          <CardContent>
            {mealPlans.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                {dt.noMealPlans}
              </p>
            ) : (
              <div className="space-y-3">
                {mealPlans.map((plan) => (
                  <Link
                    key={plan.id}
                    href={`/admin/meal-plans/${plan.id}`}
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div>
                      <p className="font-medium">{plan.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {plan.startDate && plan.endDate
                          ? `${plan.startDate} — ${plan.endDate}`
                          : dt.noDatesSet}
                        {plan.calorieTarget &&
                          ` · ${plan.calorieTarget} kcal`}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={planStatusColors[plan.status] ?? ""}
                    >
                      {plan.status}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
