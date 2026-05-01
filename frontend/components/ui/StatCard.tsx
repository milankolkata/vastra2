import { Package, IndianRupee, Palette, Calendar, TrendingUp, Users, AlertTriangle } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon?: string;
  color?: string;
}

const iconMap: Record<string, React.ReactNode> = {
  package:       <Package className="w-5 h-5" />,
  "indian-rupee":<IndianRupee className="w-5 h-5" />,
  palette:       <Palette className="w-5 h-5" />,
  calendar:      <Calendar className="w-5 h-5" />,
  "trending-up": <TrendingUp className="w-5 h-5" />,
  users:         <Users className="w-5 h-5" />,
  alert:         <AlertTriangle className="w-5 h-5" />,
};

const colorMap: Record<string, string> = {
  brand:  "bg-violet-50 text-violet-600",
  green:  "bg-emerald-50 text-emerald-600",
  orange: "bg-amber-50 text-amber-600",
  blue:   "bg-sky-50 text-sky-600",
  red:    "bg-red-50 text-red-600",
};

export default function StatCard({ label, value, sub, icon, color = "brand" }: StatCardProps) {
  const resolvedIcon = icon ? iconMap[icon] : null;
  const colorClass = colorMap[color] ?? colorMap.brand;

  return (
    <div className="stat-card animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <span className="stat-label">{label}</span>
          <span className="stat-value">{value}</span>
          {sub && <span className="text-xs text-slate-400">{sub}</span>}
        </div>
        {resolvedIcon && (
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
            {resolvedIcon}
          </div>
        )}
      </div>
    </div>
  );
}
