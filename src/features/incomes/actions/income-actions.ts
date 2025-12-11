"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/src/lib/prisma";
import { TransactionStatus } from "@prisma/client";
import {
  createIncomeSchema,
  updateIncomeSchema,
  type CreateIncomeInput,
  type UpdateIncomeInput,
} from "../schemas/income-schema";

export async function createIncome(data: CreateIncomeInput) {
  try {
    const validated = createIncomeSchema.parse(data);

    const income = await prisma.income.create({
      data: {
        ...validated,
        receiveDate: new Date(validated.receiveDate),
      },
      include: { category: true },
    });

    revalidatePath("/receitas");
    return { success: true, data: income };
  } catch (error) {
    console.error("Erro ao criar receita:", error);
    return { success: false, error: "Erro ao criar receita" };
  }
}

export async function updateIncome(data: UpdateIncomeInput) {
  try {
    const validated = updateIncomeSchema.parse(data);
    const { id, receivedAt, ...updateData } = validated;

    const income = await prisma.income.update({
      where: { id },
      data: {
        ...updateData,
        receiveDate: new Date(updateData.receiveDate),
        receivedAt: receivedAt ? new Date(receivedAt) : null,
      },
      include: { category: true },
    });

    revalidatePath("/receitas");
    return { success: true, data: income };
  } catch (error) {
    console.error("Erro ao atualizar receita:", error);
    return { success: false, error: "Erro ao atualizar receita" };
  }
}

export async function deleteIncome(id: string) {
  try {
    await prisma.income.delete({ where: { id } });
    revalidatePath("/receitas");
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar receita:", error);
    return { success: false, error: "Erro ao deletar receita" };
  }
}

export async function markIncomeAsReceived(id: string) {
  try {
    const income = await prisma.income.update({
      where: { id },
      data: {
        status: TransactionStatus.PAID,
        receivedAt: new Date(),
      },
      include: { category: true },
    });

    revalidatePath("/receitas");
    return { success: true, data: income };
  } catch (error) {
    console.error("Erro ao marcar receita como recebida:", error);
    return { success: false, error: "Erro ao marcar receita como recebida" };
  }
}

export async function getIncomes() {
  try {
    const incomes = await prisma.income.findMany({
      include: { category: true },
      orderBy: { receiveDate: "desc" },
    });

    return { success: true, data: incomes };
  } catch (error) {
    console.error("Erro ao buscar receitas:", error);
    return { success: false, error: "Erro ao buscar receitas", data: [] };
  }
}

export async function getIncomeById(id: string) {
  try {
    const income = await prisma.income.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!income) {
      return { success: false, error: "Receita não encontrada" };
    }

    return { success: true, data: income };
  } catch (error) {
    console.error("Erro ao buscar receita:", error);
    return { success: false, error: "Erro ao buscar receita" };
  }
}

