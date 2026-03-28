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

const goalOptions = [
  { value: "fat_loss", label: "Fat Loss" },
  { value: "muscle_gain", label: "Muscle Gain" },
  { value: "weight_cut", label: "Weight Cut" },
  { value: "maintenance", label: "Maintenance" },
  { value: "pre_competition", label: "Pre-Competition" },
];

const sexOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

const planStatusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  active: "bg-emerald-100 text-emerald-700",
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
  const [showMeasurementForm, setShowMeasurementForm] = useState(false);

  const updateClientWithId = updateClient.bind(null, client.id);
  const addMeasurementWithId = addMeasurement.bind(null, client.id);
  const deleteClientWithId = deleteClient.bind(null, client.id);

  return (
    <Tabs defaultValue="profile">
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="measurements">Measurements</TabsTrigger>
        <TabsTrigger value="meal-plans">Meal Plans</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={updateClientWithId} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={client.name}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={client.email ?? ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    defaultValue={client.phone ?? ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    defaultValue={client.dateOfBirth ?? ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sex</Label>
                  <Select name="sex" defaultValue={client.sex ?? ""}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select sex" />
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
                  <Label>Goal</Label>
                  <Select name="goal" defaultValue={client.goal ?? ""}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select goal" />
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
                  <Label htmlFor="activityLevel">Activity Level</Label>
                  <Input
                    id="activityLevel"
                    name="activityLevel"
                    defaultValue={client.activityLevel ?? ""}
                    placeholder="e.g. Moderate, High"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sport">Sport</Label>
                  <Input
                    id="sport"
                    name="sport"
                    defaultValue={client.sport ?? ""}
                    placeholder="e.g. Swimming, Running"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
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
                    Delete Client
                  </Button>
                </form>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="measurements">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Body Measurements</CardTitle>
            <Button
              size="sm"
              onClick={() => setShowMeasurementForm(!showMeasurementForm)}
            >
              <Plus className="size-4" />
              Add Measurement
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
                    <Label htmlFor="m-date">Date</Label>
                    <Input id="m-date" name="date" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="m-weight">Weight (kg)</Label>
                    <Input
                      id="m-weight"
                      name="weightKg"
                      type="number"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="m-height">Height (cm)</Label>
                    <Input
                      id="m-height"
                      name="heightCm"
                      type="number"
                      step="0.1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="m-bfp">Body Fat %</Label>
                    <Input
                      id="m-bfp"
                      name="bodyFatPct"
                      type="number"
                      step="0.1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="m-mm">Muscle Mass %</Label>
                    <Input
                      id="m-mm"
                      name="muscleMassPct"
                      type="number"
                      step="0.1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="m-bmi">BMI</Label>
                    <Input
                      id="m-bmi"
                      name="bmi"
                      type="number"
                      step="0.01"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="m-notes">Notes</Label>
                  <Textarea id="m-notes" name="notes" rows={2} />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="sm">
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMeasurementForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {measurements.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No measurements recorded yet.
              </p>
            ) : (
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Weight (kg)</TableHead>
                      <TableHead>Body Fat %</TableHead>
                      <TableHead>Muscle Mass %</TableHead>
                      <TableHead>BMI</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {measurements.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell className="font-medium">{m.date}</TableCell>
                        <TableCell>{m.weightKg ?? "—"}</TableCell>
                        <TableCell>{m.bodyFatPct ?? "—"}</TableCell>
                        <TableCell>{m.muscleMassPct ?? "—"}</TableCell>
                        <TableCell>{m.bmi ?? "—"}</TableCell>
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
            <CardTitle>Assigned Meal Plans</CardTitle>
          </CardHeader>
          <CardContent>
            {mealPlans.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No meal plans assigned yet.
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
                          : "No dates set"}
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
