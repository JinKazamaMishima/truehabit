"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Quote, User, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useDictionary } from "@/lib/i18n/context";

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
  const d = useDictionary();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % items.length);
  }, [items.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [next, items.length]);

  if (items.length === 0) return null;

  const item = items[current];

  return (
    <section ref={ref} className="bg-gray-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="mx-auto mb-16 max-w-2xl text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-brand" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                {d.public.testimonials.eyebrow}
              </span>
              <span className="h-px w-8 bg-brand" />
            </div>
            <h2 className="font-heading text-3xl font-bold text-charcoal sm:text-4xl lg:text-[2.75rem]">
              {d.public.testimonials.heading}
            </h2>
          </motion.div>

          <motion.div variants={fadeUp}>
            <div className="mx-auto max-w-4xl">
              <div className="grid items-center gap-8 lg:grid-cols-5">
                <div className="flex items-center justify-center lg:col-span-2">
                  <div className="relative">
                    <div className="flex size-48 items-center justify-center rounded-full bg-brand/10 sm:size-56">
                      <User className="size-20 text-brand/30" />
                    </div>
                    <div className="absolute -right-2 -top-2 flex size-12 items-center justify-center rounded-full bg-brand text-white shadow-lg">
                      <Quote className="size-5" />
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-3">
                  <div className="rounded-2xl bg-brand px-8 py-10 shadow-xl sm:px-10 sm:py-12">
                    <Quote className="mb-4 size-10 text-white/30" />
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                      >
                        <p className="text-lg leading-relaxed text-white/90 italic sm:text-xl">
                          &ldquo;{item.quote}&rdquo;
                        </p>
                        <div className="mt-6 border-t border-white/20 pt-4">
                          <p className="text-base font-semibold text-white">
                            {item.clientName}
                          </p>
                          {item.clientTitle && (
                            <p className="mt-0.5 text-sm text-white/60">
                              {item.clientTitle}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {items.length > 1 && (
                      <div className="mt-6 flex items-center gap-3">
                        <button
                          onClick={prev}
                          className="flex size-9 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
                          aria-label={d.public.testimonials.prev}
                        >
                          <ChevronLeft className="size-4" />
                        </button>
                        <div className="flex gap-1.5">
                          {items.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setCurrent(i)}
                              className={`size-2 rounded-full transition-all ${
                                i === current ? "w-6 bg-white" : "bg-white/40"
                              }`}
                              aria-label={`${d.public.testimonials.testimonialN} ${i + 1}`}
                            />
                          ))}
                        </div>
                        <button
                          onClick={next}
                          className="flex size-9 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
                          aria-label={d.public.testimonials.next}
                        >
                          <ChevronRight className="size-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
