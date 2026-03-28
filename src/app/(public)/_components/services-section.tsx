"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  Apple,
  Scale,
  Dumbbell,
  Activity,
  Trophy,
  Users,
  ArrowRight,
} from "lucide-react";
import { motion, useInView } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Apple,
  Scale,
  Dumbbell,
  Activity,
  Trophy,
  Users,
};

const services = [
  { icon: "Apple", title: "Nutrición Personalizada", desc: "Planes alimenticios adaptados a tus requerimientos calóricos y preferencias.", slug: "personalized_nutrition" },
  { icon: "Scale", title: "Pérdida de Peso", desc: "Estrategias sostenibles para alcanzar y mantener tu peso ideal.", slug: "weight_loss" },
  { icon: "Dumbbell", title: "Nutrición Deportiva", desc: "Optimiza tu rendimiento con nutrición específica para tu disciplina.", slug: "sports_nutrition" },
  { icon: "Activity", title: "Composición Corporal", desc: "Análisis detallado y estrategias para mejorar tu composición corporal.", slug: "body_composition" },
  { icon: "Trophy", title: "Plan Pre-Competencia", desc: "Protocolos de nutrición y carga de carbohidratos para competidores.", slug: "pre_competition" },
  { icon: "Users", title: "Coaching Individual", desc: "Acompañamiento personalizado para crear hábitos alimenticios duraderos.", slug: "individual_coaching" },
];

export function ServicesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto mb-14 max-w-2xl text-center"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
        >
          <motion.p
            variants={fadeUp}
            className="mb-2 text-sm font-semibold uppercase tracking-widest text-emerald-600"
          >
            Lo que ofrecemos
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-3xl font-extrabold text-slate-900 sm:text-4xl"
          >
            Nuestros Servicios
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-slate-600">
            Soluciones integrales de nutrición adaptadas a tus necesidades específicas.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
        >
          {services.map((s) => {
            const Icon = ICON_MAP[s.icon] ?? Apple;
            return (
              <motion.div
                key={s.title}
                variants={fadeUp}
                className="group rounded-2xl border border-slate-100 bg-white p-8 transition-shadow hover:shadow-lg"
              >
                <div className="mb-5 flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                  <Icon className="size-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">{s.title}</h3>
                <p className="mb-4 text-sm leading-relaxed text-slate-600">{s.desc}</p>
                <Link
                  href="/services"
                  className="inline-flex items-center text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
                >
                  Saber Más
                  <ArrowRight className="ml-1 size-3.5" />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
