import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import * as schema from "./schema";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set");
  process.exit(1);
}

const sql = postgres(DATABASE_URL);
const db = drizzle(sql, { schema });

async function seed() {
  console.log("🌱 Seeding database...\n");

  // ─── Admin User ───────────────────────────────────────────────────────
  console.log("👤 Creating admin user...");
  const existingAdmin = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, "admin@truehabit.com"))
    .limit(1);

  let adminId: string;
  if (existingAdmin.length > 0) {
    adminId = existingAdmin[0].id;
    console.log("   Admin user already exists, skipping.");
  } else {
    const passwordHash = await bcrypt.hash("admin123", 12);
    const [admin] = await db
      .insert(schema.users)
      .values({
        email: "admin@truehabit.com",
        name: "Enya Marrero",
        passwordHash,
        role: "admin",
      })
      .returning({ id: schema.users.id });
    adminId = admin.id;
    console.log("   Admin user created.");
  }

  // ─── Food Groups ─────────────────────────────────────────────────────
  console.log("🥗 Creating food groups...");
  const foodGroupData = [
    { name: "Cereales", displayOrder: 1 },
    { name: "Proteínas", displayOrder: 2 },
    { name: "Grasas", displayOrder: 3 },
    { name: "Vegetales", displayOrder: 4 },
    { name: "Frutas", displayOrder: 5 },
    { name: "Lácteos", displayOrder: 6 },
    { name: "Suplementos", displayOrder: 7 },
  ];

  const foodGroupIds: Record<string, string> = {};
  for (const fg of foodGroupData) {
    const existing = await db
      .select()
      .from(schema.foodGroups)
      .where(eq(schema.foodGroups.name, fg.name))
      .limit(1);

    if (existing.length > 0) {
      foodGroupIds[fg.name] = existing[0].id;
    } else {
      const [inserted] = await db
        .insert(schema.foodGroups)
        .values(fg)
        .returning({ id: schema.foodGroups.id });
      foodGroupIds[fg.name] = inserted.id;
    }
  }
  console.log("   Food groups ready.");

  // ─── Foods ────────────────────────────────────────────────────────────
  console.log("🍎 Creating foods...");

  type FoodSeed = {
    group: string;
    name: string;
    baseServingQty: string;
    baseServingUnit: string;
    carbsG: string;
    proteinG: string;
    fatG: string;
    calories: string;
    isFree?: boolean;
  };

  const foodsData: FoodSeed[] = [
    // Cereales
    { group: "Cereales", name: "Avena", baseServingQty: "1", baseServingUnit: "taza cocida", carbsG: "27", proteinG: "5", fatG: "3", calories: "154" },
    { group: "Cereales", name: "Arroz blanco", baseServingQty: "1", baseServingUnit: "taza cocido", carbsG: "45", proteinG: "4", fatG: "0.4", calories: "206" },
    { group: "Cereales", name: "Pan integral", baseServingQty: "1", baseServingUnit: "rebanada", carbsG: "12", proteinG: "4", fatG: "1", calories: "69" },
    { group: "Cereales", name: "Tortilla de maíz", baseServingQty: "1", baseServingUnit: "pieza", carbsG: "11", proteinG: "1.5", fatG: "0.6", calories: "52" },
    { group: "Cereales", name: "Pasta", baseServingQty: "1", baseServingUnit: "taza cocida", carbsG: "43", proteinG: "8", fatG: "1", calories: "220" },
    { group: "Cereales", name: "Frijoles", baseServingQty: "0.5", baseServingUnit: "taza cocidos", carbsG: "20", proteinG: "7", fatG: "0.5", calories: "114" },
    { group: "Cereales", name: "Quinoa", baseServingQty: "1", baseServingUnit: "taza cocida", carbsG: "39", proteinG: "8", fatG: "4", calories: "222" },
    { group: "Cereales", name: "Camote", baseServingQty: "0.5", baseServingUnit: "taza", carbsG: "20", proteinG: "1.5", fatG: "0", calories: "90" },
    { group: "Cereales", name: "Galletas de arroz", baseServingQty: "1", baseServingUnit: "paquete", carbsG: "7", proteinG: "1", fatG: "0", calories: "35" },
    // Proteínas
    { group: "Proteínas", name: "Pechuga de pollo", baseServingQty: "100", baseServingUnit: "g", carbsG: "0", proteinG: "31", fatG: "3.6", calories: "165" },
    { group: "Proteínas", name: "Carne de res magra", baseServingQty: "100", baseServingUnit: "g", carbsG: "0", proteinG: "26", fatG: "10", calories: "200" },
    { group: "Proteínas", name: "Atún en lata", baseServingQty: "1", baseServingUnit: "lata", carbsG: "0", proteinG: "20", fatG: "1", calories: "90" },
    { group: "Proteínas", name: "Huevo entero", baseServingQty: "1", baseServingUnit: "pieza", carbsG: "0.6", proteinG: "6", fatG: "5", calories: "72" },
    { group: "Proteínas", name: "Claras de huevo", baseServingQty: "0.25", baseServingUnit: "taza", carbsG: "0.4", proteinG: "9", fatG: "0", calories: "38" },
    { group: "Proteínas", name: "Pescado blanco", baseServingQty: "100", baseServingUnit: "g", carbsG: "0", proteinG: "20", fatG: "1", calories: "90" },
    { group: "Proteínas", name: "Pechuga de pavo", baseServingQty: "4", baseServingUnit: "rebanadas", carbsG: "1", proteinG: "12", fatG: "0.5", calories: "60" },
    { group: "Proteínas", name: "Proteína de suero", baseServingQty: "1", baseServingUnit: "scoop", carbsG: "2", proteinG: "24", fatG: "1", calories: "120" },
    // Grasas
    { group: "Grasas", name: "Aguacate", baseServingQty: "0.5", baseServingUnit: "pieza", carbsG: "6", proteinG: "2", fatG: "15", calories: "160" },
    { group: "Grasas", name: "Aceite de oliva", baseServingQty: "1", baseServingUnit: "cda", carbsG: "0", proteinG: "0", fatG: "14", calories: "119" },
    { group: "Grasas", name: "Almendras", baseServingQty: "12", baseServingUnit: "piezas", carbsG: "3", proteinG: "3", fatG: "7", calories: "82" },
    { group: "Grasas", name: "Crema de maní", baseServingQty: "1", baseServingUnit: "cda", carbsG: "3", proteinG: "4", fatG: "8", calories: "94" },
    // Vegetales (isFree)
    { group: "Vegetales", name: "Espinacas", baseServingQty: "1", baseServingUnit: "taza", carbsG: "1", proteinG: "1", fatG: "0", calories: "7", isFree: true },
    { group: "Vegetales", name: "Brócoli", baseServingQty: "1", baseServingUnit: "taza", carbsG: "6", proteinG: "3", fatG: "0", calories: "31", isFree: true },
    { group: "Vegetales", name: "Champiñones", baseServingQty: "1", baseServingUnit: "taza", carbsG: "2", proteinG: "2", fatG: "0", calories: "15", isFree: true },
    { group: "Vegetales", name: "Nopales", baseServingQty: "1", baseServingUnit: "taza", carbsG: "3", proteinG: "1", fatG: "0", calories: "14", isFree: true },
    { group: "Vegetales", name: "Zanahoria", baseServingQty: "1", baseServingUnit: "taza cocida", carbsG: "12", proteinG: "1", fatG: "0", calories: "55", isFree: true },
    // Frutas
    { group: "Frutas", name: "Plátano", baseServingQty: "1", baseServingUnit: "pieza", carbsG: "27", proteinG: "1", fatG: "0", calories: "105" },
    { group: "Frutas", name: "Manzana", baseServingQty: "1", baseServingUnit: "pieza", carbsG: "25", proteinG: "0.5", fatG: "0", calories: "95" },
    { group: "Frutas", name: "Fresas", baseServingQty: "1", baseServingUnit: "taza", carbsG: "11", proteinG: "1", fatG: "0", calories: "49" },
    // Lácteos
    { group: "Lácteos", name: "Yogurt griego 0%", baseServingQty: "1", baseServingUnit: "taza", carbsG: "6", proteinG: "17", fatG: "0", calories: "100" },
    { group: "Lácteos", name: "Queso Oaxaca light", baseServingQty: "30", baseServingUnit: "g", carbsG: "1", proteinG: "7", fatG: "5", calories: "75" },
    { group: "Lácteos", name: "Cottage 1%", baseServingQty: "0.5", baseServingUnit: "taza", carbsG: "3", proteinG: "14", fatG: "1", calories: "81" },
  ];

  const foodIds: Record<string, string> = {};
  for (const f of foodsData) {
    const existing = await db
      .select()
      .from(schema.foods)
      .where(eq(schema.foods.name, f.name))
      .limit(1);

    if (existing.length > 0) {
      foodIds[f.name] = existing[0].id;
    } else {
      const [inserted] = await db
        .insert(schema.foods)
        .values({
          foodGroupId: foodGroupIds[f.group],
          name: f.name,
          baseServingQty: f.baseServingQty,
          baseServingUnit: f.baseServingUnit,
          carbsG: f.carbsG,
          proteinG: f.proteinG,
          fatG: f.fatG,
          calories: f.calories,
          isFree: f.isFree ?? false,
        })
        .returning({ id: schema.foods.id });
      foodIds[f.name] = inserted.id;
    }
  }
  console.log(`   ${foodsData.length} foods ready.`);

  // ─── Recipes ──────────────────────────────────────────────────────────
  console.log("📖 Creating recipes...");

  type RecipeSeed = {
    name: string;
    description: string;
    mealTypes: string[];
    tags: string[];
    ingredients: {
      foodName?: string;
      label: string;
      qty: string;
      unit: string;
      ratioGroup?: string;
      isFree?: boolean;
      order: number;
    }[];
  };

  const recipesData: RecipeSeed[] = [
    {
      name: "Omelette de Huevo con Verduras",
      description: "Omelette alto en proteína con vegetales frescos y aguacate",
      mealTypes: ["breakfast"],
      tags: ["breakfast", "high_protein"],
      ingredients: [
        { foodName: "Huevo entero", label: "Huevos enteros", qty: "2", unit: "piezas", ratioGroup: "proteinas", order: 1 },
        { foodName: "Claras de huevo", label: "Claras de huevo", qty: "0.5", unit: "taza", ratioGroup: "proteinas", order: 2 },
        { label: "Verduras al gusto (pimiento, espinaca, champiñones)", qty: "1", unit: "taza", isFree: true, order: 3 },
        { foodName: "Aceite de oliva", label: "Aceite de oliva", qty: "1", unit: "cdita", ratioGroup: "grasas", order: 4 },
        { foodName: "Aguacate", label: "Aguacate", qty: "0.5", unit: "pieza", ratioGroup: "grasas", order: 5 },
      ],
    },
    {
      name: "Avena Overnight",
      description: "Avena preparada la noche anterior con chía, yogurt y cacao",
      mealTypes: ["breakfast"],
      tags: ["breakfast", "quick"],
      ingredients: [
        { foodName: "Avena", label: "Avena", qty: "0.25", unit: "taza", ratioGroup: "cereales", order: 1 },
        { label: "Semilla de chía", qty: "2", unit: "cdas", ratioGroup: "grasas", order: 2 },
        { label: "Bebida vegetal", qty: "0.5", unit: "taza", order: 3 },
        { foodName: "Yogurt griego 0%", label: "Yogurt griego", qty: "0.5", unit: "taza", ratioGroup: "proteinas", order: 4 },
        { label: "Cacao en polvo", qty: "1", unit: "cda", order: 5 },
      ],
    },
    {
      name: "Pollo con Arroz y Vegetales",
      description: "Pechuga de pollo a la plancha con arroz blanco y vegetales mixtos",
      mealTypes: ["lunch"],
      tags: ["lunch", "high_protein"],
      ingredients: [
        { foodName: "Pechuga de pollo", label: "Pechuga de pollo", qty: "150", unit: "g", ratioGroup: "proteinas", order: 1 },
        { foodName: "Arroz blanco", label: "Arroz blanco", qty: "1", unit: "taza cocida", ratioGroup: "cereales", order: 2 },
        { label: "Vegetales mixtos", qty: "1", unit: "taza", isFree: true, order: 3 },
        { foodName: "Aceite de oliva", label: "Aceite de oliva", qty: "1", unit: "cdita", ratioGroup: "grasas", order: 4 },
      ],
    },
    {
      name: "Pasta con Carne",
      description: "Pasta cocida con carne molida magra en salsa",
      mealTypes: ["dinner"],
      tags: ["dinner"],
      ingredients: [
        { foodName: "Pasta", label: "Pasta cocida", qty: "1.5", unit: "taza", ratioGroup: "cereales", order: 1 },
        { foodName: "Carne de res magra", label: "Carne molida magra", qty: "100", unit: "g", ratioGroup: "proteinas", order: 2 },
        { foodName: "Aceite de oliva", label: "Aceite de oliva", qty: "1", unit: "cda", ratioGroup: "grasas", order: 3 },
      ],
    },
    {
      name: "Shake de Proteína Pre-Entreno",
      description: "Batido rápido de proteína con plátano y crema de maní",
      mealTypes: ["pre_workout"],
      tags: ["pre_workout", "quick"],
      ingredients: [
        { foodName: "Proteína de suero", label: "Proteína de suero", qty: "1", unit: "scoop", ratioGroup: "proteinas", order: 1 },
        { foodName: "Plátano", label: "Plátano", qty: "1", unit: "pieza", ratioGroup: "cereales", order: 2 },
        { foodName: "Crema de maní", label: "Crema de maní", qty: "1", unit: "cda", ratioGroup: "grasas", order: 3 },
      ],
    },
  ];

  for (const r of recipesData) {
    const existing = await db
      .select()
      .from(schema.recipes)
      .where(eq(schema.recipes.name, r.name))
      .limit(1);

    if (existing.length > 0) {
      console.log(`   Recipe "${r.name}" already exists, skipping.`);
      continue;
    }

    const [recipe] = await db
      .insert(schema.recipes)
      .values({
        name: r.name,
        description: r.description,
        mealTypes: r.mealTypes,
        createdBy: adminId,
      })
      .returning({ id: schema.recipes.id });

    for (const ing of r.ingredients) {
      await db.insert(schema.recipeIngredients).values({
        recipeId: recipe.id,
        foodId: ing.foodName ? foodIds[ing.foodName] ?? null : null,
        name: ing.label,
        baseQty: ing.qty,
        servingUnit: ing.unit,
        ratioGroup: ing.ratioGroup ?? null,
        isOptional: ing.isFree ?? false,
        displayOrder: ing.order,
      });
    }

    for (const tag of r.tags) {
      await db.insert(schema.recipeTags).values({
        recipeId: recipe.id,
        tag,
      });
    }

    console.log(`   Recipe "${r.name}" created.`);
  }

  // ─── Testimonials ─────────────────────────────────────────────────────
  console.log("💬 Creating testimonials...");
  const testimonialsData = [
    {
      clientName: "María García",
      clientTitle: "Atleta",
      quote: "Gracias a TrueHabit logré mis objetivos de composición corporal en solo 3 meses. El plan personalizado hizo toda la diferencia.",
      isFeatured: true,
      displayOrder: 1,
    },
    {
      clientName: "Carlos Mendoza",
      clientTitle: "Corredor de maratón",
      quote: "El enfoque basado en ciencia de Enya me ayudó a mejorar mi rendimiento deportivo significativamente. Muy profesional.",
      isFeatured: true,
      displayOrder: 2,
    },
    {
      clientName: "Ana López",
      clientTitle: "Cliente satisfecha",
      quote: "Después de años luchando con mi peso, finalmente encontré un plan que funciona y que puedo mantener a largo plazo.",
      isFeatured: true,
      displayOrder: 3,
    },
  ];

  for (const t of testimonialsData) {
    const existing = await db
      .select()
      .from(schema.testimonials)
      .where(eq(schema.testimonials.clientName, t.clientName))
      .limit(1);

    if (existing.length > 0) continue;

    await db.insert(schema.testimonials).values(t);
  }
  console.log("   Testimonials ready.");

  // ─── Site Settings ──────────────────────────────────────────────────
  console.log("⚙️  Creating default site settings...");
  const siteSettingsData = [
    { key: "business_name", value: "TrueHabit", section: "business" },
    { key: "business_tagline", value: "Nutrición basada en ciencia", section: "business" },
    { key: "business_phone", value: "+52 (664) 123-4567", section: "business" },
    { key: "business_email", value: "contacto@truehabit.mx", section: "business" },
    { key: "business_address", value: "Tijuana, B.C., México", section: "business" },
    { key: "business_instagram", value: "https://instagram.com", section: "business" },
    { key: "business_facebook", value: "https://facebook.com", section: "business" },
    { key: "business_whatsapp", value: "5210000000000", section: "business" },
    { key: "hero_badge", value: "Nutrición basada en ciencia", section: "hero" },
    { key: "hero_heading", value: "Transforma Tu Nutrición", section: "hero" },
    { key: "hero_subheading", value: "Planes de alimentación personalizados, diseñados por profesionales y respaldados por la ciencia, para ayudarte a alcanzar tus metas de salud y rendimiento.", section: "hero" },
    { key: "hero_cta_primary", value: "Agenda Tu Cita", section: "hero" },
    { key: "hero_cta_secondary", value: "Conoce Más", section: "hero" },
    { key: "about_name", value: "LN. Enya Marrero", section: "about" },
    { key: "about_title", value: "Tu Nutrióloga", section: "about" },
    { key: "about_bio_1", value: "Enya Marrero es Licenciada en Nutrición con una pasión profunda por la nutrición deportiva y la transformación de hábitos alimenticios. Con más de 10 años de experiencia profesional, ha trabajado con atletas de alto rendimiento, personas que buscan mejorar su composición corporal y clientes con objetivos de pérdida de peso saludable.", section: "about" },
    { key: "about_bio_2", value: "Su metodología combina evaluaciones antropométricas precisas, planificación de macronutrientes basada en evidencia y un acompañamiento cercano que garantiza la adherencia al plan. Ha diseñado protocolos de nutrición para competidores, incluyendo planes de carga de carbohidratos y cortes de peso seguros.", section: "about" },
    { key: "about_bio_3", value: "Cree firmemente que la nutrición debe ser un aliado, no una restricción, y que cada persona merece un plan diseñado exclusivamente para sus necesidades y estilo de vida.", section: "about" },
    { key: "about_credentials", value: JSON.stringify([
      "Licenciatura en Nutrición — Universidad Autónoma de Baja California",
      "Especialización en Nutrición Deportiva — ISAK Nivel 2",
      "Certificación en Composición Corporal — Antropometría avanzada",
      "Diplomado en Nutrición Clínica y Metabolismo",
      "Miembro del Colegio de Nutriólogos de Baja California",
    ]), section: "about" },
    { key: "about_stat_clients", value: "500", section: "about" },
    { key: "about_stat_years", value: "10", section: "about" },
    { key: "about_stat_satisfaction", value: "98", section: "about" },
  ];

  for (const s of siteSettingsData) {
    const existing = await db
      .select()
      .from(schema.siteSettings)
      .where(eq(schema.siteSettings.key, s.key))
      .limit(1);

    if (existing.length > 0) continue;

    await db.insert(schema.siteSettings).values(s);
  }
  console.log("   Site settings ready.");

  // ─── Meal Plan Template ───────────────────────────────────────────────
  console.log("📋 Creating meal plan template...");
  const templateName = "Pérdida de Grasa - Entrenamiento";
  const existingTemplate = await db
    .select()
    .from(schema.mealPlanTemplates)
    .where(eq(schema.mealPlanTemplates.name, templateName))
    .limit(1);

  if (existingTemplate.length > 0) {
    console.log("   Meal plan template already exists, skipping.");
  } else {
    const [template] = await db
      .insert(schema.mealPlanTemplates)
      .values({
        name: templateName,
        goalType: "fat_loss",
        description: "Template para pérdida de grasa con días de entrenamiento y descanso",
        dayTypes: ["training", "rest"],
        createdBy: adminId,
      })
      .returning({ id: schema.mealPlanTemplates.id });

    type SlotDef = {
      dayType: "training" | "rest";
      slotName: string;
      timeRange: string;
      order: number;
      portions: { group: string; count: string }[];
    };

    const trainingSlots: SlotDef[] = [
      {
        dayType: "training", slotName: "Desayuno", timeRange: "7:00-8:00", order: 1,
        portions: [
          { group: "Cereales", count: "2" },
          { group: "Proteínas", count: "1" },
          { group: "Grasas", count: "1" },
          { group: "Vegetales", count: "0" },
        ],
      },
      {
        dayType: "training", slotName: "Colación 1", timeRange: "10:00-10:30", order: 2,
        portions: [
          { group: "Cereales", count: "1" },
          { group: "Grasas", count: "1" },
        ],
      },
      {
        dayType: "training", slotName: "Comida", timeRange: "13:00-14:00", order: 3,
        portions: [
          { group: "Cereales", count: "2" },
          { group: "Proteínas", count: "1.5" },
          { group: "Grasas", count: "1" },
          { group: "Vegetales", count: "0" },
        ],
      },
      {
        dayType: "training", slotName: "Pre-entreno", timeRange: "16:00", order: 4,
        portions: [
          { group: "Cereales", count: "2" },
        ],
      },
      {
        dayType: "training", slotName: "Recovery", timeRange: "post-entreno", order: 5,
        portions: [
          { group: "Proteínas", count: "1" },
        ],
      },
      {
        dayType: "training", slotName: "Cena", timeRange: "20:00-21:00", order: 6,
        portions: [
          { group: "Proteínas", count: "1" },
          { group: "Grasas", count: "1" },
          { group: "Vegetales", count: "0" },
        ],
      },
    ];

    for (const slot of trainingSlots) {
      const [insertedSlot] = await db
        .insert(schema.mealTemplateSlots)
        .values({
          templateId: template.id,
          dayType: slot.dayType,
          slotName: slot.slotName,
          timeRange: slot.timeRange,
          displayOrder: slot.order,
        })
        .returning({ id: schema.mealTemplateSlots.id });

      for (const p of slot.portions) {
        await db.insert(schema.slotFoodGroupPortions).values({
          slotId: insertedSlot.id,
          foodGroupId: foodGroupIds[p.group],
          portionCount: p.count,
        });
      }
    }

    console.log("   Meal plan template created.");
  }

  console.log("\n✅ Seed complete!");
}

seed()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await sql.end();
  });
