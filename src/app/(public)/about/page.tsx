import { getSiteSettings } from "@/lib/db/queries/settings";
import { AboutContent } from "./_components/about-content";
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n";

export default async function AboutPage() {
  const [settings, locale] = await Promise.all([
    getSiteSettings(),
    getLocale(),
  ]);
  const d = await getDictionary(locale);

  const DEFAULT_CREDENTIALS = d.public.about.credentials;

  const DEFAULTS: Record<string, string> = {
    about_name: d.public.about.defaultName,
    about_title: d.public.about.defaultTitle,
    about_bio_1: d.public.about.defaultBio1,
    about_bio_2: d.public.about.defaultBio2,
    about_bio_3: d.public.about.defaultBio3,
    about_stat_clients: "500",
    about_stat_years: "10",
    about_stat_satisfaction: "98",
  };

  function v(key: string) {
    return settings[key] || DEFAULTS[key] || "";
  }

  let credentials: string[];
  try {
    const parsed = JSON.parse(settings.about_credentials || "[]");
    credentials = Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_CREDENTIALS;
  } catch {
    credentials = DEFAULT_CREDENTIALS;
  }

  const data = {
    name: v("about_name"),
    title: v("about_title"),
    bio1: v("about_bio_1"),
    bio2: v("about_bio_2"),
    bio3: v("about_bio_3"),
    credentials,
    statClients: Number(v("about_stat_clients")) || 500,
    statYears: Number(v("about_stat_years")) || 10,
    statSatisfaction: Number(v("about_stat_satisfaction")) || 98,
    imageUrl: settings.about_image_url || undefined,
  };

  return <AboutContent data={data} />;
}
