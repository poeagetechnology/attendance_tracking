import { useEffect, useState } from 'react';
import { Users, UserCheck, UserX, FileText } from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { AttendanceTable } from '../components/AttendanceTable';
import { WeeklyChart } from '../components/WeeklyChart';
import { QuickActions } from '../components/QuickActions';
import { getDashboardMetrics } from '../../store/dataStore';

export function Dashboard() {
  const [metrics, setMetrics] = useState({ totalEmployees: 0, presentToday: 0, absentLate: 0, pendingLeave: 0 });

  useEffect(() => { setMetrics(getDashboardMetrics()); }, []);

  const yesterdayPresent = metrics.presentToday - 1;
  const absentPct = metrics.totalEmployees > 0
    ? `${((metrics.absentLate / metrics.totalEmployees) * 100).toFixed(0)}% of workforce`
    : '—';

  return (
    <main className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Employees"
          value={metrics.totalEmployees}
          icon={<Users className="w-6 h-6 text-[#94a3b8]" />}
          badgeText="Active"
          badgeColor="neutral"
        />
        <MetricCard
          title="Present Today"
          value={metrics.presentToday}
          icon={<UserCheck className="w-6 h-6 text-emerald-400" />}
          badgeText={yesterdayPresent >= 0 ? `+${yesterdayPresent} from yesterday` : `${yesterdayPresent} from yesterday`}
          badgeColor="success"
        />
        <MetricCard
          title="Absent/Late"
          value={metrics.absentLate}
          icon={<UserX className="w-6 h-6 text-amber-400" />}
          badgeText={absentPct}
          badgeColor="warning"
        />
        <MetricCard
          title="Pending Leave Requests"
          value={metrics.pendingLeave}
          icon={<FileText className="w-6 h-6 text-[#D4AF37]" />}
          badgeText="Requires action"
          badgeColor="gold"
        />
      </div>

      <div className="mb-8">
        <AttendanceTable />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <WeeklyChart />
        </div>
        <div className="lg:col-span-2">
          <QuickActions />
        </div>
      </div>
    </main>
  );
}
