"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { AnimatedCounter } from "./animated-counter";
import { useDictionary } from "@/lib/i18n/context";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

export type StatsData = {
  clients: number;
  plans: number;
  years: number;
  satisfaction: number;
};

export function StatsSection({ data }: { data: StatsData }) {
  const d = useDictionary();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const stats = [
    { value: data.clients, suffix: "+", label: d.public.stats.happyClients },
    { value: data.plans, suffix: "+", label: d.public.stats.plansDelivered },
    { value: data.years, suffix: "+", label: d.public.stats.yearsExperience },
    { value: data.satisfaction, suffix: "%", label: d.public.stats.satisfaction },
  ];

  return (
    <section ref={ref} className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid items-center gap-12 lg:grid-cols-2"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-brand" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                {d.public.stats.eyebrow}
              </span>
              <span className="h-px w-8 bg-brand" />
            </div>

            <h2 className="font-heading text-3xl font-bold text-charcoal sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
              {d.public.stats.headingPart1}
              <span className="text-brand">{d.public.stats.headingHighlight}</span>
              {d.public.stats.headingPart2}
            </h2>

            <p className="mt-5 text-base leading-[1.8] text-muted-foreground">
              {d.public.stats.subheading}
            </p>

            <div className="mt-10 grid grid-cols-2 gap-6">
              {stats.map((s) => (
                <div key={s.label} className="rounded-xl border border-gray-100 bg-gray-50 p-5 text-center">
                  <p className="font-heading text-3xl font-bold text-brand sm:text-4xl">
                    <AnimatedCounter target={s.value} suffix={s.suffix} />
                  </p>
                  <p className="mt-1.5 text-xs font-medium tracking-wide text-muted-foreground">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="hidden lg:flex lg:justify-end">
            <div className="relative h-[420px] w-full max-w-md overflow-hidden rounded-2xl bg-gradient-to-br from-brand/15 via-brand/5 to-transparent">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-brand/20">
                  <svg className="mx-auto size-24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 6V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H2v13c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6h-6zm-6-2h4v2h-4V4z" />
                  </svg>
                  <p className="mt-2 text-sm font-medium">{d.public.stats.imageAlt}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
