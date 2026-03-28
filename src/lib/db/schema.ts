import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  decimal,
  integer,
  boolean,
  pgEnum,
  date,
  time,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Enums ───────────────────────────────────────────────────────────────────

export const userRoleEnum = pgEnum("user_role", ["admin", "nutritionist"]);

export const clientGoalEnum = pgEnum("client_goal", [
  "fat_loss",
  "muscle_gain",
  "weight_cut",
  "maintenance",
  "pre_competition",
]);

export const clientStatusEnum = pgEnum("client_status", [
  "active",
  "inactive",
]);

export const sexEnum = pgEnum("sex", ["male", "female"]);

export const dayTypeEnum = pgEnum("day_type", [
  "training",
  "rest",
  "competition",
]);

export const mealPlanStatusEnum = pgEnum("meal_plan_status", [
  "draft",
  "active",
  "completed",
]);

export const appointmentStatusEnum = pgEnum("appointment_status", [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
]);

export const serviceTypeEnum = pgEnum("service_type", [
  "personalized_nutrition",
  "weight_loss",
  "sports_nutrition",
  "body_composition",
  "pre_competition",
  "individual_coaching",
]);

// ─── Users ───────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default("nutritionist"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  clients: many(clients),
  recipes: many(recipes),
}));

// ─── Clients ─────────────────────────────────────────────────────────────────

export const clients = pgTable("clients", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  dateOfBirth: date("date_of_birth"),
  sex: sexEnum("sex"),
  goal: clientGoalEnum("goal"),
  activityLevel: varchar("activity_level", { length: 100 }),
  sport: varchar("sport", { length: 100 }),
  notes: text("notes"),
  status: clientStatusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const clientsRelations = relations(clients, ({ one, many }) => ({
  user: one(users, { fields: [clients.userId], references: [users.id] }),
  measurements: many(clientMeasurements),
  mealPlans: many(mealPlans),
  supplementProtocols: many(supplementProtocols),
  hydrationProtocols: many(hydrationProtocols),
}));

// ─── Client Measurements ────────────────────────────────────────────────────

export const clientMeasurements = pgTable("client_measurements", {
  id: uuid("id").defaultRandom().primaryKey(),
  clientId: uuid("client_id")
    .references(() => clients.id, { onDelete: "cascade" })
    .notNull(),
  date: date("date").notNull(),
  weightKg: decimal("weight_kg", { precision: 6, scale: 2 }),
  heightCm: decimal("height_cm", { precision: 6, scale: 2 }),
  bmi: decimal("bmi", { precision: 5, scale: 2 }),
  bodyFatPct: decimal("body_fat_pct", { precision: 5, scale: 2 }),
  fatKg: decimal("fat_kg", { precision: 6, scale: 2 }),
  muscleMassPct: decimal("muscle_mass_pct", { precision: 5, scale: 2 }),
  muscleKg: decimal("muscle_kg", { precision: 6, scale: 2 }),
  visceralFat: decimal("visceral_fat", { precision: 5, scale: 2 }),
  sumSkinfoldsMm: decimal("sum_skinfolds_mm", { precision: 7, scale: 2 }),
  muscleBoneIndex: decimal("muscle_bone_index", { precision: 5, scale: 2 }),
  urineDensity: decimal("urine_density", { precision: 6, scale: 4 }),
  notes: text("notes"),
});

export const clientMeasurementsRelations = relations(
  clientMeasurements,
  ({ one }) => ({
    client: one(clients, {
      fields: [clientMeasurements.clientId],
      references: [clients.id],
    }),
  })
);

// ─── Food Groups ─────────────────────────────────────────────────────────────

export const foodGroups = pgTable("food_groups", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  displayOrder: integer("display_order").notNull().default(0),
});

export const foodGroupsRelations = relations(foodGroups, ({ many }) => ({
  foods: many(foods),
}));

// ─── Serving Units ──────────────────────────────────────────────────────────

export const servingUnits = pgTable("serving_units", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  abbreviation: varchar("abbreviation", { length: 20 }).notNull(),
});

// ─── Foods ──────────────────────────────────────────────────────────────────

