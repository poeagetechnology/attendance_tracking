import { Search, Bell, ChevronDown } from 'lucide-react';

export function Header() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="bg-[#0B0F19] border-b border-[rgba(148,163,184,0.2)] px-8 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        {/* Left: Page Title & Date */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Attendance Overview</h2>
          <p className="text-sm text-[#94a3b8]">{currentDate}</p>
        </div>

        {/* Right: Search, Notifications, Profile */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
            <input
              type="text"
              placeholder="Search employee, ID..."
              className="bg-[#1E293B] text-white placeholder:text-[#94a3b8] pl-10 pr-4 py-2 rounded-lg border border-[rgba(148,163,184,0.2)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] w-64"
            />
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button className="p-2 rounded-lg bg-[#1E293B] border border-[rgba(148,163,184,0.2)] hover:bg-[#334155] transition-colors">
              <Bell className="w-5 h-5 text-white" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>

          {/* Admin Profile */}
          <div className="flex items-center gap-3 pl-4 border-l border-[rgba(148,163,184,0.2)]">
            <div className="text-right">
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs text-[#94a3b8]">Super Admin</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8941E] flex items-center justify-center font-bold text-[#0B0F19]">
              AU
            </div>
            <ChevronDown className="w-4 h-4 text-[#94a3b8]" />
          </div>
        </div>
      </div>
    </header>
  );
}
