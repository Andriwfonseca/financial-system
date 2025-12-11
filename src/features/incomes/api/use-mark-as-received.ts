import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { markIncomeAsReceived } from "../actions/income-actions";

export const useMarkIncomeAsReceived = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await markIncomeAsReceived(id);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      toast.success("Receita marcada como recebida");
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao marcar receita como recebida");
    },
  });
};

