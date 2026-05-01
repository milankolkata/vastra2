import {
  Eye, Lightbulb, BarChart3, TrendingUp, AlertTriangle,
  Package, Sparkles, Users, Shirt, MapPin, Flame,
} from "lucide-react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
}

const iconMap: Record<string, React.ReactNode> = {
  "eye":            <Eye className="w-4 h-4 text-slate-400" />,
  "lightbulb":      <Lightbulb className="w-4 h-4 text-amber-500" />,
  "bar-chart":      <BarChart3 className="w-4 h-4 text-violet-500" />,
  "trending-up":    <TrendingUp className="w-4 h-4 text-emerald-500" />,
  "alert-triangle": <AlertTriangle className="w-4 h-4 text-red-400" />,
  "package":        <Package className="w-4 h-4 text-slate-400" />,
  "sparkles":       <Sparkles className="w-4 h-4 text-amber-500" />,
  "users":          <Users className="w-4 h-4 text-violet-500" />,
  "shirt":          <Shirt className="w-4 h-4 text-violet-500" />,
  "map-pin":        <MapPin className="w-4 h-4 text-rose-500" />,
  "flame":          <Flame className="w-4 h-4 text-orange-500" />,
};

export default function SectionHeader({ title, subtitle, icon }: SectionHeaderProps) {
  const resolvedIcon = icon ? (iconMap[icon] ?? null) : null;

  return (
    <div className="mb-5">
      <h2 className="section-title flex items-center gap-2">
        {resolvedIcon}
        {title}
      </h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  );
}
