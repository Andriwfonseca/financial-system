"use client";

import { useEffect, useState } from "react";
import { ResponsiveModal } from "@/src/components/responsive-modal";
import { useEditCategoryModal } from "../hooks/use-edit-category-modal";
import { useUpdateCategory } from "../api/use-update-category";
import { getCategoryById } from "../actions/category-actions";
import { CategoryForm } from "./category-form";
import type { Category } from "@/src/lib/types";

export function EditCategoryModal() {
  const { isOpen, close, categoryId, setCategoryId } = useEditCategoryModal();
  const { mutate, isPending } = useUpdateCategory();
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (categoryId) {
      setIsLoading(true);
      getCategoryById(categoryId).then((result) => {
        if (result.success && result.data) {
          setCategory(result.data);
        }
        setIsLoading(false);
      });
    }
  }, [categoryId]);

  const handleSubmit = (data: any) => {
    if (!categoryId) return;

    mutate(
      { ...data, id: categoryId },
      {
        onSuccess: () => {
          close();
          setCategory(null);
        },
      }
    );
  };

  return (
    <ResponsiveModal open={isOpen} onOpenChange={(open) => !open && setCategoryId(null)}>
      <div className="space-y-4">
        <div className="px-6 pt-6">
          <h2 className="text-xl font-semibold">Editar Categoria</h2>
          <p className="text-sm text-muted-foreground">
            Atualize as informações da categoria
          </p>
        </div>
        {isLoading ? (
          <div className="p-6">Carregando...</div>
        ) : category ? (
          <CategoryForm
            onSubmit={handleSubmit}
            onCancel={close}
            defaultValues={category}
            isLoading={isPending}
          />
        ) : null}
      </div>
    </ResponsiveModal>
  );
}

