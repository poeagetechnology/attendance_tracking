interface MetricCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  badgeText?: string;
  badgeColor: 'neutral' | 'success' | 'warning' | 'gold';
}

const badgeStyles = {
  neutral: 'bg-[#334155] text-[#94a3b8]',
  success: 'bg-emerald-500/20 text-emerald-400',
  warning: 'bg-amber-500/20 text-amber-400',
  gold: 'bg-[#D4AF37]/20 text-[#D4AF37]',
};

export function MetricCard({ title, value, icon, badgeText, badgeColor }: MetricCardProps) {
  return (
    <div className="bg-[#1E293B] border border-[rgba(148,163,184,0.2)] rounded-xl p-6 hover:border-[#D4AF37]/50 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-[#0B0F19] rounded-lg border border-[rgba(148,163,184,0.2)]">
          {icon}
        </div>
        {badgeText && (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${badgeStyles[badgeColor]}`}>
            {badgeText}
          </span>
        )}
      </div>
      <h3 className="text-3xl font-bold text-white mb-2">{value}</h3>
      <p className="text-sm text-[#94a3b8]">{title}</p>
    </div>
  );
}
