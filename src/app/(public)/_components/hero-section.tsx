"use client";

import Link from "next/link";
import { ArrowRight, ClipboardList, FlaskConical, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const features = [
  { icon: ClipboardList, title: "Planes Personalizados", desc: "Diseñados según tus metas y estilo de vida." },
  { icon: FlaskConical, title: "Basado en Ciencia", desc: "Respaldado por evidencia científica actualizada." },
  { icon: TrendingUp, title: "Resultados Reales", desc: "Seguimiento con métricas claras de progreso." },
];

export type HeroData = {
  badge: string;
  heading: string;
  subheading: string;
  ctaPrimary: string;
  ctaSecondary: string;
  imageUrl?: string;
};

export function HeroSection({ data }: { data: HeroData }) {
  const words = data.heading.split(" ");
  const highlightWord = words.length > 2 ? words[2] : words[words.length - 1];
  const beforeHighlight = words.slice(0, words.indexOf(highlightWord)).join(" ");
  const afterHighlight = words.slice(words.indexOf(highlightWord) + 1).join(" ");

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid min-h-[600px] items-center lg:grid-cols-2">
          <motion.div
            className="relative z-10 px-6 py-20 sm:px-8 lg:py-28 lg:pr-12"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-brand" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                {data.badge}
              </span>
              <span className="h-px w-8 bg-brand" />
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-heading text-4xl font-bold leading-[1.15] text-charcoal sm:text-5xl lg:text-[3.5rem]"
            >
              {beforeHighlight}{" "}
              <span className="text-brand">{highlightWord}</span>
              {afterHighlight && ` ${afterHighlight}`}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground"
            >
              {data.subheading}
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Button
                className="h-12 rounded-md bg-brand px-8 text-sm font-semibold text-white shadow-lg transition-all hover:bg-brand-dark hover:shadow-xl"
                render={<Link href="/contact" />}
              >
                {data.ctaPrimary}
                <ArrowRight className="ml-1.5 size-4" />
              </Button>
              <Button
                className="h-12 rounded-md border-2 border-charcoal bg-charcoal px-8 text-sm font-semibold text-white transition-all hover:bg-charcoal-light"
                render={<Link href="/about" />}
              >
                {data.ctaSecondary}
              </Button>
            </motion.div>
          </motion.div>

          <div className="relative hidden h-full min-h-[500px] lg:block">
            {data.imageUrl ? (
              <img
                src={data.imageUrl}
                alt="Nutrición saludable"
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-brand/20 via-brand/10 to-brand/5">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-brand/30">
                    <svg className="mx-auto size-32" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.8 5C17.4 4 16.3 3 15.2 3c-1.1 0-2 .4-2.6 1.1-.5-.3-1.1-.5-1.8-.5-2 0-3.6 1.6-3.6 3.6 0 .4.1.8.2 1.2C5.8 8.8 4.8 10 4.8 11.4c0 1.8 1.5 3.2 3.2 3.2.1 0 .3 0 .4 0-.1.3-.2.7-.2 1.1 0 2 1.6 3.6 3.6 3.6 1.6 0 3-1.1 3.4-2.5.3.1.6.1.9.1 2 0 3.6-1.6 3.6-3.6 0-1.4-.8-2.6-2-3.2.1-.3.2-.7.2-1.1C17.9 7.4 18 6.1 17.8 5z" />
                    </svg>
                    <p className="mt-2 text-sm font-medium">Imagen del hero</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-10 -mt-12 hidden lg:block">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            className="grid grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.15, delayChildren: 0.5 } } }}
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                className="flex items-start gap-5 rounded-xl bg-white p-6 shadow-xl ring-1 ring-black/5"
              >
                <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                  <f.icon className="size-6" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-charcoal">{f.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="bg-white px-6 py-8 lg:hidden">
        <div className="grid gap-4 sm:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="flex items-start gap-4 rounded-xl bg-muted/50 p-5">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                <f.icon className="size-5" />
              </div>
              <div>
                <h3 className="font-heading text-base font-semibold text-charcoal">{f.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
