"use client";

import { useState } from "react";
import { Trash2, Check } from "lucide-react";
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
import { ConfirmDialog } from "@/src/components/confirm-dialog";

import { useGetIncomes } from "../api/use-get-incomes";
import { useDeleteIncome } from "../api/use-delete-income";
import { useMarkIncomeAsReceived } from "../api/use-mark-as-received";
import type { IncomeWithCategory } from "@/src/lib/types";

interface IncomesTableProps {
  statusFilter?: TransactionStatus | "all";
  categoryFilter?: string;
  monthFilter?: string;
}

export function IncomesTable({
  statusFilter = "all",
  categoryFilter = "all",
  monthFilter = "all",
}: IncomesTableProps) {
  const { data: incomes, isLoading } = useGetIncomes();
  const { mutate: deleteIncome, isPending: isDeleting } = useDeleteIncome();
  const { mutate: markAsReceived } = useMarkIncomeAsReceived();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [incomeToDelete, setIncomeToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const handleDeleteClick = (id: string, title: string) => {
    setIncomeToDelete({ id, title });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (incomeToDelete) {
      deleteIncome(incomeToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setIncomeToDelete(null);
        },
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Aplicar filtros
  const filteredIncomes = incomes?.filter((income) => {
    // Filtro de status
    if (statusFilter !== "all" && income.status !== statusFilter) {
      return false;
    }

    // Filtro de categoria
    if (categoryFilter !== "all" && income.categoryId !== categoryFilter) {
      return false;
    }

    // Filtro de mês
    if (monthFilter !== "all") {
      const incomeMonth = format(new Date(income.receiveDate), "yyyy-MM");
      if (incomeMonth !== monthFilter) {
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

  if (!filteredIncomes || filteredIncomes.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Nenhuma receita encontrada</p>
        <p className="text-sm mt-2">
          {incomes && incomes.length > 0
            ? "Nenhuma receita corresponde aos filtros selecionados"
            : "Crie sua primeira receita para começar"}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Data de Recebimento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredIncomes.map((income: IncomeWithCategory) => (
              <TableRow key={income.id}>
                <TableCell className="font-medium">{income.title}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: income.category.color }}
                    />
                    {income.category.name}
                  </div>
                </TableCell>
                <TableCell className="text-green-600 font-semibold">
                  {formatCurrency(income.amount)}
                </TableCell>
                <TableCell>
                  {format(new Date(income.receiveDate), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      income.status === TransactionStatus.PAID
                        ? "default"
                        : "secondary"
                    }
                  >
                    {income.status === TransactionStatus.PAID
                      ? "Recebido"
                      : "Pendente"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    {income.status !== TransactionStatus.PAID && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => markAsReceived(income.id)}
                        title="Marcar como recebido"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteClick(income.id, income.title)}
                      title="Excluir receita"
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

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Excluir Receita"
        description={
          incomeToDelete
            ? `Tem certeza que deseja excluir a receita "${incomeToDelete.title}"? Esta ação não pode ser desfeita.`
            : ""
        }
        confirmText="Excluir"
        cancelText="Cancelar"
        isLoading={isDeleting}
      />
    </>
  );
}
