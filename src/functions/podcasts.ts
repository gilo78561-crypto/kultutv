import { createServerFn } from "@tanstack/react-start";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db/client";
import { podcasts } from "@/db/schema";
import { createId } from "@/lib/id";
import { requireAdminSession } from "@/functions/admin-auth";

export const podcastInput = z.object({
  title: z.string().min(1),
  show: z.string().min(1),
  duration: z.string().min(1),
  cover: z.string().min(1),
  audioUrl: z.string().min(1),
});

export const getPodcasts = createServerFn({ method: "GET" }).handler(async () => {
  return db.select().from(podcasts).orderBy(asc(podcasts.title));
});

export const getPodcastShows = createServerFn({ method: "GET" }).handler(async () => {
  const rows = await db.selectDistinct({ show: podcasts.show }).from(podcasts);
  return rows.map((r) => r.show).sort();
});

export const createPodcast = createServerFn({ method: "POST" })
  .validator(podcastInput)
  .handler(async ({ data }) => {
    await requireAdminSession();
    const [row] = await db
      .insert(podcasts)
      .values({ id: createId("podcast"), ...data })
      .returning();
    return row;
  });

export const updatePodcast = createServerFn({ method: "POST" })
  .validator(podcastInput.extend({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    await requireAdminSession();
    const { id, ...values } = data;
    const [row] = await db
      .update(podcasts)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(podcasts.id, id))
      .returning();
    return row;
  });

export const deletePodcast = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    await requireAdminSession();
    await db.delete(podcasts).where(eq(podcasts.id, data.id));
    return { success: true as const };
  });
