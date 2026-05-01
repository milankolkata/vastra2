"use client";

import type { TopProduct } from "@/lib/types";

interface TopProductsTableProps {
  products: TopProduct[];
}

export default function TopProductsTable({ products }: TopProductsTableProps) {
  if (!products.length) return null;

  const maxUnits = products[0]?.units || 1;

  return (
    <div className="card">
      <h2 className="section-title">🏆 Top Performing Designs</h2>
      <p className="section-subtitle">Your best-selling products by units sold</p>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="pb-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
              <th className="pb-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Design / Product</th>
              <th className="pb-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Units</th>
              <th className="pb-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Revenue</th>
              <th className="pb-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell w-32">Performance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((p, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 pr-3 text-sm font-bold text-gray-400">#{i + 1}</td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    {i === 0 && <span className="text-lg">🥇</span>}
                    {i === 1 && <span className="text-lg">🥈</span>}
                    {i === 2 && <span className="text-lg">🥉</span>}
                    <span className="text-sm font-medium text-gray-900 truncate max-w-[180px]">{p.product}</span>
                  </div>
                </td>
                <td className="py-3 text-right text-sm font-semibold text-gray-900">{p.units.toLocaleString()}</td>
                <td className="py-3 text-right text-sm text-gray-500 hidden sm:table-cell">
                  {p.revenue > 0 ? `₹${p.revenue.toLocaleString()}` : "—"}
                </td>
                <td className="py-3 pl-4 hidden md:table-cell">
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-400"
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
