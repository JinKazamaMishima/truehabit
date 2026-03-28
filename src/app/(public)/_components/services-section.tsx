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
  visible: { transition: { staggerChildren: 0.1 } },
};

const services = [
  { icon: Apple, title: "Nutrición Personalizada", desc: "Planes alimenticios adaptados a tus requerimientos calóricos y preferencias.", slug: "personalized_nutrition" },
  { icon: Scale, title: "Pérdida de Peso", desc: "Estrategias sostenibles para alcanzar y mantener tu peso ideal.", slug: "weight_loss" },
  { icon: Dumbbell, title: "Nutrición Deportiva", desc: "Optimiza tu rendimiento con nutrición específica para tu disciplina.", slug: "sports_nutrition" },
  { icon: Activity, title: "Composición Corporal", desc: "Análisis detallado y estrategias para mejorar tu composición corporal.", slug: "body_composition" },
  { icon: Trophy, title: "Plan Pre-Competencia", desc: "Protocolos de nutrición y carga de carbohidratos para competidores.", slug: "pre_competition" },
  { icon: Users, title: "Coaching Individual", desc: "Acompañamiento personalizado para crear hábitos alimenticios duraderos.", slug: "individual_coaching" },
];

export function ServicesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="bg-white py-20 sm:py-28">
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
              Lo que ofrecemos
            </span>
            <span className="h-px w-8 bg-brand" />
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="font-heading text-3xl font-bold text-charcoal sm:text-4xl lg:text-[2.75rem]"
          >
            Nuestros Servicios
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-base text-muted-foreground">
            Soluciones integrales de nutrición adaptadas a tus necesidades específicas.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
        >
          {services.map((s) => (
            <motion.div
              key={s.title}
              variants={fadeUp}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-48 bg-gradient-to-br from-brand/10 via-brand/5 to-transparent">
                <div className="absolute inset-0 flex items-center justify-center">
                  <s.icon className="size-16 text-brand/20" />
                </div>
                <div className="absolute -bottom-5 right-6 flex size-14 items-center justify-center rounded-full bg-brand text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <s.icon className="size-6" />
                </div>
              </div>

              <div className="p-7 pt-8">
                <h3 className="mb-3 font-heading text-xl font-semibold text-charcoal">{s.title}</h3>
                <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                <Link
                  href={`/contact?service=${s.slug}`}
                  className="inline-flex items-center text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
                >
                  Saber Más
                  <ArrowRight className="ml-1 size-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
