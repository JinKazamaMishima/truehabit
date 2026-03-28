CREATE TYPE "public"."appointment_status" AS ENUM('pending', 'confirmed', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."client_goal" AS ENUM('fat_loss', 'muscle_gain', 'weight_cut', 'maintenance', 'pre_competition');--> statement-breakpoint
CREATE TYPE "public"."client_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."day_type" AS ENUM('training', 'rest', 'competition');--> statement-breakpoint
CREATE TYPE "public"."meal_plan_status" AS ENUM('draft', 'active', 'completed');--> statement-breakpoint
CREATE TYPE "public"."service_type" AS ENUM('personalized_nutrition', 'weight_loss', 'sports_nutrition', 'body_composition', 'pre_competition', 'individual_coaching');--> statement-breakpoint
CREATE TYPE "public"."sex" AS ENUM('male', 'female');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'nutritionist');--> statement-breakpoint
CREATE TABLE "appointments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(50),
	"service_type" "service_type" NOT NULL,
	"preferred_date" date,
	"preferred_time" time,
	"message" text,
	"status" "appointment_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "carb_loading_schedules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meal_plan_id" uuid NOT NULL,
	"day_number" integer NOT NULL,
	"day_label" varchar(100),
	"carbs_g_per_kg" numeric(5, 2),
	"total_carbs_g" numeric(8, 2),
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "client_measurements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"date" date NOT NULL,
	"weight_kg" numeric(6, 2),
	"height_cm" numeric(6, 2),
	"bmi" numeric(5, 2),
	"body_fat_pct" numeric(5, 2),
	"fat_kg" numeric(6, 2),
	"muscle_mass_pct" numeric(5, 2),
	"muscle_kg" numeric(6, 2),
	"visceral_fat" numeric(5, 2),
	"sum_skinfolds_mm" numeric(7, 2),
	"muscle_bone_index" numeric(5, 2),
	"urine_density" numeric(6, 4),
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255),
	"phone" varchar(50),
	"date_of_birth" date,
	"sex" "sex",
	"goal" "client_goal",
	"activity_level" varchar(100),
	"sport" varchar(100),
	"notes" text,
	"status" "client_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "food_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "food_groups_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "foods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"food_group_id" uuid,
	"name" varchar(255) NOT NULL,
	"base_serving_qty" numeric(8, 2),
	"base_serving_unit" varchar(50),
	"calories" numeric(8, 2),
	"protein_g" numeric(8, 2),
	"carbs_g" numeric(8, 2),
	"fat_g" numeric(8, 2),
	"fiber_g" numeric(8, 2),
	"is_free" boolean DEFAULT false,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "hydration_protocols" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"meal_plan_id" uuid,
	"daily_water_ml" integer,
	"during_training" text,
	"electrolyte_brand" varchar(255),
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "meal_options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meal_id" uuid NOT NULL,
	"recipe_id" uuid NOT NULL,
	"display_order" integer DEFAULT 0,
	"is_primary" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "meal_plan_days" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meal_plan_id" uuid NOT NULL,
	"day_number" integer NOT NULL,
	"day_label" varchar(100),
	"day_type" "day_type"
);
--> statement-breakpoint
CREATE TABLE "meal_plan_meals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"day_id" uuid NOT NULL,
	"slot_name" varchar(100) NOT NULL,
	"cereal_portions" numeric(5, 2),
	"protein_portions" numeric(5, 2),
	"fat_portions" numeric(5, 2),
	"veggie_portions" numeric(5, 2),
	"display_order" integer DEFAULT 0,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "meal_plan_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"goal_type" "client_goal",
	"description" text,
	"day_types" text[],
	"created_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meal_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"template_id" uuid,
	"name" varchar(255) NOT NULL,
	"start_date" date,
	"end_date" date,
	"status" "meal_plan_status" DEFAULT 'draft' NOT NULL,
	"calorie_target" integer,
	"protein_g_per_kg" numeric(5, 2),
	"carbs_g_per_kg" numeric(5, 2),
	"fat_g_per_kg" numeric(5, 2),
	"general_recommendations" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meal_template_slots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_id" uuid NOT NULL,
	"day_type" "day_type",
	"slot_name" varchar(100) NOT NULL,
	"time_range" varchar(50),
	"display_order" integer DEFAULT 0 NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "recipe_ingredients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recipe_id" uuid NOT NULL,
	"food_id" uuid,
	"name" varchar(255),
	"base_qty" numeric(8, 2),
	"serving_unit" varchar(50),
	"ratio_group" varchar(50),
	"is_optional" boolean DEFAULT false,
	"display_order" integer DEFAULT 0,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "recipe_tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recipe_id" uuid NOT NULL,
	"tag" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"prep_instructions" text,
	"prep_time_min" integer,
	"meal_types" text[],
	"image_url" text,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "serving_units" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"abbreviation" varchar(20) NOT NULL,
	CONSTRAINT "serving_units_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(100) NOT NULL,
	"value" text,
	"section" varchar(50),
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "site_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "slot_food_group_portions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slot_id" uuid NOT NULL,
	"food_group_id" uuid NOT NULL,
	"portion_count" numeric(5, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "supplement_protocols" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"meal_plan_id" uuid,
	"supplement_name" varchar(255) NOT NULL,
	"dose" varchar(100),
	"frequency" varchar(100),
	"timing" varchar(255),
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_name" varchar(255) NOT NULL,
	"client_title" varchar(255),
	"quote" text NOT NULL,
	"image_url" text,
	"is_featured" boolean DEFAULT false,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"role" "user_role" DEFAULT 'nutritionist' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "carb_loading_schedules" ADD CONSTRAINT "carb_loading_schedules_meal_plan_id_meal_plans_id_fk" FOREIGN KEY ("meal_plan_id") REFERENCES "public"."meal_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_measurements" ADD CONSTRAINT "client_measurements_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "foods" ADD CONSTRAINT "foods_food_group_id_food_groups_id_fk" FOREIGN KEY ("food_group_id") REFERENCES "public"."food_groups"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hydration_protocols" ADD CONSTRAINT "hydration_protocols_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hydration_protocols" ADD CONSTRAINT "hydration_protocols_meal_plan_id_meal_plans_id_fk" FOREIGN KEY ("meal_plan_id") REFERENCES "public"."meal_plans"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meal_options" ADD CONSTRAINT "meal_options_meal_id_meal_plan_meals_id_fk" FOREIGN KEY ("meal_id") REFERENCES "public"."meal_plan_meals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meal_options" ADD CONSTRAINT "meal_options_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meal_plan_days" ADD CONSTRAINT "meal_plan_days_meal_plan_id_meal_plans_id_fk" FOREIGN KEY ("meal_plan_id") REFERENCES "public"."meal_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meal_plan_meals" ADD CONSTRAINT "meal_plan_meals_day_id_meal_plan_days_id_fk" FOREIGN KEY ("day_id") REFERENCES "public"."meal_plan_days"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meal_plan_templates" ADD CONSTRAINT "meal_plan_templates_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meal_plans" ADD CONSTRAINT "meal_plans_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meal_plans" ADD CONSTRAINT "meal_plans_template_id_meal_plan_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."meal_plan_templates"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meal_template_slots" ADD CONSTRAINT "meal_template_slots_template_id_meal_plan_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."meal_plan_templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_food_id_foods_id_fk" FOREIGN KEY ("food_id") REFERENCES "public"."foods"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_tags" ADD CONSTRAINT "recipe_tags_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slot_food_group_portions" ADD CONSTRAINT "slot_food_group_portions_slot_id_meal_template_slots_id_fk" FOREIGN KEY ("slot_id") REFERENCES "public"."meal_template_slots"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slot_food_group_portions" ADD CONSTRAINT "slot_food_group_portions_food_group_id_food_groups_id_fk" FOREIGN KEY ("food_group_id") REFERENCES "public"."food_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplement_protocols" ADD CONSTRAINT "supplement_protocols_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplement_protocols" ADD CONSTRAINT "supplement_protocols_meal_plan_id_meal_plans_id_fk" FOREIGN KEY ("meal_plan_id") REFERENCES "public"."meal_plans"("id") ON DELETE set null ON UPDATE no action;