"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import type { ColorData, FabricData } from "@/lib/types";

const COLOR_PALETTE = ["#a21caf", "#f97316", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6", "#ec4899", "#6366f1"];

interface ColorFabricChartProps {
  colors: ColorData[];
  fabrics: FabricData[];
}

export default function ColorFabricChart({ colors, fabrics }: ColorFabricChartProps) {
  if (!colors.length && !fabrics.length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {colors.length > 0 && (
        <div className="card">
          <h2 className="section-title">🎨 Color Trends</h2>
          <p className="section-subtitle">Best-performing colors by units sold</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={colors.slice(0, 8)} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
              <YAxis dataKey="color" type="category" tick={{ fontSize: 11, fill: "#374151" }} tickLine={false} width={80} />
              <Tooltip formatter={(v: number) => [`${v} units`, "Sold"]} />
              <Bar dataKey="units" radius={[0, 6, 6, 0]}>
                {colors.map((_, i) => (
                  <Cell key={i} fill={COLOR_PALETTE[i % COLOR_PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {fabrics.length > 0 && (
        <div className="card">
          <h2 className="section-title">🧵 Fabric Trends</h2>
          <p className="section-subtitle">Most popular fabrics by units sold</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={fabrics.slice(0, 8)} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
              <YAxis dataKey="fabric" type="category" tick={{ fontSize: 11, fill: "#374151" }} tickLine={false} width={80} />
              <Tooltip formatter={(v: number) => [`${v} units`, "Sold"]} />
              <Bar dataKey="units" radius={[0, 6, 6, 0]}>
                {fabrics.map((_, i) => (
                  <Cell key={i} fill={COLOR_PALETTE[(i + 3) % COLOR_PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
