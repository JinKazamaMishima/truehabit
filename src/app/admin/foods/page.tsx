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
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n";

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
  const locale = await getLocale();
  const d = await getDictionary(locale);

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
          <h1 className="text-2xl font-bold tracking-tight">{d.admin.foods.title}</h1>
          <p className="text-muted-foreground">
            {d.admin.foods.subtitle}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="border-brand/40 text-brand-dark hover:bg-brand/10 dark:text-brand"
            render={<Link href="/admin/foods/food-groups" />}
          >
            <Tags className="size-4" />
            {d.admin.foods.foodGroups}
          </Button>
          <Button
            className="bg-brand hover:bg-brand-dark dark:bg-brand dark:hover:bg-brand"
            render={<Link href="/admin/foods/new" />}
          >
            <Plus className="size-4" />
            {d.admin.foods.addFood}
          </Button>
        </div>
      </div>

      <form className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="relative min-w-[200px] flex-1 sm:max-w-sm">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="q"
            placeholder={d.admin.foods.searchPlaceholder}
            defaultValue={q ?? ""}
            className="pl-9"
          />
        </div>
        <div className="flex w-full flex-col gap-1 sm:w-56">
          <label htmlFor="group" className="text-xs font-medium text-muted-foreground">
            {d.admin.foods.foodGroupLabel}
          </label>
          <select
            id="group"
            name="group"
            defaultValue={groupId ?? ""}
            className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          >
            <option value="">{d.admin.foods.allGroups}</option>
            {allGroups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" variant="secondary" size="sm" className="w-full sm:w-auto">
          {d.admin.foods.applyFilters}
        </Button>
      </form>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-brand/25 bg-brand/[0.03] py-16">
          <Apple className="mb-3 size-10 text-brand/40" />
          <p className="text-sm font-medium text-muted-foreground">
            {q || groupId
              ? d.admin.foods.noMatch
              : d.admin.foods.noFoodsYet}
          </p>
          {!q && !groupId && (
            <Button
              variant="outline"
              className="mt-4 border-brand/40"
              render={<Link href="/admin/foods/new" />}
            >
              <Plus className="size-4" />
              {d.admin.foods.addFirstFood}
            </Button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-brand/10">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>{d.admin.foods.tableHeaders.name}</TableHead>
                <TableHead>{d.admin.foods.tableHeaders.foodGroup}</TableHead>
                <TableHead>{d.admin.foods.tableHeaders.serving}</TableHead>
                <TableHead>{d.admin.foods.tableHeaders.calories}</TableHead>
                <TableHead>{d.admin.foods.tableHeaders.protein}</TableHead>
                <TableHead>{d.admin.foods.tableHeaders.carbs}</TableHead>
                <TableHead>{d.admin.foods.tableHeaders.fat}</TableHead>
                <TableHead>{d.admin.foods.tableHeaders.free}</TableHead>
                <TableHead className="text-right">{d.admin.foods.tableHeaders.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ food, group }) => (
                <TableRow key={food.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/admin/foods/${food.id}`}
                      className="text-brand-dark hover:underline dark:text-brand"
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
                      <Badge className="bg-brand/15 text-brand-dark dark:text-brand">
                        {d.common.yes}
                      </Badge>
                    ) : (
                      <Badge variant="secondary">{d.common.no}</Badge>
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
                        {d.common.edit}
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
