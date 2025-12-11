import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createIncome } from "../actions/income-actions";
import type { CreateIncomeInput } from "../schemas/income-schema";

export const useCreateIncome = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateIncomeInput) => {
      const result = await createIncome(data);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      toast.success("Receita criada com sucesso");
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao criar receita");
    },
  });
};

