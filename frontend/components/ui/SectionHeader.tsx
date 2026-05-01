interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
}

export default function SectionHeader({ title, subtitle, icon }: SectionHeaderProps) {
  return (
    <div className="mb-5">
      <h2 className="section-title flex items-center gap-2">
        {icon && <span>{icon}</span>}
        {title}
      </h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  );
}
