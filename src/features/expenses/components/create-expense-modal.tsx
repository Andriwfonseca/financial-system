"use client";

import { ResponsiveModal } from "@/src/components/responsive-modal";
import { useCreateExpenseModal } from "../hooks/use-create-expense-modal";
import { useCreateExpense } from "../api/use-create-expense";
import { ExpenseForm } from "./expense-form";
import { CreateExpenseInput } from "../schemas/expense-schema";

export function CreateExpenseModal() {
  const { isOpen, close, setIsOpen } = useCreateExpenseModal();
  const { mutate, isPending } = useCreateExpense();

  const handleSubmit = (data: CreateExpenseInput) => {
    mutate(data, {
      onSuccess: () => {
        close();
      },
    });
  };

  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Nova Despesa"
    >
      <div className="space-y-4">
        <div className="px-6 pt-6">
          <h2 className="text-xl font-semibold">Nova Despesa</h2>
          <p className="text-sm text-muted-foreground">
            Registre uma nova despesa
          </p>
        </div>
        <ExpenseForm
          onSubmit={handleSubmit}
          onCancel={close}
          isLoading={isPending}
        />
      </div>
    </ResponsiveModal>
  );
}
