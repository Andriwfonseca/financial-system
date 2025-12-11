import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteIncome } from "../actions/income-actions";

export const useDeleteIncome = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteIncome(id);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      toast.success("Receita deletada com sucesso");
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao deletar receita");
    },
  });
};

