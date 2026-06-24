import { FileText, UserCheck, Edit } from 'lucide-react';

export function QuickActions() {
  return (
    <div className="bg-[#1E293B] border border-[rgba(148,163,184,0.2)] rounded-xl p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white">Quick Actions</h3>
        <p className="text-sm text-[#94a3b8] mt-1">Common administrative tasks</p>
      </div>

      <div className="space-y-3">
        <button className="w-full flex items-center gap-3 p-4 bg-[#D4AF37] hover:bg-[#B8941E] text-[#0B0F19] rounded-lg transition-all duration-200 font-medium">
          <FileText className="w-5 h-5" />
          <span>Export Report (CSV/PDF)</span>
        </button>

        <button className="w-full flex items-center gap-3 p-4 bg-[#0B0F19] hover:bg-[#334155] text-white border border-[rgba(148,163,184,0.2)] hover:border-[#D4AF37] rounded-lg transition-all duration-200 font-medium">
          <UserCheck className="w-5 h-5" />
          <span>Bulk Check-In</span>
        </button>

        <button className="w-full flex items-center gap-3 p-4 bg-[#0B0F19] hover:bg-[#334155] text-white border border-[rgba(148,163,184,0.2)] hover:border-[#D4AF37] rounded-lg transition-all duration-200 font-medium">
          <Edit className="w-5 h-5" />
          <span>Manual Entry Correction</span>
        </button>
      </div>

      {/* Additional Stats */}
      <div className="mt-6 pt-6 border-t border-[rgba(148,163,184,0.2)]">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#94a3b8]">Average Attendance</span>
            <span className="text-sm font-medium text-[#D4AF37]">94.2%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#94a3b8]">This Month</span>
            <span className="text-sm font-medium text-white">5,420 check-ins</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#94a3b8]">Peak Hours</span>
            <span className="text-sm font-medium text-white">8:30 - 9:00 AM</span>
          </div>
        </div>
      </div>
    </div>
  );
}
