"use client";

import { useState } from "react";
import {
  Search, MapPin, Star, Phone, Globe, Copy, Download,
  ChevronRight, Loader2, Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { searchLeads } from "@/lib/api";
import type { Lead } from "@/lib/types";

const BUSINESS_TYPES = [
  { label: "Ethnic Wear Boutique", value: "ethnic wear boutique saree shop kurti" },
  { label: "Saree Shop", value: "saree shop silk saree" },
  { label: "Kurti & Suit Store", value: "kurti salwar suit shop" },
  { label: "Lehenga & Bridal", value: "bridal lehenga shop wedding wear" },
  { label: "Wholesale Dealer", value: "ethnic wear wholesale supplier" },
  { label: "Textile Shop", value: "textile fabric shop" },
];

const POPULAR_CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad",
  "Pune", "Ahmedabad", "Jaipur", "Surat", "Lucknow", "Coimbatore",
];

function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return <span className="text-xs text-gray-400">No rating</span>;
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`text-sm ${i < full ? "text-yellow-400" : "text-gray-200"}`}>★</span>
      ))}
      <span className="text-xs text-gray-500 font-medium">{rating.toFixed(1)}</span>
    </div>
  );
}

function LeadCard({ lead, index }: { lead: Lead; index: number }) {
  const [copied, setCopied] = useState(false);

  const copyPhone = () => {
    if (!lead.phone) return;
    navigator.clipboard.writeText(lead.phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-all animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0">
          <Building2 className="w-5 h-5 text-indigo-500" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 truncate">{lead.name}</p>
              <StarRating rating={lead.rating} />
              {lead.total_ratings > 0 && (
                <p className="text-xs text-gray-400">{lead.total_ratings.toLocaleString()} reviews</p>
              )}
            </div>
            {lead.rating && lead.rating >= 4 && (
              <Badge variant="success" className="flex-shrink-0">Top Rated</Badge>
            )}
          </div>

          {/* Address */}
          <div className="flex items-start gap-1.5 mt-2">
            <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-500 leading-relaxed">{lead.address}</p>
          </div>

          {/* Actions row */}
          <div className="flex flex-wrap gap-2 mt-3">
            {lead.phone ? (
              <button
                onClick={copyPhone}
                className="flex items-center gap-1.5 text-xs bg-green-50 text-green-700 border border-green-200 rounded-lg px-2.5 py-1.5 hover:bg-green-100 transition-colors font-medium"
              >
                {copied ? (
                  <><span className="text-green-600">✓</span> Copied!</>
                ) : (
                  <><Phone className="w-3 h-3" />{lead.phone}<Copy className="w-3 h-3 ml-1 opacity-60" /></>
                )}
              </button>
            ) : (
              <span className="text-xs text-gray-400 bg-gray-50 rounded-lg px-2.5 py-1.5 border border-gray-100">
                No phone listed
              </span>
            )}

            <a
              href={lead.maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-lg px-2.5 py-1.5 hover:bg-blue-100 transition-colors font-medium"
            >
              <MapPin className="w-3 h-3" /> Maps
            </a>

            {lead.website && (
              <a
                href={lead.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs bg-gray-50 text-gray-600 border border-gray-200 rounded-lg px-2.5 py-1.5 hover:bg-gray-100 transition-colors"
              >
                <Globe className="w-3 h-3" /> Website
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function exportToCSV(leads: Lead[], city: string) {
  const headers = ["Name", "Address", "Rating", "Total Reviews", "Phone", "Website", "Maps URL"];
  const rows = leads.map((l) => [
    l.name, l.address, l.rating ?? "", l.total_ratings, l.phone ?? "", l.website ?? "", l.maps_url,
  ]);
  const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `leads-${city.toLowerCase().replace(/\s/g, "-")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function LeadDiscovery() {
  const [city, setCity] = useState("");
  const [businessType, setBusinessType] = useState(BUSINESS_TYPES[0].value);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [lastCity, setLastCity] = useState("");

  const handleSearch = async () => {
    if (!city.trim()) return setError("Please enter a city name.");
    setLoading(true);
    setError(null);
    setLeads([]);
    try {
      const result = await searchLeads({ city: city.trim(), business_type: businessType, max_results: 20 });
      setLeads(result.businesses);
      setLastCity(result.city);
      setSearched(true);
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || "Search failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="section-title flex items-center gap-2">
          <Search className="w-5 h-5 text-brand-500" />
          Lead Discovery
        </h2>
        <p className="section-subtitle">Find ethnic wear businesses in any city to expand your network</p>
      </div>

      {/* Search form */}
      <div className="card">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-1 space-y-1.5">
            <Label>City *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                className="pl-9"
                placeholder="e.g. Mumbai, Surat…"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            {/* Quick city chips */}
            <div className="flex flex-wrap gap-1 pt-1">
              {POPULAR_CITIES.slice(0, 6).map((c) => (
                <button
                  key={c}
                  onClick={() => setCity(c)}
                  className={`text-[10px] px-2 py-0.5 rounded-full border transition-all ${
                    city === c ? "bg-brand-500 text-white border-brand-500" : "text-gray-500 border-gray-200 hover:border-brand-300"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="sm:col-span-1 space-y-1.5">
            <Label>Business Type</Label>
            <Select value={businessType} onValueChange={setBusinessType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {BUSINESS_TYPES.map((b) => (
                  <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="sm:col-span-1 flex items-end">
            <Button onClick={handleSearch} disabled={loading} className="w-full gap-2 h-9">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Searching…</> : <><Search className="w-4 h-4" />Find Businesses</>}
            </Button>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
          <span>🔑</span>
          <span>Uses Google Places API. Add <code className="bg-gray-100 px-1 rounded">GOOGLE_PLACES_API_KEY</code> to backend/.env to enable.</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm flex gap-2">
          <span>⚠️</span>{error}
        </div>
      )}

      {/* Results */}
      {leads.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900">{leads.length} businesses found in {lastCity}</h3>
              <p className="text-sm text-gray-500">Click phone numbers to copy · Sorted by Google relevance</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToCSV(leads, lastCity)}
              className="gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {leads.map((lead, i) => (
              <LeadCard key={lead.id} lead={lead} index={i} />
            ))}
          </div>
        </div>
      )}

      {searched && leads.length === 0 && !loading && !error && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">🔍</div>
          <p className="font-semibold text-gray-700">No businesses found in {lastCity}</p>
          <p className="text-sm text-gray-400 mt-1">Try a different city or business type.</p>
        </div>
      )}

      {!searched && !loading && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">🗺️</div>
          <p className="font-semibold text-gray-700 mb-1">Discover ethnic wear businesses near you</p>
          <p className="text-sm text-gray-400 max-w-sm mx-auto">
            Enter a city to find boutiques, saree shops, and retailers to grow your sales network.
          </p>
        </div>
      )}
    </div>
  );
}
