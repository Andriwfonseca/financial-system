import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateExpense } from "../actions/expense-actions";
import type { UpdateExpenseInput } from "../schemas/expense-schema";

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateExpenseInput) => {
      const result = await updateExpense(data);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success("Despesa atualizada com sucesso");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao atualizar despesa");
    },
  });
};

