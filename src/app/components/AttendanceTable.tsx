import { MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface AttendanceRecord {
  id: string;
  employeeName: string;
  employeeId: string;
  avatar: string;
  date: string;
  clockIn: string;
  clockOut: string;
  status: 'On Time' | 'Late' | 'Absent' | 'On Leave';
}

const mockData: AttendanceRecord[] = [
  { id: '1', employeeName: 'Sarah Johnson', employeeId: 'EMP-001', avatar: 'SJ', date: '2026-06-24', clockIn: '08:45 AM', clockOut: '05:30 PM', status: 'On Time' },
  { id: '2', employeeName: 'Michael Chen', employeeId: 'EMP-002', avatar: 'MC', date: '2026-06-24', clockIn: '09:15 AM', clockOut: '05:45 PM', status: 'Late' },
  { id: '3', employeeName: 'Emily Rodriguez', employeeId: 'EMP-003', avatar: 'ER', date: '2026-06-24', clockIn: '08:30 AM', clockOut: '05:00 PM', status: 'On Time' },
  { id: '4', employeeName: 'David Park', employeeId: 'EMP-004', avatar: 'DP', date: '2026-06-24', clockIn: '--', clockOut: '--', status: 'Absent' },
  { id: '5', employeeName: 'Jessica Williams', employeeId: 'EMP-005', avatar: 'JW', date: '2026-06-24', clockIn: '08:50 AM', clockOut: '05:20 PM', status: 'On Time' },
  { id: '6', employeeName: 'Ryan Thompson', employeeId: 'EMP-006', avatar: 'RT', date: '2026-06-24', clockIn: '09:30 AM', clockOut: '06:00 PM', status: 'Late' },
  { id: '7', employeeName: 'Amanda Lee', employeeId: 'EMP-007', avatar: 'AL', date: '2026-06-24', clockIn: '08:40 AM', clockOut: '05:15 PM', status: 'On Time' },
  { id: '8', employeeName: 'James Martinez', employeeId: 'EMP-008', avatar: 'JM', date: '2026-06-24', clockIn: '--', clockOut: '--', status: 'On Leave' },
  { id: '9', employeeName: 'Lisa Anderson', employeeId: 'EMP-009', avatar: 'LA', date: '2026-06-24', clockIn: '08:35 AM', clockOut: '05:10 PM', status: 'On Time' },
  { id: '10', employeeName: 'Kevin Brown', employeeId: 'EMP-010', avatar: 'KB', date: '2026-06-24', clockIn: '09:10 AM', clockOut: '05:40 PM', status: 'Late' },
];

export function AttendanceTable() {
  return (
    <div className="bg-[#1E293B] border border-[rgba(148,163,184,0.2)] rounded-xl overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-[rgba(148,163,184,0.2)]">
        <h3 className="text-lg font-bold text-white">Live Attendance Status</h3>
        <p className="text-sm text-[#94a3b8] mt-1">Real-time clock-in data for today</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#0B0F19]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#94a3b8] uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#94a3b8] uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#94a3b8] uppercase tracking-wider">
                Clock-In
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#94a3b8] uppercase tracking-wider">
                Clock-Out
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#94a3b8] uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#94a3b8] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(148,163,184,0.2)]">
            {mockData.map((record) => (
              <tr key={record.id} className="hover:bg-[#0B0F19]/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8941E] flex items-center justify-center text-sm font-bold text-[#0B0F19]">
                      {record.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{record.employeeName}</p>
                      <p className="text-xs text-[#94a3b8]">{record.employeeId}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {record.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {record.clockIn}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {record.clockOut}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={record.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="p-2 hover:bg-[#0B0F19] rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4 text-[#94a3b8]" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-[rgba(148,163,184,0.2)] flex items-center justify-between">
        <p className="text-sm text-[#94a3b8]">Showing 1-10 of 250</p>
        <div className="flex gap-2">
          <button className="p-2 rounded-lg bg-[#0B0F19] border border-[rgba(148,163,184,0.2)] hover:border-[#D4AF37] transition-colors">
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <button className="px-4 py-2 rounded-lg bg-[#D4AF37] text-[#0B0F19] font-medium">
            1
          </button>
          <button className="px-4 py-2 rounded-lg bg-[#0B0F19] border border-[rgba(148,163,184,0.2)] text-white hover:border-[#D4AF37] transition-colors">
            2
          </button>
          <button className="px-4 py-2 rounded-lg bg-[#0B0F19] border border-[rgba(148,163,184,0.2)] text-white hover:border-[#D4AF37] transition-colors">
            3
          </button>
          <button className="p-2 rounded-lg bg-[#0B0F19] border border-[rgba(148,163,184,0.2)] hover:border-[#D4AF37] transition-colors">
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
