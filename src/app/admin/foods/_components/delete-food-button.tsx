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

export function DeleteFoodButton({
  foodId,
  foodName,
}: {
  foodId: string;
  foodName: string;
}) {
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
            aria-label={`Delete ${foodName}`}
          />
        }
      >
        <Trash2 className="size-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete food</DialogTitle>
          <DialogDescription>
            Remove <span className="font-medium text-foreground">{foodName}</span>{" "}
            from the database? This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <form action={deleteFood.bind(null, foodId)}>
            <Button type="submit" variant="destructive">
              Delete
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
