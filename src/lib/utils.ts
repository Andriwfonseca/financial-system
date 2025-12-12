import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converte uma string de data no formato 'YYYY-MM-DD' para um objeto Date local
 * Isso evita problemas de timezone onde a data é interpretada como UTC
 *
 * @param dateString - String da data no formato 'YYYY-MM-DD'
 * @returns Objeto Date com a data local às 12:00 (meio-dia)
 */
export function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  // Cria a data com horário local (meio-dia para evitar problemas de timezone)
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}
