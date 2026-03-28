"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export function NewClientFormSelects() {
  return (
    <>
      <div className="space-y-2">
        <Label>Sex</Label>
        <Select name="sex">
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
        <Select name="goal">
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
    </>
  );
}
