"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteFood } from "@/actions/foods";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function EditFoodDeleteSection({
  foodId,
  foodName,
}: {
  foodId: string;
  foodName: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Card className="border-destructive/20 bg-destructive/[0.02]">
      <CardHeader>
        <CardTitle className="text-base">Danger zone</CardTitle>
        <CardDescription>
          Permanently remove this food from the database.
        </CardDescription>
      </CardHeader>
      <CardFooter className="border-t border-destructive/10 pt-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button type="button" variant="destructive" size="sm" />
            }
          >
            <Trash2 className="size-4" />
            Delete food
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete food</DialogTitle>
              <DialogDescription>
                Remove{" "}
                <span className="font-medium text-foreground">{foodName}</span>?
                Recipes or plans referencing this item may need updates.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <form action={deleteFood.bind(null, foodId)}>
                <Button type="submit" variant="destructive">
                  Delete permanently
                </Button>
              </form>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
