"use client";

import { useEffect, useState } from "react";
import { getUpcomingFestivals } from "@/lib/api";
import type { Festival } from "@/lib/types";

const categoryIcon: Record<string, string> = {
  festive: "🪔",
  wedding: "💍",
};

const regionFlags: Record<string, string> = {
  "Pan India": "🇮🇳",
  Kerala: "🌴",
  Gujarat: "🎭",
  Bengal: "🌸",
  "West Bengal": "🌸",
  Tamil: "🌺",
  "Tamil Nadu": "🌺",
  Rajasthan: "🏜️",
  Maharashtra: "🌆",
};

function getRegionIcon(region: string) {
  for (const [key, icon] of Object.entries(regionFlags)) {
    if (region.toLowerCase().includes(key.toLowerCase())) return icon;
  }
  return "📍";
}

function CountdownBadge({ days, urgency }: { days: number; urgency: Festival["urgency"] }) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${urgency.bg} ${urgency.text} ${urgency.border}`}>
      {days === 0 ? "Today!" : days === 1 ? "Tomorrow!" : `${days} days away`}
    </div>
  );
}

interface FestivalCardProps {
  festival: Festival;
  index: number;
}

function FestivalCard({ festival, index }: FestivalCardProps) {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <div
      className={`rounded-2xl border-2 overflow-hidden transition-all duration-300 animate-slide-up ${festival.urgency.border} ${festival.urgency.bg}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Header */}
      <div className="p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-3xl">{categoryIcon[festival.category] || "🎊"}</span>
            <div className="min-w-0">
              <h3 className={`font-bold text-base ${festival.urgency.text} truncate`}>{festival.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {festival.date}
                {festival.duration_days > 1 && ` · ${festival.duration_days} days`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <CountdownBadge days={festival.days_remaining} urgency={festival.urgency} />
            <span className="text-gray-400 text-sm">{expanded ? "▲" : "▼"}</span>
          </div>
        </div>

        {/* Regions */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {festival.primary_regions.map((r) => (
            <span key={r} className="badge bg-white/70 text-gray-700 border border-gray-200 gap-1">
              {getRegionIcon(r)} {r}
            </span>
          ))}
          {festival.secondary_regions.slice(0, 2).map((r) => (
            <span key={r} className="badge bg-white/40 text-gray-500 border border-gray-200 gap-1">
              {getRegionIcon(r)} {r}
            </span>
          ))}
        </div>

        {/* Alert */}
        {festival.alert && (
          <div className="mt-3 flex items-start gap-2 bg-white/60 rounded-xl px-3 py-2">
            <span className="text-sm mt-0.5">🔔</span>
            <p className={`text-sm font-medium ${festival.urgency.text}`}>{festival.alert}</p>
          </div>
        )}
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-current/10 pt-3 space-y-4">
          {/* Historical insights */}
          {festival.historical_insights.length > 0 && (
            <div className="bg-white/70 rounded-xl p-3">
              <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">📊 From Your Sales History</p>
              <ul className="space-y-1">
                {festival.historical_insights.map((ins, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-1.5">
                    <span className="text-green-500 mt-0.5">✓</span> {ins}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Product suggestions */}
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">👗 What to Stock</p>
            <ul className="space-y-1">
              {festival.product_suggestions.map((s, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-1.5">
                  <span className="text-purple-500">•</span> {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Colors & Fabrics */}
          <div className="grid grid-cols-2 gap-3">
            {festival.color_suggestions.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">🎨 Colors</p>
                <div className="flex flex-wrap gap-1.5">
                  {festival.color_suggestions.map((c) => (
                    <span key={c} className="badge bg-white/70 text-gray-600 border border-gray-200">{c}</span>
                  ))}
                </div>
              </div>
            )}
            {festival.fabric_suggestions.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">🧵 Fabrics</p>
                <div className="flex flex-wrap gap-1.5">
                  {festival.fabric_suggestions.map((f) => (
                    <span key={f} className="badge bg-white/70 text-gray-600 border border-gray-200">{f}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FestivalOpportunities() {
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getUpcomingFestivals(5)
      .then(setFestivals)
      .catch(() => setError("Could not load festival data. Make sure the backend is running."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="section-title">🎊 Upcoming Festival Opportunities</h2>
          <p className="section-subtitle">What to prepare and when to push sales</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" /> &lt;15 days</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" /> 15–30 days</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" /> &gt;30 days</span>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading festival calendar…</p>
        </div>
      )}

      {error && (
        <div className="card bg-red-50 border-red-200 text-center py-8">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {festivals.map((f, i) => (
            <FestivalCard key={f.id} festival={f} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
