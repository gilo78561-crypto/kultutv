import { createServerFn } from "@tanstack/react-start";
import { put } from "@vercel/blob";

import { requireAdminSession } from "@/functions/admin-auth";

const MAX_FILE_BYTES = 200 * 1024 * 1024; // 200 MB

export const uploadFile = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (!(data instanceof FormData)) throw new Error("Requête invalide.");
    return data;
  })
  .handler(async ({ data }) => {
    await requireAdminSession();

    const file = data.get("file");
    if (!(file instanceof File)) throw new Error("Aucun fichier reçu.");
    if (file.size > MAX_FILE_BYTES) throw new Error("Fichier trop volumineux (200 Mo max).");

    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type || undefined,
    });

    return { url: blob.url };
  });
