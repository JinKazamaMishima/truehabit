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
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const services = [
  {
    icon: Apple,
    title: "Nutrición Personalizada",
    slug: "personalized_nutrition",
    short: "Planes alimenticios adaptados a tus requerimientos calóricos y preferencias.",
    long: "Diseñamos un plan nutricional completamente personalizado basado en tus objetivos, composición corporal, metabolismo basal y estilo de vida. Incluye evaluación inicial completa, cálculo preciso de macronutrientes, menús variados con recetas prácticas y seguimiento continuo para ajustar el plan según tu progreso.",
  },
  {
    icon: Scale,
    title: "Pérdida de Peso",
    slug: "weight_loss",
    short: "Estrategias sostenibles para alcanzar y mantener tu peso ideal.",
    long: "Nuestro programa de pérdida de peso se basa en un déficit calórico moderado y sostenible, preservando tu masa muscular mientras reduces grasa corporal. Incluye planificación de comidas, educación nutricional y seguimiento semanal con ajustes progresivos.",
  },
  {
    icon: Dumbbell,
    title: "Nutrición Deportiva",
    slug: "sports_nutrition",
    short: "Optimiza tu rendimiento con nutrición específica para tu disciplina.",
    long: "Programas de nutrición diseñados específicamente para atletas y deportistas. Incluye periodización nutricional adaptada a tu plan de entrenamiento, protocolos de hidratación, timing de nutrientes y suplementación basada en evidencia.",
  },
  {
    icon: Activity,
    title: "Composición Corporal",
    slug: "body_composition",
    short: "Análisis detallado y estrategias para mejorar tu composición corporal.",
    long: "Evaluación completa de tu composición corporal mediante antropometría avanzada (ISAK). Medimos y analizamos tu porcentaje de grasa, masa muscular y otros indicadores clave para diseñar estrategias nutricionales específicas.",
  },
  {
    icon: Trophy,
    title: "Plan Pre-Competencia",
    slug: "pre_competition",
    short: "Protocolos de nutrición y carga de carbohidratos para competidores.",
    long: "Protocolo especializado para atletas que se preparan para competencias. Incluye planificación de la fase de preparación, protocolo de corte de peso seguro, carga de carbohidratos programada y plan de hidratación específico.",
  },
  {
    icon: Users,
    title: "Coaching Individual",
    slug: "individual_coaching",
    short: "Acompañamiento personalizado para crear hábitos alimenticios duraderos.",
    long: "Un programa de acompañamiento uno a uno enfocado en la transformación de hábitos alimenticios. Incluye sesiones semanales de seguimiento, educación nutricional práctica y herramientas para mantener la motivación a largo plazo.",
  },
];

export default function ServicesPage() {
  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-80px" });

  return (
    <>
      <section className="relative overflow-hidden bg-charcoal py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal-light/50 to-charcoal opacity-80" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="mb-4 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-brand" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                Lo que ofrecemos
              </span>
              <span className="h-px w-8 bg-brand" />
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="font-heading text-4xl font-bold text-white sm:text-5xl"
            >
              Nuestros Servicios
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-5 max-w-xl text-base text-white/70"
            >
              Soluciones integrales de nutrición diseñadas para ayudarte a
              alcanzar tus metas de salud y rendimiento.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section ref={gridRef} className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            animate={gridInView ? "visible" : "hidden"}
            variants={stagger}
          >
            {services.map((s) => (
              <motion.div
                key={s.slug}
                variants={fadeUp}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-44 bg-gradient-to-br from-brand/10 via-brand/5 to-transparent">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <s.icon className="size-14 text-brand/20" />
                  </div>
                  <div className="absolute -bottom-5 right-6 flex size-14 items-center justify-center rounded-full bg-brand text-white shadow-lg">
                    <s.icon className="size-6" />
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-7 pt-8">
                  <h3 className="mb-3 font-heading text-xl font-semibold text-charcoal">
                    {s.title}
                  </h3>
                  <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {s.long}
                  </p>
                  <Button
                    className="mt-auto w-full bg-brand text-white hover:bg-brand-dark"
                    render={<Link href={`/contact?service=${s.slug}`} />}
                  >
                    Agendar Cita
                    <ArrowRight className="ml-1 size-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
