export type AttendanceStatus = 'On Time' | 'Late' | 'Absent' | 'On Leave';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';
export type Department = 'Engineering' | 'Marketing' | 'Sales' | 'HR' | 'Finance' | 'Operations' | 'Design';

export interface Employee {
  id: string;
  name: string;
  employeeId: string;
  avatar: string;
  department: Department;
  position: string;
  email: string;
  phone: string;
  joinDate: string;
  status: 'Active' | 'Inactive';
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  clockIn: string;
  clockOut: string;
  status: AttendanceStatus;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: 'Annual' | 'Sick' | 'Emergency' | 'Maternity' | 'Paternity' | 'Unpaid';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  submittedDate: string;
}

export interface Settings {
  companyName: string;
  workStartTime: string;
  workEndTime: string;
  lateThresholdMinutes: number;
  adminName: string;
  adminEmail: string;
  notificationsEnabled: boolean;
  weekendDays: string[];
}

const DEFAULT_EMPLOYEES: Employee[] = [
  { id: '1', name: 'Sarah Johnson', employeeId: 'EMP-001', avatar: 'SJ', department: 'Engineering', position: 'Senior Developer', email: 'sarah.johnson@attendpro.com', phone: '+1 555-0101', joinDate: '2022-03-15', status: 'Active' },
  { id: '2', name: 'Michael Chen', employeeId: 'EMP-002', avatar: 'MC', department: 'Engineering', position: 'Full Stack Developer', email: 'michael.chen@attendpro.com', phone: '+1 555-0102', joinDate: '2021-07-01', status: 'Active' },
  { id: '3', name: 'Emily Rodriguez', employeeId: 'EMP-003', avatar: 'ER', department: 'Marketing', position: 'Marketing Manager', email: 'emily.rodriguez@attendpro.com', phone: '+1 555-0103', joinDate: '2020-11-20', status: 'Active' },
  { id: '4', name: 'David Park', employeeId: 'EMP-004', avatar: 'DP', department: 'Design', position: 'UI/UX Designer', email: 'david.park@attendpro.com', phone: '+1 555-0104', joinDate: '2023-01-10', status: 'Active' },
  { id: '5', name: 'Jessica Williams', employeeId: 'EMP-005', avatar: 'JW', department: 'Sales', position: 'Sales Lead', email: 'jessica.williams@attendpro.com', phone: '+1 555-0105', joinDate: '2021-04-05', status: 'Active' },
  { id: '6', name: 'Ryan Thompson', employeeId: 'EMP-006', avatar: 'RT', department: 'Finance', position: 'Financial Analyst', email: 'ryan.thompson@attendpro.com', phone: '+1 555-0106', joinDate: '2022-08-22', status: 'Active' },
  { id: '7', name: 'Amanda Lee', employeeId: 'EMP-007', avatar: 'AL', department: 'HR', position: 'HR Specialist', email: 'amanda.lee@attendpro.com', phone: '+1 555-0107', joinDate: '2020-06-30', status: 'Active' },
  { id: '8', name: 'James Martinez', employeeId: 'EMP-008', avatar: 'JM', department: 'Operations', position: 'Operations Manager', email: 'james.martinez@attendpro.com', phone: '+1 555-0108', joinDate: '2019-12-01', status: 'Active' },
  { id: '9', name: 'Lisa Anderson', employeeId: 'EMP-009', avatar: 'LA', department: 'Engineering', position: 'Backend Developer', email: 'lisa.anderson@attendpro.com', phone: '+1 555-0109', joinDate: '2022-05-17', status: 'Active' },
  { id: '10', name: 'Kevin Brown', employeeId: 'EMP-010', avatar: 'KB', department: 'Marketing', position: 'Content Strategist', email: 'kevin.brown@attendpro.com', phone: '+1 555-0110', joinDate: '2023-03-28', status: 'Active' },
];

const TODAY = new Date().toISOString().split('T')[0];

