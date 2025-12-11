import { Suspense } from "react";
import { MonthlyExpenses } from "@/src/features/expenses/components/monthly-expenses";

export default function MonthlyExpensesPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contas do Mês</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie as despesas do mês selecionado
          </p>
        </div>

        <MonthlyExpenses />
      </div>
    </Suspense>
  );
}
