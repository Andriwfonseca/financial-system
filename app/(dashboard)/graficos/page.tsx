import { ChartsView } from "@/src/features/charts/components/charts-view";

export default function ChartsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gráficos e Relatórios</h1>
        <p className="text-muted-foreground">
          Visualize suas finanças através de gráficos detalhados
        </p>
      </div>

      <ChartsView />
    </div>
  );
}

