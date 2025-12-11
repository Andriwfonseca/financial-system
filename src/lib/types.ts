import { Prisma } from "@prisma/client";

// Tipos base do Prisma
export type Category = Prisma.CategoryGetPayload<{}>;
export type Expense = Prisma.ExpenseGetPayload<{}>;
export type Income = Prisma.IncomeGetPayload<{}>;

// Tipos com relações
export type ExpenseWithCategory = Prisma.ExpenseGetPayload<{
  include: { category: true };
}>;

export type IncomeWithCategory = Prisma.IncomeGetPayload<{
  include: { category: true };
}>;

// Enums
export { CategoryType, TransactionStatus } from "@prisma/client";

