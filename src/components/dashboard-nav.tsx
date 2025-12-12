"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Tag,
  CreditCard,
  TrendingUp,
  BarChart3,
  Calendar,
  Moon,
  Sun,
  Menu,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/src/components/ui/sheet";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Categorias", href: "/categorias", icon: Tag },
  { name: "Despesas", href: "/despesas", icon: CreditCard },
  { name: "Receitas", href: "/receitas", icon: TrendingUp },
  { name: "Contas do Mês", href: "/contas-mes", icon: Calendar },
  { name: "Gráficos", href: "/graficos", icon: BarChart3 },
];

export function DashboardNav() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Botão Menu Hambúrguer - Apenas Mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(true)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir menu</span>
            </Button>

            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <span className="hidden font-bold sm:inline-block">
                Sistema Financeiro
              </span>
            </Link>

            {/* Menu Desktop */}
            <div className="hidden md:flex md:gap-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Alternar tema</span>
          </Button>
        </div>
      </div>

      {/* Menu Mobile - Sheet Lateral */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-[280px] sm:w-[320px]">
          <SheetHeader>
            <SheetTitle>Menu de Navegação</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-2 mt-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors hover:bg-accent",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
