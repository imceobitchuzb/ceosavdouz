"use client";

import * as React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatUZS } from "@/lib/utils/format";

interface SalesChartProps {
  data: {
    date: string;
    revenue: number;
    orders: number;
  }[];
}

export function SalesChart({ data }: SalesChartProps) {
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
        Нет данных о продажах за выбранный период
      </div>
    );
  }

  return (
    <div className="h-64 sm:h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#047857" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#047857" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="date"
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
              if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
              return val;
            }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="p-3 bg-slate-900 text-white rounded-lg shadow-xl text-xs space-y-1">
                    <p className="font-semibold">{item.date}</p>
                    <p className="text-emerald-400 font-bold">
                      {formatUZS(item.revenue)}
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      Заказов: {item.orders}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#047857"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorRevenue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
