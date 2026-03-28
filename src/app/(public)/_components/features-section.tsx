"use client";

import { useRef } from "react";
import { ClipboardList, FlaskConical, TrendingUp } from "lucide-react";
import { motion, useInView } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  ClipboardList,
  FlaskConical,
  TrendingUp,
};

const features = [
  { icon: "ClipboardList", title: "Planes Personalizados", desc: "Cada plan se diseña según tus metas, estilo de vida y necesidades nutricionales únicas." },
  { icon: "FlaskConical", title: "Basado en Ciencia", desc: "Estrategias respaldadas por la evidencia científica más actualizada en nutrición." },
  { icon: "TrendingUp", title: "Resultados Reales", desc: "Seguimiento continuo con métricas claras para garantizar tu progreso." },
];

export function FeaturesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid gap-8 md:grid-cols-3"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
        >
          {features.map((f) => {
            const Icon = ICON_MAP[f.icon] ?? ClipboardList;
            return (
              <motion.div
                key={f.title}
                variants={fadeUp}
                className="group rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="mb-5 flex size-14 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                  <Icon className="size-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">{f.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{f.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
