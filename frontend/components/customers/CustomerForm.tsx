"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createCustomer, updateCustomer } from "@/lib/api";
import type { Customer } from "@/lib/types";

// ── Taxonomy (mirrors indian_wear_knowledge.py) ───────────────
const CATEGORIES = [
  "Sarees", "Salwar Suits", "Kurtis", "Lehengas",
  "Anarkali Suits", "Dupattas", "Sharara", "Gharara", "Palazzo Suits",
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

const FABRIC_TYPES = [
  "Banarasi Silk", "Kanjivaram Silk", "Tussar Silk", "Chanderi",
  "Mysore Silk", "Organza", "Pure Silk", "Dupion Silk",
  "Georgette", "Chiffon", "Net", "Velvet",
  "Mulmul", "Khadi", "Cotton", "Linen",
  "Rayon", "Crepe", "Patola Silk", "Paithani Silk",
  "Pochampally Fabric", "Bhagalpuri Silk",
];

const OCCASIONS = [
  "Bridal", "Wedding Guest", "Sangeet", "Mehendi", "Reception",
  "Diwali", "Navratri", "Eid", "Holi", "Festive",
  "Party Wear", "Semi-Formal", "Office / Formal", "Casual", "Daily Wear",
];

const COLORS = [
  "Red", "Pink", "Blue", "Green", "Yellow", "Orange",
  "White", "Cream", "Maroon", "Gold", "Purple", "Pastel",
  "Black", "Peach", "Turquoise", "Magenta", "Rust",
];

// ── Reusable tag picker component ─────────────────────────────
function TagSelector({
  label, options, selected, onChange, accent = "brand",
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
  accent?: "brand" | "rose" | "violet" | "amber" | "teal";
}) {
  const toggle = (o: string) =>
    onChange(selected.includes(o) ? selected.filter((x) => x !== o) : [...selected, o]);

  const colorMap: Record<string, string> = {
    brand:  "bg-brand-500 text-white border-brand-500",
    rose:   "bg-rose-500 text-white border-rose-500",
    violet: "bg-violet-500 text-white border-violet-500",
    amber:  "bg-amber-500 text-white border-amber-500",
    teal:   "bg-teal-500 text-white border-teal-500",
  };
  const activeClass = colorMap[accent] ?? colorMap.brand;

  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
        {label}
      </Label>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => toggle(o)}
            className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-all ${
              selected.includes(o)
                ? activeClass
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Section divider ───────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 space-y-4">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{title}</p>
      {children}
    </div>
  );
}

// ── Main form ─────────────────────────────────────────────────
interface CustomerFormProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  existing?: Customer | null;
  onSuccess: (c: Customer) => void;
}

const EMPTY: Partial<Customer> = {
  name: "", phone: "", region_city: "", region_state: "",
  preferred_categories: [],
  preferred_styles: [],
  color_preference: [],
  embroidery_preferences: [],
  print_preferences: [],
  fabric_preferences: [],
  occasion_preferences: [],
  price_min: undefined,
  price_max: undefined,
  notes: "",
};

export default function CustomerForm({ open, onOpenChange, existing, onSuccess }: CustomerFormProps) {
  const [form, setForm] = useState<Partial<Customer>>(existing || EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpen = (o: boolean) => {
    if (o) setForm(existing || EMPTY);
    setError(null);
    onOpenChange(o);
  };

  const set = (k: keyof Customer) => (v: any) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name?.trim()) return setError("Customer name is required.");
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...form,
        price_min: form.price_min ? Number(form.price_min) : undefined,
        price_max: form.price_max ? Number(form.price_max) : undefined,
      };
      const customer = existing
        ? await updateCustomer(existing.id, payload)
        : await createCustomer(payload);
      onSuccess(customer);
      handleOpen(false);
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || "Save failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{existing ? "Edit Customer" : "Add New Customer"}</DialogTitle>
          <DialogDescription>
            Build a complete taste profile for smarter design matching
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">

          {/* Basic info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 sm:col-span-1 space-y-1">
              <Label>Full Name *</Label>
              <Input
                placeholder="e.g. Priya Sharma"
                value={form.name || ""}
                onChange={(e) => set("name")(e.target.value)}
              />
            </div>
            <div className="col-span-2 sm:col-span-1 space-y-1">
              <Label>Phone (WhatsApp)</Label>
              <Input
                placeholder="9876543210"
                value={form.phone || ""}
                onChange={(e) => set("phone")(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>City</Label>
              <Input
                placeholder="e.g. Lucknow"
                value={form.region_city || ""}
                onChange={(e) => set("region_city")(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>State</Label>
              <Input
                placeholder="e.g. Uttar Pradesh"
                value={form.region_state || ""}
                onChange={(e) => set("region_state")(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Min Budget (₹)</Label>
              <Input
                type="number"
                placeholder="2000"
                value={form.price_min || ""}
                onChange={(e) => set("price_min")(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Max Budget (₹)</Label>
              <Input
                type="number"
                placeholder="15000"
                value={form.price_max || ""}
                onChange={(e) => set("price_max")(e.target.value)}
              />
            </div>
          </div>

          {/* Category */}
          <Section title="Garment Categories">
            <TagSelector
              label="What does she buy?"
              options={CATEGORIES}
              selected={form.preferred_categories || []}
              onChange={set("preferred_categories")}
              accent="brand"
            />
          </Section>

          {/* Embroidery — the most important dimension */}
          <Section title="Embroidery Preferences">
            <p className="text-xs text-gray-500 -mt-2">
              Tip: select all she wears — Zardozi & Aari / Maggam are treated as
              the same heavy-work family.
            </p>
            <TagSelector
              label="Embroidery types she loves"
              options={EMBROIDERY_TYPES}
              selected={form.embroidery_preferences || []}
              onChange={set("embroidery_preferences")}
              accent="rose"
            />
          </Section>

          {/* Prints */}
          <Section title="Print Preferences">
            <TagSelector
              label="Print styles she prefers"
              options={PRINT_TYPES}
              selected={form.print_preferences || []}
              onChange={set("print_preferences")}
              accent="violet"
            />
          </Section>

          {/* Occasions */}
          <Section title="Shopping Occasions">
            <TagSelector
              label="What occasions does she shop for?"
              options={OCCASIONS}
              selected={form.occasion_preferences || []}
              onChange={set("occasion_preferences")}
              accent="amber"
            />
          </Section>

          {/* Fabric */}
          <Section title="Fabric Preferences">
            <TagSelector
              label="Fabrics she likes"
              options={FABRIC_TYPES}
              selected={form.fabric_preferences || []}
              onChange={set("fabric_preferences")}
              accent="teal"
            />
          </Section>

          {/* Color */}
          <Section title="Color Preferences">
            <TagSelector
              label="Colours she gravitates towards"
              options={COLORS}
              selected={form.color_preference || []}
              onChange={set("color_preference")}
              accent="brand"
            />
          </Section>

          {/* Notes */}
          <div className="space-y-1">
            <Label>Notes</Label>
            <Textarea
              placeholder="Any extra details — e.g. only buys for weddings, prefers pastel, gifting for daughter…"
              value={form.notes || ""}
              onChange={(e) => set("notes")(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 text-red-700 rounded-xl px-3 py-2 text-sm">
            <span>⚠️</span>{error}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading
              ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</>
              : existing ? "Save Changes" : "Add Customer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
