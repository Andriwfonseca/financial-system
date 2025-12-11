"use client";

import { Plus } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { CategoriesTable } from "./categories-table";
import { CreateCategoryModal } from "./create-category-modal";
import { EditCategoryModal } from "./edit-category-modal";
import { useCreateCategoryModal } from "../hooks/use-create-category-modal";

export function CategoriesPageClient() {
  const { open } = useCreateCategoryModal();

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categorias</h1>
          <p className="text-muted-foreground">
            Gerencie as categorias de receitas e despesas
          </p>
        </div>
        <Button onClick={open}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      <CategoriesTable />
      <CreateCategoryModal />
      <EditCategoryModal />
    </>
  );
}

