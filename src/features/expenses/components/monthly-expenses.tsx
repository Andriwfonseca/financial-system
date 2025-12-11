"use client";

import { useState } from "react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TransactionStatus, CategoryType } from "@prisma/client";
import { Calendar as CalendarIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Switch } from "@/src/components/ui/switch";

import { useGetExpenses } from "../api/use-get-expenses";
import { useGetIncomes } from "@/src/features/incomes/api/use-get-incomes";
import { useGetCategories } from "@/src/features/categories/api/use-get-categories";
import { useToggleExpensePaid } from "../api/use-toggle-expense-paid";
import type { ExpenseWithCategory } from "@/src/lib/types";

export function MonthlyExpenses() {
  const [selectedMonth, setSelectedMonth] = useState(
    format(new Date(), "yyyy-MM")
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isFixedFilter, setIsFixedFilter] = useState<string>("all");

  const { data: expenses, isLoading: expensesLoading } = useGetExpenses();
  const { data: incomes } = useGetIncomes();
  const { data: categories } = useGetCategories();
  const { mutate: togglePaid } = useToggleExpensePaid();

  const expenseCategories = categories?.filter(
    (cat) => cat.type === CategoryType.EXPENSE
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Função para verificar se a despesa pertence ao mês selecionado
  const expenseBelongsToMonth = (expense: any, selectedMonth: string) => {
    const dueDate = new Date(expense.dueDate);
    const [selectedYear, selectedMonthNum] = selectedMonth
      .split("-")
      .map(Number);

    // Se não tem parcelas, usa a lógica normal
    if (expense.installments <= 1) {
      const expenseMonth = format(dueDate, "yyyy-MM");
      return expenseMonth === selectedMonth;
    }

    // Para despesas parceladas, calcular o range de meses
    const startYear = dueDate.getFullYear();
    const startMonth = dueDate.getMonth(); // 0-11

    // Calcular o mês final das parcelas
    let endMonth = startMonth + expense.installments - 1;
    let endYear = startYear;

    while (endMonth > 11) {
      endMonth -= 12;
      endYear += 1;
    }

    // Verificar se o mês selecionado está dentro do range
    const selectedDate = new Date(selectedYear, selectedMonthNum - 1, 1);
    const startDate = new Date(startYear, startMonth, 1);
    const endDate = new Date(endYear, endMonth, 1);

    return selectedDate >= startDate && selectedDate <= endDate;
  };

  // Filtrar despesas do mês selecionado
  const monthlyExpenses = expenses?.filter((expense) => {
    const matchesMonth = expenseBelongsToMonth(expense, selectedMonth);
    const matchesCategory =
      selectedCategory === "all" || expense.categoryId === selectedCategory;
    const matchesFixed =
      isFixedFilter === "all" ||
      (isFixedFilter === "true" && expense.isFixed) ||
      (isFixedFilter === "false" && !expense.isFixed);
    return matchesMonth && matchesCategory && matchesFixed;
  });

  // Separar por status
  const overdueExpenses = monthlyExpenses?.filter(
    (exp) =>
      exp.status === TransactionStatus.OVERDUE ||
      (exp.status === TransactionStatus.PENDING &&
        new Date(exp.dueDate) < new Date())
  );

  const pendingExpenses = monthlyExpenses?.filter(
    (exp) =>
      exp.status === TransactionStatus.PENDING &&
      new Date(exp.dueDate) >= new Date()
  );

  const paidExpenses = monthlyExpenses?.filter(
    (exp) => exp.status === TransactionStatus.PAID
  );

  // Calcular totais (considerando o valor da parcela)
  const calculateInstallmentAmount = (expense: any) => {
    return expense.installments > 1
      ? expense.amount / expense.installments
      : expense.amount;
  };

  const totalMonth =
    monthlyExpenses?.reduce(
      (sum, exp) => sum + calculateInstallmentAmount(exp),
      0
    ) || 0;
  const totalPending =
    pendingExpenses?.reduce(
      (sum, exp) => sum + calculateInstallmentAmount(exp),
      0
    ) || 0;
  const totalPaid =
    paidExpenses?.reduce(
      (sum, exp) => sum + calculateInstallmentAmount(exp),
      0
    ) || 0;
  const totalOverdue =
    overdueExpenses?.reduce(
      (sum, exp) => sum + calculateInstallmentAmount(exp),
      0
    ) || 0;

  // Calcular receitas do mês
  const monthlyIncomes = incomes?.filter((income) => {
    const incomeMonth = format(new Date(income.receiveDate), "yyyy-MM");
    return incomeMonth === selectedMonth;
  });

  const totalIncomesReceived =
    monthlyIncomes
      ?.filter((inc) => inc.status === TransactionStatus.PAID)
      .reduce((sum, inc) => sum + inc.amount, 0) || 0;

  const handleTogglePaid = (id: string, currentStatus: TransactionStatus) => {
    const isPaid = currentStatus !== TransactionStatus.PAID;
    togglePaid({ id, isPaid });
  };

  // Função para calcular qual parcela está sendo exibida no mês selecionado
  const getCurrentInstallmentNumber = (expense: any, selectedMonth: string) => {
    const dueDate = new Date(expense.dueDate);
    const [selectedYear, selectedMonthNum] = selectedMonth
      .split("-")
      .map(Number);
    const selectedDate = new Date(selectedYear, selectedMonthNum - 1, 1);

    const startYear = dueDate.getFullYear();
    const startMonth = dueDate.getMonth();
    const startDate = new Date(startYear, startMonth, 1);

    const monthsDiff =
      (selectedDate.getFullYear() - startDate.getFullYear()) * 12 +
      (selectedDate.getMonth() - startDate.getMonth());

    return monthsDiff + 1; // Parcela atual (1-indexed)
  };

  const ExpensesList = ({
    expenses,
  }: {
    expenses: ExpenseWithCategory[] | undefined;
  }) => {
    if (!expenses || expenses.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          Nenhuma despesa encontrada
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {expenses.map((expense) => {
          const installmentAmount = calculateInstallmentAmount(expense);
          const currentInstallment =
            expense.installments > 1
              ? getCurrentInstallmentNumber(expense, selectedMonth)
              : null;

          return (
            <div
              key={expense.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={expense.status === TransactionStatus.PAID}
                    onCheckedChange={() =>
                      handleTogglePaid(expense.id, expense.status)
                    }
                    id={`switch-${expense.id}`}
                  />
                  <label
                    htmlFor={`switch-${expense.id}`}
                    className="text-xs text-muted-foreground cursor-pointer select-none"
                  >
                    Pago
                  </label>
                </div>
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: expense.category.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{expense.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {expense.category.name} •{" "}
                    {format(new Date(expense.dueDate), "dd/MM/yyyy", {
                      locale: ptBR,
                    })}
                    {currentInstallment && (
                      <span className="ml-2">
                        • Parcela {currentInstallment}/{expense.installments}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">
                  {formatCurrency(installmentAmount)}
                </div>
                {expense.installments > 1 && (
                  <div className="text-xs text-muted-foreground">
                    {expense.installments}x de{" "}
                    {formatCurrency(installmentAmount)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (expensesLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Mês</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-background"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Categoria</label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {expenseCategories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">
            Tipo de Conta
          </label>
          <Select value={isFixedFilter} onValueChange={setIsFixedFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="true">Contas Fixas</SelectItem>
              <SelectItem value="false">Contas Variáveis</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Receitas Recebidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalIncomesReceived)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Despesas do Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalMonth)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Vencidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalOverdue)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pendente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(totalPending)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pagas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalPaid)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs com Listagens */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            Todas ({monthlyExpenses?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="overdue">
            Vencidas ({overdueExpenses?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="pending">
            A Vencer ({pendingExpenses?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="paid">
            Pagas ({paidExpenses?.length || 0})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <ExpensesList expenses={monthlyExpenses} />
        </TabsContent>
        <TabsContent value="overdue" className="mt-6">
          <ExpensesList expenses={overdueExpenses} />
        </TabsContent>
        <TabsContent value="pending" className="mt-6">
          <ExpensesList expenses={pendingExpenses} />
        </TabsContent>
        <TabsContent value="paid" className="mt-6">
          <ExpensesList expenses={paidExpenses} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
