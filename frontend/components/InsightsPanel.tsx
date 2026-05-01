"use client";

import type { Insight } from "@/lib/types";

interface InsightsPanelProps {
  insights: Insight[];
}

const priorityColor: Record<string, string> = {
  high: "border-l-red-400 bg-red-50",
  medium: "border-l-yellow-400 bg-yellow-50",
  low: "border-l-green-400 bg-green-50",
};

const priorityBadge: Record<string, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-green-100 text-green-700",
};

export default function InsightsPanel({ insights }: InsightsPanelProps) {
  if (!insights.length) return null;

  return (
    <div className="space-y-4">
      {insights.map((insight, i) => (
        <div
          key={i}
          className={`card-sm border-l-4 ${priorityColor[insight.priority] || "border-l-gray-300 bg-gray-50"} animate-slide-up`}
          style={{ animationDelay: `${i * 0.08}s` }}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl mt-0.5">{insight.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-semibold text-gray-900 text-sm">{insight.title}</h3>
                <span className={`badge ${priorityBadge[insight.priority] || ""}`}>
                  {insight.priority === "high" ? "Action Needed" : insight.priority === "medium" ? "Recommended" : "Good to Know"}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{insight.body}</p>
              <div className="flex items-start gap-2 bg-white/70 rounded-lg px-3 py-2">
                <span className="text-blue-500 text-sm mt-0.5">💡</span>
                <p className="text-sm text-blue-800 font-medium">{insight.action}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
