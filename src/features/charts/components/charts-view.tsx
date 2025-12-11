"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";

import {
  useExpensesByCategory,
  useIncomesByCategory,
  useMonthlyComparison,
  useFinancialEvolution,
} from "../hooks/use-charts-data";

export function ChartsView() {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(format(now, "yyyy-MM"));
  
  const [year, month] = selectedMonth.split("-").map(Number);

  const { data: expensesByCategory, isLoading: loadingExpenses } = useExpensesByCategory(year, month);
  const { data: incomesByCategory, isLoading: loadingIncomes } = useIncomesByCategory(year, month);
  const { data: monthlyComparison, isLoading: loadingComparison } = useMonthlyComparison();
  const { data: financialEvolution, isLoading: loadingEvolution } = useFinancialEvolution();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Filtro de Período */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Período para gráficos de pizza:</label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-3 py-2 border rounded-md bg-background"
        />
      </div>

      {/* Gráficos de Pizza */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Despesas por Categoria</CardTitle>
            <CardDescription>
              Distribuição das despesas no período selecionado
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingExpenses ? (
              <Skeleton className="h-[300px] w-full" />
            ) : expensesByCategory && expensesByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => entry.name}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Sem dados disponíveis
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Receitas por Categoria</CardTitle>
            <CardDescription>
              Distribuição das receitas no período selecionado
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingIncomes ? (
              <Skeleton className="h-[300px] w-full" />
            ) : incomesByCategory && incomesByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={incomesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => entry.name}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {incomesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Sem dados disponíveis
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Barras - Comparação Mensal */}
      <Card>
        <CardHeader>
          <CardTitle>Entrada × Saída Mensal</CardTitle>
          <CardDescription>
            Comparativo dos últimos 6 meses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingComparison ? (
            <Skeleton className="h-[400px] w-full" />
          ) : monthlyComparison && monthlyComparison.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={monthlyComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Bar dataKey="incomes" name="Receitas" fill="#10B981" />
                <Bar dataKey="expenses" name="Despesas" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              Sem dados disponíveis
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráfico de Linha - Evolução Financeira */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução Financeira</CardTitle>
          <CardDescription>
            Saldo acumulado nos últimos 6 meses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingEvolution ? (
            <Skeleton className="h-[400px] w-full" />
          ) : financialEvolution && financialEvolution.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={financialEvolution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="balance"
                  name="Saldo Acumulado"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              Sem dados disponíveis
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

