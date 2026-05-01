"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import type { ForecastResult } from "@/lib/types";

interface ForecastSectionProps {
  forecast: ForecastResult;
}

const methodLabel: Record<string, string> = {
  prophet: "Prophet AI",
  linear: "Trend-based",
};

export default function ForecastSection({ forecast }: ForecastSectionProps) {
  if (forecast.error) {
    return (
      <div className="card bg-gray-50 text-center py-10">
        <span className="text-4xl">📊</span>
        <p className="mt-3 text-gray-600 font-medium">{forecast.error}</p>
        <p className="text-sm text-gray-400 mt-1">Upload a file with at least 2 weeks of sales data to get a forecast.</p>
      </div>
    );
  }

  const { predictions, summary, historical_daily_avg, forecast_daily_avg, peak_days } = forecast;

  const colorClass = {
    green: "text-green-600 bg-green-50",
    red: "text-red-600 bg-red-50",
    orange: "text-orange-600 bg-orange-50",
    blue: "text-blue-600 bg-blue-50",
  }[summary?.color || "blue"] || "text-blue-600 bg-blue-50";

  const formatDate = (d: string) => {
    const dt = new Date(d);
    return `${dt.getDate()} ${dt.toLocaleString("default", { month: "short" })}`;
  };

  return (
    <div className="space-y-6">
      {/* Summary banner */}
      <div className={`rounded-2xl p-5 ${colorClass} border border-current/10`}>
        <div className="flex items-start gap-4">
          <span className="text-4xl">{summary?.emoji || "📊"}</span>
          <div>
            <p className="font-bold text-lg">{summary?.summary}</p>
            <div className="flex flex-wrap gap-4 mt-2 text-sm">
              <span>
                <strong>Current avg:</strong> {historical_daily_avg} units/day
              </span>
              <span>
                <strong>Forecast avg:</strong> {forecast_daily_avg} units/day
              </span>
              {summary?.change_pct !== 0 && (
                <span>
                  <strong>Change:</strong> {summary?.change_pct > 0 ? "+" : ""}{summary?.change_pct}%
                </span>
              )}
              <span className="opacity-60 text-xs mt-0.5">
                Model: {methodLabel[summary?.method] || summary?.method}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="card">
        <h2 className="section-title">📅 30-Day Sales Forecast</h2>
        <p className="section-subtitle">Predicted daily units for the next 30 days</p>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={predictions} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="confidenceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} interval={4} />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}
              labelFormatter={(v) => formatDate(String(v))}
              formatter={(v: number, name: string) => [
                `${v} units`,
                name === "predicted" ? "Forecast" : name === "upper" ? "Upper bound" : "Lower bound",
              ]}
            />
            <Area type="monotone" dataKey="upper" stroke="transparent" fill="url(#confidenceGrad)" />
            <Area type="monotone" dataKey="lower" stroke="transparent" fill="white" />
            <Area type="monotone" dataKey="predicted" stroke="#f97316" strokeWidth={2.5} fill="url(#forecastGrad)" name="Forecast" />
            <ReferenceLine y={historical_daily_avg} stroke="#a21caf" strokeDasharray="5 5" label={{ value: "Current avg", fontSize: 10, fill: "#a21caf" }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Peak days */}
      {peak_days && peak_days.length > 0 && (
        <div className="card">
          <h2 className="section-title">🚀 Expected Peak Days</h2>
          <p className="section-subtitle">Days with highest predicted demand</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {peak_days.map((day, i) => (
              <div key={i} className="bg-orange-50 rounded-xl p-4 text-center border border-orange-100">
                <p className="text-sm text-orange-600 font-medium mb-1">
                  {i === 0 ? "🥇 Peak Day" : i === 1 ? "🥈 2nd Peak" : "🥉 3rd Peak"}
                </p>
                <p className="font-bold text-gray-900 text-lg">{formatDate(day.date)}</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">{day.predicted}</p>
                <p className="text-xs text-gray-400">units predicted</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
