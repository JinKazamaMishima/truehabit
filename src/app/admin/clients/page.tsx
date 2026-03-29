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
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n";

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const locale = await getLocale();
  const d = await getDictionary(locale);

  const allClients = q
    ? await db
        .select()
        .from(clients)
        .where(like(clients.name, `%${q}%`))
        .orderBy(desc(clients.createdAt))
    : await db.select().from(clients).orderBy(desc(clients.createdAt));

  const goalLabels = d.admin.clients.goalLabels;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{d.admin.clients.title}</h1>
          <p className="text-muted-foreground">
            {d.admin.clients.subtitle}
          </p>
        </div>
        <Button className="w-full sm:w-auto" render={<Link href="/admin/clients/new" />}>
          <Plus className="size-4" />
          {d.admin.clients.addClient}
        </Button>
      </div>

      <form className="flex max-w-sm items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="q"
            placeholder={d.admin.clients.searchPlaceholder}
            defaultValue={q ?? ""}
            className="pl-9"
          />
        </div>
        <Button type="submit" variant="secondary" size="sm">
          {d.common.search}
        </Button>
      </form>

      {allClients.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <Users className="mb-3 size-10 text-muted-foreground/50" />
          <p className="text-sm font-medium text-muted-foreground">
            {q ? d.admin.clients.noMatch : d.admin.clients.noClientsYet}
          </p>
          {!q && (
            <Button
              variant="outline"
              className="mt-4"
              render={<Link href="/admin/clients/new" />}
            >
              <Plus className="size-4" />
              {d.admin.clients.addFirstClient}
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{d.admin.clients.tableHeaders.name}</TableHead>
                <TableHead>{d.admin.clients.tableHeaders.email}</TableHead>
                <TableHead>{d.admin.clients.tableHeaders.goal}</TableHead>
                <TableHead>{d.admin.clients.tableHeaders.status}</TableHead>
                <TableHead className="text-right">{d.admin.clients.tableHeaders.actions}</TableHead>
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
                    {client.email ?? d.common.emDash}
                  </TableCell>
                  <TableCell>
                    {client.goal ? (
                      <Badge variant="secondary">
                        {goalLabels[client.goal as keyof typeof goalLabels] ?? client.goal}
                      </Badge>
                    ) : (
                      d.common.emDash
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
                      {d.common.view}
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
