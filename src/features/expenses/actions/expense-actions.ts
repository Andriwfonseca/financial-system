"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/src/lib/prisma";
import { parseLocalDate } from "@/src/lib/utils";
import { TransactionStatus } from "@prisma/client";
import {
  createExpenseSchema,
  updateExpenseSchema,
  markAsPaidSchema,
  togglePaidSchema,
  type CreateExpenseInput,
  type UpdateExpenseInput,
  type MarkAsPaidInput,
  type TogglePaidInput,
} from "../schemas/expense-schema";

export async function createExpense(data: CreateExpenseInput) {
  try {
    const validated = createExpenseSchema.parse(data);

    const expense = await prisma.expense.create({
      data: {
        ...validated,
        dueDate: parseLocalDate(validated.dueDate),
      },
      include: {
        category: true,
      },
    });

    revalidatePath("/despesas");
    revalidatePath("/contas-mes");
    return { success: true, data: expense };
  } catch (error) {
    console.error("Erro ao criar despesa:", error);
    return { success: false, error: "Erro ao criar despesa" };
  }
}

export async function updateExpense(data: UpdateExpenseInput) {
  try {
    const validated = updateExpenseSchema.parse(data);
    const { id, paidAt, ...updateData } = validated;

    const expense = await prisma.expense.update({
      where: { id },
      data: {
        ...updateData,
        dueDate: parseLocalDate(updateData.dueDate),
        paidAt: paidAt ? parseLocalDate(paidAt) : null,
      },
      include: {
        category: true,
      },
    });

    revalidatePath("/despesas");
    revalidatePath("/contas-mes");
    return { success: true, data: expense };
  } catch (error) {
    console.error("Erro ao atualizar despesa:", error);
    return { success: false, error: "Erro ao atualizar despesa" };
  }
}

export async function deleteExpense(id: string) {
  try {
    await prisma.expense.delete({
      where: { id },
    });

    revalidatePath("/despesas");
    revalidatePath("/contas-mes");
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar despesa:", error);
    return { success: false, error: "Erro ao deletar despesa" };
  }
}

export async function markExpenseAsPaid(data: MarkAsPaidInput) {
  try {
    const validated = markAsPaidSchema.parse(data);

    const expense = await prisma.expense.update({
      where: { id: validated.id },
      data: {
        status: TransactionStatus.PAID,
        paidAt: validated.paidAt
          ? parseLocalDate(validated.paidAt)
          : new Date(),
      },
      include: {
        category: true,
      },
    });

    revalidatePath("/despesas");
    revalidatePath("/contas-mes");
    return { success: true, data: expense };
  } catch (error) {
    console.error("Erro ao marcar despesa como paga:", error);
    return { success: false, error: "Erro ao marcar despesa como paga" };
  }
}

export async function toggleExpensePaid(data: TogglePaidInput) {
  try {
    const validated = togglePaidSchema.parse(data);

    const expense = await prisma.expense.update({
      where: { id: validated.id },
      data: {
        status: validated.isPaid
          ? TransactionStatus.PAID
          : TransactionStatus.PENDING,
        paidAt: validated.isPaid ? new Date() : null,
      },
      include: {
        category: true,
      },
    });

    revalidatePath("/despesas");
    revalidatePath("/contas-mes");
    return { success: true, data: expense };
  } catch (error) {
    console.error("Erro ao alterar status da despesa:", error);
    return { success: false, error: "Erro ao alterar status da despesa" };
  }
}

export async function getExpenses() {
  try {
    const expenses = await prisma.expense.findMany({
      include: {
        category: true,
      },
      orderBy: { dueDate: "desc" },
    });

    return { success: true, data: expenses };
  } catch (error) {
    console.error("Erro ao buscar despesas:", error);
    return { success: false, error: "Erro ao buscar despesas", data: [] };
  }
}

export async function getExpenseById(id: string) {
  try {
    const expense = await prisma.expense.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!expense) {
      return { success: false, error: "Despesa não encontrada" };
    }

    return { success: true, data: expense };
  } catch (error) {
    console.error("Erro ao buscar despesa:", error);
    return { success: false, error: "Erro ao buscar despesa" };
  }
}

export async function getExpensesByMonth(year: number, month: number) {
  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const expenses = await prisma.expense.findMany({
      where: {
        dueDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: true,
      },
      orderBy: { dueDate: "asc" },
    });

    return { success: true, data: expenses };
  } catch (error) {
    console.error("Erro ao buscar despesas do mês:", error);
    return {
      success: false,
      error: "Erro ao buscar despesas do mês",
      data: [],
    };
  }
}
