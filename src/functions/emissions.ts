import { createServerFn } from "@tanstack/react-start";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db/client";
import { emissions } from "@/db/schema";
import { createId } from "@/lib/id";
import { requireAdminSession } from "@/functions/admin-auth";

export const emissionInput = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  host: z.string().min(1),
  schedule: z.string().min(1),
  category: z.string().min(1),
  description: z.string().min(1),
  cover: z.string().min(1),
  streamUrl: z.string().min(1),
});

export const getEmissions = createServerFn({ method: "GET" }).handler(async () => {
  return db.select().from(emissions).orderBy(asc(emissions.title));
});

export const getEmission = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string().min(1) }))
  .handler(async ({ data }) => {
    const [row] = await db.select().from(emissions).where(eq(emissions.slug, data.slug)).limit(1);
    return row;
  });

export const getEmissionCategories = createServerFn({ method: "GET" }).handler(async () => {
  const rows = await db.selectDistinct({ category: emissions.category }).from(emissions);
  return rows.map((r) => r.category).sort();
});

export const createEmission = createServerFn({ method: "POST" })
  .validator(emissionInput)
  .handler(async ({ data }) => {
    await requireAdminSession();
    const [row] = await db
      .insert(emissions)
      .values({ id: createId("emission"), ...data })
      .returning();
    return row;
  });

export const updateEmission = createServerFn({ method: "POST" })
  .validator(emissionInput.extend({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    await requireAdminSession();
    const { id, ...values } = data;
    const [row] = await db
      .update(emissions)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(emissions.id, id))
      .returning();
    return row;
  });

export const deleteEmission = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    await requireAdminSession();
    await db.delete(emissions).where(eq(emissions.id, data.id));
    return { success: true as const };
  });
