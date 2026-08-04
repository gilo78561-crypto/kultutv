import { createServerFn } from "@tanstack/react-start";
import { and, eq, isNotNull, ne } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db/client";
import { streams } from "@/db/schema";
import { requireAdminSession } from "@/functions/admin-auth";

export const MUX_RTMP_URL = "rtmp://global-live.mux.com:5222/app";

function muxCredentials() {
  const tokenId = process.env.MUX_TOKEN_ID;
  const tokenSecret = process.env.MUX_TOKEN_SECRET;
  if (!tokenId || !tokenSecret) {
    throw new Error("Mux n'est pas configuré (MUX_TOKEN_ID / MUX_TOKEN_SECRET manquants).");
  }
  return Buffer.from(`${tokenId}:${tokenSecret}`).toString("base64");
}

async function muxFetch(path: string, init?: RequestInit) {
  const res = await fetch(`https://api.mux.com${path}`, {
    ...init,
    headers: {
      Authorization: `Basic ${muxCredentials()}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Erreur Mux (${res.status}): ${body || res.statusText}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

const streamIdInput = z.object({ streamId: z.string().min(1) });

export const createMuxLiveStream = createServerFn({ method: "POST" })
  .validator(streamIdInput)
  .handler(async ({ data }) => {
    await requireAdminSession();

    // Only one live can be configured at a time — reject if another stream
    // already has an active Mux direct.
    const [existing] = await db
      .select({ id: streams.id })
      .from(streams)
      .where(and(isNotNull(streams.muxLiveStreamId), ne(streams.id, data.streamId)))
      .limit(1);
    if (existing) {
      throw new Error("Un direct est déjà configuré. Supprime-le avant d'en créer un nouveau.");
    }

    const result = (await muxFetch("/video/v1/live-streams", {
      method: "POST",
      body: JSON.stringify({
        playback_policy: ["public"],
        new_asset_settings: { playback_policy: ["public"] },
        reconnect_window: 60,
      }),
    })) as {
      data: { id: string; stream_key: string; playback_ids: { id: string }[] };
    };

    const muxLiveStreamId = result.data.id;
    const muxStreamKey = result.data.stream_key;
    const muxPlaybackId = result.data.playback_ids[0]?.id;
    if (!muxPlaybackId) throw new Error("Mux n'a pas renvoyé d'identifiant de lecture.");

    const [row] = await db
      .update(streams)
      .set({
        muxLiveStreamId,
        muxStreamKey,
        muxPlaybackId,
        url: `https://stream.mux.com/${muxPlaybackId}.m3u8`,
        updatedAt: new Date(),
      })
      .where(eq(streams.id, data.streamId))
      .returning();

    return row;
  });

export const getMuxLiveStatus = createServerFn({ method: "POST" })
  .validator(z.object({ muxLiveStreamId: z.string().min(1) }))
  .handler(async ({ data }) => {
    await requireAdminSession();
    const result = (await muxFetch(`/video/v1/live-streams/${data.muxLiveStreamId}`)) as {
      data: { status: "idle" | "active" | "disabled" };
    };
    return { status: result.data.status };
  });

export const resetMuxStreamKey = createServerFn({ method: "POST" })
  .validator(streamIdInput.extend({ muxLiveStreamId: z.string().min(1) }))
  .handler(async ({ data }) => {
    await requireAdminSession();
    const result = (await muxFetch(
      `/video/v1/live-streams/${data.muxLiveStreamId}/reset-stream-key`,
      { method: "POST" },
    )) as { data: { stream_key: string } };

    const [row] = await db
      .update(streams)
      .set({ muxStreamKey: result.data.stream_key, updatedAt: new Date() })
      .where(eq(streams.id, data.streamId))
      .returning();

    return row;
  });

export const deleteMuxLiveStream = createServerFn({ method: "POST" })
  .validator(streamIdInput.extend({ muxLiveStreamId: z.string().min(1) }))
  .handler(async ({ data }) => {
    await requireAdminSession();
    await muxFetch(`/video/v1/live-streams/${data.muxLiveStreamId}`, { method: "DELETE" });

    const [row] = await db
      .update(streams)
      .set({
        muxLiveStreamId: null,
        muxStreamKey: null,
        muxPlaybackId: null,
        updatedAt: new Date(),
      })
      .where(eq(streams.id, data.streamId))
      .returning();

    return row;
  });
