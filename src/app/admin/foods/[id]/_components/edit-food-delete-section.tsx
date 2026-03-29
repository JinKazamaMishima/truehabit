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
import { useDictionary } from "@/lib/i18n/context";

export function EditFoodDeleteSection({
  foodId,
  foodName,
}: {
  foodId: string;
  foodName: string;
}) {
  const d = useDictionary();
  const [open, setOpen] = useState(false);

  return (
    <Card className="border-destructive/20 bg-destructive/[0.02]">
      <CardHeader>
        <CardTitle className="text-base">{d.common.dangerZone}</CardTitle>
        <CardDescription>
          {d.admin.foods.deleteFood.dangerDescription}
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
            {d.admin.foods.deleteFood.deleteButton}
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{d.admin.foods.deleteFood.confirmTitle}</DialogTitle>
              <DialogDescription>
                {d.admin.foods.foodGroupsPage.removePrefix}
                <span className="font-medium text-foreground">{foodName}</span>
                {d.admin.foods.deleteFood.confirmDetail}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                {d.common.cancel}
              </Button>
              <form action={deleteFood.bind(null, foodId)}>
                <Button type="submit" variant="destructive">
                  {d.admin.foods.deleteFood.deletePermanently}
                </Button>
              </form>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
