import { z } from "zod";

export const upsertUserSchema = z.object({
  id: z.string().optional(),
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

export type UpsertUserSchema = z.infer<typeof upsertUserSchema>;
