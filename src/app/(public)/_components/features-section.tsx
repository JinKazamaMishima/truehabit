"use client";

import { useRef } from "react";
import { ClipboardList, FlaskConical, TrendingUp, Utensils, Heart, Sparkles } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useDictionary } from "@/lib/i18n/context";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const featureIcons = [ClipboardList, FlaskConical, Utensils, Heart, TrendingUp, Sparkles];

export function FeaturesSection() {
  const d = useDictionary();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const features = d.public.features.items.map((item, i) => ({
    icon: featureIcons[i],
    title: item.title,
    desc: item.description,
  }));

  return (
    <section ref={ref} className="bg-white py-20 sm:py-28 lg:pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto mb-16 max-w-2xl text-center"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-brand" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              {d.public.features.eyebrow}
            </span>
            <span className="h-px w-8 bg-brand" />
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="font-heading text-3xl font-bold text-charcoal sm:text-4xl lg:text-[2.75rem]"
          >
            {d.public.features.heading}
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-base text-muted-foreground">
            {d.public.features.subheading}
          </motion.p>
        </motion.div>

        <motion.div
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-brand/10 text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
                <f.icon className="size-7" />
              </div>
              <h3 className="mb-3 font-heading text-xl font-semibold text-charcoal">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
