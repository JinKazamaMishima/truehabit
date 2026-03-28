import { getSiteSettings } from "@/lib/db/queries/settings";
import { getFeaturedTestimonials } from "@/lib/db/queries/settings";
import { HeroSection } from "./_components/hero-section";
import { FeaturesSection } from "./_components/features-section";
import { AboutPreview } from "./_components/about-preview";
import { ServicesSection } from "./_components/services-section";
import { WhyChooseUs } from "./_components/why-choose-us";
import { StatsSection } from "./_components/stats-section";
import { TestimonialsSection } from "./_components/testimonials-section";
import { CTABanner } from "./_components/cta-banner";

const DEFAULTS: Record<string, string> = {
  hero_badge: "Nutrición basada en ciencia",
  hero_heading: "Transforma Tu Nutrición",
  hero_subheading:
    "Planes de alimentación personalizados, diseñados por profesionales y respaldados por la ciencia, para ayudarte a alcanzar tus metas de salud y rendimiento.",
  hero_cta_primary: "Agenda Tu Cita",
  hero_cta_secondary: "Conoce Más",
  about_name: "LN. Enya Marrero",
  about_title: "Conócenos",
  about_bio_1:
    "Licenciada en Nutrición con especialización en nutrición deportiva y composición corporal. Con más de una década de experiencia, ha ayudado a cientos de clientes a transformar su relación con la alimentación mediante planes personalizados y evidencia científica.",
  about_bio_2:
    "Su enfoque integral combina la ciencia de la nutrición con estrategias prácticas y sostenibles, asegurando que cada plan se adapte al estilo de vida único de cada persona.",
  about_stat_clients: "500",
  about_stat_years: "10",
  about_stat_satisfaction: "98",
};

function v(settings: Record<string, string>, key: string) {
  return settings[key] || DEFAULTS[key] || "";
}

export default async function HomePage() {
  const [settings, testimonials] = await Promise.all([
    getSiteSettings(),
    getFeaturedTestimonials(),
  ]);

  const heroData = {
    badge: v(settings, "hero_badge"),
    heading: v(settings, "hero_heading"),
    subheading: v(settings, "hero_subheading"),
    ctaPrimary: v(settings, "hero_cta_primary"),
    ctaSecondary: v(settings, "hero_cta_secondary"),
    imageUrl: settings.hero_image_url || undefined,
  };

  const aboutData = {
    name: v(settings, "about_name"),
    title: v(settings, "about_title"),
    bio1: v(settings, "about_bio_1"),
    bio2: v(settings, "about_bio_2"),
    yearsExperience: Number(v(settings, "about_stat_years")) || 10,
    imageUrl: settings.about_image_url || undefined,
  };

  const statsData = {
    clients: Number(v(settings, "about_stat_clients")) || 500,
    plans: 1000,
    years: Number(v(settings, "about_stat_years")) || 10,
    satisfaction: Number(v(settings, "about_stat_satisfaction")) || 98,
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
