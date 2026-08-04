import { createServerFn } from "@tanstack/react-start";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db/client";
import { streams } from "@/db/schema";
import { createId } from "@/lib/id";
import { requireAdminSession } from "@/functions/admin-auth";

export const streamInput = z.object({
  kind: z.enum(["tv", "radio"]),
  name: z.string().min(1),
  url: z.string().min(1),
  cover: z.string().min(1),
  sortOrder: z.number().int().default(0),
});

export const getTvStreams = createServerFn({ method: "GET" }).handler(async () => {
  return db.select().from(streams).where(eq(streams.kind, "tv")).orderBy(asc(streams.sortOrder));
});

export const getRadioStreams = createServerFn({ method: "GET" }).handler(async () => {
  return db.select().from(streams).where(eq(streams.kind, "radio")).orderBy(asc(streams.sortOrder));
});

export const listStreamsAdmin = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdminSession();
  return db.select().from(streams).orderBy(asc(streams.kind), asc(streams.sortOrder));
});

export const createStream = createServerFn({ method: "POST" })
  .validator(streamInput)
  .handler(async ({ data }) => {
    await requireAdminSession();
    const [row] = await db
      .insert(streams)
      .values({ id: createId("stream"), ...data })
      .returning();
    return row;
  });

export const updateStream = createServerFn({ method: "POST" })
  .validator(streamInput.extend({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    await requireAdminSession();
    const { id, ...values } = data;
    const [row] = await db
      .update(streams)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(streams.id, id))
      .returning();
    return row;
  });

export const deleteStream = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    await requireAdminSession();
    await db.delete(streams).where(eq(streams.id, data.id));
    return { success: true as const };
  });
