import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Clock,
  FileText,
  BarChart3,
  Settings,
} from "lucide-react";
import { getSettings } from "../../store/dataStore";

interface NavItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

const navItems: NavItem[] = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/" },
  { name: "Employee Directory", icon: Users, href: "/employees" },
  { name: "Attendance Logs", icon: Clock, href: "/attendance" },
  { name: "Leave Requests", icon: FileText, href: "/leave" },
  { name: "Analytics", icon: BarChart3, href: "/analytics" },
  { name: "Settings", icon: Settings, href: "/settings" },
];

interface SidebarProps {
  activePage: string;
  onNavigate: (href: string) => void;
}

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const [appName, setAppName] = useState("");

  useEffect(() => {
    function sync() {
      const s = getSettings();
      setAppName(s.appName);
    }
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [activePage]);

  const initials = appName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="w-64 bg-[#0B0F19] border-r border-[rgba(148,163,184,0.2)] flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-[rgba(148,163,184,0.2)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#B8941E] rounded-lg flex items-center justify-center">
            {initials ? (
              <span className="text-sm font-bold text-[#0B0F19]">
                {initials}
              </span>
            ) : (
              <Clock className="w-6 h-6 text-[#0B0F19]" />
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              {appName || "Admin Portal"}
            </h1>
            <p className="text-xs text-[#94a3b8]">Admin Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.href;
            return (
              <li key={item.name}>
                <button
                  onClick={() => onNavigate(item.href)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                    isActive
                      ? "bg-[rgba(212,175,55,0.15)] text-[#D4AF37] border-l-2 border-[#D4AF37] -ml-[2px]"
                      : "text-[#94a3b8] hover:bg-[#1E293B] hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
