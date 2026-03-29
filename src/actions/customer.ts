"use server";

import { db } from "@/lib/db";
import {
  clients,
  clientMeasurements,
  mealPlans,
  mealPlanDays,
  mealPlanMeals,
  mealOptions,
  recipes,
  supplementProtocols,
  hydrationProtocols,
  appointments,
} from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";

export async function getClientByLinkedUser(userId: string) {
  const [client] = await db
    .select()
    .from(clients)
    .where(eq(clients.linkedUserId, userId))
    .limit(1);
  return client ?? null;
}

export async function getClientMealPlans(clientId: string) {
  return db.query.mealPlans.findMany({
    where: eq(mealPlans.clientId, clientId),
    orderBy: desc(mealPlans.createdAt),
    with: {
      days: {
        orderBy: (d, { asc }) => asc(d.dayNumber),
        with: {
          meals: {
            orderBy: (m, { asc }) => asc(m.displayOrder),
            with: {
              options: {
                with: { recipe: true },
                orderBy: (o, { asc }) => asc(o.displayOrder),
              },
            },
          },
        },
      },
    },
  });
}

export async function getClientMeasurements(clientId: string) {
  return db
    .select()
    .from(clientMeasurements)
    .where(eq(clientMeasurements.clientId, clientId))
    .orderBy(desc(clientMeasurements.date));
}

export async function getClientSupplements(clientId: string) {
  return db
    .select()
    .from(supplementProtocols)
    .where(eq(supplementProtocols.clientId, clientId));
}

export async function getClientHydration(clientId: string) {
  return db
    .select()
    .from(hydrationProtocols)
    .where(eq(hydrationProtocols.clientId, clientId));
}

export async function getClientAppointments(clientEmail: string) {
  return db
    .select()
    .from(appointments)
    .where(eq(appointments.email, clientEmail))
    .orderBy(desc(appointments.createdAt));
}
