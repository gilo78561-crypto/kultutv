import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env and configure your Neon/Vercel Postgres connection string.",
    );
  }
  return url;
}

const sql = neon(getDatabaseUrl());

export const db = drizzle(sql, { schema });
