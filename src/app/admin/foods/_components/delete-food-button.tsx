"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteFood } from "@/actions/foods";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDictionary } from "@/lib/i18n/context";

export function DeleteFoodButton({
  foodId,
  foodName,
}: {
  foodId: string;
  foodName: string;
}) {
  const d = useDictionary();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            aria-label={`${d.common.delete} ${foodName}`}
          />
        }
      >
        <Trash2 className="size-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{d.admin.foods.deleteFood.title}</DialogTitle>
          <DialogDescription>
            {d.admin.foods.foodGroupsPage.removePrefix}<span className="font-medium text-foreground">{foodName}</span>{" "}
            {d.admin.foods.deleteFood.confirmMessage}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            {d.common.cancel}
          </Button>
          <form action={deleteFood.bind(null, foodId)}>
            <Button type="submit" variant="destructive">
              {d.common.delete}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
