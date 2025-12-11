import "dotenv/config";
import { PrismaClient, CategoryType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Criar categorias de despesas
  const expenseCategories = [
    { name: "Alimentação", color: "#EF4444", type: CategoryType.EXPENSE },
    { name: "Transporte", color: "#F59E0B", type: CategoryType.EXPENSE },
    { name: "Moradia", color: "#8B5CF6", type: CategoryType.EXPENSE },
    { name: "Saúde", color: "#EC4899", type: CategoryType.EXPENSE },
    { name: "Cerveja", color: "#3B82F6", type: CategoryType.EXPENSE },
    { name: "Lazer", color: "#10B981", type: CategoryType.EXPENSE },
    { name: "Outros", color: "#6B7280", type: CategoryType.EXPENSE },
  ];

  // Criar categorias de receitas
  const incomeCategories = [
    { name: "Salário", color: "#10B981", type: CategoryType.INCOME },
    { name: "Freelance", color: "#3B82F6", type: CategoryType.INCOME },
    { name: "Investimentos", color: "#8B5CF6", type: CategoryType.INCOME },
    { name: "Outros", color: "#6B7280", type: CategoryType.INCOME },
  ];

  console.log("📦 Criando categorias...");

  for (const category of [...expenseCategories, ...incomeCategories]) {
    const existing = await prisma.category.findFirst({
      where: { name: category.name, type: category.type },
    });

    if (!existing) {
      await prisma.category.create({
        data: category,
      });
      console.log(`  ✓ Categoria criada: ${category.name}`);
    } else {
      console.log(`  ⊘ Categoria já existe: ${category.name}`);
    }
  }

  console.log("✅ Seed concluído com sucesso!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Erro durante o seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
