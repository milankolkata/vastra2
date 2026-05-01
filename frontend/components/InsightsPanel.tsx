"use client";

import { AlertCircle, Info, CheckCircle2, Lightbulb } from "lucide-react";
import type { Insight } from "@/lib/types";

interface InsightsPanelProps {
  insights: Insight[];
}

const priorityConfig: Record<string, { card: string; badge: string; label: string; icon: React.ReactNode }> = {
  high: {
    card:  "border-l-red-400 bg-red-50/60",
    badge: "bg-red-100 text-red-700",
    label: "Action Needed",
    icon:  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />,
  },
  medium: {
    card:  "border-l-amber-400 bg-amber-50/60",
    badge: "bg-amber-100 text-amber-700",
    label: "Recommended",
    icon:  <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />,
  },
  low: {
    card:  "border-l-emerald-400 bg-emerald-50/60",
    badge: "bg-emerald-100 text-emerald-700",
    label: "Good to Know",
    icon:  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />,
  },
};

export default function InsightsPanel({ insights }: InsightsPanelProps) {
  if (!insights.length) return null;

  return (
    <div className="space-y-3">
      {insights.map((insight, i) => {
        const cfg = priorityConfig[insight.priority] ?? priorityConfig.low;
        return (
          <div
            key={i}
            className={`card-sm border-l-4 ${cfg.card} animate-slide-up`}
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            <div className="flex items-start gap-3">
              {cfg.icon}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold text-slate-900 text-sm">{insight.title}</h3>
                  <span className={`badge ${cfg.badge}`}>{cfg.label}</span>
                </div>
                <p className="text-sm text-slate-600 mb-2.5">{insight.body}</p>
                <div className="flex items-start gap-2 bg-white/70 rounded-lg px-3 py-2">
                  <Lightbulb className="w-3.5 h-3.5 text-violet-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700 font-medium">{insight.action}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
