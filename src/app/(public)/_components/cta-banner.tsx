"use client";

import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTABanner({ ctaText }: { ctaText?: string }) {
  return (
    <section className="bg-emerald-600 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <Zap className="mx-auto mb-4 size-10 text-emerald-200" />
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          ¿Listo para transformar tu alimentación?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-emerald-100">
          Da el primer paso hacia una vida más saludable con un plan diseñado
          exclusivamente para ti.
        </p>
        <div className="mt-8">
          <Button
            className="h-12 rounded-full bg-white px-8 text-base font-semibold text-emerald-700 shadow-lg hover:bg-emerald-50"
            render={<Link href="/contact" />}
          >
            {ctaText || "Agenda Tu Cita"}
            <ArrowRight className="ml-1 size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
