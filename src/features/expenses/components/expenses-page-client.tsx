"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { TransactionStatus } from "@prisma/client";

import { Button } from "@/src/components/ui/button";
import { ExpensesTable } from "./expenses-table";
import { ExpensesFilters } from "./expenses-filters";
import { CreateExpenseModal } from "./create-expense-modal";
import { EditExpenseModal } from "./edit-expense-modal";
import { useCreateExpenseModal } from "../hooks/use-create-expense-modal";

export function ExpensesPageClient() {
  const { open } = useCreateExpenseModal();
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | "all">(
    "all"
  );
  const [isFixedFilter, setIsFixedFilter] = useState<boolean | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [monthFilter, setMonthFilter] = useState<string>("all");

  const handleClearFilters = () => {
    setStatusFilter("all");
    setIsFixedFilter("all");
    setCategoryFilter("all");
    setMonthFilter("all");
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Despesas</h1>
          <p className="text-muted-foreground">
            Gerencie todas as suas despesas e contas
          </p>
        </div>
        <Button onClick={open}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Despesa
        </Button>
      </div>

      <ExpensesFilters
        statusFilter={statusFilter}
        isFixedFilter={isFixedFilter}
        categoryFilter={categoryFilter}
        monthFilter={monthFilter}
        onStatusChange={setStatusFilter}
        onIsFixedChange={setIsFixedFilter}
        onCategoryChange={setCategoryFilter}
        onMonthChange={setMonthFilter}
        onClearFilters={handleClearFilters}
      />

      <ExpensesTable
        statusFilter={statusFilter}
        isFixedFilter={isFixedFilter}
        categoryFilter={categoryFilter}
        monthFilter={monthFilter}
      />
      <CreateExpenseModal />
      <EditExpenseModal />
    </>
  );
}
