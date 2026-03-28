"use client";

import { useRef } from "react";
import { Shield, Heart, Target, Lightbulb } from "lucide-react";
import { motion, useInView } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const reasons = [
  {
    icon: Shield,
    title: "Estrategias Nutricionales",
    desc: "Protocolos basados en la evidencia científica más reciente, ajustados continuamente según tu progreso.",
  },
  {
    icon: Heart,
    title: "Soporte y Motivación",
    desc: "Acompañamiento continuo con seguimiento semanal, ajustes en tiempo real y la motivación que necesitas.",
  },
  {
    icon: Target,
    title: "Enfoque Individualizado",
    desc: "Cada plan es único porque cada persona es diferente. Nos adaptamos a tu metabolismo y estilo de vida.",
  },
  {
    icon: Lightbulb,
    title: "Educación Nutricional",
    desc: "Te enseñamos a tomar decisiones informadas para mantener tus resultados a largo plazo.",
  },
];

export function WhyChooseUs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="overflow-hidden">
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[400px] bg-gradient-to-br from-charcoal to-charcoal-light lg:min-h-[600px]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white/10">
              <svg className="mx-auto size-40" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <p className="mt-3 text-sm font-medium text-white/20">Imagen de estilo de vida</p>
            </div>
          </div>
        </div>

        <div className="bg-brand px-8 py-16 sm:px-12 lg:px-16 lg:py-20">
          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-white/40" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                Nuestra Diferencia
              </span>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="mb-10 font-heading text-3xl font-bold text-white sm:text-4xl"
            >
              ¿Por Qué Elegirnos?
            </motion.h2>

            <motion.div className="space-y-8" variants={stagger}>
              {reasons.map((r) => (
                <motion.div key={r.title} variants={fadeUp} className="flex gap-5">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white text-brand">
                    <r.icon className="size-6" />
                  </div>
                  <div>
                    <h3 className="mb-1.5 text-lg font-semibold text-white">{r.title}</h3>
                    <p className="text-sm leading-relaxed text-white/80">{r.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
