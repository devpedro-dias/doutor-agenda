import { z } from "zod";

export const createMedicalSpecialtySchema = z.object({
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

export const updateMedicalSpecialtySchema = z.object({
  id: z.string().uuid({
    message: "ID da especialidade é obrigatório.",
  }),
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
  isActive: z.boolean().optional(),
});

export const getMedicalSpecialtiesSchema = z.object({});

export const deleteMedicalSpecialtySchema = z.object({
  id: z.string().uuid({
    message: "ID da especialidade é obrigatório.",
  }),
});

export type CreateMedicalSpecialtySchema = z.infer<
  typeof createMedicalSpecialtySchema
>;
export type UpdateMedicalSpecialtySchema = z.infer<
  typeof updateMedicalSpecialtySchema
>;
export type GetMedicalSpecialtiesSchema = z.infer<
  typeof getMedicalSpecialtiesSchema
>;
export type DeleteMedicalSpecialtySchema = z.infer<
  typeof deleteMedicalSpecialtySchema
>;
