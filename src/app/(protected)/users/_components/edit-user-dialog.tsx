"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2Icon } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/_components/ui/select";
import { Input } from "@/src/_components/ui/input";
import { Button } from "@/src/_components/ui/button";
import { updateUser } from "@/src/_actions/update-user";
import { toast } from "sonner";

const updateUserSchema = z.object({
  name: z.string().trim().min(1, { message: "O nome é obrigatório" }),
  role: z.enum(["MANAGER", "DOCTOR", "STAFF"], {
    required_error: "Selecione uma função",
  }),
});

type UpdateUserForm = z.infer<typeof updateUserSchema>;

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface EditUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdated: () => void;
}

export const EditUserDialog = ({
  user,
  open,
  onOpenChange,
  onUserUpdated,
}: EditUserDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UpdateUserForm>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: "",
      role: undefined,
    },
  });

  // Reset form when user changes
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        role: user.role as "MANAGER" | "DOCTOR" | "STAFF",
      });
    }
  }, [user, form]);

  const onSubmit = async (data: UpdateUserForm) => {
    if (!user) return;

    try {
      setIsSubmitting(true);
      await updateUser({
        userId: user.id,
        name: data.name,
        role: data.role,
      });
      toast.success("Usuário atualizado com sucesso!");
      form.reset();
      onUserUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      toast.error("Erro ao atualizar usuário");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>
            Atualize as informações do usuário "{user.name}".
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Função</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma função" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MANAGER">Gerente</SelectItem>
                      <SelectItem value="DOCTOR">Médico</SelectItem>
                      <SelectItem value="STAFF">Funcionário</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                )}
                Atualizar Usuário
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
