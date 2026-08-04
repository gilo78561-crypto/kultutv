import { db } from "@/db/client";
import {
  articles,
  emissions,
  flashInfos,
  podcasts,
  programme,
  programmeNextItems,
  replays,
  streams,
} from "@/db/schema";
import { createId } from "@/lib/id";
import * as mock from "@/services/mock-data";

async function seed() {
  console.log("Seeding streams...");
  await db
    .insert(streams)
    .values([
      ...mock.tvStreams.map((s, i) => ({ ...s, kind: "tv" as const, sortOrder: i })),
      ...mock.radioStreams.map((s, i) => ({ ...s, kind: "radio" as const, sortOrder: i })),
    ]);

  console.log("Seeding replays...");
  await db.insert(replays).values(mock.replays);

  console.log("Seeding emissions...");
  await db.insert(emissions).values(mock.emissions);

  console.log("Seeding articles...");
  await db.insert(articles).values(mock.articles);

  console.log("Seeding podcasts...");
  await db.insert(podcasts).values(mock.podcasts);

  console.log("Seeding flash infos...");
  await db.insert(flashInfos).values(mock.flashInfos);

  console.log("Seeding programme...");
  const { next, ...current } = mock.programme;
  await db.insert(programme).values({ id: "current", ...current });
  await db
    .insert(programmeNextItems)
    .values(next.map((item, index) => ({ id: createId("next"), ...item, sortOrder: index })));

  console.log("Done.");
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
