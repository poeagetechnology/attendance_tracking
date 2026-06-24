import { Users, UserCheck, UserX, FileText } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MetricCard } from './components/MetricCard';
import { AttendanceTable } from './components/AttendanceTable';
import { WeeklyChart } from './components/WeeklyChart';
import { QuickActions } from './components/QuickActions';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0B0F19] dark">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="ml-64">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="p-8">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total Employees"
              value="250"
              icon={<Users className="w-6 h-6 text-[#94a3b8]" />}
              badgeText="Active"
              badgeColor="neutral"
            />
            <MetricCard
              title="Present Today"
              value="235"
              icon={<UserCheck className="w-6 h-6 text-emerald-400" />}
              badgeText="+5 from yesterday"
              badgeColor="success"
            />
            <MetricCard
              title="Absent/Late"
              value="15"
              icon={<UserX className="w-6 h-6 text-amber-400" />}
              badgeText="6% of workforce"
              badgeColor="warning"
            />
            <MetricCard
              title="Pending Leave Requests"
              value="8"
              icon={<FileText className="w-6 h-6 text-[#D4AF37]" />}
              badgeText="Requires action"
              badgeColor="gold"
            />
          </div>

          {/* Attendance Table */}
          <div className="mb-8">
            <AttendanceTable />
          </div>

          {/* Analytics & Quick Actions Section */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
              <WeeklyChart />
            </div>
            <div className="lg:col-span-2">
              <QuickActions />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
