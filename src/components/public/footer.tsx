import Link from "next/link";
import { Leaf, Camera, Globe, MessageCircle, Phone, Mail, MapPin } from "lucide-react";

const quickLinks = [
  { href: "/", label: "Inicio" },
  { href: "/about", label: "Sobre Nosotros" },
  { href: "/services", label: "Servicios" },
  { href: "/contact", label: "Contacto" },
];

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
  const displayPhone = phone || "+52 (664) 123-4567";
  const displayEmail = email || "contacto@truehabit.mx";
  const displayAddress = address || "Tijuana, B.C., México";
  const displayInstagram = instagramUrl || "https://instagram.com";
  const displayFacebook = facebookUrl || "https://facebook.com";
  const displayWhatsapp = whatsappNumber || "5210000000000";
  const displayTagline = tagline || "Nutrición basada en ciencia";

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Leaf className="size-7 text-emerald-500" />
              <span className="text-xl font-bold text-white">TrueHabit</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              {displayTagline}
            </p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-400">
              Transformamos hábitos alimenticios con planes personalizados y
              respaldados por evidencia científica.
            </p>

            <div className="mt-6 flex gap-3">
              <a
                href={displayInstagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-9 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition-colors hover:bg-emerald-600 hover:text-white"
                aria-label="Instagram"
              >
                <Camera className="size-4" />
              </a>
              <a
                href={displayFacebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-9 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition-colors hover:bg-emerald-600 hover:text-white"
                aria-label="Facebook"
              >
                <Globe className="size-4" />
              </a>
              <a
                href={`https://wa.me/${displayWhatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-9 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition-colors hover:bg-emerald-600 hover:text-white"
                aria-label="WhatsApp"
              >
                <MessageCircle className="size-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Enlaces Rápidos
            </h3>
            <ul className="mt-4 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-emerald-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Contacto
            </h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <Phone className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                <span>{displayPhone}</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <Mail className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                <span>{displayEmail}</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <MapPin className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                <span>{displayAddress}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-slate-500">
            &copy; {new Date().getFullYear()} TrueHabit. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
