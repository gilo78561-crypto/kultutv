import { createServerFn } from "@tanstack/react-start";
import { count } from "drizzle-orm";

import { db } from "@/db/client";
import { articles, emissions, flashInfos, podcasts, replays, streams } from "@/db/schema";
import { requireAdminSession } from "@/functions/admin-auth";

export const getAdminStats = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdminSession();

  const [streamsCount, replaysCount, emissionsCount, articlesCount, podcastsCount, flashCount] =
    await Promise.all([
      db.select({ value: count() }).from(streams),
      db.select({ value: count() }).from(replays),
      db.select({ value: count() }).from(emissions),
      db.select({ value: count() }).from(articles),
      db.select({ value: count() }).from(podcasts),
      db.select({ value: count() }).from(flashInfos),
    ]);

  return {
    streams: streamsCount[0]?.value ?? 0,
    replays: replaysCount[0]?.value ?? 0,
    emissions: emissionsCount[0]?.value ?? 0,
    articles: articlesCount[0]?.value ?? 0,
    podcasts: podcastsCount[0]?.value ?? 0,
    flashInfos: flashCount[0]?.value ?? 0,
  };
});
