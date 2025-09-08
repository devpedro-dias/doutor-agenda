"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { upsertAction } from "@/src/_actions/upsert-user";
import { Button } from "@/src/_components/ui/button";
import {
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
import { MaskedInput } from "@/src/_components/ui/masked-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/_components/ui/select";
import { useViaCep } from "@/src/_hooks/use-viacep";

const formSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Nome é obrigatório.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  cpf: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true; // Permitir vazio
        // Remover pontos e traços para validação
        const cleanCPF = val.replace(/[^\d]/g, "");
        // Verificar se tem 11 dígitos
        if (cleanCPF.length !== 11) return false;
        // Verificar se não é sequência (111.111.111-11, etc.)
        if (/^(\d)\1+$/.test(cleanCPF)) return false;
        // Algoritmo de validação do CPF
        let sum = 0;
        for (let i = 0; i < 9; i++) {
          sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
        }
        let remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cleanCPF.charAt(9))) return false;

        sum = 0;
        for (let i = 0; i < 10; i++) {
          sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
        }
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        return remainder === parseInt(cleanCPF.charAt(10));
      },
      {
        message: "CPF inválido.",
      },
    ),
  phoneNumber: z.string().optional(),
  cep: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  complement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  address: z.string().optional(),
  role: z.enum(["OWNER", "MANAGER", "DOCTOR", "STAFF"], {
    required_error: "Role é obrigatória.",
  }),
});

interface UpsertUserFormProps {
  isOpen: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    cpf?: string | null;
    phoneNumber?: string | null;
    cep?: string | null;
    street?: string | null;
    number?: string | null;
    complement?: string | null;
    neighborhood?: string | null;
    city?: string | null;
    state?: string | null;
    address?: string | null;
    role: string;
  } | null;
  onSuccess?: () => void;
  onUsersChange?: () => void;
}

const UpsertUserForm = ({
  user,
  onSuccess,
  isOpen,
  onUsersChange,
}: UpsertUserFormProps) => {
  const {
    fetchAddressByCep,
    isLoading: isLoadingCep,
    error: cepError,
  } = useViaCep();

  const form = useForm<z.infer<typeof formSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      cpf: user?.cpf ?? "",
      phoneNumber: user?.phoneNumber ?? "",
      cep: user?.cep ?? "",
      street: user?.street ?? "",
      number: user?.number ?? "",
      complement: user?.complement ?? "",
      neighborhood: user?.neighborhood ?? "",
      city: user?.city ?? "",
      state: user?.state ?? "",
      address: user?.address ?? "",
      role:
        (user?.role as "OWNER" | "MANAGER" | "DOCTOR" | "STAFF") ?? "MANAGER",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: user?.name ?? "",
        email: user?.email ?? "",
        cpf: user?.cpf ?? "",
        phoneNumber: user?.phoneNumber ?? "",
        cep: user?.cep ?? "",
        street: user?.street ?? "",
        number: user?.number ?? "",
        complement: user?.complement ?? "",
        neighborhood: user?.neighborhood ?? "",
        city: user?.city ?? "",
        state: user?.state ?? "",
        address: user?.address ?? "",
        role:
          (user?.role as "OWNER" | "MANAGER" | "DOCTOR" | "STAFF") ?? "MANAGER",
      });
    }
  }, [isOpen, form, user]);

  const handleCepChange = async (cepValue: string) => {
    form.setValue("cep", cepValue);

    // Se o CEP estiver completo (8 dígitos), buscar endereço
    const cleanCep = cepValue.replace(/\D/g, "");
    if (cleanCep.length === 8) {
      const addressData = await fetchAddressByCep(cleanCep);
      if (addressData) {
        form.setValue("street", addressData.street);
        form.setValue("neighborhood", addressData.neighborhood);
        form.setValue("city", addressData.city);
        form.setValue("state", addressData.state);
      }
    }
  };

  const upsertUserAction = useAction(upsertAction, {
    onSuccess: () => {
      toast.success("Usuário salvo com sucesso.");
      onSuccess?.();

      onUsersChange?.();
    },
    onError: (error) => {
      // Tratamento específico de erros
      if (error.error?.serverError) {
        if (error.error.serverError.includes("não encontrado")) {
          toast.error(error.error.serverError);
        } else if (error.error.serverError.includes("already associated")) {
          toast.error("Este usuário já está associado à clínica.");
        } else if (error.error.serverError.includes("CPF já cadastrado")) {
          toast.error("CPF já cadastrado para outro usuário.");
        } else if (
          error.error.serverError.includes("Cannot change owner role")
        ) {
          toast.error("Não é possível alterar a função do proprietário.");
        } else if (error.error.serverError.includes("Only clinic owners")) {
          toast.error("Apenas proprietários podem gerenciar usuários.");
        } else if (
          error.error.serverError.includes("clinic owners and managers")
        ) {
          toast.error(
            "Apenas proprietários e gerentes podem gerenciar usuários.",
          );
        } else {
          toast.error(error.error.serverError);
        }
      } else {
        toast.error("Erro ao salvar usuário.");
      }
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    upsertUserAction.execute({
      ...values,
      id: user?.id,
    });
  };

  const isEditingOwner = user?.role === "OWNER";

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {user ? "Editar usuário" : "Adicionar usuário"}
        </DialogTitle>
        <DialogDescription>
          {user
            ? "Edite as informações desse usuário."
            : "Adicione um novo usuário à clínica."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Nome do usuário</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite o nome completo do usuário"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="exemplo@email.com"
                    {...field}
                    disabled={!!user} // Não permitir alterar email na edição
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF</FormLabel>
                <FormControl>
                  <MaskedInput
                    mask="cpf"
                    {...field}
                    placeholder="000.000.000-00"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <MaskedInput
                    mask="phone"
                    {...field}
                    placeholder="(11) 99999-9999"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <h4 className="text-muted-foreground text-sm font-medium">
              Endereço
            </h4>

            <FormField
              control={form.control}
              name="cep"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP</FormLabel>
                  <FormControl>
                    <MaskedInput
                      mask="cep"
                      {...field}
                      onValueChange={handleCepChange}
                      disabled={field.disabled || isLoadingCep}
                      placeholder="00000-000"
                    />
                  </FormControl>
                  {cepError && (
                    <p className="text-destructive text-sm">{cepError}</p>
                  )}
                  {isLoadingCep && (
                    <p className="text-muted-foreground text-sm">
                      Buscando endereço...
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rua</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da rua" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número</FormLabel>
                    <FormControl>
                      <Input placeholder="123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="complement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complemento</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Apartamento, bloco, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="neighborhood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do bairro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da cidade" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <Input placeholder="UF" maxLength={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isEditingOwner} // Desabilitar se for OWNER
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isEditingOwner && (
                      <SelectItem value="OWNER" disabled>
                        Proprietário
                      </SelectItem>
                    )}
                    <SelectItem value="MANAGER">Gerente</SelectItem>
                    <SelectItem value="DOCTOR">Médico</SelectItem>
                    <SelectItem value="STAFF">Funcionário</SelectItem>
                  </SelectContent>
                </Select>
                {isEditingOwner && (
                  <p className="text-muted-foreground text-sm">
                    A role do proprietário não pode ser alterada.
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button
              type="submit"
              disabled={upsertUserAction.isPending}
              className="w-full"
            >
              {upsertUserAction.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default UpsertUserForm;
