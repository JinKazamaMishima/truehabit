"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Leaf,
  LayoutDashboard,
  UtensilsCrossed,
  TrendingUp,
  UserCircle,
  Pill,
  CalendarDays,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useDictionary } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/language-switcher";

export function DashboardNav({
  userName,
  signOutAction,
}: {
  userName: string;
  signOutAction: () => Promise<void>;
}) {
  const d = useDictionary();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: "/dashboard", label: d.nav.dashboard.home, icon: LayoutDashboard, exact: true },
    { href: "/dashboard/meal-plans", label: d.nav.dashboard.mealPlans, icon: UtensilsCrossed },
    { href: "/dashboard/progress", label: d.nav.dashboard.progress, icon: TrendingUp },
    { href: "/dashboard/profile", label: d.nav.dashboard.profile, icon: UserCircle },
    { href: "/dashboard/protocols", label: d.nav.dashboard.protocols, icon: Pill },
    { href: "/dashboard/appointments", label: d.nav.dashboard.appointments, icon: CalendarDays },
  ];

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Leaf className="size-7 text-brand" />
            <span className="font-heading text-xl font-bold text-charcoal">
              TrueHabit
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-brand-light text-brand-dark"
                      : "text-charcoal/70 hover:bg-muted hover:text-charcoal"
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher className="hidden md:inline-flex" />
          <DropdownMenu>
            <DropdownMenuTrigger className="hidden items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-charcoal/70 transition-colors hover:bg-muted md:flex">
              <div className="flex size-8 items-center justify-center rounded-full bg-brand-light text-brand-dark font-semibold text-xs">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="max-w-[120px] truncate">{userName}</span>
              <ChevronDown className="size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                className="gap-2"
                render={<Link href="/dashboard/profile" />}
              >
                <UserCircle className="size-4" />
                {d.nav.dashboard.myProfile}
              </DropdownMenuItem>
              <form action={signOutAction}>
                <DropdownMenuItem
                  className="gap-2"
                  variant="destructive"
                  render={<button type="submit" className="w-full" />}
                >
                  <LogOut className="size-4" />
                  {d.common.signOut}
                </DropdownMenuItem>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t bg-white px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-brand-light text-brand-dark"
                      : "text-charcoal/70 hover:bg-muted"
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-2 border-t pt-2 space-y-2">
            <LanguageSwitcher className="w-full justify-center" />
            <form action={signOutAction}>
              <button
                type="submit"
                className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10"
              >
                <LogOut className="size-4" />
                {d.common.signOut}
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
