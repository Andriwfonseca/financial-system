"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/src/lib/prisma";
import {
  createCategorySchema,
  updateCategorySchema,
  type CreateCategoryInput,
  type UpdateCategoryInput,
} from "../schemas/category-schema";

export async function createCategory(data: CreateCategoryInput) {
  try {
    const validated = createCategorySchema.parse(data);

    const category = await prisma.category.create({
      data: validated,
    });

    revalidatePath("/categorias");
    return { success: true, data: category };
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    return { success: false, error: "Erro ao criar categoria" };
  }
}

export async function updateCategory(data: UpdateCategoryInput) {
  try {
    const validated = updateCategorySchema.parse(data);
    const { id, ...updateData } = validated;

    const category = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/categorias");
    return { success: true, data: category };
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error);
    return { success: false, error: "Erro ao atualizar categoria" };
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({
      where: { id },
    });

    revalidatePath("/categorias");
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar categoria:", error);
    return { success: false, error: "Erro ao deletar categoria" };
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });

    return { success: true, data: categories };
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    return { success: false, error: "Erro ao buscar categorias", data: [] };
  }
}

export async function getCategoryById(id: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return { success: false, error: "Categoria não encontrada" };
    }

    return { success: true, data: category };
  } catch (error) {
    console.error("Erro ao buscar categoria:", error);
    return { success: false, error: "Erro ao buscar categoria" };
  }
}

