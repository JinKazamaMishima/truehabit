import { getSiteSettings } from "@/lib/db/queries/settings";
import { AboutContent } from "./_components/about-content";

const DEFAULT_CREDENTIALS = [
  "Licenciatura en Nutrición — Universidad Autónoma de Baja California",
  "Especialización en Nutrición Deportiva — ISAK Nivel 2",
  "Certificación en Composición Corporal — Antropometría avanzada",
  "Diplomado en Nutrición Clínica y Metabolismo",
  "Miembro del Colegio de Nutriólogos de Baja California",
];

const DEFAULTS: Record<string, string> = {
  about_name: "LN. Enya Marrero",
  about_title: "Tu Nutrióloga",
  about_bio_1:
    "Enya Marrero es Licenciada en Nutrición con una pasión profunda por la nutrición deportiva y la transformación de hábitos alimenticios. Con más de 10 años de experiencia profesional, ha trabajado con atletas de alto rendimiento, personas que buscan mejorar su composición corporal y clientes con objetivos de pérdida de peso saludable.",
  about_bio_2:
    "Su metodología combina evaluaciones antropométricas precisas, planificación de macronutrientes basada en evidencia y un acompañamiento cercano que garantiza la adherencia al plan. Ha diseñado protocolos de nutrición para competidores, incluyendo planes de carga de carbohidratos y cortes de peso seguros.",
  about_bio_3:
    "Cree firmemente que la nutrición debe ser un aliado, no una restricción, y que cada persona merece un plan diseñado exclusivamente para sus necesidades y estilo de vida.",
  about_stat_clients: "500",
  about_stat_years: "10",
  about_stat_satisfaction: "98",
};

function v(settings: Record<string, string>, key: string) {
  return settings[key] || DEFAULTS[key] || "";
}

export default async function AboutPage() {
  const settings = await getSiteSettings();

  let credentials: string[];
  try {
    const parsed = JSON.parse(settings.about_credentials || "[]");
    credentials = Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_CREDENTIALS;
  } catch {
    credentials = DEFAULT_CREDENTIALS;
  }

  const data = {
    name: v(settings, "about_name"),
    title: v(settings, "about_title"),
    bio1: v(settings, "about_bio_1"),
    bio2: v(settings, "about_bio_2"),
    bio3: v(settings, "about_bio_3"),
    credentials,
    statClients: Number(v(settings, "about_stat_clients")) || 500,
    statYears: Number(v(settings, "about_stat_years")) || 10,
    statSatisfaction: Number(v(settings, "about_stat_satisfaction")) || 98,
    imageUrl: settings.about_image_url || undefined,
  };

  return <AboutContent data={data} />;
}
