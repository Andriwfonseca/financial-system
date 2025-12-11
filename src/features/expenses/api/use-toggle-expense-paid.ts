import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { toggleExpensePaid } from "../actions/expense-actions";
import type { TogglePaidInput } from "../schemas/expense-schema";

export const useToggleExpensePaid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TogglePaidInput) => {
      const result = await toggleExpensePaid(data);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (_, variables) => {
      toast.success(
        variables.isPaid
          ? "Despesa marcada como paga"
          : "Despesa marcada como pendente"
      );
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao alterar status da despesa");
    },
  });
};
