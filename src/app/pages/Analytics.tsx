import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { getEmployees, getAttendance, getLeaveRequests, Department } from '../../store/dataStore';

const DEPT_COLORS: Record<string, string> = {
  Engineering: '#3b82f6',
  Marketing: '#a855f7',
  Sales: '#10b981',
  HR: '#ec4899',
  Finance: '#f59e0b',
  Operations: '#f97316',
  Design: '#06b6d4',
};

const PIE_COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

export function Analytics() {
  const [weeklyData, setWeeklyData] = useState<{ day: string; present: number; late: number; absent: number }[]>([]);
  const [deptData, setDeptData] = useState<{ dept: string; count: number; present: number; rate: string }[]>([]);
  const [pieData, setPieData] = useState<{ name: string; value: number }[]>([]);
  const [leaveData, setLeaveData] = useState<{ type: string; count: number }[]>([]);
  const [summary, setSummary] = useState({ total: 0, avgRate: '0', totalCheckIns: 0, pendingLeave: 0 });

  useEffect(() => {
    const employees = getEmployees();
    const attendance = getAttendance();
    const leave = getLeaveRequests();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Weekly data (last 7 days)
    const weekly = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayRecs = attendance.filter(r => r.date === dateStr);
      weekly.push({
        day: days[d.getDay()],
        present: dayRecs.filter(r => r.status === 'On Time').length,
        late: dayRecs.filter(r => r.status === 'Late').length,
        absent: dayRecs.filter(r => r.status === 'Absent').length,
      });
    }
    setWeeklyData(weekly);

    // Department breakdown
    const depts = [...new Set(employees.map(e => e.department))] as Department[];
    const dept = depts.map(d => {
      const empIds = employees.filter(e => e.department === d).map(e => e.employeeId);
      const deptRecs = attendance.filter(r => empIds.includes(r.employeeId));
      const presentRecs = deptRecs.filter(r => r.status === 'On Time' || r.status === 'Late').length;
      const rate = deptRecs.length > 0 ? ((presentRecs / deptRecs.length) * 100).toFixed(0) : '0';
      return { dept: d, count: empIds.length, present: presentRecs, rate: `${rate}%` };
    });
    setDeptData(dept);

    // Status pie
    const today = new Date().toISOString().split('T')[0];
    const todayRecs = attendance.filter(r => r.date === today);
    setPieData([
      { name: 'On Time', value: todayRecs.filter(r => r.status === 'On Time').length },
      { name: 'Late', value: todayRecs.filter(r => r.status === 'Late').length },
      { name: 'Absent', value: todayRecs.filter(r => r.status === 'Absent').length },
      { name: 'On Leave', value: todayRecs.filter(r => r.status === 'On Leave').length },
    ].filter(d => d.value > 0));

    // Leave types
    const leaveTypeCounts = leave.reduce<Record<string, number>>((acc, r) => {
      acc[r.type] = (acc[r.type] ?? 0) + 1;
      return acc;
    }, {});
    setLeaveData(Object.entries(leaveTypeCounts).map(([type, count]) => ({ type, count })));

    // Summary
    const allPresent = attendance.filter(r => r.status === 'On Time' || r.status === 'Late').length;
    const avgRate = attendance.length > 0 ? ((allPresent / attendance.length) * 100).toFixed(1) : '0';
    setSummary({
      total: employees.filter(e => e.status === 'Active').length,
      avgRate,
      totalCheckIns: allPresent,
      pendingLeave: leave.filter(r => r.status === 'Pending').length,
    });
  }, []);

  return (
    <main className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-1">Analytics</h2>
        <p className="text-sm text-[#94a3b8]">Attendance insights and trends</p>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Employees', value: summary.total, color: 'text-white' },
          { label: 'Avg Attendance Rate', value: `${summary.avgRate}%`, color: 'text-[#D4AF37]' },
          { label: 'Total Check-Ins', value: summary.totalCheckIns.toLocaleString(), color: 'text-emerald-400' },
          { label: 'Pending Leave', value: summary.pendingLeave, color: 'text-amber-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-[#1E293B] border border-[rgba(148,163,184,0.2)] rounded-xl p-5">
            <p className={`text-2xl font-bold ${color} mb-1`}>{value}</p>
            <p className="text-sm text-[#94a3b8]">{label}</p>
          </div>
        ))}
      </div>

      {/* Weekly Trend + Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-[#1E293B] border border-[rgba(148,163,184,0.2)] rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-1">Weekly Attendance</h3>
          <p className="text-sm text-[#94a3b8] mb-6">Last 7 days breakdown</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
              <XAxis dataKey="day" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0B0F19', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '8px', color: '#fff' }} />
              <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }} />
              <Bar dataKey="present" fill="#10b981" name="On Time" radius={[4, 4, 0, 0]} />
              <Bar dataKey="late" fill="#f59e0b" name="Late" radius={[4, 4, 0, 0]} />
              <Bar dataKey="absent" fill="#ef4444" name="Absent" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#1E293B] border border-[rgba(148,163,184,0.2)] rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-1">Today's Status</h3>
          <p className="text-sm text-[#94a3b8] mb-6">Distribution of attendance</p>
          {pieData.length === 0 ? (
            <div className="h-[280px] flex items-center justify-center text-[#94a3b8] text-sm">No data for today</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0B0F19', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '8px', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-xs text-[#94a3b8]">{d.name}</span>
                    </div>
                    <span className="text-xs font-medium text-white">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Department Breakdown + Leave Types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1E293B] border border-[rgba(148,163,184,0.2)] rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-1">Department Breakdown</h3>
          <p className="text-sm text-[#94a3b8] mb-6">Attendance rate by department</p>
          <div className="space-y-4">
            {deptData.map(d => (
              <div key={d.dept}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-white">{d.dept}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#94a3b8]">{d.count} emp</span>
                    <span className="text-sm font-medium text-[#D4AF37]">{d.rate}</span>
                  </div>
                </div>
                <div className="w-full bg-[#0B0F19] rounded-full h-2">
                  <div className="h-2 rounded-full transition-all" style={{ width: d.rate, background: DEPT_COLORS[d.dept] ?? '#D4AF37' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1E293B] border border-[rgba(148,163,184,0.2)] rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-1">Leave by Type</h3>
          <p className="text-sm text-[#94a3b8] mb-6">Distribution of leave requests</p>
          {leaveData.length === 0 ? (
            <div className="h-[200px] flex items-center justify-center text-[#94a3b8] text-sm">No leave data</div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={leaveData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis type="number" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis dataKey="type" type="category" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} width={70} />
                <Tooltip contentStyle={{ backgroundColor: '#0B0F19', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="count" fill="#D4AF37" name="Requests" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </main>
  );
}
