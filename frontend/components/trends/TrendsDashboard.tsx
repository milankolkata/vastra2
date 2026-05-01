"use client";

import { useState, useEffect, useCallback } from "react";
import { listTrends, matchTrendWithCatalog } from "@/lib/api";
import type { Trend, TrendCatalogMatch } from "@/lib/types";

// ─── Constants ──────────────────────────────────────────────────────────────
const PAGE_SIZE = 18;

// Frontend label → value sent to backend
const PRODUCT_TYPES: { label: string; value: string }[] = [
  { label: "All Products",    value: "" },
  { label: "Saree",           value: "Saree" },
  { label: "Lehenga",         value: "Lehenga" },
  { label: "Salwar Suit",     value: "Salwar Suit" },
  { label: "Kurti",           value: "Kurti" },
  { label: "Dupatta",         value: "Dupatta" },
  { label: "Unstitched",      value: "Unstitched" },
  { label: "Semi-stitched",   value: "Semi-stitched" },
  { label: "Fabric / Thaan",  value: "Fabric" },   // backend has "Fabric-Thaan", "Fabric" matches via substring
];

const WORK_TYPES = [
  "All",
  // Handwork
  "Zari Work", "Zardozi", "Aari Work", "Tilla Work", "Chikankari Work",
  "Mirror Work", "Gota Patti", "Resham Embroidery", "Kantha Work",
  "Phulkari", "Kutchi Work",
  // Machine / Print
  "Machine Work", "Machine Embroidery", "Digital Print", "Screen Print",
  "Block Print", "Ajrakh Print", "Bandhani", "Kalamkari", "Handpaint",
  // Premium
  "Sequins Work", "Applique",
];

const FABRIC_TYPES = [
  "All",
  "Silk", "Chanderi", "Organza", "Chiffon", "Georgette", "Net",
  "Cotton", "Rayon", "Linen", "Viscose Crepe", "Velvet",
  "Dupion Silk", "Tissue Silk", "Cotton Lawn", "Silk Brocade",
];

const REGIONS = ["All", "North India", "South India", "West India", "East India", "Central India"];

const TIME_OPTS = [
  { label: "All Trends",      value: "all" },
  { label: "Trending Now",    value: "this_week" },
  { label: "This Month",      value: "this_month" },
  { label: "Festival Season", value: "festival_season" },
];

// ─── Score colours ───────────────────────────────────────────────────────────
function scoreStyle(score: number) {
  if (score >= 88) return { pill: "bg-green-100 text-green-700",  bar: "bg-green-500"  };
  if (score >= 75) return { pill: "bg-brand-100 text-brand-700", bar: "bg-brand-500"  };
  return               { pill: "bg-orange-100 text-orange-600", bar: "bg-orange-400" };
}

function gradientBg(colors: string[]) {
  if (!colors.length) return "linear-gradient(135deg,#a21caf,#f97316)";
  return `linear-gradient(135deg,${colors[0]},${colors[Math.min(1, colors.length - 1)]})`;
}

// ─── Image with lazy-load + gradient fallback ────────────────────────────────
function TrendImage({ url, colors, title }: { url: string; colors: string[]; title: string }) {
  const [err, setErr] = useState(false);

  if (url && !err) {
    return (
      <img
        src={url}
        alt={title}
        loading="lazy"
        onError={() => setErr(true)}
        className="w-full h-48 object-cover"
      />
    );
  }
  // Fallback: gradient with swatches
  return (
    <div
      className="w-full h-48 flex flex-col items-end justify-end p-3 gap-2"
      style={{ background: gradientBg(colors) }}
    >
      <div className="flex gap-1.5">
        {colors.map((hex, i) => (
          <div key={i} className="w-5 h-5 rounded-full border-2 border-white/60" style={{ backgroundColor: hex }} />
        ))}
      </div>
    </div>
  );
}

// ─── Skeleton card ───────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-1.5 bg-gray-100 rounded" />
        <div className="h-16 bg-gray-100 rounded" />
        <div className="h-16 bg-gray-100 rounded" />
        <div className="h-9 bg-gray-100 rounded-xl mt-2" />
      </div>
    </div>
  );
}

