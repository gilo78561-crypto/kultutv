import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db/client";
import { replays } from "@/db/schema";
import { createId } from "@/lib/id";
import { requireAdminSession } from "@/functions/admin-auth";

export const replayInput = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  emission: z.string().min(1),
  duration: z.string().min(1),
  date: z.string().optional(),
  cover: z.string().min(1),
  description: z.string().min(1),
  streamUrl: z.string().min(1),
});

export const getReplays = createServerFn({ method: "GET" }).handler(async () => {
  return db.select().from(replays).orderBy(desc(replays.createdAt));
});

export const getReplay = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string().min(1) }))
  .handler(async ({ data }) => {
    const [row] = await db.select().from(replays).where(eq(replays.slug, data.slug)).limit(1);
    return row;
  });

export const createReplay = createServerFn({ method: "POST" })
  .validator(replayInput)
  .handler(async ({ data }) => {
    await requireAdminSession();
    const [row] = await db
      .insert(replays)
      .values({ id: createId("replay"), ...data })
      .returning();
    return row;
  });

export const updateReplay = createServerFn({ method: "POST" })
  .validator(replayInput.extend({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    await requireAdminSession();
    const { id, ...values } = data;
    const [row] = await db
      .update(replays)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(replays.id, id))
      .returning();
    return row;
  });

export const deleteReplay = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    await requireAdminSession();
    await db.delete(replays).where(eq(replays.id, data.id));
    return { success: true as const };
  });
