import { Suspense } from "react";
import { CategoriesPageClient } from "@/src/features/categories/components/categories-page-client";

export default function CategoriesPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <CategoriesPageClient />
    </Suspense>
  );
}
