"use client";

import { useEffect } from "react";
import { Button } from "@/src/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/_components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/_components/ui/form";
import { Input } from "@/src/_components/ui/input";
import { authClient } from "@/src/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, {
      message: "Email é obrigatório",
    })
    .email({
      message: "Email inválido",
    }),
  password: z.string().trim().min(8, {
    message: "Senha deve ter no mínimo 8 caracteres",
  }),
});

const LoginForm = () => {
  const router = useRouter();

  // Limpar dados antigos ao carregar a página
  useEffect(() => {
    try {
      // Limpar localStorage relacionado ao auth
      const keysToRemove = Object.keys(localStorage).filter(
        (key) =>
          key.includes("auth") ||
          key.includes("better-auth") ||
          key.includes("session"),
      );
      keysToRemove.forEach((key) => localStorage.removeItem(key));

      // Limpar cookies relacionados ao auth
      document.cookie.split(";").forEach((cookie) => {
        const [name] = cookie.trim().split("=");
        if (
          name &&
          (name.includes("auth") ||
            name.includes("better-auth") ||
            name.includes("session"))
        ) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
      });
    } catch (error) {
      console.log("Erro ao limpar cache:", error);
    }
  }, []);
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof loginSchema>) => {
    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
        onError: () => {
          toast.error("Email ou senha inválidos");
        },
      },
    );
  };

  const handleGoogleLogin = async () => {
    // Definir cookie de trial se estiver no contexto de trial
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("trial") === "true") {
      document.cookie = "isTrial=true; path=/; max-age=604800; samesite=lax";
    }

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (error: unknown) {
      // Tratar erros específicos de autenticação
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (errorMessage?.includes("não encontrado")) {
        toast.error(
          "Usuário não encontrado. Para criar uma conta, inicie o período de teste primeiro.",
        );
      } else if (errorMessage?.includes("não autorizado")) {
        toast.error("Conta sem plano ativo. Entre em contato com o suporte.");
      } else if (errorMessage?.includes("deve ter um plano ativo")) {
        toast.error(
          "Para criar uma conta, inicie o período de teste primeiro.",
        );
      } else {
        toast.error("Erro ao fazer login com Google. Tente novamente.");
      }
    }
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <CardHeader>
            <CardTitle>Fazer login</CardTitle>
            <CardDescription>
              Digite suas credenciais para acessar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Senha</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite sua senha"
                      {...field}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <div className="flex w-full flex-col gap-2">
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                )}
                Entrar
              </Button>
              <Button
                variant="outline"
                onClick={handleGoogleLogin}
                type="button"
              >
                <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Entrar com o Google
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default LoginForm;
