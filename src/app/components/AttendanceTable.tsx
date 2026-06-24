import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getAttendance, getEmployees, AttendanceRecord, Employee } from '../../store/dataStore';
import { StatusBadge } from './StatusBadge';

const PAGE_SIZE = 10;

export function AttendanceTable() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setRecords(getAttendance());
    setEmployees(getEmployees());
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todayRecords = records.filter(r => r.date === today);
  const totalPages = Math.max(1, Math.ceil(todayRecords.length / PAGE_SIZE));
  const paginated = todayRecords.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function getEmployee(empId: string) {
    return employees.find(e => e.employeeId === empId);
  }

  return (
    <div className="bg-[#1E293B] border border-[rgba(148,163,184,0.2)] rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-[rgba(148,163,184,0.2)]">
        <h3 className="text-lg font-bold text-white">Live Attendance Status</h3>
        <p className="text-sm text-[#94a3b8] mt-1">Real-time clock-in data for today</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#0B0F19]">
            <tr>
              {['Employee', 'Date', 'Clock-In', 'Clock-Out', 'Status'].map(h => (
                <th key={h} className="px-6 py-4 text-left text-xs font-medium text-[#94a3b8] uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(148,163,184,0.2)]">
            {paginated.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-[#94a3b8]">No attendance records for today</td></tr>
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
                        <p className="text-sm font-medium text-white">{emp?.name ?? record.employeeId}</p>
                        <p className="text-xs text-[#94a3b8]">{record.employeeId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{record.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{record.clockIn}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{record.clockOut}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={record.status} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-[rgba(148,163,184,0.2)] flex items-center justify-between">
        <p className="text-sm text-[#94a3b8]">
          Showing {Math.min((page - 1) * PAGE_SIZE + 1, todayRecords.length)}–{Math.min(page * PAGE_SIZE, todayRecords.length)} of {todayRecords.length} today
        </p>
        <div className="flex gap-2">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
            className="p-2 rounded-lg bg-[#0B0F19] border border-[rgba(148,163,184,0.2)] hover:border-[#D4AF37] disabled:opacity-40 transition-colors">
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${page === p ? 'bg-[#D4AF37] text-[#0B0F19]' : 'bg-[#0B0F19] border border-[rgba(148,163,184,0.2)] text-white hover:border-[#D4AF37]'}`}>
              {p}
            </button>
          ))}
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
            className="p-2 rounded-lg bg-[#0B0F19] border border-[rgba(148,163,184,0.2)] hover:border-[#D4AF37] disabled:opacity-40 transition-colors">
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
