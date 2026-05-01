interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon?: string;
  color?: string;
}

export default function StatCard({ label, value, sub, icon, color = "brand" }: StatCardProps) {
  const colorMap: Record<string, string> = {
    brand: "bg-purple-50 text-purple-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    blue: "bg-blue-50 text-blue-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="stat-card animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1 flex-1">
          <span className="stat-label">{label}</span>
          <span className="stat-value">{value}</span>
          {sub && <span className="text-xs text-gray-400">{sub}</span>}
        </div>
        {icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${colorMap[color] || colorMap.brand}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
