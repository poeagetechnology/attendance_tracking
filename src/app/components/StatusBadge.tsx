interface StatusBadgeProps {
  status: 'On Time' | 'Late' | 'Absent' | 'On Leave';
}

const statusStyles = {
  'On Time': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Late': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'Absent': 'bg-red-500/20 text-red-400 border-red-500/30',
  'On Leave': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[status]}`}>
      {status}
    </span>
  );
}
