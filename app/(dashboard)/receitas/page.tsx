import { Suspense } from "react";
import { IncomesPageClient } from "@/src/features/incomes/components/incomes-page-client";

export default function IncomesPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <IncomesPageClient />
    </Suspense>
  );
}
