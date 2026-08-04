import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

export const streams = pgTable("streams", {
  id: text("id").primaryKey(),
  kind: text("kind", { enum: ["tv", "radio"] }).notNull(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  cover: text("cover").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  // Set when this stream is a real live broadcast managed through Mux
  // (OBS/streaming software -> RTMP ingest -> HLS playback), rather than a
  // plain external URL (e.g. a YouTube link).
  muxLiveStreamId: text("mux_live_stream_id"),
  muxStreamKey: text("mux_stream_key"),
  muxPlaybackId: text("mux_playback_id"),
  ...timestamps,
});

export const replays = pgTable("replays", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  emission: text("emission").notNull(),
  duration: text("duration").notNull(),
  date: text("date"),
  cover: text("cover").notNull(),
  description: text("description").notNull(),
  streamUrl: text("stream_url").notNull(),
  ...timestamps,
});

export const emissions = pgTable("emissions", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  host: text("host").notNull(),
  schedule: text("schedule").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  cover: text("cover").notNull(),
  streamUrl: text("stream_url").notNull(),
  ...timestamps,
});

export const articles = pgTable("articles", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  body: text("body").array().notNull(),
  category: text("category").notNull(),
  author: text("author").notNull(),
  date: text("date").notNull(),
  readTime: text("read_time").notNull(),
  cover: text("cover").notNull(),
  ...timestamps,
});

export const podcasts = pgTable("podcasts", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  show: text("show").notNull(),
  duration: text("duration").notNull(),
  cover: text("cover").notNull(),
  audioUrl: text("audio_url").notNull(),
  ...timestamps,
});

export const flashInfos = pgTable("flash_infos", {
  id: text("id").primaryKey(),
  time: text("time").notNull(),
  label: text("label").notNull(),
  text: text("text").notNull(),
  ...timestamps,
});

export const programme = pgTable("programme", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  emission: text("emission").notNull(),
  host: text("host").notNull(),
  startsAt: text("starts_at").notNull(),
  endsAt: text("ends_at").notNull(),
  progress: integer("progress").notNull().default(0),
  description: text("description").notNull(),
  cover: text("cover").notNull(),
  streamUrl: text("stream_url").notNull(),
  ...timestamps,
});

export const programmeNextItems = pgTable("programme_next_items", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  startsAt: text("starts_at").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
});
