import { useState, useEffect } from 'react';
import { Search, Plus, X, Check } from 'lucide-react';
import { getAttendance, getEmployees, addAttendanceRecord, updateAttendanceRecord, AttendanceRecord, AttendanceStatus, Employee } from '../../store/dataStore';
import { StatusBadge } from '../components/StatusBadge';

const STATUSES: AttendanceStatus[] = ['On Time', 'Late', 'Absent', 'On Leave'];

export function AttendanceLogs() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<AttendanceRecord | null>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const [form, setForm] = useState({ employeeId: '', date: new Date().toISOString().split('T')[0], clockIn: '', clockOut: '', status: 'On Time' as AttendanceStatus });

  useEffect(() => {
    setRecords(getAttendance());
    setEmployees(getEmployees());
  }, []);

  function refresh() { setRecords(getAttendance()); }

  function getEmployee(empId: string) {
    return employees.find(e => e.employeeId === empId);
  }

  function openAdd() {
    setEditTarget(null);
    setForm({ employeeId: '', date: new Date().toISOString().split('T')[0], clockIn: '', clockOut: '', status: 'On Time' });
    setShowModal(true);
  }

  function openEdit(record: AttendanceRecord) {
    setEditTarget(record);
    setForm({ employeeId: record.employeeId, date: record.date, clockIn: record.clockIn === '--' ? '' : record.clockIn, clockOut: record.clockOut === '--' ? '' : record.clockOut, status: record.status });
    setShowModal(true);
  }

  function handleSubmit() {
    if (!form.employeeId || !form.date) return;
    const clockIn = form.clockIn || '--';
    const clockOut = form.clockOut || '--';
    if (editTarget) {
      updateAttendanceRecord({ ...editTarget, ...form, clockIn, clockOut });
    } else {
      addAttendanceRecord({ id: crypto.randomUUID(), ...form, clockIn, clockOut });
    }
    setShowModal(false);
    refresh();
  }

  const filtered = records.filter(r => {
    const emp = getEmployee(r.employeeId);
    const matchSearch = emp ? emp.name.toLowerCase().includes(search.toLowerCase()) || r.employeeId.toLowerCase().includes(search.toLowerCase()) : r.employeeId.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchDate = !dateFilter || r.date === dateFilter;
    return matchSearch && matchStatus && matchDate;
  });

  const sorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date));
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <main className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Attendance Logs</h2>
          <p className="text-sm text-[#94a3b8]">{filtered.length} records found</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-[#D4AF37] hover:bg-[#B8941E] text-[#0B0F19] font-medium rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          Add Record
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
          <input
            type="text"
            placeholder="Search by name or employee ID..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-[#1E293B] text-white placeholder:text-[#94a3b8] pl-10 pr-4 py-2.5 rounded-lg border border-[rgba(148,163,184,0.2)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          />
        </div>
        <input
          type="date"
          value={dateFilter}
          onChange={e => { setDateFilter(e.target.value); setPage(1); }}
          className="bg-[#1E293B] text-white px-4 py-2.5 rounded-lg border border-[rgba(148,163,184,0.2)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
        />
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="bg-[#1E293B] text-white px-4 py-2.5 rounded-lg border border-[rgba(148,163,184,0.2)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
        >
          <option value="All">All Status</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#1E293B] border border-[rgba(148,163,184,0.2)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0B0F19]">
              <tr>
                {['Employee', 'Date', 'Clock-In', 'Clock-Out', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-medium text-[#94a3b8] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(148,163,184,0.2)]">
              {paginated.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-[#94a3b8]">No records found</td></tr>
              ) : paginated.map(record => {
                const emp = getEmployee(record.employeeId);
                return (
                  <tr key={record.id} className="hover:bg-[#0B0F19]/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8941E] flex items-center justify-center text-sm font-bold text-[#0B0F19]">
                          {emp?.avatar ?? record.employeeId.slice(-2)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{emp?.name ?? 'Unknown'}</p>
                          <p className="text-xs text-[#94a3b8]">{record.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{record.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{record.clockIn}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{record.clockOut}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={record.status} /></td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button onClick={() => openEdit(record)} className="px-3 py-1.5 text-xs bg-[#0B0F19] border border-[rgba(148,163,184,0.2)] hover:border-[#D4AF37] text-white rounded-lg transition-colors">
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-[rgba(148,163,184,0.2)] flex items-center justify-between">
          <p className="text-sm text-[#94a3b8]">Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</p>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 rounded-lg bg-[#0B0F19] border border-[rgba(148,163,184,0.2)] text-white disabled:opacity-40 hover:border-[#D4AF37] transition-colors text-sm">Prev</button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${page === p ? 'bg-[#D4AF37] text-[#0B0F19]' : 'bg-[#0B0F19] border border-[rgba(148,163,184,0.2)] text-white hover:border-[#D4AF37]'}`}>{p}</button>
            ))}
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 rounded-lg bg-[#0B0F19] border border-[rgba(148,163,184,0.2)] text-white disabled:opacity-40 hover:border-[#D4AF37] transition-colors text-sm">Next</button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E293B] border border-[rgba(148,163,184,0.2)] rounded-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(148,163,184,0.2)]">
              <h3 className="text-lg font-bold text-white">{editTarget ? 'Edit Record' : 'Add Attendance Record'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-[#0B0F19] rounded-lg text-[#94a3b8]"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-[#94a3b8] mb-1.5">Employee *</label>
                <select value={form.employeeId} onChange={e => setForm({ ...form, employeeId: e.target.value })} className="w-full bg-[#0B0F19] text-white px-3 py-2 rounded-lg border border-[rgba(148,163,184,0.2)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm">
                  <option value="">Select employee...</option>
                  {employees.map(e => <option key={e.id} value={e.employeeId}>{e.name} ({e.employeeId})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#94a3b8] mb-1.5">Date *</label>
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full bg-[#0B0F19] text-white px-3 py-2 rounded-lg border border-[rgba(148,163,184,0.2)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#94a3b8] mb-1.5">Clock-In</label>
                  <input type="time" value={form.clockIn} onChange={e => setForm({ ...form, clockIn: e.target.value })} className="w-full bg-[#0B0F19] text-white px-3 py-2 rounded-lg border border-[rgba(148,163,184,0.2)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-[#94a3b8] mb-1.5">Clock-Out</label>
                  <input type="time" value={form.clockOut} onChange={e => setForm({ ...form, clockOut: e.target.value })} className="w-full bg-[#0B0F19] text-white px-3 py-2 rounded-lg border border-[rgba(148,163,184,0.2)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-[#94a3b8] mb-1.5">Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as AttendanceStatus })} className="w-full bg-[#0B0F19] text-white px-3 py-2 rounded-lg border border-[rgba(148,163,184,0.2)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm">
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-[rgba(148,163,184,0.2)]">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 bg-[#0B0F19] text-white border border-[rgba(148,163,184,0.2)] rounded-lg hover:border-[#D4AF37] transition-colors font-medium text-sm">Cancel</button>
              <button onClick={handleSubmit} className="flex-1 px-4 py-2.5 bg-[#D4AF37] hover:bg-[#B8941E] text-[#0B0F19] rounded-lg transition-colors font-medium text-sm">
                {editTarget ? 'Save Changes' : 'Add Record'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
