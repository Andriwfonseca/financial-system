import { useQueryState, parseAsBoolean } from "nuqs";

export const useCreateExpenseModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "create-expense",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return {
    isOpen: !!isOpen,
    open,
    close,
    setIsOpen,
  };
};

