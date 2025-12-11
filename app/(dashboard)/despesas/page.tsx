import { Suspense } from "react";
import { ExpensesPageClient } from "@/src/features/expenses/components/expenses-page-client";

export default function ExpensesPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ExpensesPageClient />
    </Suspense>
  );
}
