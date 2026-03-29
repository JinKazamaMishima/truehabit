"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Apple,
  ChefHat,
  Calendar,
  CalendarClock,
  Settings,
  Menu,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { useDictionary } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/language-switcher";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname.startsWith(href);
}

function NavLinks({
  pathname,
  onNavigate,
  labels,
}: {
  pathname: string;
  onNavigate?: () => void;
  labels: { dashboard: string; clients: string; foods: string; recipes: string; mealPlans: string; appointments: string; settings: string };
}) {
  const navItems = [
    { label: labels.dashboard, href: "/admin", icon: LayoutDashboard },
    { label: labels.clients, href: "/admin/clients", icon: Users },
    { label: labels.foods, href: "/admin/foods", icon: Apple },
    { label: labels.recipes, href: "/admin/recipes", icon: ChefHat },
    { label: labels.mealPlans, href: "/admin/meal-plans", icon: Calendar },
    { label: labels.appointments, href: "/admin/appointments", icon: CalendarClock },
    { label: labels.settings, href: "/admin/settings", icon: Settings },
  ];

  return (
    <nav className="flex flex-col gap-1 px-3">
      {navItems.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
              active
                ? "border-l-[3px] border-brand bg-brand/10 text-brand"
                : "border-l-[3px] border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="size-5 shrink-0" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminSidebar({
  userName,
  userEmail,
  signOutAction,
}: {
  userName: string;
  userEmail: string;
  signOutAction: () => Promise<void>;
}) {
  const d = useDictionary();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <>
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <div className="flex size-8 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white">
          TH
        </div>
        <span className="font-heading text-base font-semibold">TrueHabit</span>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <NavLinks
          pathname={pathname}
          onNavigate={() => setMobileOpen(false)}
          labels={d.nav.admin}
        />
      </div>

      <div className="border-t p-3">
        <LanguageSwitcher className="mb-2 w-full justify-center" />
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <Avatar size="sm">
            <AvatarFallback>{getInitials(userName)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 truncate">
            <p className="truncate text-sm font-medium">{userName}</p>
            <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
          </div>
        </div>
        <form action={signOutAction}>
          <Button
            type="submit"
            variant="ghost"
            className="mt-1 w-full justify-start gap-2 text-muted-foreground"
            size="sm"
          >
            <LogOut className="size-4" />
            {d.admin.sidebar.signOut}
          </Button>
        </form>
      </div>
    </>
  );

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-40 flex h-14 items-center gap-3 border-b bg-background px-4 md:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon">
                <Menu className="size-5" />
              </Button>
            }
          />
          <SheetContent side="left" className="w-64 p-0" showCloseButton={false}>
            <SheetTitle className="sr-only">{d.nav.admin.navigation}</SheetTitle>
            <div className="flex h-full flex-col">{sidebarContent}</div>
          </SheetContent>
        </Sheet>
        <span className="text-base font-semibold">TrueHabit</span>
      </div>

      <div className="h-14 shrink-0 md:hidden" />

      <aside className="hidden w-64 shrink-0 flex-col border-r bg-background md:flex">
        {sidebarContent}
      </aside>
    </>
  );
}
