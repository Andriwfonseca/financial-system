import { useQuery } from "@tanstack/react-query";
import { getExpenses } from "../actions/expense-actions";

export const useGetExpenses = () => {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: async () => {
      const result = await getExpenses();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });
};

