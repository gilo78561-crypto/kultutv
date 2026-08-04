import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db/client";
import { articles } from "@/db/schema";
import { createId } from "@/lib/id";
import { requireAdminSession } from "@/functions/admin-auth";

export const articleInput = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  body: z.array(z.string().min(1)).min(1),
  category: z.string().min(1),
  author: z.string().min(1),
  date: z.string().min(1),
  readTime: z.string().min(1),
  cover: z.string().min(1),
});

export const getArticles = createServerFn({ method: "GET" }).handler(async () => {
  return db.select().from(articles).orderBy(desc(articles.date));
});

export const getArticle = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string().min(1) }))
  .handler(async ({ data }) => {
    const [row] = await db.select().from(articles).where(eq(articles.slug, data.slug)).limit(1);
    return row;
  });

export const getArticleCategories = createServerFn({ method: "GET" }).handler(async () => {
  const rows = await db.selectDistinct({ category: articles.category }).from(articles);
  return rows.map((r) => r.category).sort();
});

export const createArticle = createServerFn({ method: "POST" })
  .validator(articleInput)
  .handler(async ({ data }) => {
    await requireAdminSession();
    const [row] = await db
      .insert(articles)
      .values({ id: createId("article"), ...data })
      .returning();
    return row;
  });

export const updateArticle = createServerFn({ method: "POST" })
  .validator(articleInput.extend({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    await requireAdminSession();
    const { id, ...values } = data;
    const [row] = await db
      .update(articles)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(articles.id, id))
      .returning();
    return row;
  });

export const deleteArticle = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    await requireAdminSession();
    await db.delete(articles).where(eq(articles.id, data.id));
    return { success: true as const };
  });
