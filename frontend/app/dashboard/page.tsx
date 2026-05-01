"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CloudUpload, BarChart3, TrendingUp, Sparkles, Shirt, Users, MapPin,
  Flame, LogOut, RefreshCw, AlertCircle, CheckCircle2, Menu, X,
  Lock, Crown, ArrowRight,
} from "lucide-react";

import { uploadSalesFile } from "@/lib/api";
import type { UploadResponse } from "@/lib/types";
import { supabase } from "@/lib/supabase";

import FileUpload            from "@/components/FileUpload";
import PreviewTable          from "@/components/PreviewTable";
import StatCard              from "@/components/ui/StatCard";
import SectionHeader         from "@/components/ui/SectionHeader";
import InsightsPanel         from "@/components/InsightsPanel";
import TopProductsTable      from "@/components/TopProductsTable";
import DeadStockTable        from "@/components/DeadStockTable";
import SalesTrendChart       from "@/components/charts/SalesTrendChart";
import CategoryChart         from "@/components/charts/CategoryChart";
import ColorFabricChart      from "@/components/charts/ColorFabricChart";
import ForecastSection       from "@/components/ForecastSection";
import FestivalOpportunities from "@/components/FestivalOpportunities";
import DesignLibrary         from "@/components/designs/DesignLibrary";
import CustomerManager       from "@/components/customers/CustomerManager";
import LeadDiscovery         from "@/components/leads/LeadDiscovery";
import TrendsDashboard       from "@/components/trends/TrendsDashboard";

type Tab = "upload" | "insights" | "forecast" | "festivals" | "designs" | "customers" | "leads" | "trends";

interface TabDef {
  id: Tab;
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
  group: "sales" | "catalog";
  proOnly?: boolean;
}

/* Pro-only tabs — free users see a gate instead of content */
const PRO_TABS: Tab[] = ["forecast", "festivals", "customers", "trends"];

const FREE_LEADS_LIMIT = 3;

const PRO_GATE_COPY: Record<string, { headline: string; sub: string }> = {
  forecast:  { headline: "30-Day Demand Forecast",      sub: "AI-powered predictions so you order the right quantity before the season peaks." },
  festivals: { headline: "Festival Opportunity Alerts", sub: "Know what to stock weeks before Diwali, Navratri, Eid, and every key selling season." },
  customers: { headline: "Smart Customer Matching",     sub: "AI matches every design to the buyers most likely to purchase it — by preference, budget, and city." },
  leads:     { headline: "Lead Discovery",              sub: "Find ethnic wear buyers and retailers in any Indian city with one click." },
  trends:    { headline: "Trends Dashboard",            sub: "See what styles, fabrics, and colours are trending across the ethnic wear market right now." },
};

/* ── Upgrade gate shown when free user clicks a Pro tab ── */
function UpgradeGate({ tab }: { tab: Tab }) {
  const copy = PRO_GATE_COPY[tab] ?? { headline: "Pro Feature", sub: "Upgrade to access this feature." };
  return (
    <div className="max-w-sm mx-auto text-center py-20 animate-fade-in">
      <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <Lock className="w-7 h-7 text-violet-600" />
      </div>
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold mb-4">
        <Crown className="w-3 h-3" /> Pro Feature
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{copy.headline}</h3>
      <p className="text-slate-500 text-sm mb-8 leading-relaxed">{copy.sub}</p>
      <Link href="/#pricing" className="btn-primary inline-flex text-sm px-6 py-2.5">
        Upgrade to Pro <ArrowRight className="w-4 h-4" />
      </Link>
      <p className="mt-3 text-xs text-slate-400">₹999/month · Cancel anytime</p>
    </div>
  );
}

