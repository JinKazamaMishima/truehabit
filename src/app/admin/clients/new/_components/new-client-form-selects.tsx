"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDictionary } from "@/lib/i18n/context";

export function NewClientFormSelects() {
  const d = useDictionary();
  const nc = d.admin.clients.newClient;

  const goalOptions = Object.entries(d.admin.clients.goalLabels).map(
    ([value, label]) => ({ value, label }),
  );

  const sexOptions = [
    { value: "male", label: nc.male },
    { value: "female", label: nc.female },
  ];

  return (
    <>
      <div className="space-y-2">
        <Label>{nc.sex}</Label>
        <Select name="sex">
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
        <Select name="goal">
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
    </>
  );
}
