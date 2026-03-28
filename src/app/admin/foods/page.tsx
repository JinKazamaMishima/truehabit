import Link from "next/link";
import { Apple, Pencil, Plus, Search, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import { foods, foodGroups } from "@/lib/db/schema";
import { and, asc, eq, like } from "drizzle-orm";
import { DeleteFoodButton } from "./_components/delete-food-button";

function formatG(val: string | null | undefined) {
  if (val == null || val === "") return "—";
  const n = Number(val);
  if (Number.isNaN(n)) return "—";
  return `${n.toFixed(1)}g`;
}

function formatKcal(val: string | null | undefined) {
  if (val == null || val === "") return "—";
  const n = Number(val);
  if (Number.isNaN(n)) return "—";
  return `${n.toFixed(0)} kcal`;
}

function servingText(
  qty: string | null | undefined,
  unit: string | null | undefined
) {
  if ((qty == null || qty === "") && (unit == null || unit === "")) return "—";
  const q = qty != null && qty !== "" ? String(qty) : "";
  const u = unit?.trim() ?? "";
  return [q, u].filter(Boolean).join(" ") || "—";
}

export default async function FoodsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; group?: string }>;
}) {
  const { q, group: groupId } = await searchParams;

  const allGroups = await db
    .select()
    .from(foodGroups)
    .orderBy(asc(foodGroups.displayOrder), asc(foodGroups.name));

  const conditions = [];
  if (q?.trim()) {
    conditions.push(like(foods.name, `%${q.trim()}%`));
  }
  if (groupId?.trim()) {
    conditions.push(eq(foods.foodGroupId, groupId.trim()));
  }

  const qb = db
    .select({
      food: foods,
      group: foodGroups,
    })
    .from(foods)
    .leftJoin(foodGroups, eq(foods.foodGroupId, foodGroups.id));

  const rows =
    conditions.length > 0
      ? await qb.where(and(...conditions)).orderBy(asc(foods.name))
      : await qb.orderBy(asc(foods.name));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Food Database</h1>
          <p className="text-muted-foreground">
            Manage foods, macros, and portions for meal planning.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="border-emerald-600/40 text-emerald-700 hover:bg-emerald-600/10 dark:text-emerald-400"
            render={<Link href="/admin/foods/food-groups" />}
          >
            <Tags className="size-4" />
            Food groups
          </Button>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            render={<Link href="/admin/foods/new" />}
          >
            <Plus className="size-4" />
            Add Food
          </Button>
        </div>
      </div>

      <form className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="relative min-w-[200px] flex-1 sm:max-w-sm">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="q"
            placeholder="Search by name…"
            defaultValue={q ?? ""}
            className="pl-9"
          />
        </div>
        <div className="flex w-full flex-col gap-1 sm:w-56">
          <label htmlFor="group" className="text-xs font-medium text-muted-foreground">
            Food group
          </label>
          <select
            id="group"
            name="group"
            defaultValue={groupId ?? ""}
            className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          >
            <option value="">All groups</option>
            {allGroups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" variant="secondary" size="sm" className="w-full sm:w-auto">
          Apply filters
        </Button>
      </form>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-emerald-600/25 bg-emerald-600/[0.03] py-16">
          <Apple className="mb-3 size-10 text-emerald-600/40" />
          <p className="text-sm font-medium text-muted-foreground">
            {q || groupId
              ? "No foods match your filters."
              : "No foods in the database yet."}
          </p>
          {!q && !groupId && (
            <Button
              variant="outline"
              className="mt-4 border-emerald-600/40"
              render={<Link href="/admin/foods/new" />}
            >
              <Plus className="size-4" />
              Add your first food
            </Button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-emerald-600/10">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead>Food Group</TableHead>
                <TableHead>Serving</TableHead>
                <TableHead>Calories</TableHead>
                <TableHead>Protein</TableHead>
                <TableHead>Carbs</TableHead>
                <TableHead>Fat</TableHead>
                <TableHead>Free?</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ food, group }) => (
                <TableRow key={food.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/admin/foods/${food.id}`}
                      className="text-emerald-700 hover:underline dark:text-emerald-400"
                    >
                      {food.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {group?.name ?? "—"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {servingText(food.baseServingQty, food.baseServingUnit)}
                  </TableCell>
                  <TableCell>{formatKcal(food.calories)}</TableCell>
                  <TableCell>{formatG(food.proteinG)}</TableCell>
                  <TableCell>{formatG(food.carbsG)}</TableCell>
                  <TableCell>{formatG(food.fatG)}</TableCell>
                  <TableCell>
                    {food.isFree ? (
                      <Badge className="bg-emerald-600/15 text-emerald-800 dark:text-emerald-300">
                        Yes
                      </Badge>
                    ) : (
                      <Badge variant="secondary">No</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        render={<Link href={`/admin/foods/${food.id}`} />}
                      >
                        <Pencil className="size-4" />
                        Edit
                      </Button>
                      <DeleteFoodButton foodId={food.id} foodName={food.name} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
