"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { createMedicalSpecialtyAction } from "@/src/_actions/medical-specialties";
import { Button } from "@/src/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/_components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/_components/ui/form";
import { Input } from "@/src/_components/ui/input";

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, {
      message: "Nome da especialidade é obrigatório.",
    })
    .max(100, {
      message: "Nome da especialidade deve ter no máximo 100 caracteres.",
    }),
  description: z.string().optional(),
});

interface CreateSpecialtyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateSpecialtyDialog({
  isOpen,
  onClose,
  onSuccess,
}: CreateSpecialtyDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const createSpecialtyAction = useAction(createMedicalSpecialtyAction, {
    onSuccess: () => {
      toast.success("Especialidade criada com sucesso!");
      form.reset();
      onSuccess();
    },
    onError: (error) => {
      if (error.error?.serverError) {
        toast.error(error.error.serverError);
      } else {
        toast.error("Erro ao criar especialidade");
      }
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createSpecialtyAction.execute(values);
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Especialidade</DialogTitle>
          <DialogDescription>
            Adicione uma nova especialidade médica à sua clínica
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Nome da especialidade</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Cardiologia, Dermatologia, etc."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Descreva brevemente a especialidade..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={createSpecialtyAction.isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={createSpecialtyAction.isPending}>
                {createSpecialtyAction.isPending
                  ? "Criando..."
                  : "Criar Especialidade"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
