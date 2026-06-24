import { useState, useEffect } from 'react';
import { Save, RotateCcw, Bell, Clock, Building2, User, Shield } from 'lucide-react';
import { getSettings, saveSettings, Settings } from '../../store/dataStore';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function SettingsPage() {
  const [form, setForm] = useState<Settings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setForm(getSettings()); }, []);

  if (!form) return null;

  function handleSave() {
    if (!form) return;
    saveSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleReset() {
    setForm(getSettings());
  }

  function toggleWeekend(day: string) {
    setForm(f => {
      if (!f) return f;
      const days = f.weekendDays.includes(day)
        ? f.weekendDays.filter(d => d !== day)
        : [...f.weekendDays, day];
      return { ...f, weekendDays: days };
    });
  }

  return (
    <main className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Settings</h2>
          <p className="text-sm text-[#94a3b8]">Configure your attendance system</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2.5 bg-[#1E293B] text-white border border-[rgba(148,163,184,0.2)] hover:border-[#D4AF37] rounded-lg transition-colors font-medium text-sm">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
          <button onClick={handleSave} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors font-medium text-sm ${saved ? 'bg-emerald-500 text-white' : 'bg-[#D4AF37] hover:bg-[#B8941E] text-[#0B0F19]'}`}>
            <Save className="w-4 h-4" />
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Company Settings */}
        <div className="bg-[#1E293B] border border-[rgba(148,163,184,0.2)] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#0B0F19] rounded-lg border border-[rgba(148,163,184,0.2)]">
              <Building2 className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Company</h3>
              <p className="text-xs text-[#94a3b8]">Organization details</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#94a3b8] mb-1.5">Company Name</label>
              <input value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })}
                className="w-full bg-[#0B0F19] text-white px-3 py-2.5 rounded-lg border border-[rgba(148,163,184,0.2)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm" />
            </div>
          </div>
        </div>

        {/* Work Hours */}
        <div className="bg-[#1E293B] border border-[rgba(148,163,184,0.2)] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#0B0F19] rounded-lg border border-[rgba(148,163,184,0.2)]">
              <Clock className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Work Hours</h3>
              <p className="text-xs text-[#94a3b8]">Schedule and attendance rules</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-[#94a3b8] mb-1.5">Work Start Time</label>
              <input type="time" value={form.workStartTime} onChange={e => setForm({ ...form, workStartTime: e.target.value })}
                className="w-full bg-[#0B0F19] text-white px-3 py-2.5 rounded-lg border border-[rgba(148,163,184,0.2)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm" />
            </div>
            <div>
              <label className="block text-xs text-[#94a3b8] mb-1.5">Work End Time</label>
              <input type="time" value={form.workEndTime} onChange={e => setForm({ ...form, workEndTime: e.target.value })}
                className="w-full bg-[#0B0F19] text-white px-3 py-2.5 rounded-lg border border-[rgba(148,163,184,0.2)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm" />
            </div>
            <div>
              <label className="block text-xs text-[#94a3b8] mb-1.5">Late Threshold (minutes)</label>
              <input type="number" min="1" max="120" value={form.lateThresholdMinutes} onChange={e => setForm({ ...form, lateThresholdMinutes: Number(e.target.value) })}
                className="w-full bg-[#0B0F19] text-white px-3 py-2.5 rounded-lg border border-[rgba(148,163,184,0.2)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm" />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-xs text-[#94a3b8] mb-3">Weekend Days (non-working)</label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map(day => (
                <button key={day} onClick={() => toggleWeekend(day)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${form.weekendDays.includes(day) ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40' : 'bg-[#0B0F19] text-[#94a3b8] border-[rgba(148,163,184,0.2)] hover:border-[#D4AF37]'}`}>
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Admin Profile */}
        <div className="bg-[#1E293B] border border-[rgba(148,163,184,0.2)] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#0B0F19] rounded-lg border border-[rgba(148,163,184,0.2)]">
              <User className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Admin Profile</h3>
              <p className="text-xs text-[#94a3b8]">Administrator account details</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#94a3b8] mb-1.5">Admin Name</label>
              <input value={form.adminName} onChange={e => setForm({ ...form, adminName: e.target.value })}
                className="w-full bg-[#0B0F19] text-white px-3 py-2.5 rounded-lg border border-[rgba(148,163,184,0.2)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm" />
            </div>
            <div>
              <label className="block text-xs text-[#94a3b8] mb-1.5">Admin Email</label>
              <input type="email" value={form.adminEmail} onChange={e => setForm({ ...form, adminEmail: e.target.value })}
                className="w-full bg-[#0B0F19] text-white px-3 py-2.5 rounded-lg border border-[rgba(148,163,184,0.2)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm" />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-[#1E293B] border border-[rgba(148,163,184,0.2)] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#0B0F19] rounded-lg border border-[rgba(148,163,184,0.2)]">
              <Bell className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Notifications</h3>
              <p className="text-xs text-[#94a3b8]">Alert preferences</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-[#0B0F19] rounded-lg border border-[rgba(148,163,184,0.2)]">
            <div>
              <p className="text-sm font-medium text-white">Enable Notifications</p>
              <p className="text-xs text-[#94a3b8]">Receive alerts for late arrivals and leave requests</p>
            </div>
            <button onClick={() => setForm({ ...form, notificationsEnabled: !form.notificationsEnabled })}
              className={`relative w-12 h-6 rounded-full transition-colors ${form.notificationsEnabled ? 'bg-[#D4AF37]' : 'bg-[#334155]'}`}>
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${form.notificationsEnabled ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-[#1E293B] border border-red-500/30 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/30">
              <Shield className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-red-400">Danger Zone</h3>
              <p className="text-xs text-[#94a3b8]">Irreversible actions</p>
            </div>
          </div>
          <button onClick={() => {
            if (window.confirm('This will reset ALL data to defaults. This cannot be undone. Continue?')) {
              localStorage.clear();
              window.location.reload();
            }
          }} className="px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg text-sm font-medium transition-colors">
            Reset All Data to Defaults
          </button>
        </div>
      </div>
    </main>
  );
}
