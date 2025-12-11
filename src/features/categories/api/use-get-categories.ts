import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../actions/category-actions";

export const useGetCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const result = await getCategories();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });
};

