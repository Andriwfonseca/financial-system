import { z } from "zod";
import { TransactionStatus } from "@prisma/client";

export const createIncomeSchema = z.object({
  title: z.string().trim().min(1, "Título é obrigatório"),
  amount: z.number().positive("Valor deve ser maior que zero"),
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  receiveDate: z.string().min(1, "Data de recebimento é obrigatória"),
  status: z.nativeEnum(TransactionStatus),
  description: z.string().optional(),
});

export const updateIncomeSchema = createIncomeSchema.extend({
  id: z.string().min(1, "ID é obrigatório"),
  receivedAt: z.string().optional().nullable(),
});

export type CreateIncomeInput = z.infer<typeof createIncomeSchema>;
export type UpdateIncomeInput = z.infer<typeof updateIncomeSchema>;
