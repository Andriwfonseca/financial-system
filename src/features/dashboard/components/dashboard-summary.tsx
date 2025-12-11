"use client";

import { DollarSign, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { Skeleton } from "@/src/components/ui/skeleton";
import { SummaryCard } from "./summary-card";
import { useDashboardSummary } from "../hooks/use-dashboard-summary";

export function DashboardSummary() {
  const { data, isLoading } = useDashboardSummary();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <SummaryCard
        title="Receitas do Mês"
        value={formatCurrency(data.totalIncomes)}
        icon={TrendingUp}
        iconColor="text-green-600"
        trend={data.incomesComparison}
      />
      <SummaryCard
        title="Despesas do Mês"
        value={formatCurrency(data.totalExpenses)}
        icon={TrendingDown}
        iconColor="text-red-600"
        trend={data.expensesComparison}
      />
      <SummaryCard
        title="Total Pendente"
        value={formatCurrency(data.pendingExpenses)}
        icon={Wallet}
        iconColor="text-orange-600"
      />
      <SummaryCard
        title="Saldo do Mês"
        value={formatCurrency(data.balance)}
        icon={DollarSign}
        iconColor={data.balance >= 0 ? "text-green-600" : "text-red-600"}
        trend={data.balanceComparison}
      />
    </div>
  );
}