const DEFAULT_ATTENDANCE: AttendanceRecord[] = [
  { id: 'a1', employeeId: 'EMP-001', date: TODAY, clockIn: '08:45 AM', clockOut: '05:30 PM', status: 'On Time' },
  { id: 'a2', employeeId: 'EMP-002', date: TODAY, clockIn: '09:15 AM', clockOut: '05:45 PM', status: 'Late' },
  { id: 'a3', employeeId: 'EMP-003', date: TODAY, clockIn: '08:30 AM', clockOut: '05:00 PM', status: 'On Time' },
  { id: 'a4', employeeId: 'EMP-004', date: TODAY, clockIn: '--', clockOut: '--', status: 'Absent' },
  { id: 'a5', employeeId: 'EMP-005', date: TODAY, clockIn: '08:50 AM', clockOut: '05:20 PM', status: 'On Time' },
  { id: 'a6', employeeId: 'EMP-006', date: TODAY, clockIn: '09:30 AM', clockOut: '06:00 PM', status: 'Late' },
  { id: 'a7', employeeId: 'EMP-007', date: TODAY, clockIn: '08:40 AM', clockOut: '05:15 PM', status: 'On Time' },
  { id: 'a8', employeeId: 'EMP-008', date: TODAY, clockIn: '--', clockOut: '--', status: 'On Leave' },
  { id: 'a9', employeeId: 'EMP-009', date: TODAY, clockIn: '08:35 AM', clockOut: '05:10 PM', status: 'On Time' },
  { id: 'a10', employeeId: 'EMP-010', date: TODAY, clockIn: '09:10 AM', clockOut: '05:40 PM', status: 'Late' },
];

const DEFAULT_LEAVE_REQUESTS: LeaveRequest[] = [
  { id: 'l1', employeeId: 'EMP-008', type: 'Annual', startDate: TODAY, endDate: TODAY, days: 1, reason: 'Personal appointment', status: 'Approved', submittedDate: '2026-06-20' },
  { id: 'l2', employeeId: 'EMP-004', type: 'Sick', startDate: TODAY, endDate: TODAY, days: 1, reason: 'Feeling unwell', status: 'Pending', submittedDate: '2026-06-23' },
  { id: 'l3', employeeId: 'EMP-002', type: 'Annual', startDate: '2026-06-27', endDate: '2026-06-28', days: 2, reason: 'Family vacation', status: 'Pending', submittedDate: '2026-06-22' },
  { id: 'l4', employeeId: 'EMP-005', type: 'Emergency', startDate: '2026-06-21', endDate: '2026-06-21', days: 1, reason: 'Family emergency', status: 'Approved', submittedDate: '2026-06-21' },
  { id: 'l5', employeeId: 'EMP-009', type: 'Annual', startDate: '2026-07-01', endDate: '2026-07-05', days: 5, reason: 'Summer vacation', status: 'Pending', submittedDate: '2026-06-18' },
  { id: 'l6', employeeId: 'EMP-001', type: 'Sick', startDate: '2026-06-15', endDate: '2026-06-15', days: 1, reason: 'Medical checkup', status: 'Approved', submittedDate: '2026-06-14' },
  { id: 'l7', employeeId: 'EMP-007', type: 'Annual', startDate: '2026-07-10', endDate: '2026-07-12', days: 3, reason: 'Wedding attendance', status: 'Pending', submittedDate: '2026-06-20' },
  { id: 'l8', employeeId: 'EMP-003', type: 'Unpaid', startDate: '2026-07-15', endDate: '2026-07-16', days: 2, reason: 'Personal matters', status: 'Rejected', submittedDate: '2026-06-19' },
];

const DEFAULT_SETTINGS: Settings = {
  companyName: 'AttendPro',
  workStartTime: '09:00',
  workEndTime: '17:00',
  lateThresholdMinutes: 15,
  adminName: 'Admin User',
  adminEmail: 'admin@attendpro.com',
  notificationsEnabled: true,
  weekendDays: ['Saturday', 'Sunday'],
};

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Initialize localStorage with defaults on first run
export function initStore(): void {
  if (!localStorage.getItem('attendpro_initialized')) {
    save('attendpro_employees', DEFAULT_EMPLOYEES);
    save('attendpro_attendance', DEFAULT_ATTENDANCE);
    save('attendpro_leave', DEFAULT_LEAVE_REQUESTS);
    save('attendpro_settings', DEFAULT_SETTINGS);
    save('attendpro_initialized', 'true');
  }
}

