"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { Switch } from "@/src/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

import { useGetCategories } from "@/src/features/categories/api/use-get-categories";
import {
  createExpenseSchema,
  type CreateExpenseInput,
  type CreateExpenseFormInput,
} from "../schemas/expense-schema";
import type { ExpenseWithCategory } from "@/src/lib/types";
import { CategoryType, TransactionStatus } from "@prisma/client";

interface ExpenseFormProps {
  onSubmit: (data: CreateExpenseInput) => void;
  onCancel?: () => void;
  defaultValues?: ExpenseWithCategory;
  isLoading?: boolean;
}

export function ExpenseForm({
  onSubmit,
  onCancel,
  defaultValues,
  isLoading,
}: ExpenseFormProps) {
  const { data: categories } = useGetCategories();

  const expenseCategories = categories?.filter(
    (cat) => cat.type === CategoryType.EXPENSE
  );

  const form = useForm<CreateExpenseFormInput>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: defaultValues
      ? {
          title: defaultValues.title,
          amount: defaultValues.amount,
          categoryId: defaultValues.categoryId,
          dueDate: format(new Date(defaultValues.dueDate), "yyyy-MM-dd"),
          installments: defaultValues.installments,
          isFixed: defaultValues.isFixed,
          status: defaultValues.status,
          description: defaultValues.description || "",
        }
      : {
          title: "",
          amount: "" as unknown as number,
          categoryId: "",
          dueDate: format(new Date(), "yyyy-MM-dd"),
          installments: "1" as unknown as number,
          isFixed: false,
          status: TransactionStatus.PENDING,
          description: "",
        },
  });

  const handleFormSubmit = (data: CreateExpenseFormInput) => {
    // Garante que os dados estão no formato correto antes de enviar
    onSubmit(data as CreateExpenseInput);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-4 p-6"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Ex: Conta de luz"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor (R$)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    disabled={isLoading}
                    value={field.value as number}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="installments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parcelas</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    disabled={isLoading}
                    value={field.value as number}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {expenseCategories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Vencimento</FormLabel>
              <FormControl>
                <Input {...field} type="date" disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isFixed"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Conta fixa</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Despesa recorrente todos os meses
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição (opcional)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Observações..."
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 justify-end pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Salvando..." : defaultValues ? "Atualizar" : "Criar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
