"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Pencil, Image, Phone, MapPin, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import CustomerForm from "./CustomerForm";
import { listCustomers, deleteCustomer, uploadCustomerImage, listCustomerImages, deleteCustomerImage } from "@/lib/api";
import type { Customer } from "@/lib/types";
import { useDropzone } from "react-dropzone";

// ── Reference image uploader for a specific customer ──────────
function ImagePrefUploader({ customerId, onClose }: { customerId: string; onClose: () => void }) {
  const [images, setImages] = useState<{ id: string; image_url: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loadingImgs, setLoadingImgs] = useState(true);

  useEffect(() => {
    listCustomerImages(customerId)
      .then(setImages)
      .finally(() => setLoadingImgs(false));
  }, [customerId]);

  const onDrop = useCallback(async (accepted: File[]) => {
    setUploading(true);
    try {
      for (const file of accepted) {
        await uploadCustomerImage(customerId, file);
      }
      const fresh = await listCustomerImages(customerId);
      setImages(fresh);
    } finally {
      setUploading(false);
    }
  }, [customerId]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"], "image/webp": [".webp"] },
    disabled: uploading,
  });

  const handleDelete = async (id: string) => {
    await deleteCustomerImage(id);
    setImages((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Upload images of outfits this customer likes — AI will use them for visual similarity matching.
      </p>
      <div
        {...getRootProps()}
        className="border-2 border-dashed rounded-xl p-5 text-center cursor-pointer hover:border-brand-300 transition-colors"
      >
        <input {...getInputProps()} />
        <p className="text-sm text-gray-500">{uploading ? "Uploading…" : "Drag or click to add reference images"}</p>
      </div>
      {loadingImgs ? (
        <div className="text-center text-sm text-gray-400 py-4">Loading…</div>
      ) : images.length === 0 ? (
        <p className="text-center text-sm text-gray-400 py-4">No reference images yet.</p>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {images.map((img) => (
            <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-50">
              <img src={img.image_url} alt="ref" className="w-full h-full object-cover" />
              <button
                onClick={() => handleDelete(img.id)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Customer card ──────────────────────────────────────────────
function CustomerCard({
  customer,
  onEdit,
  onDelete,
  onImages,
}: {
  customer: Customer;
  onEdit: (c: Customer) => void;
  onDelete: (id: string) => void;
  onImages: (c: Customer) => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const allPrefs = [
    ...(customer.preferred_categories || []),
    ...(customer.preferred_styles || []),
    ...(customer.color_preference || []),
  ];

  const handleDelete = async () => {
    if (!confirm(`Remove ${customer.name}?`)) return;
    setDeleting(true);
    try {
      await deleteCustomer(customer.id);
      onDelete(customer.id);
    } catch { setDeleting(false); }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-all animate-slide-up">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-saffron-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {customer.name[0]?.toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 truncate">{customer.name}</p>
              <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                {customer.phone && (
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{customer.phone}</span>
                )}
                {(customer.region_city || customer.region_state) && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {[customer.region_city, customer.region_state].filter(Boolean).join(", ")}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onImages(customer)}>
                <Image className="w-3.5 h-3.5 text-blue-500" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onEdit(customer)}>
                <Pencil className="w-3.5 h-3.5 text-gray-500" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleDelete} disabled={deleting}>
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
              </Button>
            </div>
          </div>

          {/* Budget */}
          {(customer.price_min || customer.price_max) && (
            <p className="text-xs text-green-600 font-medium mt-1">
              Budget: ₹{customer.price_min?.toLocaleString("en-IN") || "0"} – ₹{customer.price_max?.toLocaleString("en-IN") || "∞"}
            </p>
          )}

          {/* Preference tags */}
          {allPrefs.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {allPrefs.slice(0, 5).map((p) => (
                <span key={p} className="badge bg-gray-100 text-gray-600 text-[10px]">{p}</span>
              ))}
              {allPrefs.length > 5 && (
                <span className="badge bg-gray-100 text-gray-400 text-[10px]">+{allPrefs.length - 5}</span>
              )}
            </div>
          )}

          {/* Reference images badge */}
          {(customer.image_pref_count || 0) > 0 && (
            <div className="flex items-center gap-1 mt-2">
              <Badge variant="info" className="text-[10px] gap-1">
                <Image className="w-2.5 h-2.5" />
                {customer.image_pref_count} reference image{customer.image_pref_count !== 1 ? "s" : ""}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {customer.notes && (
        <p className="text-xs text-gray-500 mt-2 bg-gray-50 rounded-lg px-2 py-1.5 italic">{customer.notes}</p>
      )}
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────
export default function CustomerManager() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [imageCustomer, setImageCustomer] = useState<Customer | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCustomers(await listCustomers());
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to load customers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSaved = (customer: Customer) => {
    setCustomers((prev) => {
      const idx = prev.findIndex((c) => c.id === customer.id);
      return idx >= 0
        ? prev.map((c) => (c.id === customer.id ? customer : c))
        : [customer, ...prev];
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="section-title flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-500" />
            Smart Customer Targeting
          </h2>
          <p className="section-subtitle">
            {customers.length} customer{customers.length !== 1 ? "s" : ""} · Save preferences to get design match recommendations
          </p>
        </div>
        <Button
          onClick={() => { setEditCustomer(null); setFormOpen(true); }}
          className="gap-2 flex-shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Customer
        </Button>
      </div>

      {/* How it works banner */}
      {customers.length === 0 && !loading && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-2xl p-5">
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <Star className="w-4 h-4 text-brand-500" /> How Smart Targeting Works
          </h3>
          <ol className="space-y-1.5 text-sm text-gray-600">
            <li>1. Add your customers and their style preferences (category, color, style, budget)</li>
            <li>2. Optionally upload reference images of outfits they like</li>
            <li>3. When you upload a new design, click "Find Matches" to see who to contact</li>
            <li>4. Send personalised WhatsApp messages with one click</li>
          </ol>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-28 animate-pulse" />
          ))}
        </div>
      ) : customers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-3xl mb-3">👤</div>
          <p className="font-semibold text-gray-700 mb-1">No customers yet</p>
          <p className="text-sm text-gray-400 mb-4">Add your first customer to start smart targeting</p>
          <Button onClick={() => setFormOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Add First Customer
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map((c) => (
            <CustomerCard
              key={c.id}
              customer={c}
              onEdit={(c) => { setEditCustomer(c); setFormOpen(true); }}
              onDelete={(id) => setCustomers((prev) => prev.filter((x) => x.id !== id))}
              onImages={(c) => setImageCustomer(c)}
            />
          ))}
        </div>
      )}

      {/* Customer form modal */}
      <CustomerForm
        open={formOpen}
        onOpenChange={(o) => { setFormOpen(o); if (!o) setEditCustomer(null); }}
        existing={editCustomer}
        onSuccess={handleSaved}
      />

      {/* Reference images modal */}
      <Dialog open={!!imageCustomer} onOpenChange={(o) => !o && setImageCustomer(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>📷 Reference Images — {imageCustomer?.name}</DialogTitle>
            <DialogDescription>Upload outfits this customer likes for AI visual matching</DialogDescription>
          </DialogHeader>
          {imageCustomer && (
            <ImagePrefUploader
              customerId={imageCustomer.id}
              onClose={() => { setImageCustomer(null); load(); }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
