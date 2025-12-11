import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createExpense } from "../actions/expense-actions";
import type { CreateExpenseInput } from "../schemas/expense-schema";

export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateExpenseInput) => {
      const result = await createExpense(data);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success("Despesa criada com sucesso");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao criar despesa");
    },
  });
};

