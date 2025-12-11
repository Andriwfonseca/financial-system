"use client";

import { TransactionStatus, CategoryType } from "@prisma/client";
import { Filter, X } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";

import { useGetCategories } from "@/src/features/categories/api/use-get-categories";

interface IncomesFiltersProps {
  statusFilter: TransactionStatus | "all";
  categoryFilter: string;
  monthFilter: string;
  onStatusChange: (value: TransactionStatus | "all") => void;
  onCategoryChange: (value: string) => void;
  onMonthChange: (value: string) => void;
  onClearFilters: () => void;
}

export function IncomesFilters({
  statusFilter,
  categoryFilter,
  monthFilter,
  onStatusChange,
  onCategoryChange,
  onMonthChange,
  onClearFilters,
}: IncomesFiltersProps) {
  const { data: categories } = useGetCategories();

  const incomeCategories = categories?.filter(
    (cat) => cat.type === CategoryType.INCOME
  );

  const hasActiveFilters =
    statusFilter !== "all" || categoryFilter !== "all" || monthFilter !== "all";

  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-4 w-4" />
        <h3 className="font-semibold">Filtros</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="ml-auto"
          >
            <X className="h-4 w-4 mr-1" />
            Limpar filtros
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Filtro de Status */}
        <div>
          <label className="text-sm font-medium mb-2 block">Status</label>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              onStatusChange(value as TransactionStatus | "all")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value={TransactionStatus.PENDING}>
                Pendente
              </SelectItem>
              <SelectItem value={TransactionStatus.PAID}>Recebido</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filtro de Categoria */}
        <div>
          <label className="text-sm font-medium mb-2 block">Categoria</label>
          <Select value={categoryFilter} onValueChange={onCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {incomeCategories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    {category.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtro de Mês */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Mês de Recebimento
          </label>
          <input
            type="month"
            value={monthFilter === "all" ? "" : monthFilter}
            onChange={(e) => onMonthChange(e.target.value || "all")}
            className="w-full px-3 py-2 text-sm border rounded-md bg-background"
          />
        </div>
      </div>
    </Card>
  );
}
