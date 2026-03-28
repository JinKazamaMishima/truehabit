# TrueHabit — Nutrition Business Management Platform

A full-stack platform for managing a nutrition consultancy business. Features a public marketing website with appointment booking and a protected admin dashboard for ratio-based meal planning, client management, and PDF export.

## Tech Stack

- **Framework**: Next.js 15 (App Router, Server Actions, RSC)
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Auth**: NextAuth.js v5
- **UI**: Tailwind CSS v4 + shadcn/ui
- **Animations**: Framer Motion
- **PDF Export**: @react-pdf/renderer
- **Deployment**: Railway (Docker)

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database

### Setup

```bash
# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env
# Edit .env with your DATABASE_URL and NEXTAUTH_SECRET

# Generate and run database migrations
npm run db:generate
npm run db:migrate

# Seed the database with sample data
npm run db:seed

# Start development server
npm run dev
```

### Default Admin Login

After seeding, log in at `/login` with:
- **Email**: admin@truehabit.com
- **Password**: admin123

## Project Structure

```
src/
  app/
    (public)/          # Public marketing site (no auth)
      page.tsx         # Landing page
      about/           # About page
      services/        # Services page
      contact/         # Contact & booking form
    (auth)/
      login/           # Admin login
    admin/             # Protected admin dashboard
      clients/         # Client management
      foods/           # Food database
      recipes/         # Recipe builder
      meal-plans/      # Meal plan templates & builder
      appointments/    # Booking management
    api/
      auth/            # NextAuth API routes
      meal-plans/      # PDF export API
  components/
    ui/                # shadcn/ui components
    public/            # Public site components
    pdf/               # PDF document templates
  lib/
    db/
      schema.ts        # Drizzle ORM schema (22 tables)
      seed.ts          # Database seed script
    auth.ts            # NextAuth configuration
    macros.ts          # Macro calculation engine
  actions/             # Server actions
```

## Key Features

### Public Website
- Landing page with hero, services, testimonials
- About page with nutritionist bio
- Services page with detailed offerings
- Contact page with appointment booking form

### Admin Dashboard
- **Client Management**: CRUD, anthropometric measurements, body composition tracking
- **Food Database**: Foods organized by food groups with macro data per serving
- **Recipe Builder**: Create recipes with ratio-based ingredients (scale by food group portions)
- **Meal Plan Templates**: Define reusable structures with day types and meal slots
- **Meal Plan Builder**: 4-step wizard to assign plans to clients with macro targets
- **Appointment Management**: View/confirm/cancel booking requests
- **PDF Export**: Generate branded meal plan PDFs

### Ratio-Based Meal Planning

The core innovation: meals are built from food group portions (cereales, proteinas, grasas, vegetales). A recipe template scales automatically — when a meal slot requires "3 cereal portions," the cereal-group ingredients multiply by 3 while other groups stay at their base ratios.

## Database Scripts

```bash
npm run db:generate   # Generate migration from schema changes
npm run db:migrate    # Run pending migrations
npm run db:seed       # Seed with sample data
npm run db:studio     # Open Drizzle Studio (DB browser)
```

## Deployment (Railway)

1. Create a new project on Railway
2. Add a PostgreSQL database service
3. Connect your GitHub repo
4. Set environment variables:
   - `DATABASE_URL` (from Railway Postgres)
   - `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
   - `NEXTAUTH_URL` (your Railway domain)
5. Railway will auto-detect the Dockerfile and deploy

## License

Private — All rights reserved.
