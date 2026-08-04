import { createServerFn } from "@tanstack/react-start";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db/client";
import { programme, programmeNextItems } from "@/db/schema";
import { createId } from "@/lib/id";
import { requireAdminSession } from "@/functions/admin-auth";

const CURRENT_ID = "current";

export const nextItemInput = z.object({
  title: z.string().min(1),
  startsAt: z.string().min(1),
});

export const programmeInput = z.object({
  title: z.string().min(1),
  emission: z.string().min(1),
  host: z.string().min(1),
  startsAt: z.string().min(1),
  endsAt: z.string().min(1),
  progress: z.number().int().min(0).max(100).default(0),
  description: z.string().min(1),
  cover: z.string().min(1),
  streamUrl: z.string().min(1),
  next: z.array(nextItemInput).default([]),
});

export const getProgrammeEnCours = createServerFn({ method: "GET" }).handler(async () => {
  const [current] = await db.select().from(programme).where(eq(programme.id, CURRENT_ID)).limit(1);
  const next = await db
    .select()
    .from(programmeNextItems)
    .orderBy(asc(programmeNextItems.sortOrder));

  if (!current) return null;
  return { ...current, next: next.map((n) => ({ title: n.title, startsAt: n.startsAt })) };
});

export const updateProgramme = createServerFn({ method: "POST" })
  .validator(programmeInput)
  .handler(async ({ data }) => {
    await requireAdminSession();
    const { next, ...values } = data;

    await db
      .insert(programme)
      .values({ id: CURRENT_ID, ...values })
      .onConflictDoUpdate({ target: programme.id, set: { ...values, updatedAt: new Date() } });

    // neon-http has no transaction support; sequential ops are acceptable for
    // this single-admin, low-frequency write.
    await db.delete(programmeNextItems);
    if (next.length > 0) {
      await db.insert(programmeNextItems).values(
        next.map((item, index) => ({
          id: createId("next"),
          title: item.title,
          startsAt: item.startsAt,
          sortOrder: index,
        })),
      );
    }

    return { success: true as const };
  });
