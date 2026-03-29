"use client";

import { useRef } from "react";
import Link from "next/link";
import { User, Clock, Star, Award, ArrowRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "./animated-counter";
import { useDictionary } from "@/lib/i18n/context";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

export type AboutPreviewData = {
  name: string;
  title: string;
  bio1: string;
  bio2: string;
  yearsExperience: number;
  imageUrl?: string;
};

export function AboutPreview({ data }: { data: AboutPreviewData }) {
  const d = useDictionary();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const highlights = [
    { icon: Clock, label: d.public.aboutPreview.punctualService },
    { icon: Star, label: d.public.aboutPreview.premiumService },
    { icon: Award, label: d.public.aboutPreview.certifiedProfessionals },
  ];

  return (
    <section ref={ref} className="bg-gray-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
        >
          <motion.div variants={fadeLeft}>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-brand" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                {data.title}
              </span>
              <span className="h-px w-8 bg-brand" />
            </div>

            <h2 className="font-heading text-3xl font-bold text-charcoal sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
              {d.public.aboutPreview.welcomeTo}
              <span className="text-brand">TrueHabit</span>
            </h2>

            <p className="mt-6 text-base leading-[1.8] text-muted-foreground">{data.bio1}</p>
            <p className="mt-4 text-base leading-[1.8] text-muted-foreground">{data.bio2}</p>

            <div className="mt-8 flex flex-wrap items-center gap-6">
              {highlights.map((h) => (
                <div key={h.label} className="flex items-center gap-2.5">
                  <div className="flex size-10 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <h.icon className="size-4" />
                  </div>
                  <span className="text-sm font-medium text-charcoal">{h.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Button
                className="h-12 rounded-md bg-brand px-8 text-sm font-semibold text-white shadow-md transition-all hover:bg-brand-dark hover:shadow-lg"
                render={<Link href="/about" />}
              >
                {d.public.aboutPreview.moreAboutUs}
                <ArrowRight className="ml-1.5 size-4" />
              </Button>
            </div>
          </motion.div>

          <motion.div variants={fadeRight} className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl border-[6px] border-brand shadow-2xl">
                {data.imageUrl ? (
                  <img
                    src={data.imageUrl}
                    alt={data.name}
                    className="size-80 object-cover lg:h-[28rem] lg:w-96"
                  />
                ) : (
                  <div className="flex size-80 items-center justify-center bg-gradient-to-br from-brand/10 to-brand/5 lg:h-[28rem] lg:w-96">
                    <User className="size-24 text-brand/30" />
                  </div>
                )}
              </div>

              <div className="absolute -bottom-6 -left-6 rounded-xl bg-charcoal px-6 py-4 shadow-xl">
                <p className="text-3xl font-bold text-brand">
                  <AnimatedCounter target={data.yearsExperience} suffix="+" />
                </p>
                <p className="text-xs font-medium tracking-wide text-white/80">
                  {d.public.aboutPreview.yearsExperience}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
