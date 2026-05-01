"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Loader2, Upload, Sparkles } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { createDesign } from "@/lib/api";
import type { Design } from "@/lib/types";

const CATEGORIES = ["Sarees", "Salwar Suits", "Kurtis", "Lehengas", "Anarkali Suits", "Dupattas", "Other"];
const WORK_TYPES = ["Embroidered", "Printed", "Plain", "Bandhani", "Chikankari", "Sequin", "Block Print", "Woven", "Zardozi", "Other"];
const FABRICS = ["Cotton", "Silk", "Georgette", "Rayon", "Net", "Velvet", "Linen", "Chiffon", "Banarasi", "Chanderi", "Other"];
const COLORS = ["Red", "Pink", "Blue", "Green", "Yellow", "Orange", "Purple", "White", "Cream", "Maroon", "Gold", "Black", "Multi-color", "Other"];

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

  const [form, setForm] = useState({
    name: "", category: "", color: "", fabric: "", work_type: "", price: "",
  });

  const onDrop = useCallback((accepted: File[]) => {
    const f = accepted[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setAutoColors([]);
    setError(null);
    // Auto-fill name from filename
    const noExt = f.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    setForm((prev) => ({ ...prev, name: prev.name || noExt }));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"], "image/webp": [".webp"] },
    maxFiles: 1,
    disabled: loading,
  });

  const set = (k: keyof typeof form) => (v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = async () => {
    if (!file) return setError("Please select a design image.");
    if (!form.name.trim()) return setError("Design name is required.");

    setLoading(true);
    setError(null);
    try {
      const result = await createDesign(file, form);
      setAutoColors(result.design_intelligence?.dominant_colors || []);
      onSuccess(result.design);
      // Reset
      setFile(null);
      setPreview(null);
      setForm({ name: "", category: "", color: "", fabric: "", work_type: "", price: "" });
      onOpenChange(false);
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>📸 Upload New Design</DialogTitle>
          <DialogDescription>Add a design to your catalog with metadata for smart matching.</DialogDescription>
        </DialogHeader>

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

        {/* Auto-detected colors (Design Intelligence) */}
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
                  <span className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: c.hex }} />
                  {c.name_approx}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Metadata form */}
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 space-y-1">
            <Label>Design Name *</Label>
            <Input placeholder="e.g. Floral Anarkali A101" value={form.name} onChange={(e) => set("name")(e.target.value)} />
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
            <Label>Work Type / Style</Label>
            <Select value={form.work_type} onValueChange={set("work_type")}>
              <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
              <SelectContent>
                {WORK_TYPES.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2 space-y-1">
            <Label>Price (₹) — optional</Label>
            <Input type="number" placeholder="e.g. 1850" value={form.price} onChange={(e) => set("price")(e.target.value)} />
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
