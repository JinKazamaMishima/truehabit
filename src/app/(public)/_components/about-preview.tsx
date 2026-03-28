"use client";

import { useRef } from "react";
import Link from "next/link";
import { User, Star, ArrowRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "./animated-counter";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
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
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid items-center gap-12 lg:grid-cols-2"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-emerald-600">
              {data.title}
            </p>
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              {data.name}
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600">{data.bio1}</p>
            <p className="mt-3 leading-relaxed text-slate-600">{data.bio2}</p>

            <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-emerald-100 px-5 py-2.5">
              <Star className="size-5 text-emerald-600" />
              <span className="text-sm font-bold text-emerald-800">
                <AnimatedCounter target={data.yearsExperience} suffix="+" /> Años de Experiencia
              </span>
            </div>

            <div className="mt-6">
              <Button
                className="bg-emerald-600 text-white hover:bg-emerald-700"
                size="lg"
                render={<Link href="/about" />}
              >
                Más Sobre Nosotros
                <ArrowRight className="ml-1 size-4" />
              </Button>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="flex justify-center">
            {data.imageUrl ? (
              <div className="relative size-80 overflow-hidden rounded-2xl lg:size-96">
                <img
                  src={data.imageUrl}
                  alt={data.name}
                  className="size-full object-cover"
                />
              </div>
            ) : (
              <div className="relative flex size-80 items-center justify-center rounded-2xl bg-emerald-100 lg:size-96">
                <User className="size-24 text-emerald-300" />
                <div className="absolute -bottom-4 -right-4 rounded-xl bg-emerald-600 px-5 py-3 shadow-lg">
                  <p className="text-xs font-medium text-emerald-200">Certificada</p>
                  <p className="text-sm font-bold text-white">Nutrición Deportiva</p>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