// Employees
export function getEmployees(): Employee[] {
  return load('attendpro_employees', DEFAULT_EMPLOYEES);
}
export function saveEmployees(employees: Employee[]): void {
  save('attendpro_employees', employees);
}
export function addEmployee(employee: Employee): void {
  const employees = getEmployees();
  save('attendpro_employees', [...employees, employee]);
}
export function updateEmployee(updated: Employee): void {
  const employees = getEmployees().map(e => e.id === updated.id ? updated : e);
  save('attendpro_employees', employees);
}
export function deleteEmployee(id: string): void {
  save('attendpro_employees', getEmployees().filter(e => e.id !== id));
}

// Attendance
export function getAttendance(): AttendanceRecord[] {
  return load('attendpro_attendance', DEFAULT_ATTENDANCE);
}
export function saveAttendance(records: AttendanceRecord[]): void {
  save('attendpro_attendance', records);
}
export function addAttendanceRecord(record: AttendanceRecord): void {
  const records = getAttendance();
  save('attendpro_attendance', [...records, record]);
}
export function updateAttendanceRecord(updated: AttendanceRecord): void {
  const records = getAttendance().map(r => r.id === updated.id ? updated : r);
  save('attendpro_attendance', records);
}

// Leave
export function getLeaveRequests(): LeaveRequest[] {
  return load('attendpro_leave', DEFAULT_LEAVE_REQUESTS);
}
export function saveLeaveRequests(requests: LeaveRequest[]): void {
  save('attendpro_leave', requests);
}
export function addLeaveRequest(request: LeaveRequest): void {
  const requests = getLeaveRequests();
  save('attendpro_leave', [...requests, request]);
}
export function updateLeaveRequest(updated: LeaveRequest): void {
  const requests = getLeaveRequests().map(r => r.id === updated.id ? updated : r);
  save('attendpro_leave', requests);
}

// Settings
export function getSettings(): Settings {
  return load('attendpro_settings', DEFAULT_SETTINGS);
}
export function saveSettings(settings: Settings): void {
  save('attendpro_settings', settings);
}

// Derived metrics (computed from live data, no duplicates)
export function getDashboardMetrics() {
  const employees = getEmployees();
  const attendance = getAttendance();
  const leave = getLeaveRequests();
  const today = new Date().toISOString().split('T')[0];

  const todayRecords = attendance.filter(r => r.date === today);
  const totalEmployees = employees.filter(e => e.status === 'Active').length;
  const presentToday = todayRecords.filter(r => r.status === 'On Time' || r.status === 'Late').length;
  const absentLate = todayRecords.filter(r => r.status === 'Absent' || r.status === 'Late').length;
  const pendingLeave = leave.filter(r => r.status === 'Pending').length;

  return { totalEmployees, presentToday, absentLate, pendingLeave };
}

export function getWeeklyChartData() {
  const attendance = getAttendance();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const result = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayRecords = attendance.filter(r => r.date === dateStr);
    result.push({
      day: days[d.getDay()],
      present: dayRecords.filter(r => r.status === 'On Time').length,
      late: dayRecords.filter(r => r.status === 'Late').length,
      absent: dayRecords.filter(r => r.status === 'Absent').length,
    });
  }
  return result;
}

export function getQuickStats() {
  const attendance = getAttendance();
  const today = new Date().toISOString().split('T')[0];
  const currentMonth = today.slice(0, 7);
  const monthRecords = attendance.filter(r => r.date.startsWith(currentMonth) && (r.status === 'On Time' || r.status === 'Late'));
  const allPresent = attendance.filter(r => r.status === 'On Time' || r.status === 'Late').length;
  const allTotal = attendance.length;
  const avgRate = allTotal > 0 ? ((allPresent / allTotal) * 100).toFixed(1) : '0.0';

  return {
    avgAttendance: `${avgRate}%`,
    monthCheckIns: monthRecords.length.toLocaleString(),
    peakHours: '8:30 - 9:00 AM',
  };
}