// ─── Trend Card ──────────────────────────────────────────────────────────────
function TrendCard({
  trend,
  bookmarked,
  onBookmark,
  onMatch,
}: {
  trend: Trend;
  bookmarked: boolean;
  onBookmark: (id: string) => void;
  onMatch: (t: Trend) => void;
}) {
  const sc = scoreStyle(trend.trend_score);

  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      {/* ── Image / gradient ── */}
      <div className="relative overflow-hidden">
        <TrendImage url={trend.image_url} colors={trend.colors} title={trend.title} />

        {/* Score pill */}
        <div className={`absolute top-2 left-2 flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm ${sc.pill}`}>
          🔥 {trend.trend_score}
        </div>

        {/* Bookmark */}
        <button
          onClick={() => onBookmark(trend.id)}
          aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
          className="absolute top-2 right-2 w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-sm hover:scale-110 transition-transform shadow"
        >
          {bookmarked ? "🔖" : "📌"}
        </button>

        {/* Product type tag */}
        <div className="absolute bottom-2 left-2">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/40 text-white backdrop-blur-sm">
            {trend.product_type}
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Title */}
        <div>
          <h3 className="font-bold text-gray-900 text-sm leading-snug">{trend.title}</h3>
          <div className="flex flex-wrap gap-1 mt-1.5">
            <span className="badge bg-purple-100 text-purple-700 text-[10px]">{trend.category}</span>
            <span className="badge bg-blue-50 text-blue-600 text-[10px]">{trend.work_type}</span>
            <span className="badge bg-gray-100 text-gray-600 text-[10px]">{trend.fabric_type}</span>
          </div>
        </div>

        {/* Score bar */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Trend Score</span>
            <span className={`text-xs font-bold ${sc.pill.split(" ")[1]}`}>{trend.trend_score}/100</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${sc.bar}`} style={{ width: `${trend.trend_score}%` }} />
          </div>
        </div>

        {/* Festival tags */}
        {trend.festival_tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {trend.festival_tags.slice(0, 3).map(tag => (
              <span key={tag} className="badge bg-orange-50 text-orange-600 text-[10px]">🪔 {tag}</span>
            ))}
          </div>
        )}

        {/* Insight panels */}
        <div className="space-y-2">
          <InsightPanel icon="💡" label="Why it's trending" color="gray">
            {trend.why_trending}
          </InsightPanel>
          <InsightPanel icon="📈" label="Demand Insight" color="green">
            {trend.demand_insight}
          </InsightPanel>
          <InsightPanel icon="🧵" label="Fabric Insight" color="blue">
            {trend.fabric_insight}
          </InsightPanel>
          <InsightPanel icon="🎯" label="Who Should Sell" color="amber">
            {trend.who_should_sell}
          </InsightPanel>
        </div>

        {/* Source + action */}
        <div className="mt-auto pt-1 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400">
              Source: <span className="font-medium text-gray-600">{trend.source_name}</span>
            </span>
            {trend.source_url && (
              <a
                href={trend.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-brand-600 hover:underline font-semibold"
              >
                View ↗
              </a>
            )}
          </div>

          <button
            onClick={() => onMatch(trend)}
            className="w-full flex items-center justify-center gap-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 font-semibold text-xs py-2.5 rounded-xl transition-all border border-brand-200"
          >
            👗 Match with My Designs
          </button>
        </div>
      </div>
    </article>
  );
}

// ─── Insight panel ───────────────────────────────────────────────────────────
function InsightPanel({
  icon, label, color, children,
}: { icon: string; label: string; color: string; children: string }) {
  const colors: Record<string, string> = {
    gray:  "bg-gray-50  text-gray-400",
    green: "bg-green-50 text-green-500",
    blue:  "bg-blue-50  text-blue-500",
    amber: "bg-amber-50 text-amber-500",
  };
  return (
    <div className={`rounded-xl p-3 ${colors[color].split(" ")[0]}`}>
      <p className={`text-[10px] font-semibold mb-1 ${colors[color].split(" ")[1]}`}>{icon} {label}</p>
      <p className="text-xs text-gray-700 leading-relaxed line-clamp-2">{children}</p>
    </div>
  );
}

// ─── Match Modal ─────────────────────────────────────────────────────────────
function MatchModal({ trend, onClose }: { trend: Trend; onClose: () => void }) {
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<TrendCatalogMatch[]>([]);
  const [total, setTotal]     = useState(0);
  const [error, setError]     = useState("");

  useEffect(() => {
    matchTrendWithCatalog(trend.id)
      .then(r => { setMatches(r.matches); setTotal(r.total_designs); })
      .catch(() => setError("Could not load matches — is the backend running?"))
      .finally(() => setLoading(false));
  }, [trend.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900 text-base">Matching designs</h2>
            <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[260px]">{trend.title}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-lg">✕</button>
        </div>
        <div className="overflow-y-auto flex-1 p-5">
          {loading && (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">{error}</div>}
          {!loading && !error && matches.length === 0 && (
            <div className="text-center py-10">
              <p className="text-3xl mb-3">🔍</p>
              <p className="font-semibold text-gray-800">No matches found</p>
              <p className="text-sm text-gray-500 mt-1">
                {total === 0 ? "Your design catalog is empty — add designs first." : `None of your ${total} designs match this trend.`}
              </p>
            </div>
          )}
          {!loading && matches.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs text-gray-500 mb-3">
                Found <strong className="text-gray-800">{matches.length}</strong> matching design{matches.length !== 1 ? "s" : ""} from your {total}-design catalog.
              </p>
              {matches.map(m => (
                <div key={m.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  {m.image_url
                    ? <img src={m.image_url} alt={m.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                    : <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center text-xl shrink-0">👗</div>
                  }
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{m.name}</p>
                    <p className="text-xs text-gray-500 truncate">{[m.category, m.color, m.work_type].filter(Boolean).join(" · ")}</p>
                  </div>
                  <span className="shrink-0 text-xs font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded-lg whitespace-nowrap">
                    {m.match_score}% match
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Filter bar (collapsible on mobile) ──────────────────────────────────────
function FilterBar({
  productType, workType, fabricType, region, timeFilter,
  onChange, activeCount, onClear,
}: {
  productType: string; workType: string; fabricType: string;
  region: string; timeFilter: string;
  onChange: (k: string, v: string) => void;
  activeCount: number; onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const sel = "text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all w-full";

  const fields = [
    { key: "productType", label: "Product Type", value: productType, opts: PRODUCT_TYPES.map(o => ({ label: o.label, value: o.value })) },
    { key: "workType",    label: "Work Type",    value: workType,    opts: WORK_TYPES.map(o    => ({ label: o, value: o === "All" ? "" : o })) },
    { key: "fabricType",  label: "Fabric Type",  value: fabricType,  opts: FABRIC_TYPES.map(o  => ({ label: o, value: o === "All" ? "" : o })) },
    { key: "region",      label: "Region",       value: region,      opts: REGIONS.map(o       => ({ label: o, value: o === "All" ? "" : o })) },
    { key: "timeFilter",  label: "Time Period",  value: timeFilter,  opts: TIME_OPTS },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Mobile header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer sm:hidden"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">🔍 Filters</span>
          {activeCount > 0 && (
            <span className="badge bg-brand-100 text-brand-700 text-xs">{activeCount} active</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button
              onClick={e => { e.stopPropagation(); onClear(); }}
              className="text-xs text-red-500 font-medium"
            >
              Clear
            </button>
          )}
          <span className="text-gray-400 text-sm">{open ? "▲" : "▼"}</span>
        </div>
      </div>

      {/* Filter fields — always visible on sm+, collapsible on mobile */}
      <div className={`${open ? "block" : "hidden"} sm:block px-4 pb-4 sm:pt-4`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {fields.map(f => (
            <div key={f.key}>
              <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1">
                {f.label}
              </label>
              <select
                className={sel}
                value={f.value}
                onChange={e => onChange(f.key, e.target.value)}
              >
                {f.opts.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Desktop clear button */}
        {activeCount > 0 && (
          <div className="hidden sm:flex justify-end mt-3">
            <button onClick={onClear} className="text-xs text-red-500 hover:text-red-600 font-medium">
              Clear all filters ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function TrendsDashboard() {
  const [trends, setTrends]     = useState<Trend[]>([]);
  const [total, setTotal]       = useState(0);
  const [hasMore, setHasMore]   = useState(false);
  const [offset, setOffset]     = useState(0);
  const [loading, setLoading]   = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError]       = useState("");
  const [matchingTrend, setMatchingTrend] = useState<Trend | null>(null);

  // Filters
  const [productType, setProductType] = useState("");
  const [workType,    setWorkType]    = useState("");
  const [fabricType,  setFabricType]  = useState("");
  const [region,      setRegion]      = useState("");
  const [timeFilter,  setTimeFilter]  = useState("all");

  // Bookmarks persisted to localStorage
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem("vastra_bookmarks") || "[]")); }
    catch { return new Set(); }
  });

  const fetchPage = useCallback(async (pageOffset: number, append: boolean) => {
    if (pageOffset === 0) setLoading(true); else setLoadingMore(true);
    setError("");
    try {
      const res = await listTrends({
        product_type: productType || undefined,
        work_type:    workType    || undefined,
        fabric_type:  fabricType  || undefined,
        region:       region      || undefined,
        time_filter:  timeFilter,
        limit:  PAGE_SIZE,
        offset: pageOffset,
      });
      setTrends(prev => append ? [...prev, ...res.trends] : res.trends);
      setTotal(res.total);
      setHasMore(res.has_more);
      setOffset(pageOffset);
    } catch {
      setError("Could not load trends. Make sure the backend is running on port 8000.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [productType, workType, fabricType, region, timeFilter]);

  useEffect(() => {
    setOffset(0);
    fetchPage(0, false);
  }, [productType, workType, fabricType, region, timeFilter]);

  function handleFilterChange(key: string, value: string) {
    if (key === "productType") setProductType(value);
    else if (key === "workType")   setWorkType(value);
    else if (key === "fabricType") setFabricType(value);
    else if (key === "region")     setRegion(value);
    else if (key === "timeFilter") setTimeFilter(value);
  }

  function clearFilters() {
    setProductType(""); setWorkType(""); setFabricType("");
    setRegion(""); setTimeFilter("all");
  }

  function toggleBookmark(id: string) {
    setBookmarks(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      try { localStorage.setItem("vastra_bookmarks", JSON.stringify([...next])); } catch { /* noop */ }
      return next;
    });
  }

  const activeFilters = [
    productType ? PRODUCT_TYPES.find(o => o.value === productType)?.label : "",
    workType, fabricType, region,
    timeFilter !== "all" ? TIME_OPTS.find(o => o.value === timeFilter)?.label : "",
  ].filter(Boolean) as string[];

  return (
    <div className="space-y-4">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-gray-900">🔥 What&apos;s Trending</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {loading ? "Loading…" : `${total} trending design${total !== 1 ? "s" : ""} in ethnic wear`}
          </p>
        </div>
        {bookmarks.size > 0 && (
          <span className="badge bg-orange-100 text-orange-700 text-sm self-start mt-1">
            🔖 {bookmarks.size} saved
          </span>
        )}
      </div>

      {/* ── Filter bar ── */}
      <FilterBar
        productType={productType} workType={workType} fabricType={fabricType}
        region={region} timeFilter={timeFilter}
        onChange={handleFilterChange}
        activeCount={activeFilters.length}
        onClear={clearFilters}
      />

      {/* ── Active filter chips (desktop only) ── */}
      {activeFilters.length > 0 && (
        <div className="hidden sm:flex flex-wrap gap-2">
          {activeFilters.map(f => (
            <span key={f} className="badge bg-brand-100 text-brand-700 text-xs py-1 px-3">{f}</span>
          ))}
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600 flex gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* ── Skeleton ── */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && !error && trends.length === 0 && (
        <div className="text-center py-14">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-semibold text-gray-800">No trends match your filters</p>
          <p className="text-sm text-gray-500 mt-1">Try removing some filters.</p>
          <button onClick={clearFilters} className="mt-4 btn-secondary text-sm">Clear all filters</button>
        </div>
      )}

      {/* ── Trend grid ── */}
      {!loading && trends.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {trends.map(t => (
              <TrendCard
                key={t.id}
                trend={t}
                bookmarked={bookmarks.has(t.id)}
                onBookmark={toggleBookmark}
                onMatch={setMatchingTrend}
              />
            ))}
          </div>

          {/* Load more */}
          {hasMore && (
            <div className="flex justify-center pt-2">
              <button
                onClick={() => fetchPage(offset + PAGE_SIZE, true)}
                disabled={loadingMore}
                className="btn-secondary flex items-center gap-2 disabled:opacity-60"
              >
                {loadingMore
                  ? <><span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />Loading…</>
                  : `Load more (${total - trends.length} remaining)`
                }
              </button>
            </div>
          )}

          {!hasMore && (
            <p className="text-center text-xs text-gray-400 pb-2">
              Showing all {trends.length} trends · Scores updated daily based on festival calendar
            </p>
          )}
        </>
      )}

      {/* ── Unsplash upgrade hint ── */}
      {!loading && trends.length > 0 && trends.every(t => t.image_url?.includes("picsum")) && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-sm">
          <p className="font-semibold text-blue-800 mb-1">💡 Want ethnic wear product photos?</p>
          <p className="text-xs text-blue-600">
            Add <code className="bg-blue-100 px-1 rounded font-mono">UNSPLASH_ACCESS_KEY=your_key</code> to <code className="bg-blue-100 px-1 rounded font-mono">backend/.env</code>.
            Free at <strong>unsplash.com/developers</strong> — replaces stock photos with real Indian fashion images.
          </p>
        </div>
      )}

      {/* ── Bookmarks summary ── */}
      {!loading && bookmarks.size > 0 && (
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 text-sm text-orange-700">
          <p className="font-semibold">🔖 {bookmarks.size} trend{bookmarks.size !== 1 ? "s" : ""} bookmarked</p>
          <p className="text-xs text-orange-500 mt-0.5">Saved locally on this device.</p>
        </div>
      )}

      {/* ── Match modal ── */}
      {matchingTrend && (
        <MatchModal trend={matchingTrend} onClose={() => setMatchingTrend(null)} />
      )}
    </div>
  );
}
