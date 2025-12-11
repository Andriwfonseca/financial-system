"use server";

import { prisma } from "@/src/lib/prisma";
import { TransactionStatus } from "@prisma/client";
import { startOfMonth, endOfMonth, startOfDay, endOfDay, subMonths } from "date-fns";

export async function getDashboardSummary() {
  try {
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);
    const previousMonthStart = startOfMonth(subMonths(now, 1));
    const previousMonthEnd = endOfMonth(subMonths(now, 1));

    // Despesas do mês atual
    const currentExpenses = await prisma.expense.findMany({
      where: {
        dueDate: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
      },
    });

    // Receitas do mês atual
    const currentIncomes = await prisma.income.findMany({
      where: {
        receiveDate: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
      },
    });

    // Despesas do mês anterior
    const previousExpenses = await prisma.expense.findMany({
      where: {
        dueDate: {
          gte: previousMonthStart,
          lte: previousMonthEnd,
        },
      },
    });

    // Receitas do mês anterior
    const previousIncomes = await prisma.income.findMany({
      where: {
        receiveDate: {
          gte: previousMonthStart,
          lte: previousMonthEnd,
        },
      },
    });

    // Cálculos mês atual
    const totalExpenses = currentExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalIncomes = currentIncomes.reduce((sum, inc) => sum + inc.amount, 0);
    const paidExpenses = currentExpenses
      .filter((exp) => exp.status === TransactionStatus.PAID)
      .reduce((sum, exp) => sum + exp.amount, 0);
    const pendingExpenses = currentExpenses
      .filter((exp) => exp.status === TransactionStatus.PENDING)
      .reduce((sum, exp) => sum + exp.amount, 0);

    // Cálculos mês anterior
    const previousTotalExpenses = previousExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const previousTotalIncomes = previousIncomes.reduce((sum, inc) => sum + inc.amount, 0);

    // Comparativos
    const expensesComparison =
      previousTotalExpenses > 0
        ? ((totalExpenses - previousTotalExpenses) / previousTotalExpenses) * 100
        : 0;

    const incomesComparison =
      previousTotalIncomes > 0
        ? ((totalIncomes - previousTotalIncomes) / previousTotalIncomes) * 100
        : 0;

    const balance = totalIncomes - totalExpenses;
    const previousBalance = previousTotalIncomes - previousTotalExpenses;
    const balanceComparison =
      previousBalance !== 0 ? ((balance - previousBalance) / Math.abs(previousBalance)) * 100 : 0;

    return {
      success: true,
      data: {
        totalExpenses,
        totalIncomes,
        paidExpenses,
        pendingExpenses,
        balance,
        expensesComparison,
        incomesComparison,
        balanceComparison,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar resumo do dashboard:", error);
    return {
      success: false,
      error: "Erro ao buscar resumo do dashboard",
    };
  }
}

export async function getRecentTransactions() {
  try {
    const expenses = await prisma.expense.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });

    const incomes = await prisma.income.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });

    return {
      success: true,
      data: { expenses, incomes },
    };
  } catch (error) {
    console.error("Erro ao buscar transações recentes:", error);
    return {
      success: false,
      error: "Erro ao buscar transações recentes",
      data: { expenses: [], incomes: [] },
    };
  }
}

