"use client";

import { AnimatedCounter } from "./animated-counter";

export type StatsData = {
  clients: number;
  plans: number;
  years: number;
  satisfaction: number;
};

export function StatsSection({ data }: { data: StatsData }) {
  const stats = [
    { value: data.clients, suffix: "+", label: "Clientes Felices" },
    { value: data.plans, suffix: "+", label: "Planes Entregados" },
    { value: data.years, suffix: "+", label: "Años Experiencia" },
    { value: data.satisfaction, suffix: "%", label: "Satisfacción" },
  ];

  return (
    <section className="bg-gradient-to-r from-emerald-600 to-emerald-700 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-sm font-medium text-emerald-100">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
