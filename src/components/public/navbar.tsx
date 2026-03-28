"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export function Navbar({ businessName }: { businessName?: string }) {
  const name = businessName || "TrueHabit";
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-white/95 shadow-md backdrop-blur-sm"
          : "bg-white"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Leaf className="size-7 text-emerald-600" />
          <span className="text-xl font-bold text-emerald-600">{name}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-emerald-600",
                pathname === link.href
                  ? "text-emerald-600"
                  : "text-slate-700"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button
            className="bg-emerald-600 text-white hover:bg-emerald-700"
            size="lg"
            render={<Link href="/contact" />}
          >
            Book Appointment
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="md:hidden"
            render={<Button variant="ghost" size="icon" />}
          >
            <Menu className="size-5" />
            <span className="sr-only">Toggle menu</span>
          </SheetTrigger>

          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle>
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  onClick={() => setOpen(false)}
                >
                  <Leaf className="size-6 text-emerald-600" />
                  <span className="text-lg font-bold text-emerald-600">
                    {name}
                  </span>
                </Link>
              </SheetTitle>
            </SheetHeader>

            <nav className="flex flex-col gap-1 px-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-emerald-50 hover:text-emerald-600",
                    pathname === link.href
                      ? "bg-emerald-50 text-emerald-600"
                      : "text-slate-700"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-4 px-4">
              <Button
                className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
                size="lg"
                render={<Link href="/contact" onClick={() => setOpen(false)} />}
              >
                Book Appointment
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
