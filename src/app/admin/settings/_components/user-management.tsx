"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  createUser,
  resetUserPassword,
  deleteUser,
} from "@/actions/users";
import {
  Loader2,
  Plus,
  KeyRound,
  Trash2,
  UserPlus,
  Shield,
  User,
  Utensils,
} from "lucide-react";
import { toast } from "sonner";
import { useDictionary } from "@/lib/i18n/context";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "nutritionist" | "customer";
  createdAt: Date;
};

type UnlinkedClient = {
  id: string;
  name: string;
  email: string | null;
};

const roleConfig = {
  admin: { icon: Shield, variant: "default" as const },
  nutritionist: { icon: Utensils, variant: "secondary" as const },
  customer: { icon: User, variant: "outline" as const },
};

function AddUserDialog({
  unlinkedClients,
  onDone,
}: {
  unlinkedClients: UnlinkedClient[];
  onDone: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<"admin" | "nutritionist" | "customer">("customer");
  const [linkedClientId, setLinkedClientId] = useState<string>("");
  const d = useDictionary();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      try {
        await createUser({
          name: formData.get("name") as string,
          email: formData.get("email") as string,
          password: formData.get("password") as string,
          role,
          linkedClientId: role === "customer" && linkedClientId ? linkedClientId : undefined,
        });
        toast.success(d.admin.settings.users.toastCreated);
        setOpen(false);
        setRole("customer");
        setLinkedClientId("");
        form.reset();
        onDone();
      } catch {
        toast.error(d.admin.settings.users.toastCreateFailed);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm" className="gap-2 bg-brand text-white hover:bg-brand-dark">
            <UserPlus className="size-4" />
            {d.admin.settings.users.addUser}
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{d.admin.settings.users.addUserTitle}</DialogTitle>
          <DialogDescription>
            {d.admin.settings.users.addUserDescription}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="add-name">{d.admin.settings.users.nameLabel}</Label>
            <Input id="add-name" name="name" required disabled={isPending} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="add-email">{d.admin.settings.users.emailLabel}</Label>
            <Input
              id="add-email"
              name="email"
              type="email"
              required
              disabled={isPending}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="add-password">{d.admin.settings.users.passwordLabel}</Label>
            <Input
              id="add-password"
              name="password"
              type="password"
              required
              minLength={6}
              disabled={isPending}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>{d.admin.settings.users.roleLabel}</Label>
            <Select value={role} onValueChange={(v) => { if (v) setRole(v as typeof role); }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">{d.admin.settings.users.roleCustomer}</SelectItem>
                <SelectItem value="admin">{d.admin.settings.users.roleAdmin}</SelectItem>
                <SelectItem value="nutritionist">{d.admin.settings.users.roleNutritionist}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {role === "customer" && unlinkedClients.length > 0 && (
            <div className="flex flex-col gap-2">
              <Label>{d.admin.settings.users.linkToClient}</Label>
              <Select value={linkedClientId} onValueChange={(v) => setLinkedClientId(v ?? "")}>
                <SelectTrigger>
                  <SelectValue placeholder={d.admin.settings.users.selectClient} />
                </SelectTrigger>
                <SelectContent>
                  {unlinkedClients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} {c.email ? `(${c.email})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <DialogFooter>
            <DialogClose render={<Button variant="outline">{d.common.cancel}</Button>} />
            <Button
              type="submit"
              disabled={isPending}
              className="gap-2 bg-brand text-white hover:bg-brand-dark"
            >
              {isPending && <Loader2 className="size-4 animate-spin" />}
              {d.admin.settings.users.createUser}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ResetPasswordDialog({
  user,
  onDone,
}: {
  user: UserRow;
  onDone: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const d = useDictionary();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("newPassword") as string;

    startTransition(async () => {
      try {
        await resetUserPassword(user.id, newPassword);
        toast.success(`${d.admin.settings.users.toastPasswordReset} ${user.name}`);
        setOpen(false);
        onDone();
      } catch {
        toast.error(d.admin.settings.users.toastPasswordFailed);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon" className="size-8">
            <KeyRound className="size-4" />
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{d.admin.settings.users.resetPassword}</DialogTitle>
          <DialogDescription>
            {d.admin.settings.users.resetPasswordFor} <strong>{user.name}</strong> ({user.email}).
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor={`pw-${user.id}`}>{d.admin.settings.users.newPassword}</Label>
            <Input
              id={`pw-${user.id}`}
              name="newPassword"
              type="password"
              required
              minLength={6}
              disabled={isPending}
            />
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">{d.common.cancel}</Button>} />
            <Button
              type="submit"
              disabled={isPending}
              className="gap-2 bg-brand text-white hover:bg-brand-dark"
            >
              {isPending && <Loader2 className="size-4 animate-spin" />}
              {d.admin.settings.users.resetPassword}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteUserDialog({
  user,
  onDone,
}: {
  user: UserRow;
  onDone: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const d = useDictionary();

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteUser(user.id);
        toast.success(`${user.name} ${d.admin.settings.users.toastDeleted}`);
        setOpen(false);
        onDone();
      } catch {
        toast.error(d.admin.settings.users.toastDeleteFailed);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive">
            <Trash2 className="size-4" />
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{d.admin.settings.users.deleteUser}</DialogTitle>
          <DialogDescription>
            {d.admin.settings.users.deleteUserConfirm} <strong>{user.name}</strong> ({user.email})?
            {" "}{d.admin.settings.users.deleteUserWarning}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">{d.common.cancel}</Button>} />
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
            className="gap-2"
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            {d.admin.settings.users.deleteUser}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function UserManagement({
  initialUsers,
  initialUnlinkedClients,
}: {
  initialUsers: UserRow[];
  initialUnlinkedClients: UnlinkedClient[];
}) {
  const [userList, setUserList] = useState(initialUsers);
  const [unlinkedClients, setUnlinkedClients] = useState(initialUnlinkedClients);
  const d = useDictionary();

  const roleLabels: Record<string, string> = {
    admin: d.admin.settings.users.roleAdmin,
    nutritionist: d.admin.settings.users.roleNutritionist,
    customer: d.admin.settings.users.roleCustomer,
  };

  async function refresh() {
    const { getUsers, getUnlinkedClients } = await import("@/actions/users");
    const [freshUsers, freshClients] = await Promise.all([
      getUsers(),
      getUnlinkedClients(),
    ]);
    setUserList(freshUsers);
    setUnlinkedClients(freshClients);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{d.admin.settings.users.cardTitle}</CardTitle>
          <CardDescription>
            {d.admin.settings.users.cardDescription}
          </CardDescription>
        </div>
        <AddUserDialog unlinkedClients={unlinkedClients} onDone={refresh} />
      </CardHeader>
      <CardContent>
        {userList.length === 0 ? (
          <p className="text-sm text-muted-foreground">{d.admin.settings.users.noUsers}</p>
        ) : (
          <div className="divide-y">
            {userList.map((user) => {
              const config = roleConfig[user.role];
              const Icon = config.icon;
              return (
                <div
                  key={user.id}
                  className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
                      <Icon className="size-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={config.variant} className="text-xs">
                      {roleLabels[user.role]}
                    </Badge>
                    <ResetPasswordDialog user={user} onDone={refresh} />
                    <DeleteUserDialog user={user} onDone={refresh} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
