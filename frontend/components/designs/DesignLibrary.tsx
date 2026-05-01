"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Trash2, Users, SlidersHorizontal, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import DesignUploadModal from "./DesignUploadModal";
import DesignMatchModal from "./DesignMatchModal";
import { listDesigns, deleteDesign } from "@/lib/api";
import type { Design } from "@/lib/types";

const CATEGORIES = ["All", "Sarees", "Salwar Suits", "Kurtis", "Lehengas", "Anarkali Suits"];
const COLORS = ["All", "Red", "Pink", "Blue", "Green", "Yellow", "White", "Cream", "Maroon", "Gold", "Purple"];
const FABRICS = ["All", "Cotton", "Silk", "Georgette", "Rayon", "Net", "Velvet", "Linen", "Chiffon"];

function DesignCard({
  design,
  onDelete,
  onMatchClick,
}: {
  design: Design;
  onDelete: (id: string) => void;
  onMatchClick: (d: Design) => void;
}) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${design.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await deleteDesign(design.id);
      onDelete(design.id);
    } catch {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all duration-200 animate-fade-in">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {design.image_url ? (
          <img
            src={design.image_url}
            alt={design.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">👗</div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-end justify-center pb-3 gap-2 opacity-0 group-hover:opacity-100">
          <Button size="sm" className="text-xs h-7 gap-1 bg-white text-gray-900 hover:bg-gray-50" onClick={() => onMatchClick(design)}>
            <Users className="w-3 h-3" /> Find Matches
          </Button>
          <Button size="sm" variant="destructive" className="text-xs h-7 gap-1" onClick={handleDelete} disabled={deleting}>
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
        {/* Auto-color dots */}
        {design.auto_colors && design.auto_colors.length > 0 && (
          <div className="absolute top-2 right-2 flex gap-0.5">
            {design.auto_colors.slice(0, 4).map((c) => (
              <div key={c.hex} title={c.name_approx} className="w-3 h-3 rounded-full border border-white/80 shadow-sm" style={{ backgroundColor: c.hex }} />
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="font-semibold text-sm text-gray-900 truncate">{design.name}</p>
        <div className="flex flex-wrap gap-1 mt-1.5">
          {design.category && <Badge variant="default" className="text-[10px] px-1.5 py-0">{design.category}</Badge>}
          {design.color && <Badge variant="info" className="text-[10px] px-1.5 py-0">{design.color}</Badge>}
          {design.work_type && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{design.work_type}</Badge>}
        </div>
        <div className="flex items-center justify-between mt-2">
          {design.price ? (
            <span className="text-sm font-bold text-gray-700">₹{design.price.toLocaleString("en-IN")}</span>
          ) : (
            <span className="text-xs text-gray-400">No price</span>
          )}
          <button
            onClick={() => onMatchClick(design)}
            className="text-xs text-brand-500 hover:text-brand-700 font-medium flex items-center gap-1"
          >
            <Users className="w-3 h-3" /> Match
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onUpload }: { onUpload: () => void }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center text-4xl mb-4">
        👗
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-1">No designs yet</h3>
      <p className="text-sm text-gray-500 mb-5 max-w-xs">Upload your first design to build your catalog and start matching customers.</p>
      <Button onClick={onUpload} className="gap-2">
        <Plus className="w-4 h-4" /> Upload First Design
      </Button>
    </div>
  );
}

export default function DesignLibrary() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [filtered, setFiltered] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [matchDesign, setMatchDesign] = useState<Design | null>(null);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [colorFilter, setColorFilter] = useState("All");
  const [fabricFilter, setFabricFilter] = useState("All");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listDesigns();
      setDesigns(data);
      setFiltered(data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to load designs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Client-side filtering
  useEffect(() => {
    let f = [...designs];
    if (search) f = f.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));
    if (catFilter !== "All") f = f.filter((d) => d.category?.toLowerCase() === catFilter.toLowerCase());
    if (colorFilter !== "All") f = f.filter((d) => d.color?.toLowerCase() === colorFilter.toLowerCase());
    if (fabricFilter !== "All") f = f.filter((d) => d.fabric?.toLowerCase() === fabricFilter.toLowerCase());
    setFiltered(f);
  }, [designs, search, catFilter, colorFilter, fabricFilter]);

  const handleUploaded = (design: Design) => {
    setDesigns((prev) => [design, ...prev]);
  };

  const handleDeleted = (id: string) => {
    setDesigns((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="section-title flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-500" />
            Design Library
          </h2>
          <p className="section-subtitle">
            {designs.length} design{designs.length !== 1 ? "s" : ""} in your catalog · AI-powered customer matching
          </p>
        </div>
        <Button onClick={() => setUploadOpen(true)} className="gap-2 flex-shrink-0">
          <Plus className="w-4 h-4" /> Upload Design
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-wrap gap-3 items-center">
        <SlidersHorizontal className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            className="pl-9"
            placeholder="Search designs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c === "All" ? "All Categories" : c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={colorFilter} onValueChange={setColorFilter}>
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            {COLORS.map((c) => <SelectItem key={c} value={c}>{c === "All" ? "All Colors" : c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={fabricFilter} onValueChange={setFabricFilter}>
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            {FABRICS.map((f) => <SelectItem key={f} value={f}>{f === "All" ? "All Fabrics" : f}</SelectItem>)}
          </SelectContent>
        </Select>
        {(search || catFilter !== "All" || colorFilter !== "All" || fabricFilter !== "All") && (
          <button
            onClick={() => { setSearch(""); setCatFilter("All"); setColorFilter("All"); setFabricFilter("All"); }}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm flex gap-2">
          <span>⚠️</span>{error}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl aspect-square animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.length === 0 ? (
            <EmptyState onUpload={() => setUploadOpen(true)} />
          ) : (
            filtered.map((d) => (
              <DesignCard
                key={d.id}
                design={d}
                onDelete={handleDeleted}
                onMatchClick={(d) => setMatchDesign(d)}
              />
            ))
          )}
        </div>
      )}

      {/* Modals */}
      <DesignUploadModal open={uploadOpen} onOpenChange={setUploadOpen} onSuccess={handleUploaded} />
      <DesignMatchModal design={matchDesign} open={!!matchDesign} onOpenChange={(o) => !o && setMatchDesign(null)} />
    </div>
  );
}
