"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";
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

const CATEGORIES = ["Sarees", "Salwar Suits", "Kurtis", "Lehengas", "Anarkali Suits", "Dupattas"];
const STYLES = ["Embroidered", "Printed", "Plain", "Bandhani", "Chikankari", "Festive", "Bridal", "Casual", "Party Wear"];
const COLORS = ["Red", "Pink", "Blue", "Green", "Yellow", "Orange", "White", "Cream", "Maroon", "Gold", "Purple", "Pastel"];

function TagSelector({
  label, options, selected, onChange,
}: {
  label: string; options: string[]; selected: string[]; onChange: (v: string[]) => void;
}) {
  const toggle = (o: string) =>
    onChange(selected.includes(o) ? selected.filter((x) => x !== o) : [...selected, o]);
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => toggle(o)}
            className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-all ${
              selected.includes(o)
                ? "bg-brand-500 text-white border-brand-500"
                : "bg-white text-gray-600 border-gray-200 hover:border-brand-300"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

interface CustomerFormProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  existing?: Customer | null;
  onSuccess: (c: Customer) => void;
}

const EMPTY: Partial<Customer> = {
  name: "", phone: "", region_city: "", region_state: "",
  preferred_categories: [], preferred_styles: [], color_preference: [],
  price_min: undefined, price_max: undefined, notes: "",
};

export default function CustomerForm({ open, onOpenChange, existing, onSuccess }: CustomerFormProps) {
  const [form, setForm] = useState<Partial<Customer>>(existing || EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset when dialog opens
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
          <DialogTitle>{existing ? "Edit Customer" : "👤 Add New Customer"}</DialogTitle>
          <DialogDescription>Save customer preferences for smart design matching</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {/* Basic info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 sm:col-span-1 space-y-1">
              <Label>Full Name *</Label>
              <Input placeholder="e.g. Priya Sharma" value={form.name || ""} onChange={(e) => set("name")(e.target.value)} />
            </div>
            <div className="col-span-2 sm:col-span-1 space-y-1">
              <Label>Phone (WhatsApp)</Label>
              <Input placeholder="9876543210" value={form.phone || ""} onChange={(e) => set("phone")(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>City</Label>
              <Input placeholder="e.g. Mumbai" value={form.region_city || ""} onChange={(e) => set("region_city")(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>State</Label>
              <Input placeholder="e.g. Maharashtra" value={form.region_state || ""} onChange={(e) => set("region_state")(e.target.value)} />
            </div>
          </div>

          {/* Price range */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Min Budget (₹)</Label>
              <Input type="number" placeholder="500" value={form.price_min || ""} onChange={(e) => set("price_min")(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Max Budget (₹)</Label>
              <Input type="number" placeholder="5000" value={form.price_max || ""} onChange={(e) => set("price_max")(e.target.value)} />
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 space-y-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Preferences (used for matching)</p>
            <TagSelector
              label="Preferred Categories"
              options={CATEGORIES}
              selected={form.preferred_categories || []}
              onChange={set("preferred_categories")}
            />
            <TagSelector
              label="Preferred Styles"
              options={STYLES}
              selected={form.preferred_styles || []}
              onChange={set("preferred_styles")}
            />
            <TagSelector
              label="Color Preferences"
              options={COLORS}
              selected={form.color_preference || []}
              onChange={set("color_preference")}
            />
          </div>

          <div className="space-y-1">
            <Label>Notes</Label>
            <Textarea
              placeholder="Any additional notes about this customer's preferences…"
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
          <Button variant="outline" onClick={() => handleOpen(false)} disabled={loading}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</> : existing ? "Save Changes" : "Add Customer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
