"use client";

import type { DeadStockItem } from "@/lib/types";

interface DeadStockTableProps {
  items: DeadStockItem[];
}

export default function DeadStockTable({ items }: DeadStockTableProps) {
  if (!items.length) {
    return (
      <div className="card flex items-center gap-3 bg-green-50 border-green-200">
        <span className="text-2xl">✅</span>
        <div>
          <p className="font-semibold text-green-800">All designs are selling!</p>
          <p className="text-sm text-green-600">No dead stock detected in the last 30 days.</p>
        </div>
      </div>
    );
  }

  const dead = items.filter((i) => i.status === "Dead Stock");
  const slow = items.filter((i) => i.status === "Slow Moving");

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="section-title">⚠️ Dead Stock & Slow Movers</h2>
          <p className="section-subtitle">Designs with low or zero sales in the last 30 days</p>
        </div>
        <div className="flex gap-2">
          {dead.length > 0 && (
            <span className="badge bg-red-100 text-red-700">{dead.length} Dead</span>
          )}
          {slow.length > 0 && (
            <span className="badge bg-orange-100 text-orange-700">{slow.length} Slow</span>
          )}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-start gap-2">
        <span className="text-amber-500 mt-0.5">💡</span>
        <p className="text-sm text-amber-800">
          Consider <strong>discounting</strong> dead stock, running <strong>bundle offers</strong>, or <strong>clearing inventory</strong> to free up capital for new stock.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="pb-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Design / Product</th>
              <th className="pb-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Units (Last 30d)</th>
              <th className="pb-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="pb-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Suggested Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.map((item, i) => (
              <tr key={i} className={`hover:bg-gray-50 transition-colors ${item.status === "Dead Stock" ? "bg-red-50/30" : "bg-orange-50/20"}`}>
                <td className="py-3 text-sm font-medium text-gray-900 pr-4 truncate max-w-[200px]">{item.product}</td>
                <td className="py-3 text-center">
                  <span className={`font-bold text-sm ${item.status === "Dead Stock" ? "text-red-600" : "text-orange-600"}`}>
                    {item.units_last_30d}
                  </span>
                </td>
                <td className="py-3 text-center">
                  <span className={`badge ${item.status === "Dead Stock" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"}`}>
                    {item.status}
                  </span>
                </td>
                <td className="py-3 text-xs text-gray-500">
                  {item.status === "Dead Stock" ? "Offer 20–30% discount or bundle deal" : "Promote on WhatsApp / Instagram"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
