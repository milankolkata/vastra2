"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { uploadSalesFile } from "@/lib/api";
import type { UploadResponse } from "@/lib/types";
import { supabase } from "@/lib/supabase";

// ── Existing module components ────────────────────────────────
import FileUpload from "@/components/FileUpload";
import PreviewTable from "@/components/PreviewTable";
import StatCard from "@/components/ui/StatCard";
import SectionHeader from "@/components/ui/SectionHeader";
import InsightsPanel from "@/components/InsightsPanel";
import TopProductsTable from "@/components/TopProductsTable";
import DeadStockTable from "@/components/DeadStockTable";
import SalesTrendChart from "@/components/charts/SalesTrendChart";
import CategoryChart from "@/components/charts/CategoryChart";
import ColorFabricChart from "@/components/charts/ColorFabricChart";
import ForecastSection from "@/components/ForecastSection";
import FestivalOpportunities from "@/components/FestivalOpportunities";

// ── New module components ─────────────────────────────────────
import DesignLibrary from "@/components/designs/DesignLibrary";
import CustomerManager from "@/components/customers/CustomerManager";
import LeadDiscovery from "@/components/leads/LeadDiscovery";
import TrendsDashboard from "@/components/trends/TrendsDashboard";

type Tab =
  | "upload"
  | "insights"
  | "forecast"
  | "festivals"
  | "designs"
  | "customers"
  | "leads"
  | "trends";

interface TabDef {
  id: Tab;
  label: string;
  icon: string;
  disabled?: boolean;
  group?: "sales" | "catalog";
}

