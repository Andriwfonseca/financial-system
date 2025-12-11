"use client";

import { Pencil, Trash2 } from "lucide-react";
import { CategoryType } from "@prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Skeleton } from "@/src/components/ui/skeleton";

import { useGetCategories } from "../api/use-get-categories";
import { useDeleteCategory } from "../api/use-delete-category";
import { useEditCategoryModal } from "../hooks/use-edit-category-modal";
import type { Category } from "@/src/lib/types";

export function CategoriesTable() {
  const { data: categories, isLoading } = useGetCategories();
  const { mutate: deleteCategory } = useDeleteCategory();
  const { open: openEditModal } = useEditCategoryModal();

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja deletar esta categoria?")) {
      deleteCategory(id);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Nenhuma categoria encontrada</p>
        <p className="text-sm mt-2">Crie sua primeira categoria para começar</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cor</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Data de Criação</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category: Category) => (
            <TableRow key={category.id}>
              <TableCell>
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
              </TableCell>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    category.type === CategoryType.INCOME
                      ? "default"
                      : "secondary"
                  }
                >
                  {category.type === CategoryType.INCOME ? "Receita" : "Despesa"}
                </Badge>
              </TableCell>
              <TableCell>
                {format(new Date(category.createdAt), "dd/MM/yyyy", {
                  locale: ptBR,
                })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => openEditModal(category.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

