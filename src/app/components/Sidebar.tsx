import { LayoutDashboard, Users, Clock, FileText, BarChart3, Settings } from 'lucide-react';

interface NavItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { name: 'Employee Directory', icon: Users, href: '/employees' },
  { name: 'Attendance Logs', icon: Clock, href: '/attendance' },
  { name: 'Leave Requests', icon: FileText, href: '/leave' },
  { name: 'Analytics', icon: BarChart3, href: '/analytics' },
  { name: 'Settings', icon: Settings, href: '/settings' },
];

export function Sidebar() {
  const activeItem = 'Dashboard'; // In a real app, this would come from router

  return (
    <aside className="w-64 bg-[#0B0F19] border-r border-[rgba(148,163,184,0.2)] flex flex-col h-screen fixed left-0 top-0">
      {/* Brand Logo & Name */}
      <div className="p-6 border-b border-[rgba(148,163,184,0.2)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#B8941E] rounded-lg flex items-center justify-center">
            <Clock className="w-6 h-6 text-[#0B0F19]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AttendPro</h1>
            <p className="text-xs text-[#94a3b8]">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.name === activeItem;
            
            return (
              <li key={item.name}>
                <a
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-[rgba(212,175,55,0.15)] text-[#D4AF37] border-l-2 border-[#D4AF37] -ml-[2px]' 
                      : 'text-[#94a3b8] hover:bg-[#1E293B] hover:text-white'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[rgba(148,163,184,0.2)]">
        <div className="text-xs text-[#94a3b8] text-center">
          v2.1.0 • © 2026 AttendPro
        </div>
      </div>
    </aside>
  );
}
