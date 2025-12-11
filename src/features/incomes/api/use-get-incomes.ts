import { useQuery } from "@tanstack/react-query";
import { getIncomes } from "../actions/income-actions";

export const useGetIncomes = () => {
  return useQuery({
    queryKey: ["incomes"],
    queryFn: async () => {
      const result = await getIncomes();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });
};

