"use client";

import { createClinic } from "@/src/_actions/create-clinic";
import { Button } from "@/src/_components/ui/button";
import { DialogFooter } from "@/src/_components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/_components/ui/form";
import { Input } from "@/src/_components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface ClinicFormProps {
  showCancelButton?: boolean;
}

const clinicSchema = z.object({
  name: z.string().trim().min(1, { message: "O nome é obrigatório" }),
});

const ClinicForm = ({ showCancelButton = false }: ClinicFormProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof clinicSchema>>({
    resolver: zodResolver(clinicSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof clinicSchema>) => {
    try {
      await createClinic(data.name);
    } catch (error) {
      if (isRedirectError(error)) {
        return;
      }
      toast.error("Erro ao criar clínica");
    }
  };

  const handleCancel = () => {
    router.push("/dashboard");
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da clínica</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome da clínica" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter className={showCancelButton ? "flex gap-2" : ""}>
            {showCancelButton && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
              >
                Cancelar
              </Button>
            )}
            <Button
              type="submit"
              className={showCancelButton ? "flex-1" : "w-full"}
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Criar clínica
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};

export default ClinicForm;
