"use client";

import { ResponsiveModal } from "@/src/components/responsive-modal";
import { useCreateIncomeModal } from "../hooks/use-create-income-modal";
import { useCreateIncome } from "../api/use-create-income";
import { IncomeForm } from "./income-form";

export function CreateIncomeModal() {
  const { isOpen, close, setIsOpen } = useCreateIncomeModal();
  const { mutate, isPending } = useCreateIncome();

  const handleSubmit = (data: any) => {
    mutate(data, {
      onSuccess: () => {
        close();
      },
    });
  };

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <div className="space-y-4">
        <div className="px-6 pt-6">
          <h2 className="text-xl font-semibold">Nova Receita</h2>
          <p className="text-sm text-muted-foreground">
            Registre uma nova receita
          </p>
        </div>
        <IncomeForm onSubmit={handleSubmit} onCancel={close} isLoading={isPending} />
      </div>
    </ResponsiveModal>
  );
}

