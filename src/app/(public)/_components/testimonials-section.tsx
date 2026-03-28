"use client";

import { useRef } from "react";
import { Quote, User } from "lucide-react";
import { motion, useInView } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

export type TestimonialItem = {
  id: string;
  clientName: string;
  clientTitle: string | null;
  quote: string;
};

export function TestimonialsSection({ items }: { items: TestimonialItem[] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  if (items.length === 0) return null;

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
            Testimonios
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-3xl font-extrabold text-slate-900 sm:text-4xl"
          >
            Lo Que Dicen Nuestros Clientes
          </motion.h2>
        </motion.div>

        <motion.div
          className="grid gap-8 md:grid-cols-3"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
        >
          {items.map((t) => (
            <motion.div
              key={t.id}
              variants={fadeUp}
              className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm"
            >
              <Quote className="mb-4 size-8 text-emerald-200" />
              <p className="mb-6 leading-relaxed text-slate-600">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <User className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{t.clientName}</p>
                  {t.clientTitle && (
                    <p className="text-xs text-slate-500">{t.clientTitle}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
