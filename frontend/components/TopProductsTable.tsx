"use client";

import { Trophy, Medal } from "lucide-react";
import type { TopProduct } from "@/lib/types";

interface TopProductsTableProps {
  products: TopProduct[];
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <Trophy className="w-4 h-4 text-amber-500 shrink-0" />;
  if (rank === 2) return <Medal className="w-4 h-4 text-slate-400 shrink-0" />;
  if (rank === 3) return <Medal className="w-4 h-4 text-amber-700/60 shrink-0" />;
  return null;
}

export default function TopProductsTable({ products }: TopProductsTableProps) {
  if (!products.length) return null;

  const maxUnits = products[0]?.units || 1;

  return (
    <div className="card">
      <h2 className="section-title flex items-center gap-2">
        <Trophy className="w-4 h-4 text-amber-500" />
        Top Performing Designs
      </h2>
      <p className="section-subtitle">Your best-selling products by units sold</p>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="pb-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">#</th>
              <th className="pb-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Design / Product</th>
              <th className="pb-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Units</th>
              <th className="pb-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:table-cell">Revenue</th>
              <th className="pb-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell w-32">Performance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {products.map((p, i) => (
              <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3 pr-3 text-sm font-bold text-slate-300">#{i + 1}</td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <RankBadge rank={i + 1} />
                    <span className="text-sm font-medium text-slate-900 truncate max-w-[180px]">{p.product}</span>
                  </div>
                </td>
                <td className="py-3 text-right text-sm font-semibold text-slate-900">{p.units.toLocaleString()}</td>
                <td className="py-3 text-right text-sm text-slate-500 hidden sm:table-cell">
                  {p.revenue > 0 ? `₹${p.revenue.toLocaleString()}` : "—"}
                </td>
                <td className="py-3 pl-4 hidden md:table-cell">
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-violet-400"
                      style={{ width: `${Math.round((p.units / maxUnits) * 100)}%` }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
