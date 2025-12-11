"use client";

import { useEffect } from "react";
import { format } from "date-fns";
import { ResponsiveModal } from "@/src/components/responsive-modal";
import { useEditExpenseModal } from "../hooks/use-edit-expense-modal";
import { useUpdateExpense } from "../api/use-update-expense";
import { useGetExpenses } from "../api/use-get-expenses";
import { ExpenseForm } from "./expense-form";
import { Skeleton } from "@/src/components/ui/skeleton";

export function EditExpenseModal() {
  const { expenseId, isOpen, close, setExpenseId } = useEditExpenseModal();
  const { mutate, isPending } = useUpdateExpense();
  const { data: expenses } = useGetExpenses();

  const expense = expenses?.find((e) => e.id === expenseId);

  const handleSubmit = (data: any) => {
    if (!expenseId) return;

    mutate(
      { ...data, id: expenseId },
      {
        onSuccess: () => {
          close();
        },
      }
    );
  };

  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={setExpenseId}
      title="Editar Despesa"
    >
      <div className="space-y-4">
        <div className="px-6 pt-6">
          <h2 className="text-xl font-semibold">Editar Despesa</h2>
          <p className="text-sm text-muted-foreground">
            Atualize os dados da despesa
          </p>
        </div>

        {!expense ? (
          <div className="px-6 pb-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <ExpenseForm
            onSubmit={handleSubmit}
            onCancel={close}
            defaultValues={{
              title: expense.title,
              amount: expense.amount,
              categoryId: expense.categoryId,
              dueDate: format(new Date(expense.dueDate), "yyyy-MM-dd"),
              installments: expense.installments,
              isFixed: expense.isFixed,
              status: expense.status,
              description: expense.description || "",
            }}
            isLoading={isPending}
          />
        )}
      </div>
    </ResponsiveModal>
  );
}
