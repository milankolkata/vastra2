"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Loader2, Upload, Sparkles, Wand2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { createDesign } from "@/lib/api";
import type { Design, AutoTags } from "@/lib/types";

// ── Taxonomy (mirrors indian_wear_knowledge.py) ───────────────
const CATEGORIES = [
  "Sarees", "Salwar Suits", "Kurtis", "Lehengas",
  "Anarkali Suits", "Dupattas", "Sharara", "Gharara", "Palazzo Suits", "Other",
];

const EMBROIDERY_TYPES = [
  "Zardozi", "Chikankari", "Kantha", "Phulkari",
  "Kashmiri Embroidery", "Aari / Maggam", "Mirror Work", "Gota Patti",
  "Mukaish / Kamdani", "Dabka", "Beadwork", "Sequin Work",
  "Resham / Silk Thread", "Sujni", "Banjara", "Kutch Embroidery",
  "Cross Stitch", "Tukdi Patchwork", "Nakshi / Artisanal Thread",
  "Plain / No Embroidery",
];

const PRINT_TYPES = [
  "Block Print", "Bandhani", "Batik", "Kalamkari", "Ajrakh",
  "Dabu", "Leheriya", "Shibori", "Ikat", "Digital Print",
  "Screen Print", "Jamdani", "Warli", "Madhubani",
  "Floral Print", "Geometric Print", "Abstract Print", "Paisley",
  "Patola", "Pochampally", "Stripe / Checks", "Zari / Brocade Woven",
  "Plain / No Print",
];

const FABRICS = [
  "Banarasi Silk", "Kanjivaram Silk", "Tussar Silk", "Chanderi",
  "Mysore Silk", "Organza", "Pure Silk", "Dupion Silk",
  "Georgette", "Chiffon", "Net", "Velvet",
  "Mulmul", "Khadi", "Cotton", "Linen",
  "Rayon", "Crepe", "Patola Silk", "Paithani Silk",
  "Pochampally Fabric", "Bhagalpuri Silk", "Other",
];

const OCCASIONS = [
  "Bridal", "Wedding Guest", "Sangeet", "Mehendi", "Reception",
  "Diwali", "Navratri", "Eid", "Holi", "Festive",
  "Party Wear", "Semi-Formal", "Office / Formal", "Casual", "Daily Wear",
];

const COLORS = [
  "Red", "Pink", "Blue", "Green", "Yellow", "Orange",
  "Purple", "White", "Cream", "Maroon", "Gold", "Black",
  "Peach", "Turquoise", "Rust", "Multi-color", "Other",
];