/* ── Inline upgrade nudge inside the Insights tab ── */
function InsightsUpgradeNudge() {
  return (
    <div className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center shrink-0">
        <Crown className="w-5 h-5 text-violet-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-900 text-sm">Unlock AI Insights, Forecasts &amp; More</p>
        <p className="text-slate-500 text-xs mt-0.5">
          Upgrade to Pro to see AI-powered recommendations, dead stock alerts, 30-day forecasts, and festival suggestions.
        </p>
      </div>
      <Link href="/#pricing" className="shrink-0 inline-flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
        View Plans <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [checking,      setChecking]      = useState(true);
  const [userEmail,     setUserEmail]     = useState<string | null>(null);
  const [activeTab,     setActiveTab]     = useState<Tab>("upload");
  const [isLoading,     setIsLoading]     = useState(false);
  const [error,         setError]         = useState<string | null>(null);
  const [data,          setData]          = useState<UploadResponse | null>(null);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [isPro,         setIsPro]         = useState(false);
  const [leadsUsed,     setLeadsUsed]     = useState(0);

  useEffect(() => {
    checkSession();
    // Read plan from localStorage — will be replaced by Supabase user metadata after payment
    const stored = typeof window !== "undefined" ? localStorage.getItem("vastra_plan") : null;
    setIsPro(stored === "pro");
    const usedCount = parseInt(localStorage.getItem("vastra_leads_used") ?? "0", 10);
    setLeadsUsed(isNaN(usedCount) ? 0 : usedCount);
  }, []);

  function handleLeadSearch() {
    if (isPro) return;
    const next = leadsUsed + 1;
    setLeadsUsed(next);
    localStorage.setItem("vastra_leads_used", String(next));
  }

  async function checkSession() {
    if (!supabase) { setChecking(false); return; }
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/login"); return; }
      setUserEmail(session.user.email ?? null);
      // TODO: read plan from session.user.user_metadata.plan after Stripe/Razorpay integration
    } catch {}
    setChecking(false);
  }

  async function handleLogout() {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push("/login");
  }

  const handleUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await uploadSalesFile(file);
      setData(result);
      setActiveTab("insights");
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || "Upload failed. Please check your file and try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const tabs: TabDef[] = [
    { id: "upload",    label: "Upload Data",    icon: <CloudUpload className="w-4 h-4" />, group: "sales" },
    { id: "insights",  label: "Sales Insights", icon: <BarChart3   className="w-4 h-4" />, group: "sales",   disabled: !data },
    { id: "forecast",  label: "Forecast",       icon: <TrendingUp  className="w-4 h-4" />, group: "sales",   disabled: !data && !isPro, proOnly: true },
    { id: "festivals", label: "Festivals",      icon: <Sparkles   className="w-4 h-4" />, group: "sales",   proOnly: true },
    { id: "trends",    label: "Trends",         icon: <Flame      className="w-4 h-4" />, group: "catalog", proOnly: true },
    { id: "designs",   label: "Designs",        icon: <Shirt      className="w-4 h-4" />, group: "catalog" },
    { id: "customers", label: "Customers",      icon: <Users      className="w-4 h-4" />, group: "catalog", proOnly: true },
    { id: "leads",     label: "Lead Discovery", icon: <MapPin     className="w-4 h-4" />, group: "catalog" },
  ];

  const salesTabs   = tabs.filter((t) => t.group === "sales");
  const catalogTabs = tabs.filter((t) => t.group === "catalog");
  const currentTab  = tabs.find((t) => t.id === activeTab);

  function isLocked(tab: TabDef) {
    return !isPro && !!tab.proOnly;
  }

  function navigate(tab: TabDef) {
    if (tab.disabled && !isLocked(tab)) return;
    setActiveTab(tab.id);
    setMobileSidebar(false);
  }

  const fmt = (n: number) => n?.toLocaleString("en-IN") || "0";

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  /* ── Sidebar ── */
  function SidebarContent() {
    return (
      <aside className="w-56 bg-[#16082a] flex flex-col h-full border-r border-white/5">
        {/* Logo */}
        <div className="px-4 pt-5 pb-4 border-b border-white/[0.07]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-amber-500 flex items-center justify-center shrink-0">
              <Shirt className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <div className="text-white text-sm font-bold leading-none">Vastra AI</div>
              <div className="text-white/30 text-[11px] mt-0.5">Sales Intelligence</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-hide">
          <p className="text-white/25 text-[10px] font-semibold uppercase tracking-[0.15em] px-2 py-1.5">Sales</p>
          {salesTabs.map((tab) => {
            const locked = isLocked(tab);
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab)}
                disabled={tab.disabled && !locked}
                className={[
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 text-left",
                  isActive
                    ? "bg-violet-600 text-white shadow-sm"
                    : tab.disabled && !locked
                    ? "text-white/20 cursor-not-allowed"
                    : "text-white/55 hover:text-white hover:bg-white/[0.07]",
                ].join(" ")}
              >
                {tab.icon}
                <span className="flex-1">{tab.label}</span>
                {locked && <Lock className="w-3 h-3 text-white/25 shrink-0" />}
                {tab.id === "insights" && data && !isActive && !locked && (
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                )}
              </button>
            );
          })}

          <p className="text-white/25 text-[10px] font-semibold uppercase tracking-[0.15em] px-2 pt-4 pb-1.5">Catalog &amp; Growth</p>
          {catalogTabs.map((tab) => {
            const locked = isLocked(tab);
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab)}
                className={[
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 text-left",
                  isActive
                    ? "bg-violet-600 text-white shadow-sm"
                    : "text-white/55 hover:text-white hover:bg-white/[0.07]",
                ].join(" ")}
              >
                {tab.icon}
                <span className="flex-1">{tab.label}</span>
                {locked && <Lock className="w-3 h-3 text-white/25 shrink-0" />}
              </button>
            );
          })}
        </nav>

        {/* Upgrade nudge for free users */}
        {!isPro && (
          <div className="px-3 pb-3">
            <Link href="/#pricing" className="block w-full rounded-lg bg-gradient-to-br from-violet-500/20 to-amber-500/10 border border-white/10 px-3 py-2.5 hover:border-white/20 transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-white text-xs font-bold">Upgrade to Pro</span>
              </div>
              <p className="text-white/40 text-[10px] leading-relaxed">Unlock AI insights, forecasts &amp; more — ₹999/mo</p>
            </Link>
          </div>
        )}

        {/* User section */}
        <div className="px-3 py-3 border-t border-white/[0.07]">
          {userEmail && (
            <div className="flex items-center gap-2 px-2 py-1.5 mb-0.5">
              <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0">
                <span className="text-violet-400 text-[11px] font-bold">{userEmail[0].toUpperCase()}</span>
              </div>
              <span className="text-white/35 text-xs truncate">{userEmail}</span>
            </div>
          )}
          {isPro && (
            <div className="flex items-center gap-1.5 px-2 py-1 mb-1">
              <Crown className="w-3 h-3 text-amber-400" />
              <span className="text-amber-400/80 text-[10px] font-semibold">Pro Plan</span>
            </div>
          )}
          {supabase && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-2 py-1.5 text-white/30 hover:text-white hover:bg-white/[0.07] rounded-lg text-xs transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              Log out
            </button>
          )}
        </div>
      </aside>
    );
  }

  /* ── Main layout ── */
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">

      {/* Desktop sidebar */}
      <div className="hidden md:flex shrink-0">
        <SidebarContent />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileSidebar && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileSidebar(false)} />
          <div className="relative z-10 flex">
            <SidebarContent />
            <button
              className="absolute top-4 right-[-40px] w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white"
              onClick={() => setMobileSidebar(false)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top header */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 h-14 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileSidebar(true)} className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-slate-900 text-sm sm:text-base">{currentTab?.label}</h1>
              {currentTab?.proOnly && !isPro && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">
                  <Lock className="w-2.5 h-2.5" /> Pro
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {data && (
              <button
                onClick={() => { setData(null); setActiveTab("upload"); setError(null); }}
                className="btn-secondary gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New Upload</span>
              </button>
            )}
            {!isPro && (
              <Link href="/#pricing" className="hidden sm:inline-flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-700 hover:to-violet-600 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-all shadow-sm">
                <Crown className="w-3.5 h-3.5" /> Upgrade
              </Link>
            )}
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">

          {/* ── Pro gate for locked tabs ── */}
          {PRO_TABS.includes(activeTab) && !isPro && <UpgradeGate tab={activeTab} />}

          {/* ── UPLOAD TAB ── */}
          {activeTab === "upload" && (
            <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Upload Your Sales Data</h2>
                <p className="text-slate-500 text-sm">Get instant insights on what&apos;s selling, what&apos;s not, and what to expect next month.</p>
              </div>
              <FileUpload onUpload={handleUpload} isLoading={isLoading} />
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-700 text-sm">Upload failed</p>
                    <p className="text-sm text-red-600 mt-0.5">{error}</p>
                  </div>
                </div>
              )}
              {data && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-semibold text-emerald-800 text-sm">Analysis complete</p>
                    <p className="text-sm text-emerald-600">
                      Processed {fmt(data.summary.total_rows)} rows ·{" "}
                      <button onClick={() => setActiveTab("insights")} className="underline font-medium">View Insights</button>
                    </p>
                  </div>
                </div>
              )}
              {data?.preview && (
                <div className="card">
                  <SectionHeader title="File Preview" subtitle="First 10 rows of your uploaded file" icon="eye" />
                  <PreviewTable columns={data.preview.columns} rows={data.preview.rows} />
                </div>
              )}
            </div>
          )}

          {/* ── INSIGHTS TAB ── */}
          {activeTab === "insights" && data && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <SectionHeader
                  title="Sales Summary"
                  subtitle={data.summary.date_range?.start ? `${data.summary.date_range.start} – ${data.summary.date_range.end}` : undefined}
                  icon="bar-chart"
                />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard label="Total Units Sold" value={fmt(data.summary.total_units)} icon="package" color="brand" />
                  <StatCard
                    label="Total Revenue"
                    value={data.summary.total_revenue > 0 ? `₹${fmt(data.summary.total_revenue)}` : `${fmt(data.summary.total_units)} units`}
                    icon="indian-rupee" color="green"
                  />
                  <StatCard label="Unique Designs" value={fmt(data.summary.unique_products)} icon="palette" color="orange" />
                  <StatCard
                    label="Period Covered"
                    value={data.summary.date_range?.days ? `${data.summary.date_range.days} days` : "—"}
                    sub={data.summary.date_range?.start} icon="calendar" color="blue"
                  />
                </div>
              </div>

              {/* Charts are free */}
              {(data.daily_trend.length > 0 || data.weekly_trend.length > 0) && (
                <SalesTrendChart daily={data.daily_trend} weekly={data.weekly_trend} monthly={data.monthly_summary} />
              )}

              {/* AI insights gated for Pro */}
              {isPro ? (
                <>
                  {data.insights.length > 0 && (
                    <div>
                      <SectionHeader title="Actionable Insights" subtitle="What you should do right now" icon="lightbulb" />
                      <InsightsPanel insights={data.insights} />
                    </div>
                  )}
                  {data.top_products.length > 0 && <TopProductsTable products={data.top_products} />}
                  <CategoryChart data={data.category_breakdown} />
                  <ColorFabricChart colors={data.color_trends} fabrics={data.fabric_trends} />
                  <div>
                    <SectionHeader title="Dead Stock & Slow Movers" subtitle="Designs with low sales in the last 30 days" icon="alert-triangle" />
                    <DeadStockTable items={data.dead_stock} />
                  </div>
                </>
              ) : (
                <>
                  {/* Show teaser + gate */}
                  <InsightsUpgradeNudge />
                  {/* Still show category charts as a teaser */}
                  <CategoryChart data={data.category_breakdown} />
                </>
              )}
            </div>
          )}

          {/* ── Pro-gated tabs — shown only when isPro ── */}
          {activeTab === "forecast" && isPro && data && (
            <div className="space-y-6 animate-fade-in">
              <SectionHeader title="30-Day Demand Forecast" subtitle="AI-powered prediction of your sales for the next month" icon="trending-up" />
              <ForecastSection forecast={data.forecast} />
            </div>
          )}
          {activeTab === "forecast" && isPro && !data && (
            <div className="max-w-sm mx-auto text-center py-24 animate-fade-in">
              <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CloudUpload className="w-8 h-8 text-violet-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1.5">No data yet</h3>
              <p className="text-slate-500 text-sm mb-6">Upload your sales file first to see forecasts.</p>
              <button onClick={() => setActiveTab("upload")} className="btn-primary">Upload Sales File</button>
            </div>
          )}

          {activeTab === "festivals"  && isPro && <div className="animate-fade-in"><FestivalOpportunities /></div>}
          {activeTab === "trends"     && isPro && <div className="animate-fade-in"><TrendsDashboard /></div>}
          {activeTab === "customers"  && isPro && <div className="animate-fade-in"><CustomerManager /></div>}
          {activeTab === "leads" && (
            <div className="animate-fade-in space-y-4">
              {!isPro && leadsUsed >= FREE_LEADS_LIMIT ? (
                <UpgradeGate tab="leads" />
              ) : (
                <>
                  {!isPro && (
                    <div className="bg-violet-50 border border-violet-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-4 h-4 text-violet-600 shrink-0" />
                        <p className="text-violet-800 text-sm font-medium">
                          Free searches: <span className="font-bold">{leadsUsed} / {FREE_LEADS_LIMIT}</span> used
                        </p>
                      </div>
                      <Link href="/#pricing" className="shrink-0 inline-flex items-center gap-1 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                        <Crown className="w-3 h-3" /> Go Pro for unlimited
                      </Link>
                    </div>
                  )}
                  <LeadDiscovery onSearch={!isPro ? handleLeadSearch : undefined} />
                </>
              )}
            </div>
          )}

          {/* ── Designs — free but limited (UI note shown) ── */}
          {activeTab === "designs" && (
            <div className="animate-fade-in space-y-4">
              {!isPro && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3">
                  <Crown className="w-4 h-4 text-amber-600 shrink-0" />
                  <p className="text-amber-800 text-sm">
                    <span className="font-semibold">Free plan:</span> Design library limited to 10 designs.{" "}
                    <Link href="/#pricing" className="underline font-medium">Upgrade to Pro</Link> for unlimited designs + AI customer matching.
                  </p>
                </div>
              )}
              <DesignLibrary />
            </div>
          )}

          {/* ── Empty state for insights/forecast when no data ── */}
          {activeTab === "insights" && !data && (
            <div className="max-w-sm mx-auto text-center py-24 animate-fade-in">
              <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CloudUpload className="w-8 h-8 text-violet-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1.5">No data yet</h3>
              <p className="text-slate-500 text-sm mb-6">Upload your sales file first to see insights.</p>
              <button onClick={() => setActiveTab("upload")} className="btn-primary">Upload Sales File</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
