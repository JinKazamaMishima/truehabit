"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Leaf, Phone, Mail, Camera, Globe, MessageCircle, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useDictionary } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/language-switcher";

export function Navbar({ businessName }: { businessName?: string }) {
  const d = useDictionary();
  const name = businessName || "TrueHabit";
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: "/", label: d.nav.public.home },
    { href: "/about", label: d.nav.public.about },
    { href: "/services", label: d.nav.public.services },
    { href: "/contact", label: d.nav.public.contact },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="hidden bg-charcoal text-white md:block">
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 text-xs">
            <a href="tel:+526641234567" className="flex items-center gap-1.5 text-white/70 transition-colors hover:text-brand">
              <Phone className="size-3" />
              <span>+52 (664) 123-4567</span>
            </a>
            <a href="mailto:contacto@truehabit.mx" className="flex items-center gap-1.5 text-white/70 transition-colors hover:text-brand">
              <Mail className="size-3" />
              <span>contacto@truehabit.mx</span>
            </a>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <a href="#" className="flex size-7 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-brand hover:text-white" aria-label="Instagram">
                <Camera className="size-3" />
              </a>
              <a href="#" className="flex size-7 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-brand hover:text-white" aria-label="Facebook">
                <Globe className="size-3" />
              </a>
              <a href="#" className="flex size-7 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-brand hover:text-white" aria-label="WhatsApp">
                <MessageCircle className="size-3" />
              </a>
            </div>
            <div className="ml-2 h-4 w-px bg-white/20" />
            <LanguageSwitcher className="border-white/20 text-white [&_button]:text-white/60 [&_button:hover]:text-white [&_.text-muted-foreground]:text-white/50" />
            <div className="h-4 w-px bg-white/20" />
            <Link href="/contact" className="text-xs font-medium text-brand transition-colors hover:text-brand-dark">
              {d.public.navbar.scheduleAppointment}
            </Link>
          </div>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "bg-white/95 shadow-lg backdrop-blur-sm"
            : "bg-white shadow-sm"
        )}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <Leaf className="size-8 text-brand" />
            <span className="font-heading text-2xl font-bold text-charcoal">{name}</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-brand"
                    : "text-charcoal hover:text-brand"
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-brand" />
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Button
              variant="outline"
              className="h-11 gap-2 rounded-md border-brand/30 px-5 text-sm font-medium text-brand transition-all hover:bg-brand-light hover:text-brand-dark"
              render={<Link href="/login" />}
            >
              <LogIn className="size-4" />
              {d.common.signIn}
            </Button>
            <Button
              className="h-11 rounded-md bg-brand px-6 text-sm font-semibold text-white shadow-md transition-all hover:bg-brand-dark hover:shadow-lg"
              render={<Link href="/contact" />}
            >
              {d.public.navbar.scheduleAppointment}
            </Button>
          </div>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="lg:hidden"
              render={<Button variant="ghost" size="icon" />}
            >
              <Menu className="size-5" />
              <span className="sr-only">{d.public.navbar.toggleMenu}</span>
            </SheetTrigger>

            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>
                  <Link
                    href="/"
                    className="flex items-center gap-2"
                    onClick={() => setOpen(false)}
                  >
                    <Leaf className="size-6 text-brand" />
                    <span className="font-heading text-lg font-bold text-charcoal">
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
                      "rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-brand-light hover:text-brand-dark",
                      pathname === link.href
                        ? "bg-brand-light text-brand-dark"
                        : "text-charcoal"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-4 space-y-2 px-4">
                <LanguageSwitcher className="w-full justify-center" />
                <Button
                  variant="outline"
                  className="w-full gap-2 border-brand/30 text-brand hover:bg-brand-light hover:text-brand-dark"
                  size="lg"
                  render={<Link href="/login" onClick={() => setOpen(false)} />}
                >
                  <LogIn className="size-4" />
                  {d.common.signIn}
                </Button>
                <Button
                  className="w-full bg-brand text-white hover:bg-brand-dark"
                  size="lg"
                  render={<Link href="/contact" onClick={() => setOpen(false)} />}
                >
                  {d.public.navbar.scheduleAppointment}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </>
  );
}
