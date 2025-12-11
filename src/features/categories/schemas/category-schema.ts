import { z } from "zod";
import { CategoryType } from "@prisma/client";

export const createCategorySchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório"),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Cor inválida. Use formato hexadecimal (ex: #FF5733)"),
  type: z.nativeEnum(CategoryType),
});

export const updateCategorySchema = createCategorySchema.extend({
  id: z.string().min(1, "ID é obrigatório"),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

