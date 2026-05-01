"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import type { CategoryData } from "@/lib/types";

const COLORS = ["#a21caf", "#f97316", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6"];

interface CategoryChartProps {
  data: CategoryData[];
}

export default function CategoryChart({ data }: CategoryChartProps) {
  if (!data.length) return (
    <div className="card flex items-center justify-center h-48 text-gray-400 text-sm">
      No category data available in your file.
    </div>
  );

  return (
    <div className="card">
      <h2 className="section-title">🛍️ Category Performance</h2>
      <p className="section-subtitle">Which product categories sell the most</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" outerRadius={85} dataKey="units" nameKey="category" label={({ name, share_pct }) => `${name} ${share_pct}%`} labelLine={false}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v: number) => [`${v} units`, "Sales"]} />
          </PieChart>
        </ResponsiveContainer>

        <div className="space-y-2">
          {data.slice(0, 6).map((cat, i) => (
            <div key={cat.category} className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-sm font-medium text-gray-700 truncate">{cat.category}</span>
                  <span className="text-sm text-gray-500 ml-2">{cat.units} units</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full"
                    style={{ width: `${cat.share_pct}%`, backgroundColor: COLORS[i % COLORS.length] }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
