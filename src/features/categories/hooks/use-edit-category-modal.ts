import { useQueryState } from "nuqs";

export const useEditCategoryModal = () => {
  const [categoryId, setCategoryId] = useQueryState("edit-category");

  const open = (id: string) => setCategoryId(id);
  const close = () => setCategoryId(null);

  return {
    categoryId,
    isOpen: !!categoryId,
    open,
    close,
    setCategoryId,
  };
};