// ── Occasion multi-select tag pills ──────────────────────────
function OccasionPicker({
  selected, onChange,
}: { selected: string[]; onChange: (v: string[]) => void }) {
  const toggle = (o: string) =>
    onChange(selected.includes(o) ? selected.filter((x) => x !== o) : [...selected, o]);
  return (
    <div className="flex flex-wrap gap-1.5">
      {OCCASIONS.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => toggle(o)}
          className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-all ${
            selected.includes(o)
              ? "bg-amber-500 text-white border-amber-500"
              : "bg-white text-gray-600 border-gray-200 hover:border-amber-300"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

interface DesignUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (design: Design) => void;
}

export default function DesignUploadModal({ open, onOpenChange, onSuccess }: DesignUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [autoColors, setAutoColors] = useState<{ hex: string; name_approx: string; percentage: number }[]>([]);
  const [aiTags, setAiTags] = useState<AutoTags | null>(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    color: "",
    fabric: "",
    work_type: "",
    embroidery_type: "",
    print_type: "",
    occasion_tags: [] as string[],
    price: "",
  });

  const onDrop = useCallback((accepted: File[]) => {
    const f = accepted[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setAutoColors([]);
    setAiTags(null);
    setError(null);
    const noExt = f.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    setForm((prev) => ({ ...prev, name: prev.name || noExt }));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"], "image/webp": [".webp"] },
    maxFiles: 1,
    disabled: loading,
  });

  const set = (k: keyof typeof form) => (v: string | string[]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = async () => {
    if (!file) return setError("Please select a design image.");
    if (!form.name.trim()) return setError("Design name is required.");

    setLoading(true);
    setError(null);
    try {
      const result = await createDesign(file, form);
      setAutoColors(result.design_intelligence?.dominant_colors || []);
      if (result.design_intelligence?.ai_tags) {
        setAiTags(result.design_intelligence.ai_tags);
      }
      onSuccess(result.design);
      // Reset
      setFile(null);
      setPreview(null);
      setAiTags(null);
      setAutoColors([]);
      setForm({
        name: "", category: "", color: "", fabric: "",
        work_type: "", embroidery_type: "", print_type: "",
        occasion_tags: [], price: "",
      });
      onOpenChange(false);
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload New Design</DialogTitle>
          <DialogDescription>
            Add a design with rich metadata — AI will auto-detect embroidery and print if you skip them.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">

          {/* Image dropzone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
              isDragActive ? "border-brand-400 bg-brand-50" : "border-gray-200 hover:border-brand-300"
            }`}
          >
            <input {...getInputProps()} />
            {preview ? (
              <div className="relative">
                <img src={preview} alt="preview" className="w-full max-h-48 object-contain rounded-xl" />
                <p className="text-xs text-gray-400 mt-2">Click or drag to change</p>
              </div>
            ) : (
              <div className="py-6 flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-gray-300" />
                <p className="text-sm text-gray-500">Drag & drop design image here</p>
                <p className="text-xs text-gray-400">JPEG, PNG, WebP · Max 5 MB</p>
              </div>
            )}
          </div>

          {/* AI auto-detected tags (shown after upload response) */}
          {aiTags && (
            <div className="bg-purple-50 rounded-xl p-3 space-y-1.5">
              <div className="flex items-center gap-1.5 text-purple-700">
                <Wand2 className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs font-semibold">
                  AI detected ({aiTags.confidence} confidence)
                </span>
              </div>
              {aiTags.work_description && (
                <p className="text-xs text-purple-600 italic">{aiTags.work_description}</p>
              )}
              <div className="flex flex-wrap gap-1.5">
                {aiTags.embroidery_type && (
                  <span className="text-xs bg-rose-100 text-rose-700 rounded-full px-2 py-0.5">
                    {aiTags.embroidery_type}
                  </span>
                )}
                {aiTags.print_type && (
                  <span className="text-xs bg-violet-100 text-violet-700 rounded-full px-2 py-0.5">
                    {aiTags.print_type}
                  </span>
                )}
                {(aiTags.occasion_tags || []).map((o) => (
                  <span key={o} className="text-xs bg-amber-100 text-amber-700 rounded-full px-2 py-0.5">
                    {o}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Auto-detected colors */}
          {autoColors.length > 0 && (
            <div className="flex items-center gap-2 bg-purple-50 rounded-xl px-3 py-2">
              <Sparkles className="w-4 h-4 text-purple-500 flex-shrink-0" />
              <p className="text-xs text-purple-700 font-medium">AI detected colors:</p>
              <div className="flex gap-1 flex-wrap">
                {autoColors.map((c) => (
                  <span
                    key={c.hex}
                    className="inline-flex items-center gap-1 text-xs bg-white rounded-full px-2 py-0.5 border border-purple-200"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                    {c.name_approx}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Core metadata */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1">
              <Label>Design Name *</Label>
              <Input
                placeholder="e.g. Bridal Zardozi Lehenga A201"
                value={form.name}
                onChange={(e) => set("name")(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={set("category")}>
                <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Color</Label>
              <Select value={form.color} onValueChange={set("color")}>
                <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                <SelectContent>
                  {COLORS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Fabric</Label>
              <Select value={form.fabric} onValueChange={set("fabric")}>
                <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                <SelectContent>
                  {FABRICS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Price (₹)</Label>
              <Input
                type="number"
                placeholder="e.g. 8500"
                value={form.price}
                onChange={(e) => set("price")(e.target.value)}
              />
            </div>
          </div>

          {/* Embroidery */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Embroidery Type
              <span className="ml-1 text-gray-400 font-normal normal-case">(AI will detect if left blank)</span>
            </Label>
            <Select value={form.embroidery_type} onValueChange={set("embroidery_type")}>
              <SelectTrigger><SelectValue placeholder="Auto-detect…" /></SelectTrigger>
              <SelectContent>
                {EMBROIDERY_TYPES.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Print */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Print Type
              <span className="ml-1 text-gray-400 font-normal normal-case">(AI will detect if left blank)</span>
            </Label>
            <Select value={form.print_type} onValueChange={set("print_type")}>
              <SelectTrigger><SelectValue placeholder="Auto-detect…" /></SelectTrigger>
              <SelectContent>
                {PRINT_TYPES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Occasions */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Occasion Tags
              <span className="ml-1 text-gray-400 font-normal normal-case">(auto-inferred if left blank)</span>
            </Label>
            <OccasionPicker
              selected={form.occasion_tags}
              onChange={(v) => set("occasion_tags")(v)}
            />
          </div>

        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 text-red-700 rounded-xl px-3 py-2 text-sm">
            <span>⚠️</span>{error}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading || !file}>
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Uploading…</> : "Upload Design"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
