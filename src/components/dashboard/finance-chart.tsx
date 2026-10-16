"use client";

import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatUZS } from "@/lib/utils/format";

interface FinanceChartProps {
  data: {
    month: string;
    income: number;
    expense: number;
    profit: number;
  }[];
}

export function FinanceChart({ data }: FinanceChartProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-64 w-full flex items-center justify-center text-xs text-slate-400">
        Загрузка графика...
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 w-full flex items-center justify-center text-xs text-slate-400">
        Нет финансовых данных для отображения
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "#64748b" }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "#64748b" }}
            tickFormatter={(val) => {
              if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
              return val;
            }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="p-3 bg-slate-900 text-white rounded-lg shadow-xl text-xs space-y-1">
                    <p className="font-semibold">{item.month}</p>
                    <p className="text-emerald-400">Доходы: {formatUZS(item.income)}</p>
                    <p className="text-rose-400">Расходы: {formatUZS(item.expense)}</p>
                    <p className="text-amber-300 font-bold">Прибыль: {formatUZS(item.profit)}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="income" name="Доходы" fill="#059669" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expense" name="Расходы" fill="#e11d48" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
