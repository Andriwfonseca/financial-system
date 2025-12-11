"use client";

import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TransactionStatus } from "@prisma/client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Switch } from "@/src/components/ui/switch";

import { useGetExpenses } from "../api/use-get-expenses";
import { useDeleteExpense } from "../api/use-delete-expense";
import { useToggleExpensePaid } from "../api/use-toggle-expense-paid";
import { useEditExpenseModal } from "../hooks/use-edit-expense-modal";
import type { ExpenseWithCategory } from "@/src/lib/types";

interface ExpensesTableProps {
  statusFilter?: TransactionStatus | "all";
  isFixedFilter?: boolean | "all";
  categoryFilter?: string;
  monthFilter?: string;
}

export function ExpensesTable({
  statusFilter = "all",
  isFixedFilter = "all",
  categoryFilter = "all",
  monthFilter = "all",
}: ExpensesTableProps) {
  const { data: expenses, isLoading } = useGetExpenses();
  const { mutate: deleteExpense } = useDeleteExpense();
  const { mutate: togglePaid } = useToggleExpensePaid();
  const { open: openEditModal } = useEditExpenseModal();

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja deletar esta despesa?")) {
      deleteExpense(id);
    }
  };

  const handleTogglePaid = (id: string, currentStatus: TransactionStatus) => {
    const isPaid = currentStatus !== TransactionStatus.PAID;
    togglePaid({ id, isPaid });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Aplicar filtros
  const filteredExpenses = expenses?.filter((expense) => {
    // Filtro de status
    if (statusFilter !== "all" && expense.status !== statusFilter) {
      return false;
    }

    // Filtro de conta fixa
    if (isFixedFilter !== "all" && expense.isFixed !== isFixedFilter) {
      return false;
    }

    // Filtro de categoria
    if (categoryFilter !== "all" && expense.categoryId !== categoryFilter) {
      return false;
    }

    // Filtro de mês
    if (monthFilter !== "all") {
      const expenseMonth = format(new Date(expense.dueDate), "yyyy-MM");
      if (expenseMonth !== monthFilter) {
        return false;
      }
    }

    return true;
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!filteredExpenses || filteredExpenses.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Nenhuma despesa encontrada</p>
        <p className="text-sm mt-2">
          {expenses && expenses.length > 0
            ? "Nenhuma despesa corresponde aos filtros selecionados"
            : "Crie sua primeira despesa para começar"}
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Pago</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Parcelas</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredExpenses.map((expense: ExpenseWithCategory) => (
            <TableRow key={expense.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={expense.status === TransactionStatus.PAID}
                    onCheckedChange={() =>
                      handleTogglePaid(expense.id, expense.status)
                    }
                    id={`expense-paid-${expense.id}`}
                    title={
                      expense.status === TransactionStatus.PAID
                        ? "Marcar como pendente"
                        : "Marcar como pago"
                    }
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium">
                {expense.title}
                {expense.isFixed && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    Fixa
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: expense.category.color }}
                  />
                  {expense.category.name}
                </div>
              </TableCell>
              <TableCell>{formatCurrency(expense.amount)}</TableCell>
              <TableCell>
                {format(new Date(expense.dueDate), "dd/MM/yyyy", {
                  locale: ptBR,
                })}
              </TableCell>
              <TableCell>{expense.installments}x</TableCell>
              <TableCell>
                <Badge
                  variant={
                    expense.status === TransactionStatus.PAID
                      ? "default"
                      : expense.status === TransactionStatus.OVERDUE
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {expense.status === TransactionStatus.PAID && "Pago"}
                  {expense.status === TransactionStatus.PENDING && "Pendente"}
                  {expense.status === TransactionStatus.OVERDUE && "Vencido"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => openEditModal(expense.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(expense.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
