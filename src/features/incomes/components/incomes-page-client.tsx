"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { TransactionStatus } from "@prisma/client";

import { Button } from "@/src/components/ui/button";
import { IncomesTable } from "./incomes-table";
import { IncomesFilters } from "./incomes-filters";
import { CreateIncomeModal } from "./create-income-modal";
import { useCreateIncomeModal } from "../hooks/use-create-income-modal";

export function IncomesPageClient() {
  const { open } = useCreateIncomeModal();
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | "all">(
    "all"
  );
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [monthFilter, setMonthFilter] = useState<string>("all");

  const handleClearFilters = () => {
    setStatusFilter("all");
    setCategoryFilter("all");
    setMonthFilter("all");
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Receitas</h1>
          <p className="text-muted-foreground">
            Gerencie todas as suas receitas e ganhos
          </p>
        </div>
        <Button onClick={open}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Receita
        </Button>
      </div>

      <IncomesFilters
        statusFilter={statusFilter}
        categoryFilter={categoryFilter}
        monthFilter={monthFilter}
        onStatusChange={setStatusFilter}
        onCategoryChange={setCategoryFilter}
        onMonthChange={setMonthFilter}
        onClearFilters={handleClearFilters}
      />

      <IncomesTable
        statusFilter={statusFilter}
        categoryFilter={categoryFilter}
        monthFilter={monthFilter}
      />
      <CreateIncomeModal />
    </>
  );
}
