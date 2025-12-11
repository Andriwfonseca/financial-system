import { z } from "zod";
import { TransactionStatus } from "@prisma/client";

export const createExpenseSchema = z.object({
  title: z.string().trim().min(1, "Título é obrigatório"),
  amount: z.number().positive("Valor deve ser maior que zero"),
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  dueDate: z.string().min(1, "Data de vencimento é obrigatória"),
  installments: z
    .number()
    .int()
    .min(1, "Número de parcelas deve ser no mínimo 1"),
  isFixed: z.boolean(),
  status: z.nativeEnum(TransactionStatus),
  description: z.string().optional(),
});

export const updateExpenseSchema = createExpenseSchema.extend({
  id: z.string().min(1, "ID é obrigatório"),
  paidAt: z.string().optional().nullable(),
});

export const markAsPaidSchema = z.object({
  id: z.string().min(1, "ID é obrigatório"),
  paidAt: z.string().optional(),
});

export const togglePaidSchema = z.object({
  id: z.string().min(1, "ID é obrigatório"),
  isPaid: z.boolean(),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
export type MarkAsPaidInput = z.infer<typeof markAsPaidSchema>;
export type TogglePaidInput = z.infer<typeof togglePaidSchema>;
