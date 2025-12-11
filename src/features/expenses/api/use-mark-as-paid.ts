import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { markExpenseAsPaid } from "../actions/expense-actions";
import type { MarkAsPaidInput } from "../schemas/expense-schema";

export const useMarkExpenseAsPaid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: MarkAsPaidInput) => {
      const result = await markExpenseAsPaid(data);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success("Despesa marcada como paga");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao marcar despesa como paga");
    },
  });
};

