import { useQuery } from "@tanstack/react-query";
import {
  getExpensesByCategory,
  getIncomesByCategory,
  getMonthlyComparison,
  getFinancialEvolution,
} from "../actions/charts-actions";

export const useExpensesByCategory = (year: number, month: number) => {
  return useQuery({
    queryKey: ["expenses-by-category", year, month],
    queryFn: async () => {
      const result = await getExpensesByCategory(year, month);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });
};

export const useIncomesByCategory = (year: number, month: number) => {
  return useQuery({
    queryKey: ["incomes-by-category", year, month],
    queryFn: async () => {
      const result = await getIncomesByCategory(year, month);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });
};

export const useMonthlyComparison = () => {
  return useQuery({
    queryKey: ["monthly-comparison"],
    queryFn: async () => {
      const result = await getMonthlyComparison();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });
};

export const useFinancialEvolution = () => {
  return useQuery({
    queryKey: ["financial-evolution"],
    queryFn: async () => {
      const result = await getFinancialEvolution();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });
};

