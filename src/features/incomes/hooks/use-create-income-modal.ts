import { useQueryState, parseAsBoolean } from "nuqs";

export const useCreateIncomeModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "create-income",
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

