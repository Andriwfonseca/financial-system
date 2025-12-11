import { DashboardSummary } from "@/src/features/dashboard/components/dashboard-summary";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral das suas finanças
        </p>
      </div>

      <DashboardSummary />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bem-vindo!</CardTitle>
            <CardDescription>
              Sistema completo de gestão financeira
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Use o menu acima para navegar entre as diferentes seções do sistema.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>✓ Gerencie suas categorias de receitas e despesas</li>
              <li>✓ Registre e acompanhe todas as suas transações</li>
              <li>✓ Visualize relatórios e gráficos detalhados</li>
              <li>✓ Controle as contas do mês com filtros avançados</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Acesse as principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <a
                href="/categorias"
                className="block p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <div className="font-medium">Gerenciar Categorias</div>
                <div className="text-muted-foreground">
                  Organize suas finanças com categorias personalizadas
                </div>
              </a>
              <a
                href="/despesas"
                className="block p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <div className="font-medium">Adicionar Despesa</div>
                <div className="text-muted-foreground">
                  Registre uma nova despesa ou conta a pagar
                </div>
              </a>
              <a
                href="/receitas"
                className="block p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <div className="font-medium">Adicionar Receita</div>
                <div className="text-muted-foreground">
                  Registre uma nova receita ou ganho
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

