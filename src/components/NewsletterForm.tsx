import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Adresse email invalide"),
});

type Values = z.infer<typeof schema>;

export function NewsletterForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: "" } });

  const onSubmit = async (values: Values) => {
    await new Promise((r) => setTimeout(r, 600));
    toast.success("Inscription confirmée", { description: values.email });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <div className="flex gap-2">
        <input
          {...register("email")}
          placeholder="votre@email.com"
          className="glass-panel h-10 w-full rounded-full px-4 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="gradient-ember h-10 shrink-0 rounded-full px-5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 active:scale-95 disabled:opacity-60"
        >
          OK
        </button>
      </div>
      {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
    </form>
  );
}
