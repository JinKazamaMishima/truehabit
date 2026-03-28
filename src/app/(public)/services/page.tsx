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
  visible: { transition: { staggerChildren: 0.12 } },
};

const services = [
  {
    icon: Apple,
    title: "Nutrición Personalizada",
    slug: "personalized_nutrition",
    short: "Planes alimenticios adaptados a tus requerimientos calóricos y preferencias.",
    long: "Diseñamos un plan nutricional completamente personalizado basado en tus objetivos, composición corporal, metabolismo basal y estilo de vida. Incluye evaluación inicial completa, cálculo preciso de macronutrientes, menús variados con recetas prácticas y seguimiento continuo para ajustar el plan según tu progreso. Ideal para quienes buscan mejorar su alimentación de forma integral.",
  },
  {
    icon: Scale,
    title: "Pérdida de Peso",
    slug: "weight_loss",
    short: "Estrategias sostenibles para alcanzar y mantener tu peso ideal.",
    long: "Nuestro programa de pérdida de peso se basa en un déficit calórico moderado y sostenible, preservando tu masa muscular mientras reduces grasa corporal. Incluye planificación de comidas, educación nutricional para controlar porciones, estrategias para manejar antojos y seguimiento semanal con ajustes progresivos. Sin dietas extremas ni restricciones innecesarias.",
  },
  {
    icon: Dumbbell,
    title: "Nutrición Deportiva",
    slug: "sports_nutrition",
    short: "Optimiza tu rendimiento con nutrición específica para tu disciplina.",
    long: "Programas de nutrición diseñados específicamente para atletas y deportistas. Incluye periodización nutricional adaptada a tu plan de entrenamiento, protocolos de hidratación, timing de nutrientes pre/intra/post entrenamiento, suplementación basada en evidencia y estrategias de recuperación. Trabajamos con deportistas de todas las disciplinas y niveles.",
  },
  {
    icon: Activity,
    title: "Composición Corporal",
    slug: "body_composition",
    short: "Análisis detallado y estrategias para mejorar tu composición corporal.",
    long: "Evaluación completa de tu composición corporal mediante antropometría avanzada (ISAK). Medimos y analizamos tu porcentaje de grasa, masa muscular, grasa visceral y otros indicadores clave. Con base en los resultados, diseñamos estrategias nutricionales específicas para optimizar tu composición corporal, ya sea ganancia muscular o reducción de grasa.",
  },
  {
    icon: Trophy,
    title: "Plan Pre-Competencia",
    slug: "pre_competition",
    short: "Protocolos de nutrición y carga de carbohidratos para competidores.",
    long: "Protocolo especializado para atletas que se preparan para competencias. Incluye planificación de la fase de preparación, protocolo de corte de peso seguro, carga de carbohidratos programada, plan de hidratación específico para el día de competencia y estrategias de recuperación post-evento. Experiencia con competidores de diversas disciplinas.",
  },
  {
    icon: Users,
    title: "Coaching Individual",
    slug: "individual_coaching",
    short: "Acompañamiento personalizado para crear hábitos alimenticios duraderos.",
    long: "Un programa de acompañamiento uno a uno enfocado en la transformación de hábitos alimenticios. Incluye sesiones semanales de seguimiento, educación nutricional práctica, estrategias de planificación de comidas, manejo de situaciones sociales y viajes, y herramientas para mantener la motivación a largo plazo. Ideal para quienes buscan un cambio de vida duradero.",
  },
];

export default function ServicesPage() {
  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-80px" });

  return (
    <>
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 py-20 sm:py-28">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.p
              variants={fadeUp}
              className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-200"
            >
              Lo que ofrecemos
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-4xl font-extrabold text-white sm:text-5xl"
            >
              Nuestros Servicios
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-4 max-w-xl text-lg text-emerald-100"
            >
              Soluciones integrales de nutrición diseñadas para ayudarte a
              alcanzar tus metas de salud y rendimiento.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section ref={gridRef} className="bg-white py-20 sm:py-24">
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
                className="group flex flex-col rounded-2xl border border-slate-100 bg-white p-8 transition-shadow hover:shadow-lg"
              >
                <div className="mb-5 flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                  <s.icon className="size-6" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900">
                  {s.title}
                </h3>
                <p className="mb-6 flex-1 text-sm leading-relaxed text-slate-600">
                  {s.long}
                </p>
                <Button
                  className="mt-auto w-full bg-emerald-600 text-white hover:bg-emerald-700"
                  render={
                    <Link href={`/contact?service=${s.slug}`} />
                  }
                >
                  Agendar Cita
                  <ArrowRight className="ml-1 size-4" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
