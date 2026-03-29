"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTemplate, type CreateTemplateInput } from "@/actions/meal-plans";
import { useDictionary } from "@/lib/i18n/context";

interface FoodGroup {
  id: string;
  name: string;
  displayOrder: number;
}

interface SlotState {
  key: string;
  slotName: string;
  timeRange: string;
  notes: string;
  foodGroupPortions: Record<string, string>;
}

const DAY_TYPES = ["training", "rest", "competition"] as const;

function makeSlot(slotName = ""): SlotState {
  return {
    key: crypto.randomUUID(),
    slotName,
    timeRange: "",
    notes: "",
    foodGroupPortions: {},
  };
}

export function TemplateForm({ foodGroups }: { foodGroups: FoodGroup[] }) {
  const d = useDictionary();
  const f = d.admin.mealPlans.templates.form;

  const DAY_TYPE_LABELS: Record<string, string> = {
    training: f.training,
    rest: f.rest,
    competition: f.competition,
  };

  const GOAL_OPTIONS = [
    { value: "fat_loss", label: f.goalLabels.fat_loss },
    { value: "muscle_gain", label: f.goalLabels.muscle_gain },
    { value: "weight_cut", label: f.goalLabels.weight_cut },
    { value: "maintenance", label: f.goalLabels.maintenance },
    { value: "pre_competition", label: f.goalLabels.pre_competition },
  ];

  const DEFAULT_SLOT_NAMES = [
    f.defaultSlotNames.breakfast,
    f.defaultSlotNames.snack1,
    f.defaultSlotNames.lunch,
    f.defaultSlotNames.snack2,
    f.defaultSlotNames.preWorkout,
    f.defaultSlotNames.recovery,
    f.defaultSlotNames.dinner,
  ];

  const defaultInitialSlots = [
    f.defaultSlotNames.breakfast,
    f.defaultSlotNames.lunch,
    f.defaultSlotNames.dinner,
  ];

  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [goalType, setGoalType] = useState<string>("");
  const [description, setDescription] = useState("");
  const [selectedDayTypes, setSelectedDayTypes] = useState<Set<string>>(
    new Set(["training"])
  );

  const [slotsByDayType, setSlotsByDayType] = useState<
    Record<string, SlotState[]>
  >(() => ({
    training: defaultInitialSlots.map((name) => makeSlot(name)),
    rest: [],
    competition: [],
  }));

  function toggleDayType(dt: string) {
    setSelectedDayTypes((prev) => {
      const next = new Set(prev);
      if (next.has(dt)) {
        next.delete(dt);
      } else {
        next.add(dt);
        if (!slotsByDayType[dt] || slotsByDayType[dt].length === 0) {
          setSlotsByDayType((s) => ({
            ...s,
            [dt]: defaultInitialSlots.map((name) => makeSlot(name)),
          }));
        }
      }
      return next;
    });
  }

  function addSlot(dayType: string) {
    setSlotsByDayType((prev) => ({
      ...prev,
      [dayType]: [...(prev[dayType] || []), makeSlot()],
    }));
  }

  function removeSlot(dayType: string, key: string) {
    setSlotsByDayType((prev) => ({
      ...prev,
      [dayType]: prev[dayType].filter((s) => s.key !== key),
    }));
  }

  function updateSlot(
    dayType: string,
    key: string,
    field: keyof SlotState,
    value: string
  ) {
    setSlotsByDayType((prev) => ({
      ...prev,
      [dayType]: prev[dayType].map((s) =>
        s.key === key ? { ...s, [field]: value } : s
      ),
    }));
  }

  function updateFoodGroupPortion(
    dayType: string,
    slotKey: string,
    fgId: string,
    value: string
  ) {
    setSlotsByDayType((prev) => ({
      ...prev,
      [dayType]: prev[dayType].map((s) =>
        s.key === slotKey
          ? {
              ...s,
              foodGroupPortions: { ...s.foodGroupPortions, [fgId]: value },
            }
          : s
      ),
    }));
  }

  function handleSubmit() {
    const dayTypesArray = Array.from(selectedDayTypes);
    const allSlots = dayTypesArray.flatMap((dt, _dtIdx) =>
      (slotsByDayType[dt] || []).map((slot, idx) => ({
        slotName: slot.slotName,
        dayType: dt as "training" | "rest" | "competition",
        timeRange: slot.timeRange,
        displayOrder: idx,
        notes: slot.notes,
        foodGroupPortions: Object.entries(slot.foodGroupPortions)
          .filter(([, v]) => Number(v) > 0)
          .map(([foodGroupId, portionCount]) => ({
            foodGroupId,
            portionCount,
          })),
      }))
    );

    const data: CreateTemplateInput = {
      name,
      goalType: (goalType as CreateTemplateInput["goalType"]) || null,
      description,
      dayTypes: dayTypesArray,
      slots: allSlots,
    };

    startTransition(() => {
      createTemplate(data);
    });
  }

  const activeDayTypes = DAY_TYPES.filter((dt) => selectedDayTypes.has(dt));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{f.cardTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="template-name">{f.templateName}</Label>
              <Input
                id="template-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={f.templateNamePlaceholder}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>{f.goalType}</Label>
              <Select
                value={goalType}
                onValueChange={(v) => setGoalType(v ?? "")}
                items={Object.fromEntries(GOAL_OPTIONS.map((o) => [o.value, o.label]))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={f.selectGoal} />
                </SelectTrigger>
                <SelectContent>
                  {GOAL_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="template-desc">{f.description}</Label>
            <Textarea
              id="template-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder={f.descriptionPlaceholder}
            />
          </div>
          <div className="space-y-2">
            <Label>{f.dayTypes}</Label>
            <div className="flex flex-wrap gap-4">
              {DAY_TYPES.map((dt) => (
                <label key={dt} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={selectedDayTypes.has(dt)}
                    onCheckedChange={() => toggleDayType(dt)}
                  />
                  {DAY_TYPE_LABELS[dt]}
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {activeDayTypes.map((dayType) => (
        <Card key={dayType}>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Badge variant="outline" className="capitalize">
                {DAY_TYPE_LABELS[dayType]}
              </Badge>
              {f.slotsCard}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addSlot(dayType)}
            >
              <Plus className="size-4" />
              {f.addSlot}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {(slotsByDayType[dayType] || []).length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                {f.noSlots}
              </p>
            )}
            {(slotsByDayType[dayType] || []).map((slot, idx) => (
              <div
                key={slot.key}
                className="space-y-4 rounded-lg border bg-muted/30 p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="grid flex-1 gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label>{f.slotName}</Label>
                      <div className="flex gap-2">
                        <Select
                          value={
                            DEFAULT_SLOT_NAMES.includes(slot.slotName)
                              ? slot.slotName
                              : "__custom__"
                          }
                          onValueChange={(v) => {
                            if (!v || v === "__custom__") {
                              updateSlot(dayType, slot.key, "slotName", "");
                            } else {
                              updateSlot(dayType, slot.key, "slotName", v);
                            }
                          }}
                          items={{
                            ...Object.fromEntries(DEFAULT_SLOT_NAMES.map((sn) => [sn, sn])),
                            __custom__: f.customSlot,
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={f.selectSlot} />
                          </SelectTrigger>
                          <SelectContent>
                            {DEFAULT_SLOT_NAMES.map((sn) => (
                              <SelectItem key={sn} value={sn}>
                                {sn}
                              </SelectItem>
                            ))}
                            <SelectItem value="__custom__">{f.customSlot}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {!DEFAULT_SLOT_NAMES.includes(slot.slotName) && (
                        <Input
                          value={slot.slotName}
                          onChange={(e) =>
                            updateSlot(
                              dayType,
                              slot.key,
                              "slotName",
                              e.target.value
                            )
                          }
                          placeholder={f.customSlotName}
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>{f.timeRange}</Label>
                      <Input
                        value={slot.timeRange}
                        onChange={(e) =>
                          updateSlot(
                            dayType,
                            slot.key,
                            "timeRange",
                            e.target.value
                          )
                        }
                        placeholder={f.timeRangePlaceholder}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{f.slotNotes}</Label>
                      <Input
                        value={slot.notes}
                        onChange={(e) =>
                          updateSlot(
                            dayType,
                            slot.key,
                            "notes",
                            e.target.value
                          )
                        }
                        placeholder={f.slotNotesPlaceholder}
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="mt-6 text-destructive"
                    onClick={() => removeSlot(dayType, slot.key)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>

                {foodGroups.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <Label className="mb-2">
                        {f.foodGroupPortions}
                      </Label>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3 md:grid-cols-4">
                        {foodGroups.map((fg) => (
                          <div
                            key={fg.id}
                            className="flex items-center gap-2"
                          >
                            <span className="flex-1 truncate text-xs text-muted-foreground">
                              {fg.name}
                            </span>
                            <Input
                              type="number"
                              min="0"
                              step="0.5"
                              className="w-16 text-center"
                              value={slot.foodGroupPortions[fg.id] ?? ""}
                              onChange={(e) =>
                                updateFoodGroupPortion(
                                  dayType,
                                  slot.key,
                                  fg.id,
                                  e.target.value
                                )
                              }
                              placeholder="0"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-end gap-2">
        <Button
          onClick={handleSubmit}
          disabled={isPending || !name.trim()}
        >
          {isPending ? d.common.saving : f.createTemplate}
        </Button>
      </div>
    </div>
  );
}
