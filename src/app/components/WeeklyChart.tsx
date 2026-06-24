import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { day: 'Mon', present: 230, late: 15, absent: 5 },
  { day: 'Tue', present: 235, late: 10, absent: 5 },
  { day: 'Wed', present: 240, late: 8, absent: 2 },
  { day: 'Thu', present: 238, late: 10, absent: 2 },
  { day: 'Fri', present: 225, late: 20, absent: 5 },
  { day: 'Sat', present: 200, late: 5, absent: 45 },
  { day: 'Sun', present: 180, late: 3, absent: 67 },
];

export function WeeklyChart() {
  return (
    <div className="bg-[#1E293B] border border-[rgba(148,163,184,0.2)] rounded-xl p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white">Weekly Attendance Trends</h3>
        <p className="text-sm text-[#94a3b8] mt-1">Performance overview for the current week</p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
          <XAxis 
            dataKey="day" 
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8' }}
          />
          <YAxis 
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#0B0F19', 
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '8px',
              color: '#ffffff'
            }}
          />
          <Legend 
            wrapperStyle={{ color: '#94a3b8' }}
          />
          <Bar dataKey="present" fill="#10b981" name="Present" radius={[4, 4, 0, 0]} />
          <Bar dataKey="late" fill="#f59e0b" name="Late" radius={[4, 4, 0, 0]} />
          <Bar dataKey="absent" fill="#ef4444" name="Absent" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
