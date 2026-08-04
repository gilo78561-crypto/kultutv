import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db/client";
import { flashInfos } from "@/db/schema";
import { createId } from "@/lib/id";
import { requireAdminSession } from "@/functions/admin-auth";

export const flashInfoInput = z.object({
  time: z.string().min(1),
  label: z.string().min(1),
  text: z.string().min(1),
});

export const getFlashInfo = createServerFn({ method: "GET" }).handler(async () => {
  return db.select().from(flashInfos).orderBy(desc(flashInfos.createdAt));
});

export const getFlashInfoLabels = createServerFn({ method: "GET" }).handler(async () => {
  const rows = await db.selectDistinct({ label: flashInfos.label }).from(flashInfos);
  return rows.map((r) => r.label).sort();
});

export const createFlashInfo = createServerFn({ method: "POST" })
  .validator(flashInfoInput)
  .handler(async ({ data }) => {
    await requireAdminSession();
    const [row] = await db
      .insert(flashInfos)
      .values({ id: createId("flash"), ...data })
      .returning();
    return row;
  });

export const updateFlashInfo = createServerFn({ method: "POST" })
  .validator(flashInfoInput.extend({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    await requireAdminSession();
    const { id, ...values } = data;
    const [row] = await db
      .update(flashInfos)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(flashInfos.id, id))
      .returning();
    return row;
  });

export const deleteFlashInfo = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    await requireAdminSession();
    await db.delete(flashInfos).where(eq(flashInfos.id, data.id));
    return { success: true as const };
  });