export default function DashboardPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("upload");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<UploadResponse | null>(null);

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    // If Supabase is not configured, allow access (dev/demo mode)
    if (!supabase) {
      setChecking(false);
      return;
    }
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/login");
        return;
      }
      setUserEmail(session.user.email ?? null);
    } catch {
      // Auth check failed (e.g. network error) — allow access in dev mode
    }
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
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        "Upload failed. Please check your file and try again.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const tabs: TabDef[] = [
    { id: "upload",    label: "Upload",    icon: "📁",  group: "sales" },
    { id: "insights",  label: "Insights",  icon: "📊",  group: "sales", disabled: !data },
    { id: "forecast",  label: "Forecast",  icon: "🔮",  group: "sales", disabled: !data },
    { id: "festivals", label: "Festivals", icon: "🪔",  group: "sales" },
    { id: "trends",    label: "Trends",    icon: "🔥",  group: "catalog" },
    { id: "designs",   label: "Designs",   icon: "👗",  group: "catalog" },
    { id: "customers", label: "Customers", icon: "👤",  group: "catalog" },
    { id: "leads",     label: "Leads",     icon: "🗺️", group: "catalog" },
  ];

  const fmt = (n: number) => n?.toLocaleString("en-IN") || "0";

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-purple-50/30 to-orange-50/20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                V
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-base leading-none">Vastra AI</h1>
                <p className="text-xs text-gray-400 leading-none mt-0.5">Ethnic Wear Intelligence</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {data && (
                <button
                  onClick={() => { setData(null); setActiveTab("upload"); setError(null); }}
                  className="btn-secondary text-sm"
                >
                  New Upload
                </button>
              )}
              {userEmail && (
                <span className="hidden sm:block text-xs text-gray-400 max-w-[140px] truncate">
                  {userEmail}
                </span>
              )}
              {supabase && (
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-gray-800 border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded-lg transition-all"
                >
                  Log out
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Tab Navigation ─────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-0 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {tabs.map((tab, idx) => {
              const prevGroup = idx > 0 ? tabs[idx - 1].group : null;
              const showDivider = prevGroup && tab.group !== prevGroup;
              return (
                <div key={tab.id} className="flex items-center">
                  {showDivider && <div className="w-px h-5 bg-gray-200 mx-1 my-auto" />}
                  <button
                    onClick={() => !tab.disabled && setActiveTab(tab.id)}
                    disabled={tab.disabled}
                    className={`flex items-center gap-1.5 px-3 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-brand-600 text-brand-700"
                        : tab.disabled
                        ? "border-transparent text-gray-300 cursor-not-allowed"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    {tab.label}
                    {tab.id === "insights" && data && (
                      <span className="badge bg-brand-100 text-brand-700">New</span>
                    )}
                  </button>
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ── Main content ────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* UPLOAD TAB */}
        {activeTab === "upload" && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Your Sales Data</h2>
              <p className="text-gray-500">
                Get instant insights on what's selling, what's not, and what to expect next month.
              </p>
            </div>

            <FileUpload onUpload={handleUpload} isLoading={isLoading} />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <span className="text-red-500 text-xl">⚠️</span>
                <div>
                  <p className="font-semibold text-red-700">Upload failed</p>
                  <p className="text-sm text-red-600 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {data && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                <span className="text-green-500 text-2xl">✅</span>
                <div>
                  <p className="font-semibold text-green-800">Analysis complete!</p>
                  <p className="text-sm text-green-600">
                    Processed {fmt(data.summary.total_rows)} rows →{" "}
                    <button onClick={() => setActiveTab("insights")} className="underline font-medium">
                      View Insights
                    </button>
                  </p>
                </div>
              </div>
            )}

            {data?.preview && (
              <div className="card">
                <SectionHeader title="File Preview" subtitle="First 10 rows of your uploaded file" icon="👁️" />
                <PreviewTable columns={data.preview.columns} rows={data.preview.rows} />
              </div>
            )}
          </div>
        )}

        {/* INSIGHTS TAB */}
        {activeTab === "insights" && data && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <SectionHeader
                title="Summary"
                subtitle={
                  data.summary.date_range?.start
                    ? `${data.summary.date_range.start} – ${data.summary.date_range.end}`
                    : undefined
                }
              />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total Units Sold" value={fmt(data.summary.total_units)} icon="📦" color="brand" />
                <StatCard
                  label="Total Revenue"
                  value={
                    data.summary.total_revenue > 0
                      ? `₹${fmt(data.summary.total_revenue)}`
                      : `${fmt(data.summary.total_units)} units`
                  }
                  icon="💰"
                  color="green"
                />
                <StatCard label="Unique Designs" value={fmt(data.summary.unique_products)} icon="🎨" color="orange" />
                <StatCard
                  label="Period Covered"
                  value={data.summary.date_range?.days ? `${data.summary.date_range.days} days` : "—"}
                  sub={data.summary.date_range?.start}
                  icon="📅"
                  color="blue"
                />
              </div>
            </div>

            {data.insights.length > 0 && (
              <div>
                <SectionHeader title="Actionable Insights" subtitle="What you should do right now" icon="💡" />
                <InsightsPanel insights={data.insights} />
              </div>
            )}

            {(data.daily_trend.length > 0 || data.weekly_trend.length > 0) && (
              <SalesTrendChart
                daily={data.daily_trend}
                weekly={data.weekly_trend}
                monthly={data.monthly_summary}
              />
            )}

            {data.top_products.length > 0 && <TopProductsTable products={data.top_products} />}

            <CategoryChart data={data.category_breakdown} />

            <ColorFabricChart colors={data.color_trends} fabrics={data.fabric_trends} />

            <div>
              <SectionHeader title="Dead Stock & Slow Movers" subtitle="Designs with low sales in the last 30 days" icon="⚠️" />
              <DeadStockTable items={data.dead_stock} />
            </div>
          </div>
        )}

        {/* FORECAST TAB */}
        {activeTab === "forecast" && data && (
          <div className="space-y-6 animate-fade-in">
            <SectionHeader
              title="30-Day Demand Forecast"
              subtitle="AI-powered prediction of your sales for the next month"
              icon="🔮"
            />
            <ForecastSection forecast={data.forecast} />
          </div>
        )}

        {/* FESTIVALS TAB */}
        {activeTab === "festivals" && (
          <div className="animate-fade-in">
            <FestivalOpportunities />
          </div>
        )}

        {/* DESIGNS TAB */}
        {activeTab === "designs" && (
          <div className="animate-fade-in">
            <DesignLibrary />
          </div>
        )}

        {/* CUSTOMERS TAB */}
        {activeTab === "customers" && (
          <div className="animate-fade-in">
            <CustomerManager />
          </div>
        )}

        {/* LEADS TAB */}
        {activeTab === "leads" && (
          <div className="animate-fade-in">
            <LeadDiscovery />
          </div>
        )}

        {/* TRENDS TAB */}
        {activeTab === "trends" && (
          <div className="animate-fade-in">
            <TrendsDashboard />
          </div>
        )}

        {/* Empty states for disabled tabs */}
        {(activeTab === "insights" || activeTab === "forecast") && !data && (
          <div className="max-w-lg mx-auto text-center py-20 animate-fade-in">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
              📁
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No data yet</h3>
            <p className="text-gray-500 mb-6">Upload your sales file first to see insights and forecasts.</p>
            <button onClick={() => setActiveTab("upload")} className="btn-primary">
              Upload Sales File
            </button>
          </div>
        )}
      </main>

      <footer className="mt-16 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between text-sm text-gray-400 flex-wrap gap-2">
          <span>Vastra AI v2 · Ethnic Wear Intelligence</span>
          <span>Built for Indian store owners 🇮🇳</span>
        </div>
      </footer>
    </div>
  );
}
