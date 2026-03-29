"use client";

import Link from "next/link";
import { Leaf, Camera, Globe, MessageCircle, Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { useState } from "react";
import { useDictionary } from "@/lib/i18n/context";

export function Footer({
  phone,
  email,
  address,
  instagramUrl,
  facebookUrl,
  whatsappNumber,
  tagline,
}: {
  phone?: string;
  email?: string;
  address?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  whatsappNumber?: string;
  tagline?: string;
}) {
  const d = useDictionary();

  const quickLinks = [
    { href: "/", label: d.nav.public.home },
    { href: "/about", label: d.nav.public.about },
    { href: "/services", label: d.nav.public.services },
    { href: "/contact", label: d.nav.public.contact },
  ];

  const serviceLinks = [
    { href: "/contact?service=personalized_nutrition", label: d.public.footer.services.personalizedNutrition },
    { href: "/contact?service=weight_loss", label: d.public.footer.services.weightLoss },
    { href: "/contact?service=sports_nutrition", label: d.public.footer.services.sportsNutrition },
    { href: "/contact?service=body_composition", label: d.public.footer.services.bodyComposition },
  ];

  const displayPhone = phone || "+52 (664) 123-4567";
  const displayEmail = email || "contacto@truehabit.mx";
  const displayAddress = address || "Tijuana, B.C., México";
  const displayInstagram = instagramUrl || "https://instagram.com";
  const displayFacebook = facebookUrl || "https://facebook.com";
  const displayWhatsapp = whatsappNumber || "5210000000000";
  const displayTagline = tagline || d.public.footer.taglineDefault;

  const [newsletterEmail, setNewsletterEmail] = useState("");

  return (
    <footer className="bg-charcoal text-white/70">
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="size-4 text-brand" />
            <span>{d.public.footer.hours}</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={displayInstagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white/50 transition-colors hover:bg-brand hover:text-white"
              aria-label="Instagram"
            >
              <Camera className="size-4" />
            </a>
            <a
              href={displayFacebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white/50 transition-colors hover:bg-brand hover:text-white"
              aria-label="Facebook"
            >
              <Globe className="size-4" />
            </a>
            <a
              href={`https://wa.me/${displayWhatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white/50 transition-colors hover:bg-brand hover:text-white"
              aria-label="WhatsApp"
            >
              <MessageCircle className="size-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <Leaf className="size-7 text-brand" />
              <span className="font-heading text-xl font-bold text-white">TrueHabit</span>
            </Link>
            <p className="mt-2 text-sm font-medium text-brand">{displayTagline}</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed">
              {d.public.footer.description}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {d.public.footer.quickLinks}
            </h3>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-brand"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {d.public.footer.contact}
            </h3>
            <ul className="mt-5 space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <Phone className="mt-0.5 size-4 shrink-0 text-brand" />
                <span>{displayPhone}</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <Mail className="mt-0.5 size-4 shrink-0 text-brand" />
                <span>{displayEmail}</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand" />
                <span>{displayAddress}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {d.public.footer.newsletter}
            </h3>
            <p className="mt-5 text-sm leading-relaxed">
              {d.public.footer.newsletterDescription}
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setNewsletterEmail("");
              }}
              className="mt-4 flex"
            >
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={d.public.footer.emailPlaceholder}
                className="h-10 flex-1 rounded-l-md border-0 bg-white/10 px-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-brand"
              />
              <button
                type="submit"
                className="flex h-10 items-center gap-1 rounded-r-md bg-brand px-4 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
              >
                <Send className="size-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-white/40">
            &copy; {new Date().getFullYear()} TrueHabit. {d.public.footer.allRightsReserved}
          </p>
        </div>
      </div>
    </footer>
  );
}
