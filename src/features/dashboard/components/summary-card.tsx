"use client";

import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { cn } from "@/src/lib/utils";

interface SummaryCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  iconColor?: string;
}

export function SummaryCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel = "vs mês anterior",
  iconColor = "text-muted-foreground",
}: SummaryCardProps) {
  const isPositiveTrend = trend !== undefined && trend > 0;
  const isNegativeTrend = trend !== undefined && trend < 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn("h-4 w-4", iconColor)} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend !== undefined && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            {isPositiveTrend && <TrendingUp className="h-3 w-3 text-green-600" />}
            {isNegativeTrend && <TrendingDown className="h-3 w-3 text-red-600" />}
            <span
              className={cn(
                isPositiveTrend && "text-green-600",
                isNegativeTrend && "text-red-600"
              )}
            >
              {trend > 0 ? "+" : ""}
              {trend.toFixed(1)}%
            </span>
            <span>{trendLabel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

