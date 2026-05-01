"use client";

import { useEffect, useState } from "react";
import { Sparkles, Gem, MapPin, CheckCircle2, Shirt, Palette, Layers, Bell, ChevronUp, ChevronDown, Loader2, AlertCircle } from "lucide-react";
import { getUpcomingFestivals } from "@/lib/api";
import type { Festival } from "@/lib/types";

function CategoryIcon({ category }: { category: string }) {
  if (category === "wedding") return <Gem className="w-5 h-5" />;
  return <Sparkles className="w-5 h-5" />;
}

function CountdownBadge({ days, urgency }: { days: number; urgency: Festival["urgency"] }) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${urgency.bg} ${urgency.text} ${urgency.border}`}>
      {days === 0 ? "Today!" : days === 1 ? "Tomorrow!" : `${days} days away`}
    </div>
  );
}

function FestivalCard({ festival, index }: { festival: Festival; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <div
      className={`rounded-xl border-2 overflow-hidden transition-all duration-200 animate-slide-up ${festival.urgency.border} ${festival.urgency.bg}`}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Header */}
      <div className="p-4 cursor-pointer select-none" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-white/60 ${festival.urgency.text}`}>
              <CategoryIcon category={festival.category} />
            </div>
            <div className="min-w-0">
              <h3 className={`font-bold text-base ${festival.urgency.text} truncate`}>{festival.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {festival.date}
                {festival.duration_days > 1 && ` · ${festival.duration_days} days`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <CountdownBadge days={festival.days_remaining} urgency={festival.urgency} />
            {expanded
              ? <ChevronUp className="w-4 h-4 text-slate-400" />
              : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </div>

        {/* Regions */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {festival.primary_regions.map((r) => (
            <span key={r} className="badge bg-white/70 text-slate-700 border border-slate-200 gap-1">
              <MapPin className="w-2.5 h-2.5" /> {r}
            </span>
          ))}
          {festival.secondary_regions.slice(0, 2).map((r) => (
            <span key={r} className="badge bg-white/40 text-slate-500 border border-slate-200 gap-1">
              <MapPin className="w-2.5 h-2.5" /> {r}
            </span>
          ))}
        </div>

        {/* Alert */}
        {festival.alert && (
          <div className="mt-3 flex items-start gap-2 bg-white/60 rounded-lg px-3 py-2">
            <Bell className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-500" />
            <p className={`text-sm font-medium ${festival.urgency.text}`}>{festival.alert}</p>
          </div>
        )}
      </div>

      {/* Expanded */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-current/10 pt-3 space-y-4">
          {festival.historical_insights.length > 0 && (
            <div className="bg-white/70 rounded-xl p-3">
              <p className="text-[11px] font-semibold text-slate-500 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3 h-3" /> From Your Sales History
              </p>
              <ul className="space-y-1">
                {festival.historical_insights.map((ins, i) => (
                  <li key={i} className="text-sm text-slate-700 flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" /> {ins}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <p className="text-[11px] font-semibold text-slate-500 mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <Shirt className="w-3 h-3" /> What to Stock
            </p>
            <ul className="space-y-1">
              {festival.product_suggestions.map((s, i) => (
                <li key={i} className="text-sm text-slate-700 flex items-start gap-1.5">
                  <span className="text-violet-400 mt-1">·</span> {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {festival.color_suggestions.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold text-slate-500 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <Palette className="w-3 h-3" /> Colors
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {festival.color_suggestions.map((c) => (
                    <span key={c} className="badge bg-white/70 text-slate-600 border border-slate-200">{c}</span>
                  ))}
                </div>
              </div>
            )}
            {festival.fabric_suggestions.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold text-slate-500 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3 h-3" /> Fabrics
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {festival.fabric_suggestions.map((f) => (
                    <span key={f} className="badge bg-white/70 text-slate-600 border border-slate-200">{f}</span>
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
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  useEffect(() => {
    getUpcomingFestivals(5)
      .then(setFestivals)
      .catch(() => setError("Could not load festival data. Make sure the backend is running."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="section-title flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Upcoming Festival Opportunities
          </h2>
          <p className="section-subtitle">What to prepare and when to push sales</p>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> &lt;15 days</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> 15–30 days</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> &gt;30 days</span>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
          <p className="text-sm text-slate-500">Loading festival calendar…</p>
        </div>
      )}

      {error && (
        <div className="card border-red-200 bg-red-50 text-center py-8 flex flex-col items-center gap-2">
          <AlertCircle className="w-6 h-6 text-red-400" />
          <p className="text-red-600 font-medium text-sm">{error}</p>
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