export const foods = pgTable("foods", {
  id: uuid("id").defaultRandom().primaryKey(),
  foodGroupId: uuid("food_group_id")
    .references(() => foodGroups.id, { onDelete: "set null" }),
  name: varchar("name", { length: 255 }).notNull(),
  baseServingQty: decimal("base_serving_qty", { precision: 8, scale: 2 }),
  baseServingUnit: varchar("base_serving_unit", { length: 50 }),
  calories: decimal("calories", { precision: 8, scale: 2 }),
  proteinG: decimal("protein_g", { precision: 8, scale: 2 }),
  carbsG: decimal("carbs_g", { precision: 8, scale: 2 }),
  fatG: decimal("fat_g", { precision: 8, scale: 2 }),
  fiberG: decimal("fiber_g", { precision: 8, scale: 2 }),
  isFree: boolean("is_free").default(false),
  notes: text("notes"),
});

export const foodsRelations = relations(foods, ({ one }) => ({
  foodGroup: one(foodGroups, {
    fields: [foods.foodGroupId],
    references: [foodGroups.id],
  }),
}));

// ─── Recipes ────────────────────────────────────────────────────────────────

export const recipes = pgTable("recipes", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  prepInstructions: text("prep_instructions"),
  prepTimeMin: integer("prep_time_min"),
  mealTypes: text("meal_types").array(),
  imageUrl: text("image_url"),
  createdBy: uuid("created_by").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const recipesRelations = relations(recipes, ({ one, many }) => ({
  creator: one(users, {
    fields: [recipes.createdBy],
    references: [users.id],
  }),
  ingredients: many(recipeIngredients),
  tags: many(recipeTags),
}));

// ─── Recipe Ingredients ─────────────────────────────────────────────────────

export const recipeIngredients = pgTable("recipe_ingredients", {
  id: uuid("id").defaultRandom().primaryKey(),
  recipeId: uuid("recipe_id")
    .references(() => recipes.id, { onDelete: "cascade" })
    .notNull(),
  foodId: uuid("food_id").references(() => foods.id, { onDelete: "set null" }),
  name: varchar("name", { length: 255 }),
  baseQty: decimal("base_qty", { precision: 8, scale: 2 }),
  servingUnit: varchar("serving_unit", { length: 50 }),
  ratioGroup: varchar("ratio_group", { length: 50 }),
  isOptional: boolean("is_optional").default(false),
  displayOrder: integer("display_order").default(0),
  notes: text("notes"),
});

export const recipeIngredientsRelations = relations(
  recipeIngredients,
  ({ one }) => ({
    recipe: one(recipes, {
      fields: [recipeIngredients.recipeId],
      references: [recipes.id],
    }),
    food: one(foods, {
      fields: [recipeIngredients.foodId],
      references: [foods.id],
    }),
  })
);

// ─── Recipe Tags ────────────────────────────────────────────────────────────

export const recipeTags = pgTable("recipe_tags", {
  id: uuid("id").defaultRandom().primaryKey(),
  recipeId: uuid("recipe_id")
    .references(() => recipes.id, { onDelete: "cascade" })
    .notNull(),
  tag: varchar("tag", { length: 100 }).notNull(),
});

export const recipeTagsRelations = relations(recipeTags, ({ one }) => ({
  recipe: one(recipes, {
    fields: [recipeTags.recipeId],
    references: [recipes.id],
  }),
}));

// ─── Meal Plan Templates ───────────────────────────────────────────────────

export const mealPlanTemplates = pgTable("meal_plan_templates", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  goalType: clientGoalEnum("goal_type"),
  description: text("description"),
  dayTypes: text("day_types").array(),
  createdBy: uuid("created_by").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const mealPlanTemplatesRelations = relations(
  mealPlanTemplates,
  ({ many }) => ({
    slots: many(mealTemplateSlots),
  })
);

// ─── Meal Template Slots ───────────────────────────────────────────────────

export const mealTemplateSlots = pgTable("meal_template_slots", {
  id: uuid("id").defaultRandom().primaryKey(),
  templateId: uuid("template_id")
    .references(() => mealPlanTemplates.id, { onDelete: "cascade" })
    .notNull(),
  dayType: dayTypeEnum("day_type"),
  slotName: varchar("slot_name", { length: 100 }).notNull(),
  timeRange: varchar("time_range", { length: 50 }),
  displayOrder: integer("display_order").notNull().default(0),
  notes: text("notes"),
});

export const mealTemplateSlotsRelations = relations(
  mealTemplateSlots,
  ({ one, many }) => ({
    template: one(mealPlanTemplates, {
      fields: [mealTemplateSlots.templateId],
      references: [mealPlanTemplates.id],
    }),
    foodGroupPortions: many(slotFoodGroupPortions),
  })
);

// ─── Slot Food Group Portions ──────────────────────────────────────────────

export const slotFoodGroupPortions = pgTable("slot_food_group_portions", {
  id: uuid("id").defaultRandom().primaryKey(),
  slotId: uuid("slot_id")
    .references(() => mealTemplateSlots.id, { onDelete: "cascade" })
    .notNull(),
  foodGroupId: uuid("food_group_id")
    .references(() => foodGroups.id, { onDelete: "cascade" })
    .notNull(),
  portionCount: decimal("portion_count", { precision: 5, scale: 2 }).notNull(),
});

export const slotFoodGroupPortionsRelations = relations(
  slotFoodGroupPortions,
  ({ one }) => ({
    slot: one(mealTemplateSlots, {
      fields: [slotFoodGroupPortions.slotId],
      references: [mealTemplateSlots.id],
    }),
    foodGroup: one(foodGroups, {
      fields: [slotFoodGroupPortions.foodGroupId],
      references: [foodGroups.id],
    }),
  })
);

// ─── Meal Plans ─────────────────────────────────────────────────────────────

export const mealPlans = pgTable("meal_plans", {
  id: uuid("id").defaultRandom().primaryKey(),
  clientId: uuid("client_id")
    .references(() => clients.id, { onDelete: "cascade" })
    .notNull(),
  templateId: uuid("template_id").references(() => mealPlanTemplates.id, {
    onDelete: "set null",
  }),
  name: varchar("name", { length: 255 }).notNull(),
  startDate: date("start_date"),
  endDate: date("end_date"),
  status: mealPlanStatusEnum("status").notNull().default("draft"),
  calorieTarget: integer("calorie_target"),
  proteinGPerKg: decimal("protein_g_per_kg", { precision: 5, scale: 2 }),
  carbsGPerKg: decimal("carbs_g_per_kg", { precision: 5, scale: 2 }),
  fatGPerKg: decimal("fat_g_per_kg", { precision: 5, scale: 2 }),
  generalRecommendations: text("general_recommendations"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const mealPlansRelations = relations(mealPlans, ({ one, many }) => ({
  client: one(clients, {
    fields: [mealPlans.clientId],
    references: [clients.id],
  }),
  template: one(mealPlanTemplates, {
    fields: [mealPlans.templateId],
    references: [mealPlanTemplates.id],
  }),
  days: many(mealPlanDays),
  supplementProtocols: many(supplementProtocols),
  hydrationProtocols: many(hydrationProtocols),
  carbLoadingSchedules: many(carbLoadingSchedules),
}));

// ─── Meal Plan Days ─────────────────────────────────────────────────────────

export const mealPlanDays = pgTable("meal_plan_days", {
  id: uuid("id").defaultRandom().primaryKey(),
  mealPlanId: uuid("meal_plan_id")
    .references(() => mealPlans.id, { onDelete: "cascade" })
    .notNull(),
  dayNumber: integer("day_number").notNull(),
  dayLabel: varchar("day_label", { length: 100 }),
  dayType: dayTypeEnum("day_type"),
});

export const mealPlanDaysRelations = relations(
  mealPlanDays,
  ({ one, many }) => ({
    mealPlan: one(mealPlans, {
      fields: [mealPlanDays.mealPlanId],
      references: [mealPlans.id],
    }),
    meals: many(mealPlanMeals),
  })
);

// ─── Meal Plan Meals ────────────────────────────────────────────────────────

export const mealPlanMeals = pgTable("meal_plan_meals", {
  id: uuid("id").defaultRandom().primaryKey(),
  dayId: uuid("day_id")
    .references(() => mealPlanDays.id, { onDelete: "cascade" })
    .notNull(),
  slotName: varchar("slot_name", { length: 100 }).notNull(),
  cerealPortions: decimal("cereal_portions", { precision: 5, scale: 2 }),
  proteinPortions: decimal("protein_portions", { precision: 5, scale: 2 }),
  fatPortions: decimal("fat_portions", { precision: 5, scale: 2 }),
  veggiePortions: decimal("veggie_portions", { precision: 5, scale: 2 }),
  displayOrder: integer("display_order").default(0),
  notes: text("notes"),
});

export const mealPlanMealsRelations = relations(
  mealPlanMeals,
  ({ one, many }) => ({
    day: one(mealPlanDays, {
      fields: [mealPlanMeals.dayId],
      references: [mealPlanDays.id],
    }),
    options: many(mealOptions),
  })
);

// ─── Meal Options ───────────────────────────────────────────────────────────

export const mealOptions = pgTable("meal_options", {
  id: uuid("id").defaultRandom().primaryKey(),
  mealId: uuid("meal_id")
    .references(() => mealPlanMeals.id, { onDelete: "cascade" })
    .notNull(),
  recipeId: uuid("recipe_id")
    .references(() => recipes.id, { onDelete: "cascade" })
    .notNull(),
  displayOrder: integer("display_order").default(0),
  isPrimary: boolean("is_primary").default(false),
});

export const mealOptionsRelations = relations(mealOptions, ({ one }) => ({
  meal: one(mealPlanMeals, {
    fields: [mealOptions.mealId],
    references: [mealPlanMeals.id],
  }),
  recipe: one(recipes, {
    fields: [mealOptions.recipeId],
    references: [recipes.id],
  }),
}));

// ─── Supplement Protocols ───────────────────────────────────────────────────

export const supplementProtocols = pgTable("supplement_protocols", {
  id: uuid("id").defaultRandom().primaryKey(),
  clientId: uuid("client_id")
    .references(() => clients.id, { onDelete: "cascade" })
    .notNull(),
  mealPlanId: uuid("meal_plan_id").references(() => mealPlans.id, {
    onDelete: "set null",
  }),
  supplementName: varchar("supplement_name", { length: 255 }).notNull(),
  dose: varchar("dose", { length: 100 }),
  frequency: varchar("frequency", { length: 100 }),
  timing: varchar("timing", { length: 255 }),
  notes: text("notes"),
});

export const supplementProtocolsRelations = relations(
  supplementProtocols,
  ({ one }) => ({
    client: one(clients, {
      fields: [supplementProtocols.clientId],
      references: [clients.id],
    }),
    mealPlan: one(mealPlans, {
      fields: [supplementProtocols.mealPlanId],
      references: [mealPlans.id],
    }),
  })
);

// ─── Hydration Protocols ────────────────────────────────────────────────────

export const hydrationProtocols = pgTable("hydration_protocols", {
  id: uuid("id").defaultRandom().primaryKey(),
  clientId: uuid("client_id")
    .references(() => clients.id, { onDelete: "cascade" })
    .notNull(),
  mealPlanId: uuid("meal_plan_id").references(() => mealPlans.id, {
    onDelete: "set null",
  }),
  dailyWaterMl: integer("daily_water_ml"),
  duringTraining: text("during_training"),
  electrolyteBrand: varchar("electrolyte_brand", { length: 255 }),
  notes: text("notes"),
});

export const hydrationProtocolsRelations = relations(
  hydrationProtocols,
  ({ one }) => ({
    client: one(clients, {
      fields: [hydrationProtocols.clientId],
      references: [clients.id],
    }),
    mealPlan: one(mealPlans, {
      fields: [hydrationProtocols.mealPlanId],
      references: [mealPlans.id],
    }),
  })
);

// ─── Carb Loading Schedules ────────────────────────────────────────────────

export const carbLoadingSchedules = pgTable("carb_loading_schedules", {
  id: uuid("id").defaultRandom().primaryKey(),
  mealPlanId: uuid("meal_plan_id")
    .references(() => mealPlans.id, { onDelete: "cascade" })
    .notNull(),
  dayNumber: integer("day_number").notNull(),
  dayLabel: varchar("day_label", { length: 100 }),
  carbsGPerKg: decimal("carbs_g_per_kg", { precision: 5, scale: 2 }),
  totalCarbsG: decimal("total_carbs_g", { precision: 8, scale: 2 }),
  notes: text("notes"),
});

export const carbLoadingSchedulesRelations = relations(
  carbLoadingSchedules,
  ({ one }) => ({
    mealPlan: one(mealPlans, {
      fields: [carbLoadingSchedules.mealPlanId],
      references: [mealPlans.id],
    }),
  })
);

// ─── Appointments ───────────────────────────────────────────────────────────

export const appointments = pgTable("appointments", {
  id: uuid("id").defaultRandom().primaryKey(),
  clientName: varchar("client_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  serviceType: serviceTypeEnum("service_type").notNull(),
  preferredDate: date("preferred_date"),
  preferredTime: time("preferred_time"),
  message: text("message"),
  status: appointmentStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Testimonials ───────────────────────────────────────────────────────────

export const testimonials = pgTable("testimonials", {
  id: uuid("id").defaultRandom().primaryKey(),
  clientName: varchar("client_name", { length: 255 }).notNull(),
  clientTitle: varchar("client_title", { length: 255 }),
  quote: text("quote").notNull(),
  imageUrl: text("image_url"),
  isFeatured: boolean("is_featured").default(false),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Site Settings ──────────────────────────────────────────────────────────

export const siteSettings = pgTable("site_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value"),
  section: varchar("section", { length: 50 }),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
