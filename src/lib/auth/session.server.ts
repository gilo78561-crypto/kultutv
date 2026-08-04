import { createServerOnlyFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";

export type AdminSessionData = {
  isAdmin?: boolean;
  username?: string;
};

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET is not set (or is shorter than 32 characters). Generate one with: bun run scripts/generate-secret.ts",
    );
  }
  return secret;
}

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12; // 12h

// Not a React hook — this is h3/TanStack Start's server-side session accessor.
export const getAdminSession = createServerOnlyFn(() =>
  useSession<AdminSessionData>({
    password: getSessionSecret(),
    name: "kultu_admin",
    maxAge: SESSION_MAX_AGE_SECONDS,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    },
  }),
);
