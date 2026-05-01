"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Loader2, Users } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDesignMatches } from "@/lib/api";
import type { Design, CustomerMatch } from "@/lib/types";

interface DesignMatchModalProps {
  design: Design | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ScoreBadge({ score }: { score: number }) {
  if (score >= 70) return <Badge variant="success">{score}% match</Badge>;
  if (score >= 45) return <Badge variant="warning">{score}% match</Badge>;
  return <Badge variant="secondary">{score}% match</Badge>;
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 70 ? "bg-green-400" : score >= 45 ? "bg-yellow-400" : "bg-gray-300";
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
      <div className={`h-1.5 rounded-full ${color} transition-all duration-500`} style={{ width: `${score}%` }} />
    </div>
  );
}

export default function DesignMatchModal({ design, open, onOpenChange }: DesignMatchModalProps) {
  const [matches, setMatches] = useState<CustomerMatch[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!design || !open) return;
    setLoading(true);
    setError(null);
    getDesignMatches(design.id)
      .then(({ matches, total_customers }) => { setMatches(matches); setTotal(total_customers); })
      .catch((err) => setError(err?.response?.data?.detail || "Failed to load matches."))
      .finally(() => setLoading(false));
  }, [design, open]);

  if (!design) return null;

  const highMatches = matches.filter((m) => m.score >= 70).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-500" />
            Customer Matches for "{design.name}"
          </DialogTitle>
          <DialogDescription>
            Customers whose preferences best match this design
          </DialogDescription>
        </DialogHeader>

        {/* Design thumbnail */}
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
          {design.image_url && (
            <img src={design.image_url} alt={design.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
          )}
          <div className="min-w-0">
            <p className="font-semibold text-sm text-gray-900 truncate">{design.name}</p>
            <div className="flex gap-1.5 flex-wrap mt-1">
              {design.category && <span className="badge bg-purple-100 text-purple-700">{design.category}</span>}
              {design.color && <span className="badge bg-blue-100 text-blue-700">{design.color}</span>}
              {design.price && <span className="badge bg-green-100 text-green-700">₹{design.price}</span>}
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-10 gap-2 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Finding matching customers…</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 rounded-xl p-3 text-sm">{error}</div>
        )}

        {!loading && !error && (
          <>
            {/* Stats */}
            <div className="flex gap-3">
              <div className="flex-1 bg-purple-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-brand-600">{matches.length}</p>
                <p className="text-xs text-gray-500">Matched</p>
              </div>
              <div className="flex-1 bg-green-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-green-600">{highMatches}</p>
                <p className="text-xs text-gray-500">High Match (≥70%)</p>
              </div>
              <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-gray-600">{total}</p>
                <p className="text-xs text-gray-500">Total Customers</p>
              </div>
            </div>

            {matches.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">No customers found. Add customers first.</p>
                <p className="text-xs text-gray-400 mt-1">Go to the Customers tab to add your buyers.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {matches.map((m, i) => (
                  <div key={m.customer_id} className="border border-gray-100 rounded-xl p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {m.customer_name?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-gray-900 truncate">{m.customer_name}</p>
                          {m.region && <p className="text-xs text-gray-400">{m.region}</p>}
                        </div>
                      </div>
                      <ScoreBadge score={m.score} />
                    </div>
                    <ScoreBar score={m.score} />
                    {m.reasons.length > 0 && (
                      <ul className="mt-2 space-y-0.5">
                        {m.reasons.map((r, j) => (
                          <li key={j} className="text-xs text-gray-500 flex items-center gap-1">
                            <span className="text-green-400">✓</span> {r}
                          </li>
                        ))}
                      </ul>
                    )}
                    {m.whatsapp_url && (
                      <a href={m.whatsapp_url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex">
                        <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50 h-7 text-xs gap-1">
                          <MessageCircle className="w-3 h-3" /> Send WhatsApp
                        </Button>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
