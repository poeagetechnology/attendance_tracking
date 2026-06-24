import { useState, useEffect } from 'react';
import { Search, Plus, X, CheckCircle, XCircle, Clock } from 'lucide-react';
import { getLeaveRequests, addLeaveRequest, updateLeaveRequest, getEmployees, LeaveRequest, LeaveStatus, Employee } from '../../store/dataStore';

const LEAVE_TYPES = ['Annual', 'Sick', 'Emergency', 'Maternity', 'Paternity', 'Unpaid'] as const;

const statusStyles: Record<LeaveStatus, string> = {
  Pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Approved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const statusIcons: Record<LeaveStatus, typeof Clock> = {
  Pending: Clock,
  Approved: CheckCircle,
  Rejected: XCircle,
};

export function LeaveRequests() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ employeeId: '', type: 'Annual' as typeof LEAVE_TYPES[number], startDate: '', endDate: '', reason: '' });

  useEffect(() => {
    setRequests(getLeaveRequests());
    setEmployees(getEmployees());
  }, []);

  function refresh() { setRequests(getLeaveRequests()); }

  function getEmployee(empId: string) {
    return employees.find(e => e.employeeId === empId);
  }

  function calcDays(start: string, end: string) {
    if (!start || !end) return 0;
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return Math.max(1, Math.round(diff / 86400000) + 1);
  }

  function handleSubmit() {
    if (!form.employeeId || !form.startDate || !form.endDate) return;
    addLeaveRequest({
      id: crypto.randomUUID(),
      employeeId: form.employeeId,
      type: form.type,
      startDate: form.startDate,
      endDate: form.endDate,
      days: calcDays(form.startDate, form.endDate),
      reason: form.reason,
      status: 'Pending',
      submittedDate: new Date().toISOString().split('T')[0],
    });
    setShowModal(false);
    setForm({ employeeId: '', type: 'Annual', startDate: '', endDate: '', reason: '' });
    refresh();
  }

  function handleStatusChange(id: string, status: LeaveStatus) {
    const req = requests.find(r => r.id === id);
    if (req) { updateLeaveRequest({ ...req, status }); refresh(); }
  }

  const filtered = requests.filter(r => {
    const emp = getEmployee(r.employeeId);
    const matchSearch = emp ? emp.name.toLowerCase().includes(search.toLowerCase()) || r.employeeId.toLowerCase().includes(search.toLowerCase()) : true;
    const matchStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const sorted = [...filtered].sort((a, b) => b.submittedDate.localeCompare(a.submittedDate));

  const pending = requests.filter(r => r.status === 'Pending').length;
  const approved = requests.filter(r => r.status === 'Approved').length;
  const rejected = requests.filter(r => r.status === 'Rejected').length;

  return (
    <main className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Leave Requests</h2>
          <p className="text-sm text-[#94a3b8]">Manage employee leave applications</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#D4AF37] hover:bg-[#B8941E] text-[#0B0F19] font-medium rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          New Request
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Pending', count: pending, style: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: Clock },
          { label: 'Approved', count: approved, style: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: CheckCircle },
          { label: 'Rejected', count: rejected, style: 'bg-red-500/20 text-red-400 border-red-500/30', icon: XCircle },
        ].map(({ label, count, style, icon: Icon }) => (
          <div key={label} className="bg-[#1E293B] border border-[rgba(148,163,184,0.2)] rounded-xl p-5 flex items-center gap-4">
            <div className={`p-3 rounded-lg border ${style}`}><Icon className="w-5 h-5" /></div>
            <div>
              <p className="text-2xl font-bold text-white">{count}</p>
              <p className="text-sm text-[#94a3b8]">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
          <input type="text" placeholder="Search by employee name or ID..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#1E293B] text-white placeholder:text-[#94a3b8] pl-10 pr-4 py-2.5 rounded-lg border border-[rgba(148,163,184,0.2)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="bg-[#1E293B] text-white px-4 py-2.5 rounded-lg border border-[rgba(148,163,184,0.2)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]">
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Cards List */}
      <div className="space-y-3">
        {sorted.length === 0 ? (
          <div className="bg-[#1E293B] border border-[rgba(148,163,184,0.2)] rounded-xl p-12 text-center text-[#94a3b8]">No leave requests found</div>
        ) : sorted.map(req => {
          const emp = getEmployee(req.employeeId);
          const Icon = statusIcons[req.status];
          return (
            <div key={req.id} className="bg-[#1E293B] border border-[rgba(148,163,184,0.2)] rounded-xl p-5 hover:border-[#D4AF37]/40 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8941E] flex items-center justify-center text-sm font-bold text-[#0B0F19] shrink-0">
                    {emp?.avatar ?? '??'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-white">{emp?.name ?? req.employeeId}</p>
                      <span className="text-xs text-[#94a3b8]">{req.employeeId}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-[#0B0F19] text-[#94a3b8] border border-[rgba(148,163,184,0.2)]">{req.type}</span>
                    </div>
                    <p className="text-xs text-[#94a3b8] mb-2">{req.startDate} → {req.endDate} · {req.days} day{req.days !== 1 ? 's' : ''} · Submitted {req.submittedDate}</p>
                    {req.reason && <p className="text-sm text-[#94a3b8] italic">"{req.reason}"</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[req.status]}`}>
                    <Icon className="w-3.5 h-3.5" />
                    {req.status}
                  </span>
                  {req.status === 'Pending' && (
                    <div className="flex gap-2">
                      <button onClick={() => handleStatusChange(req.id, 'Approved')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-medium transition-colors">
                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button onClick={() => handleStatusChange(req.id, 'Rejected')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/30 rounded-lg text-xs font-medium transition-colors">
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E293B] border border-[rgba(148,163,184,0.2)] rounded-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(148,163,184,0.2)]">
              <h3 className="text-lg font-bold text-white">New Leave Request</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-[#0B0F19] rounded-lg text-[#94a3b8]"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-[#94a3b8] mb-1.5">Employee *</label>
                <select value={form.employeeId} onChange={e => setForm({ ...form, employeeId: e.target.value })}
                  className="w-full bg-[#0B0F19] text-white px-3 py-2 rounded-lg border border-[rgba(148,163,184,0.2)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm">
                  <option value="">Select employee...</option>
                  {employees.map(e => <option key={e.id} value={e.employeeId}>{e.name} ({e.employeeId})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#94a3b8] mb-1.5">Leave Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as typeof LEAVE_TYPES[number] })}
                  className="w-full bg-[#0B0F19] text-white px-3 py-2 rounded-lg border border-[rgba(148,163,184,0.2)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm">
                  {LEAVE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#94a3b8] mb-1.5">Start Date *</label>
                  <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })}
                    className="w-full bg-[#0B0F19] text-white px-3 py-2 rounded-lg border border-[rgba(148,163,184,0.2)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-[#94a3b8] mb-1.5">End Date *</label>
                  <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })}
                    className="w-full bg-[#0B0F19] text-white px-3 py-2 rounded-lg border border-[rgba(148,163,184,0.2)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm" />
                </div>
              </div>
              {form.startDate && form.endDate && (
                <p className="text-xs text-[#D4AF37]">{calcDays(form.startDate, form.endDate)} day(s) requested</p>
              )}
              <div>
                <label className="block text-xs text-[#94a3b8] mb-1.5">Reason</label>
                <textarea value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} rows={3}
                  className="w-full bg-[#0B0F19] text-white px-3 py-2 rounded-lg border border-[rgba(148,163,184,0.2)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm resize-none" placeholder="Optional reason..." />
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-[rgba(148,163,184,0.2)]">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 bg-[#0B0F19] text-white border border-[rgba(148,163,184,0.2)] rounded-lg hover:border-[#D4AF37] transition-colors font-medium text-sm">Cancel</button>
              <button onClick={handleSubmit} className="flex-1 px-4 py-2.5 bg-[#D4AF37] hover:bg-[#B8941E] text-[#0B0F19] rounded-lg transition-colors font-medium text-sm">Submit Request</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
