import { z } from "zod";
import { TransactionStatus } from "@prisma/client";

export const createIncomeSchema = z.object({
  title: z.string().trim().min(1, "Título é obrigatório"),
  amount: z.coerce.number().positive("Valor deve ser maior que zero"),
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  receiveDate: z.string().min(1, "Data de recebimento é obrigatória"),
  status: z.nativeEnum(TransactionStatus),
  description: z.string().optional(),
});

export const updateIncomeSchema = createIncomeSchema.extend({
  id: z.string().min(1, "ID é obrigatório"),
  receivedAt: z.string().optional().nullable(),
});

// Tipo para os valores de saída do schema (após validação e coerção)
export type CreateIncomeInput = z.output<typeof createIncomeSchema>;
export type UpdateIncomeInput = z.output<typeof updateIncomeSchema>;

// Tipo para os valores de entrada do formulário (antes da coerção)
export type CreateIncomeFormInput = z.input<typeof createIncomeSchema>;
