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
  admin: { label: "Admin", icon: Shield, variant: "default" as const },
  nutritionist: { label: "Nutritionist", icon: Utensils, variant: "secondary" as const },
  customer: { label: "Customer", icon: User, variant: "outline" as const },
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
        toast.success("User created successfully");
        setOpen(false);
        setRole("customer");
        setLinkedClientId("");
        form.reset();
        onDone();
      } catch {
        toast.error("Failed to create user. Email may already be in use.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm" className="gap-2 bg-brand text-white hover:bg-brand-dark">
            <UserPlus className="size-4" />
            Add User
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Create a new user account. Customers can be linked to an existing client record.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="add-name">Name</Label>
            <Input id="add-name" name="name" required disabled={isPending} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="add-email">Email</Label>
            <Input
              id="add-email"
              name="email"
              type="email"
              required
              disabled={isPending}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="add-password">Password</Label>
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
            <Label>Role</Label>
            <Select value={role} onValueChange={(v) => { if (v) setRole(v as typeof role); }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="nutritionist">Nutritionist</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {role === "customer" && unlinkedClients.length > 0 && (
            <div className="flex flex-col gap-2">
              <Label>Link to Client Record (optional)</Label>
              <Select value={linkedClientId} onValueChange={(v) => setLinkedClientId(v ?? "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a client..." />
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
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button
              type="submit"
              disabled={isPending}
              className="gap-2 bg-brand text-white hover:bg-brand-dark"
            >
              {isPending && <Loader2 className="size-4 animate-spin" />}
              Create User
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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("newPassword") as string;

    startTransition(async () => {
      try {
        await resetUserPassword(user.id, newPassword);
        toast.success(`Password reset for ${user.name}`);
        setOpen(false);
        onDone();
      } catch {
        toast.error("Failed to reset password");
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
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Set a new password for <strong>{user.name}</strong> ({user.email}).
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor={`pw-${user.id}`}>New Password</Label>
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
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button
              type="submit"
              disabled={isPending}
              className="gap-2 bg-brand text-white hover:bg-brand-dark"
            >
              {isPending && <Loader2 className="size-4 animate-spin" />}
              Reset Password
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

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteUser(user.id);
        toast.success(`User ${user.name} deleted`);
        setOpen(false);
        onDone();
      } catch {
        toast.error("Failed to delete user");
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
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{user.name}</strong> ({user.email})?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
            className="gap-2"
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            Delete User
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
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Manage user accounts, roles, and passwords.
          </CardDescription>
        </div>
        <AddUserDialog unlinkedClients={unlinkedClients} onDone={refresh} />
      </CardHeader>
      <CardContent>
        {userList.length === 0 ? (
          <p className="text-sm text-muted-foreground">No users found.</p>
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
                      {config.label}
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
