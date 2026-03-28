import Link from "next/link";
import { Plus, Search, Users } from "lucide-react";
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
import { clients } from "@/lib/db/schema";
import { desc, like } from "drizzle-orm";

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const allClients = q
    ? await db
        .select()
        .from(clients)
        .where(like(clients.name, `%${q}%`))
        .orderBy(desc(clients.createdAt))
    : await db.select().from(clients).orderBy(desc(clients.createdAt));

  const goalLabels: Record<string, string> = {
    fat_loss: "Fat Loss",
    muscle_gain: "Muscle Gain",
    weight_cut: "Weight Cut",
    maintenance: "Maintenance",
    pre_competition: "Pre-Competition",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">
            Manage your nutrition clients.
          </p>
        </div>
        <Button render={<Link href="/admin/clients/new" />}>
          <Plus className="size-4" />
          Add Client
        </Button>
      </div>

      <form className="flex max-w-sm items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="q"
            placeholder="Search clients..."
            defaultValue={q ?? ""}
            className="pl-9"
          />
        </div>
        <Button type="submit" variant="secondary" size="sm">
          Search
        </Button>
      </form>

      {allClients.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <Users className="mb-3 size-10 text-muted-foreground/50" />
          <p className="text-sm font-medium text-muted-foreground">
            {q ? "No clients match your search." : "No clients yet."}
          </p>
          {!q && (
            <Button
              variant="outline"
              className="mt-4"
              render={<Link href="/admin/clients/new" />}
            >
              <Plus className="size-4" />
              Add your first client
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Goal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/admin/clients/${client.id}`}
                      className="hover:underline"
                    >
                      {client.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {client.email ?? "—"}
                  </TableCell>
                  <TableCell>
                    {client.goal ? (
                      <Badge variant="secondary">
                        {goalLabels[client.goal] ?? client.goal}
                      </Badge>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        client.status === "active" ? "default" : "secondary"
                      }
                      className={
                        client.status === "active"
                          ? "bg-brand/15 text-brand-dark"
                          : ""
                      }
                    >
                      {client.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      render={<Link href={`/admin/clients/${client.id}`} />}
                    >
                      View
                    </Button>
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
