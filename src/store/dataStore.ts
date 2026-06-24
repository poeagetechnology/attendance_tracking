export type AttendanceStatus = "On Time" | "Late" | "Absent" | "On Leave";
export type LeaveStatus = "Pending" | "Approved" | "Rejected";
export type Department =
  | "Engineering"
  | "Marketing"
  | "Sales"
  | "HR"
  | "Finance"
  | "Operations"
  | "Design";

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
  status: "Active" | "Inactive";
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
  type: "Annual" | "Sick" | "Emergency" | "Maternity" | "Paternity" | "Unpaid";
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

const DEFAULT_EMPLOYEES: Employee[] = [];

const TODAY = new Date().toISOString().split("T")[0];

const DEFAULT_ATTENDANCE: AttendanceRecord[] = [];

const DEFAULT_LEAVE_REQUESTS: LeaveRequest[] = [];

const DEFAULT_SETTINGS: Settings = {
  companyName: "Company Name",
  workStartTime: "09:00",
  workEndTime: "17:00",
  lateThresholdMinutes: 15,
  adminName: "Admin",
  adminEmail: "admin@company.com",
  notificationsEnabled: true,
  weekendDays: ["Saturday", "Sunday"],
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
  if (!localStorage.getItem("attendpro_initialized")) {
    save("attendpro_employees", DEFAULT_EMPLOYEES);
    save("attendpro_attendance", DEFAULT_ATTENDANCE);
    save("attendpro_leave", DEFAULT_LEAVE_REQUESTS);
    save("attendpro_settings", DEFAULT_SETTINGS);
    save("attendpro_initialized", "true");
  }
}

// Employees
export function getEmployees(): Employee[] {
  return load("attendpro_employees", DEFAULT_EMPLOYEES);
}
export function saveEmployees(employees: Employee[]): void {
  save("attendpro_employees", employees);
}
export function addEmployee(employee: Employee): void {
  const employees = getEmployees();
  save("attendpro_employees", [...employees, employee]);
}
export function updateEmployee(updated: Employee): void {
  const employees = getEmployees().map((e) =>
    e.id === updated.id ? updated : e,
  );
  save("attendpro_employees", employees);
}
export function deleteEmployee(id: string): void {
  save(
    "attendpro_employees",
    getEmployees().filter((e) => e.id !== id),
  );
}

// Attendance
export function getAttendance(): AttendanceRecord[] {
  return load("attendpro_attendance", DEFAULT_ATTENDANCE);
}
export function saveAttendance(records: AttendanceRecord[]): void {
  save("attendpro_attendance", records);
}
export function addAttendanceRecord(record: AttendanceRecord): void {
  const records = getAttendance();
  save("attendpro_attendance", [...records, record]);
}
export function updateAttendanceRecord(updated: AttendanceRecord): void {
  const records = getAttendance().map((r) =>
    r.id === updated.id ? updated : r,
  );
  save("attendpro_attendance", records);
}

// Leave
export function getLeaveRequests(): LeaveRequest[] {
  return load("attendpro_leave", DEFAULT_LEAVE_REQUESTS);
}
export function saveLeaveRequests(requests: LeaveRequest[]): void {
  save("attendpro_leave", requests);
}
export function addLeaveRequest(request: LeaveRequest): void {
  const requests = getLeaveRequests();
  save("attendpro_leave", [...requests, request]);
}
export function updateLeaveRequest(updated: LeaveRequest): void {
  const requests = getLeaveRequests().map((r) =>
    r.id === updated.id ? updated : r,
  );
  save("attendpro_leave", requests);
}

// Settings
export function getSettings(): Settings {
  return load("attendpro_settings", DEFAULT_SETTINGS);
}
export function saveSettings(settings: Settings): void {
  save("attendpro_settings", settings);
}

// Derived metrics (computed from live data, no duplicates)
export function getDashboardMetrics() {
  const employees = getEmployees();
  const attendance = getAttendance();
  const leave = getLeaveRequests();
  const today = new Date().toISOString().split("T")[0];

  const todayRecords = attendance.filter((r) => r.date === today);
  const totalEmployees = employees.filter((e) => e.status === "Active").length;
  const presentToday = todayRecords.filter(
    (r) => r.status === "On Time" || r.status === "Late",
  ).length;
  const absentLate = todayRecords.filter(
    (r) => r.status === "Absent" || r.status === "Late",
  ).length;
  const pendingLeave = leave.filter((r) => r.status === "Pending").length;

  return { totalEmployees, presentToday, absentLate, pendingLeave };
}

export function getWeeklyChartData() {
  const attendance = getAttendance();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const result = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const dayRecords = attendance.filter((r) => r.date === dateStr);
    result.push({
      day: days[d.getDay()],
      present: dayRecords.filter((r) => r.status === "On Time").length,
      late: dayRecords.filter((r) => r.status === "Late").length,
      absent: dayRecords.filter((r) => r.status === "Absent").length,
    });
  }
  return result;
}

export function getQuickStats() {
  const attendance = getAttendance();
  const today = new Date().toISOString().split("T")[0];
  const currentMonth = today.slice(0, 7);
  const monthRecords = attendance.filter(
    (r) =>
      r.date.startsWith(currentMonth) &&
      (r.status === "On Time" || r.status === "Late"),
  );
  const allPresent = attendance.filter(
    (r) => r.status === "On Time" || r.status === "Late",
  ).length;
  const allTotal = attendance.length;
  const avgRate =
    allTotal > 0 ? ((allPresent / allTotal) * 100).toFixed(1) : "0.0";

  return {
    avgAttendance: `${avgRate}%`,
    monthCheckIns: monthRecords.length.toLocaleString(),
    peakHours: "8:30 - 9:00 AM",
  };
}
