import { useQueryState } from "nuqs";

export const useEditExpenseModal = () => {
  const [expenseId, setExpenseId] = useQueryState("edit-expense");

  const open = (id: string) => setExpenseId(id);
  const close = () => setExpenseId(null);

  return {
    expenseId,
    isOpen: !!expenseId,
    open,
    close,
    setExpenseId,
  };
};

