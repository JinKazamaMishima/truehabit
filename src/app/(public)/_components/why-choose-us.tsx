"use client";

import { useRef } from "react";
import { Shield, Heart } from "lucide-react";
import { motion, useInView } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

export function WhyChooseUs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="bg-slate-900 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto mb-14 max-w-2xl text-center"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
        >
          <motion.p
            variants={fadeUp}
            className="mb-2 text-sm font-semibold uppercase tracking-widest text-emerald-400"
          >
            Nuestra diferencia
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-3xl font-extrabold text-white sm:text-4xl"
          >
            ¿Por Qué Elegirnos?
          </motion.h2>
        </motion.div>

        <motion.div
          className="grid gap-8 md:grid-cols-2"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
        >
          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-slate-700 bg-slate-800/50 p-8"
          >
            <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-400">
              <Shield className="size-6" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-white">
              Estrategias Nutricionales
            </h3>
            <p className="leading-relaxed text-slate-400">
              Desarrollamos estrategias basadas en la evidencia científica más
              reciente, utilizando herramientas de evaluación avanzadas para
              crear planes que realmente funcionan. Cada protocolo se ajusta
              continuamente según tu progreso y respuesta individual.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-slate-700 bg-slate-800/50 p-8"
          >
            <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-400">
              <Heart className="size-6" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-white">
              Soporte y Motivación
            </h3>
            <p className="leading-relaxed text-slate-400">
              No estás solo en tu camino. Ofrecemos acompañamiento continuo con
              seguimiento semanal, ajustes en tiempo real y la motivación que
              necesitas para mantener el rumbo. Tu éxito es nuestra prioridad.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
