"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/lib/i18n/context";

export function PrintButton() {
  const d = useDictionary();
  return (
    <Button
      variant="outline"
      onClick={() => window.print()}
      className="gap-2"
    >
      <Printer className="size-4" />
      {d.admin.mealPlans.export.printPdf}
    </Button>
  );
}
