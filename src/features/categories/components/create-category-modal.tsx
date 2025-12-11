"use client";

import { ResponsiveModal } from "@/src/components/responsive-modal";
import { useCreateCategoryModal } from "../hooks/use-create-category-modal";
import { useCreateCategory } from "../api/use-create-category";
import { CategoryForm } from "./category-form";

export function CreateCategoryModal() {
  const { isOpen, close, setIsOpen } = useCreateCategoryModal();
  const { mutate, isPending } = useCreateCategory();

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
          <h2 className="text-xl font-semibold">Nova Categoria</h2>
          <p className="text-sm text-muted-foreground">
            Crie uma nova categoria para organizar suas finanças
          </p>
        </div>
        <CategoryForm
          onSubmit={handleSubmit}
          onCancel={close}
          isLoading={isPending}
        />
      </div>
    </ResponsiveModal>
  );
}

