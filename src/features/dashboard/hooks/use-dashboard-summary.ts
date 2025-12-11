import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "../actions/dashboard-actions";

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: async () => {
      const result = await getDashboardSummary();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });
};

