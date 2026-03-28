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
              Conócenos
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-4xl font-extrabold text-white sm:text-5xl"
            >
              Sobre TrueHabit
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-4 max-w-xl text-lg text-emerald-100"
            >
              Más de una década transformando vidas a través de la nutrición
              basada en evidencia.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section ref={bioRef} className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid items-center gap-12 lg:grid-cols-2"
            initial="hidden"
            animate={bioInView ? "visible" : "hidden"}
            variants={stagger}
          >
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
                  <div className="absolute -bottom-4 -left-4 rounded-xl bg-white px-5 py-3 shadow-lg">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="size-5 text-emerald-600" />
                      <span className="text-sm font-bold text-slate-900">
                        {data.name}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div variants={fadeUp}>
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-emerald-600">
                {data.title}
              </p>
              <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                {data.name}
              </h2>
              {data.bio1 && (
                <p className="mt-4 leading-relaxed text-slate-600">{data.bio1}</p>
              )}
              {data.bio2 && (
                <p className="mt-3 leading-relaxed text-slate-600">{data.bio2}</p>
              )}
              {data.bio3 && (
                <p className="mt-3 leading-relaxed text-slate-600">{data.bio3}</p>
              )}

              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="rounded-xl bg-emerald-50 p-4 text-center">
                  <p className="text-2xl font-extrabold text-emerald-600">
                    <AnimatedCounter target={data.statClients} suffix="+" />
                  </p>
                  <p className="mt-1 text-xs text-slate-600">Clientes</p>
                </div>
                <div className="rounded-xl bg-emerald-50 p-4 text-center">
                  <p className="text-2xl font-extrabold text-emerald-600">
                    <AnimatedCounter target={data.statYears} suffix="+" />
                  </p>
                  <p className="mt-1 text-xs text-slate-600">Años</p>
                </div>
                <div className="rounded-xl bg-emerald-50 p-4 text-center">
                  <p className="text-2xl font-extrabold text-emerald-600">
                    <AnimatedCounter target={data.statSatisfaction} suffix="%" />
                  </p>
                  <p className="mt-1 text-xs text-slate-600">Satisfacción</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {data.credentials.length > 0 && (
        <section ref={credRef} className="bg-slate-50 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              animate={credInView ? "visible" : "hidden"}
              variants={stagger}
            >
              <motion.div variants={fadeUp} className="mx-auto mb-12 max-w-2xl text-center">
                <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-emerald-600">
                  Formación
                </p>
                <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                  Credenciales y Certificaciones
                </h2>
              </motion.div>

              <motion.div variants={fadeUp} className="mx-auto max-w-2xl space-y-4">
                {data.credentials.map((cred) => (
                  <div
                    key={cred}
                    className="flex items-start gap-4 rounded-xl border border-slate-100 bg-white p-5"
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                      <CheckCircle className="size-4 text-emerald-600" />
                    </div>
                    <p className="text-sm font-medium text-slate-700">{cred}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      <section ref={philRef} className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={philInView ? "visible" : "hidden"}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="mx-auto mb-14 max-w-2xl text-center">
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-emerald-600">
                Nuestra Filosofía
              </p>
              <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                Principios que nos guían
              </h2>
              <p className="mt-4 text-slate-600">
                Creemos en un enfoque integral donde la nutrición es el
                fundamento de una vida plena y activa.
              </p>
            </motion.div>

            <motion.div className="grid gap-8 md:grid-cols-3" variants={stagger}>
              {philosophyPoints.map((p) => (
                <motion.div
                  key={p.title}
                  variants={fadeUp}
                  className="rounded-2xl border border-slate-100 bg-white p-8 text-center"
                >
                  <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <p.icon className="size-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-slate-900">{p.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{p.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
