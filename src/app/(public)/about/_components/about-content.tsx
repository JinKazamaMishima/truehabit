"use client";

import { useRef } from "react";
import {
  User,
  GraduationCap,
  CheckCircle,
  Heart,
  BookOpen,
  Target,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { AnimatedCounter } from "../../_components/animated-counter";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const philosophyPoints = [
  {
    icon: Target,
    title: "Enfoque Individualizado",
    desc: "Cada persona es única. Diseñamos planes que se adaptan a tu metabolismo, preferencias y estilo de vida.",
  },
  {
    icon: BookOpen,
    title: "Educación Nutricional",
    desc: "Te enseñamos a tomar decisiones informadas para que puedas mantener tus resultados a largo plazo.",
  },
  {
    icon: Heart,
    title: "Relación Saludable con la Comida",
    desc: "Promovemos una alimentación sin restricciones extremas, disfrutando la comida mientras alcanzas tus metas.",
  },
];

export type AboutPageData = {
  name: string;
  title: string;
  bio1: string;
  bio2: string;
  bio3: string;
  credentials: string[];
  statClients: number;
  statYears: number;
  statSatisfaction: number;
  imageUrl?: string;
};

export function AboutContent({ data }: { data: AboutPageData }) {
  const bioRef = useRef(null);
  const bioInView = useInView(bioRef, { once: true, margin: "-80px" });
  const credRef = useRef(null);
  const credInView = useInView(credRef, { once: true, margin: "-80px" });
  const philRef = useRef(null);
  const philInView = useInView(philRef, { once: true, margin: "-80px" });

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
                Conócenos
              </span>
              <span className="h-px w-8 bg-brand" />
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="font-heading text-4xl font-bold text-white sm:text-5xl"
            >
              Sobre TrueHabit
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-5 max-w-xl text-base text-white/70"
            >
              Más de una década transformando vidas a través de la nutrición
              basada en evidencia.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section ref={bioRef} className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
            initial="hidden"
            animate={bioInView ? "visible" : "hidden"}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="flex justify-center">
              {data.imageUrl ? (
                <div className="relative overflow-hidden rounded-2xl border-[6px] border-brand shadow-2xl">
                  <img
                    src={data.imageUrl}
                    alt={data.name}
                    className="size-80 object-cover lg:h-[28rem] lg:w-96"
                  />
                </div>
              ) : (
                <div className="relative">
                  <div className="flex size-80 items-center justify-center rounded-2xl border-[6px] border-brand bg-gradient-to-br from-brand/10 to-brand/5 lg:h-[28rem] lg:w-96">
                    <User className="size-24 text-brand/30" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 rounded-xl bg-white px-5 py-3 shadow-xl">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="size-5 text-brand" />
                      <span className="text-sm font-bold text-charcoal">
                        {data.name}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div variants={fadeUp}>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-brand" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                  {data.title}
                </span>
              </div>
              <h2 className="font-heading text-3xl font-bold text-charcoal sm:text-4xl">
                {data.name}
              </h2>
              {data.bio1 && (
                <p className="mt-5 text-base leading-[1.8] text-muted-foreground">{data.bio1}</p>
              )}
              {data.bio2 && (
                <p className="mt-4 text-base leading-[1.8] text-muted-foreground">{data.bio2}</p>
              )}
              {data.bio3 && (
                <p className="mt-4 text-base leading-[1.8] text-muted-foreground">{data.bio3}</p>
              )}

              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-center">
                  <p className="font-heading text-2xl font-bold text-brand">
                    <AnimatedCounter target={data.statClients} suffix="+" />
                  </p>
                  <p className="mt-1 text-xs font-medium text-muted-foreground">Clientes</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-center">
                  <p className="font-heading text-2xl font-bold text-brand">
                    <AnimatedCounter target={data.statYears} suffix="+" />
                  </p>
                  <p className="mt-1 text-xs font-medium text-muted-foreground">Años</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-center">
                  <p className="font-heading text-2xl font-bold text-brand">
                    <AnimatedCounter target={data.statSatisfaction} suffix="%" />
                  </p>
                  <p className="mt-1 text-xs font-medium text-muted-foreground">Satisfacción</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {data.credentials.length > 0 && (
        <section ref={credRef} className="bg-gray-50 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              animate={credInView ? "visible" : "hidden"}
              variants={stagger}
            >
              <motion.div variants={fadeUp} className="mx-auto mb-14 max-w-2xl text-center">
                <div className="mb-4 flex items-center justify-center gap-3">
                  <span className="h-px w-8 bg-brand" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                    Formación
                  </span>
                  <span className="h-px w-8 bg-brand" />
                </div>
                <h2 className="font-heading text-3xl font-bold text-charcoal sm:text-4xl">
                  Credenciales y Certificaciones
                </h2>
              </motion.div>

              <motion.div variants={fadeUp} className="mx-auto max-w-2xl space-y-4">
                {data.credentials.map((cred) => (
                  <div
                    key={cred}
                    className="flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand/10">
                      <CheckCircle className="size-4 text-brand" />
                    </div>
                    <p className="text-sm font-medium text-charcoal">{cred}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      <section ref={philRef} className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={philInView ? "visible" : "hidden"}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="mx-auto mb-16 max-w-2xl text-center">
              <div className="mb-4 flex items-center justify-center gap-3">
                <span className="h-px w-8 bg-brand" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                  Nuestra Filosofía
                </span>
                <span className="h-px w-8 bg-brand" />
              </div>
              <h2 className="font-heading text-3xl font-bold text-charcoal sm:text-4xl">
                Principios que nos guían
              </h2>
              <p className="mt-4 text-base text-muted-foreground">
                Creemos en un enfoque integral donde la nutrición es el
                fundamento de una vida plena y activa.
              </p>
            </motion.div>

            <motion.div className="grid gap-8 md:grid-cols-3" variants={stagger}>
              {philosophyPoints.map((p) => (
                <motion.div
                  key={p.title}
                  variants={fadeUp}
                  className="group rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-brand/10 text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
                    <p.icon className="size-7" />
                  </div>
                  <h3 className="mb-3 font-heading text-xl font-semibold text-charcoal">{p.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
