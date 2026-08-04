import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { getAdminAuthStatus, loginAdmin } from "@/functions/admin-auth";

const schema = z.object({
  username: z.string().min(1, "Identifiant requis"),
  password: z.string().min(1, "Mot de passe requis"),
});

type Values = z.infer<typeof schema>;

const field =
  "glass-panel w-full rounded-xl px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring";

export const Route = createFileRoute("/admin/login")({
  beforeLoad: async () => {
    const { isAuthenticated } = await getAdminAuthStatus();
    if (isAuthenticated) throw redirect({ to: "/admin" });
  },
  head: () => ({
    meta: [{ title: "Connexion — Admin KULTU TV" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { username: "", password: "" },
  });

  const login = useMutation({
    mutationFn: (values: Values) => loginAdmin({ data: values }),
    onSuccess: () => {
      toast.success("Connexion réussie");
      navigate({ to: "/admin" });
    },
    onError: (error: Error) => toast.error(error.message || "Identifiants invalides."),
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="gradient-ember flex h-12 w-12 items-center justify-center rounded-full shadow-glow">
            <Lock className="h-5 w-5 text-primary-foreground" />
          </span>
          <h1 className="display text-3xl tracking-[calc(0.025em+1px)]">
            KULTU <span className="text-gradient-ember">Admin</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Espace réservé à l'administration du site.
          </p>
        </div>

        <form
          onSubmit={handleSubmit((values) => login.mutate(values))}
          className="glass-panel space-y-4 rounded-2xl p-6 shadow-soft"
        >
          <div>
            <input
              {...register("username")}
              autoComplete="username"
              placeholder="Identifiant"
              className={field}
            />
            {errors.username && (
              <p className="mt-1 text-xs text-destructive">{errors.username.message}</p>
            )}
          </div>
          <div>
            <input
              {...register("password")}
              type="password"
              autoComplete="current-password"
              placeholder="Mot de passe"
              className={field}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting || login.isPending}
            className="gradient-ember w-full rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-105 active:scale-95 disabled:opacity-60"
          >
            {login.isPending ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
