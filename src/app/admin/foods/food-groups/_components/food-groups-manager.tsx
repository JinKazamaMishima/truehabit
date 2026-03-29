"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";
import {
  createFoodGroup,
  updateFoodGroup,
  deleteFoodGroup,
} from "@/actions/foods";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

export type FoodGroupRow = {
  id: string;
  name: string;
  displayOrder: number;
};

export function FoodGroupsManager({ groups }: { groups: FoodGroupRow[] }) {
  const d = useDictionary();
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<FoodGroupRow | null>(null);
  const [deleting, setDeleting] = useState<FoodGroupRow | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit gap-2 text-muted-foreground"
          render={<Link href="/admin/foods" />}
        >
          <ArrowLeft className="size-4" />
          {d.admin.foods.foodGroupsPage.backToFoods}
        </Button>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger
            render={
              <Button className="bg-brand hover:bg-brand-dark dark:bg-brand dark:hover:bg-brand" />
            }
          >
            <Plus className="size-4" />
            {d.admin.foods.foodGroupsPage.addGroup}
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{d.admin.foods.foodGroupsPage.newFoodGroup}</DialogTitle>
              <DialogDescription>
                {d.admin.foods.foodGroupsPage.groupsDescription}
              </DialogDescription>
            </DialogHeader>
            <form
              className="space-y-4"
              action={async (fd) => {
                await createFoodGroup(fd);
                setAddOpen(false);
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="add-name">{d.common.name}</Label>
                <Input id="add-name" name="name" required placeholder={d.admin.foods.foodGroupsPage.namePlaceholder} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-order">{d.admin.foods.foodGroupsPage.displayOrder}</Label>
                <Input
                  id="add-order"
                  name="display_order"
                  type="number"
                  defaultValue={0}
                  min={0}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>
                  {d.common.cancel}
                </Button>
                <Button
                  type="submit"
                  className="bg-brand hover:bg-brand-dark dark:bg-brand dark:hover:bg-brand"
                >
                  {d.common.create}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {groups.length === 0 ? (
        <div className="rounded-xl border border-dashed border-brand/25 bg-brand/[0.03] py-12 text-center text-sm text-muted-foreground">
          {d.admin.foods.foodGroupsPage.noGroupsYet} <span className="font-medium text-foreground">{d.admin.foods.foodGroupsPage.noGroupsAction}</span>{" "}
          {d.admin.foods.foodGroupsPage.noGroupsEnd}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-brand/10">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-16">{d.admin.foods.foodGroupsPage.tableHeaders.order}</TableHead>
                <TableHead>{d.admin.foods.foodGroupsPage.tableHeaders.name}</TableHead>
                <TableHead className="text-right">{d.admin.foods.foodGroupsPage.tableHeaders.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.map((g) => (
                <TableRow key={g.id}>
                  <TableCell className="text-muted-foreground">{g.displayOrder}</TableCell>
                  <TableCell className="font-medium">{g.name}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditing(g)}
                      >
                        <Pencil className="size-4" />
                        {d.common.edit}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleting(g)}
                      >
                        <Trash2 className="size-4" />
                        {d.common.delete}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={editing != null} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="sm:max-w-md" key={editing?.id}>
          {editing && (
            <>
              <DialogHeader>
                <DialogTitle>{d.admin.foods.foodGroupsPage.editGroup}</DialogTitle>
                <DialogDescription>{d.admin.foods.foodGroupsPage.editDescription}</DialogDescription>
              </DialogHeader>
              <form
                className="space-y-4"
                action={async (fd) => {
                  await updateFoodGroup(editing.id, fd);
                  setEditing(null);
                }}
              >
                <div className="space-y-2">
                  <Label htmlFor="edit-name">{d.common.name}</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    required
                    defaultValue={editing.name}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-order">{d.admin.foods.foodGroupsPage.displayOrder}</Label>
                  <Input
                    id="edit-order"
                    name="display_order"
                    type="number"
                    defaultValue={editing.displayOrder}
                    min={0}
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setEditing(null)}>
                    {d.common.cancel}
                  </Button>
                  <Button
                    type="submit"
                    className="bg-brand hover:bg-brand-dark dark:bg-brand dark:hover:bg-brand"
                  >
                    {d.common.save}
                  </Button>
                </DialogFooter>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={deleting != null} onOpenChange={(o) => !o && setDeleting(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{d.admin.foods.foodGroupsPage.deleteGroup}</DialogTitle>
            <DialogDescription>
              {deleting && (
                <>
                  {d.admin.foods.foodGroupsPage.removePrefix}<span className="font-medium text-foreground">{deleting.name}</span>
                  {d.admin.foods.foodGroupsPage.deleteConfirm}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setDeleting(null)}>
              {d.common.cancel}
            </Button>
            {deleting && (
              <form
                action={async (_formData) => {
                  await deleteFoodGroup(deleting.id);
                  setDeleting(null);
                }}
              >
                <Button type="submit" variant="destructive">
                  {d.common.delete}
                </Button>
              </form>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
