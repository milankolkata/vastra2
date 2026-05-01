"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { TrendPoint, WeekPoint, MonthPoint } from "@/lib/types";

interface SalesTrendChartProps {
  daily: TrendPoint[];
  weekly: WeekPoint[];
  monthly: MonthPoint[];
}

type ViewMode = "daily" | "weekly" | "monthly";

import { useState } from "react";

export default function SalesTrendChart({ daily, weekly, monthly }: SalesTrendChartProps) {
  const [view, setView] = useState<ViewMode>("weekly");

  const data = view === "daily" ? daily.slice(-60) : view === "weekly" ? weekly : monthly;
  const xKey = view === "daily" ? "date" : view === "weekly" ? "week" : "month";

  const formatX = (val: string) => {
    if (view === "daily") {
      const d = new Date(val);
      return `${d.getDate()} ${d.toLocaleString("default", { month: "short" })}`;
    }
    return val;
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h2 className="section-title">📈 Sales Trend</h2>
          <p className="section-subtitle">Units sold over time</p>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {(["daily", "weekly", "monthly"] as ViewMode[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                view === v ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data as any[]} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorUnits" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a21caf" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#a21caf" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey={xKey} tickFormatter={formatX} tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}
            labelFormatter={(v) => formatX(String(v))}
          />
          <Area type="monotone" dataKey="units" stroke="#a21caf" strokeWidth={2.5} fill="url(#colorUnits)" name="Units Sold" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
