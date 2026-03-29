"use client";

import Link from "next/link";
import { ArrowRight, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/lib/i18n/context";

export function CTABanner({ ctaText }: { ctaText?: string }) {
  const d = useDictionary();

  return (
    <section className="bg-gray-100 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Leaf className="size-6 text-brand" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                {d.public.ctaBanner.eyebrow}
              </span>
            </div>
            <h2 className="font-heading text-3xl font-bold text-charcoal sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
              {d.public.ctaBanner.headingPart1}
              <span className="text-brand">{d.public.ctaBanner.headingHighlight}</span>
              {d.public.ctaBanner.headingPart2}
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
              {d.public.ctaBanner.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                className="h-12 rounded-md bg-brand px-8 text-sm font-semibold text-white shadow-md transition-all hover:bg-brand-dark hover:shadow-lg"
                render={<Link href="/contact" />}
              >
                {ctaText || d.public.ctaBanner.ctaDefault}
                <ArrowRight className="ml-1.5 size-4" />
              </Button>
              <Button
                className="h-12 rounded-md border-2 border-charcoal px-8 text-sm font-semibold text-charcoal transition-all hover:bg-charcoal hover:text-white"
                render={<Link href="/about" />}
              >
                {d.public.ctaBanner.moreAboutUs}
              </Button>
            </div>
          </div>

          <div className="hidden lg:flex lg:justify-end">
            <div className="relative h-80 w-full max-w-sm overflow-hidden rounded-2xl bg-gradient-to-br from-brand/15 via-brand/5 to-transparent">
              <div className="absolute inset-0 flex items-center justify-center">
                <Leaf className="size-24 text-brand/15" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
