import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getAdminSession } from "@/lib/auth/session.server";
import { verifyPassword } from "@/lib/auth/credentials";

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

/** Throws if the current request doesn't carry a valid admin session. Call this at the top of every admin mutation/query server function. */
export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session.data.isAdmin) {
    throw new Error("Non autorisé.");
  }
  return session;
}

export const getAdminAuthStatus = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getAdminSession();
  return { isAuthenticated: Boolean(session.data.isAdmin) };
});

export const loginAdmin = createServerFn({ method: "POST" })
  .validator(loginSchema)
  .handler(async ({ data }) => {
    const expectedUsername = process.env.ADMIN_USERNAME;
    const expectedHash = process.env.ADMIN_PASSWORD_HASH;

    if (!expectedUsername || !expectedHash) {
      throw new Error(
        "Le compte admin n'est pas configuré (ADMIN_USERNAME / ADMIN_PASSWORD_HASH manquants).",
      );
    }

    // Constant-shape comparison for the username, constant-time for the password.
    const usernameOk =
      data.username.length === expectedUsername.length && data.username === expectedUsername;
    const passwordOk = verifyPassword(data.password, expectedHash);

    if (!usernameOk || !passwordOk) {
      throw new Error("Identifiants invalides.");
    }

    const session = await getAdminSession();
    await session.update({ isAdmin: true, username: data.username });
    return { success: true as const };
  });

export const logoutAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const session = await getAdminSession();
  await session.clear();
  return { success: true as const };
});
