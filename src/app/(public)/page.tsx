import { getSiteSettings } from "@/lib/db/queries/settings";
import { getFeaturedTestimonials } from "@/lib/db/queries/settings";
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n";
import { HeroSection } from "./_components/hero-section";
import { FeaturesSection } from "./_components/features-section";
import { AboutPreview } from "./_components/about-preview";
import { ServicesSection } from "./_components/services-section";
import { WhyChooseUs } from "./_components/why-choose-us";
import { StatsSection } from "./_components/stats-section";
import { TestimonialsSection } from "./_components/testimonials-section";
import { CTABanner } from "./_components/cta-banner";

export default async function HomePage() {
  const [settings, testimonials, locale] = await Promise.all([
    getSiteSettings(),
    getFeaturedTestimonials(),
    getLocale(),
  ]);
  const d = await getDictionary(locale);

  const DEFAULTS: Record<string, string> = {
    hero_badge: d.public.hero.badgeDefault,
    hero_heading: d.public.hero.headingDefault,
    hero_subheading: d.public.hero.subheadingDefault,
    hero_cta_primary: d.public.hero.ctaPrimaryDefault,
    hero_cta_secondary: d.public.hero.ctaSecondaryDefault,
    about_name: d.public.about.defaultName,
    about_title: d.public.about.defaultTitle,
    about_bio_1: d.public.about.previewBio1Default,
    about_bio_2: d.public.about.previewBio2Default,
    about_stat_clients: "500",
    about_stat_years: "10",
    about_stat_satisfaction: "98",
  };

  function v(key: string) {
    return settings[key] || DEFAULTS[key] || "";
  }

  const heroData = {
    badge: v("hero_badge"),
    heading: v("hero_heading"),
    subheading: v("hero_subheading"),
    ctaPrimary: v("hero_cta_primary"),
    ctaSecondary: v("hero_cta_secondary"),
    imageUrl: settings.hero_image_url || undefined,
  };

  const aboutData = {
    name: v("about_name"),
    title: v("about_title"),
    bio1: v("about_bio_1"),
    bio2: v("about_bio_2"),
    yearsExperience: Number(v("about_stat_years")) || 10,
    imageUrl: settings.about_image_url || undefined,
  };

  const statsData = {
    clients: Number(v("about_stat_clients")) || 500,
    plans: 1000,
    years: Number(v("about_stat_years")) || 10,
    satisfaction: Number(v("about_stat_satisfaction")) || 98,
  };

  const testimonialItems = testimonials.map((t) => ({
    id: t.id,
    clientName: t.clientName,
    clientTitle: t.clientTitle,
    quote: t.quote,
  }));

  return (
    <>
      <HeroSection data={heroData} />
      <FeaturesSection />
      <AboutPreview data={aboutData} />
      <ServicesSection />
      <WhyChooseUs />
      <StatsSection data={statsData} />
      <TestimonialsSection items={testimonialItems} />
      <CTABanner ctaText={settings.hero_cta_primary || undefined} />
    </>
  );
}
