"use server";

import { prisma } from "@/src/lib/prisma";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CategoryType } from "@prisma/client";

export async function getExpensesByCategory(year: number, month: number) {
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
    });

    // Agrupar por categoria
    const byCategory = expenses.reduce((acc, expense) => {
      const categoryName = expense.category.name;
      if (!acc[categoryName]) {
        acc[categoryName] = {
          name: categoryName,
          value: 0,
          color: expense.category.color,
        };
      }
      acc[categoryName].value += expense.amount;
      return acc;
    }, {} as Record<string, { name: string; value: number; color: string }>);

    return {
      success: true,
      data: Object.values(byCategory),
    };
  } catch (error) {
    console.error("Erro ao buscar despesas por categoria:", error);
    return {
      success: false,
      error: "Erro ao buscar despesas por categoria",
      data: [],
    };
  }
}

export async function getIncomesByCategory(year: number, month: number) {
  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const incomes = await prisma.income.findMany({
      where: {
        receiveDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: true,
      },
    });

    const byCategory = incomes.reduce((acc, income) => {
      const categoryName = income.category.name;
      if (!acc[categoryName]) {
        acc[categoryName] = {
          name: categoryName,
          value: 0,
          color: income.category.color,
        };
      }
      acc[categoryName].value += income.amount;
      return acc;
    }, {} as Record<string, { name: string; value: number; color: string }>);

    return {
      success: true,
      data: Object.values(byCategory),
    };
  } catch (error) {
    console.error("Erro ao buscar receitas por categoria:", error);
    return {
      success: false,
      error: "Erro ao buscar receitas por categoria",
      data: [],
    };
  }
}

export async function getMonthlyComparison() {
  try {
    const months = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = subMonths(now, i);
      const startDate = startOfMonth(date);
      const endDate = endOfMonth(date);

      const [expenses, incomes] = await Promise.all([
        prisma.expense.findMany({
          where: {
            dueDate: {
              gte: startDate,
              lte: endDate,
            },
          },
        }),
        prisma.income.findMany({
          where: {
            receiveDate: {
              gte: startDate,
              lte: endDate,
            },
          },
        }),
      ]);

      const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const totalIncomes = incomes.reduce((sum, inc) => sum + inc.amount, 0);

      months.push({
        month: format(date, "MMM", { locale: ptBR }),
        expenses: totalExpenses,
        incomes: totalIncomes,
        balance: totalIncomes - totalExpenses,
      });
    }

    return {
      success: true,
      data: months,
    };
  } catch (error) {
    console.error("Erro ao buscar comparação mensal:", error);
    return {
      success: false,
      error: "Erro ao buscar comparação mensal",
      data: [],
    };
  }
}

export async function getFinancialEvolution() {
  try {
    const months = [];
    const now = new Date();
    let accumulatedBalance = 0;

    for (let i = 5; i >= 0; i--) {
      const date = subMonths(now, i);
      const startDate = startOfMonth(date);
      const endDate = endOfMonth(date);

      const [expenses, incomes] = await Promise.all([
        prisma.expense.findMany({
          where: {
            dueDate: {
              gte: startDate,
              lte: endDate,
            },
          },
        }),
        prisma.income.findMany({
          where: {
            receiveDate: {
              gte: startDate,
              lte: endDate,
            },
          },
        }),
      ]);

      const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const totalIncomes = incomes.reduce((sum, inc) => sum + inc.amount, 0);
      const monthBalance = totalIncomes - totalExpenses;
      accumulatedBalance += monthBalance;

      months.push({
        month: format(date, "MMM", { locale: ptBR }),
        balance: accumulatedBalance,
      });
    }

    return {
      success: true,
      data: months,
    };
  } catch (error) {
    console.error("Erro ao buscar evolução financeira:", error);
    return {
      success: false,
      error: "Erro ao buscar evolução financeira",
      data: [],
    };
  }
}

