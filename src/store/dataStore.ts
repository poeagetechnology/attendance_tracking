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
  appName: string;
  companyName: string;
  workStartTime: string;
  workEndTime: string;
  lateThresholdMinutes: number;
  adminName: string;
  adminEmail: string;
  adminRole: string;
  notificationsEnabled: boolean;
  weekendDays: string[];
}

// Increment this string whenever defaults change to force-clear stale localStorage
const STORE_VERSION = "3";

const DEFAULT_SETTINGS: Settings = {
  appName: "",
  companyName: "",
  workStartTime: "",
  workEndTime: "",
  lateThresholdMinutes: 15,
  adminName: "",
  adminEmail: "",
  adminRole: "",
  notificationsEnabled: true,
  weekendDays: [],
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

// Clears stale data when STORE_VERSION changes, then seeds empty collections
export function initStore(): void {
  if (localStorage.getItem("attendpro_version") !== STORE_VERSION) {
    localStorage.clear();
    save("attendpro_employees", [] as Employee[]);
    save("attendpro_attendance", [] as AttendanceRecord[]);
    save("attendpro_leave", [] as LeaveRequest[]);
    save("attendpro_settings", DEFAULT_SETTINGS);
    save("attendpro_version", STORE_VERSION);
  }
}

// Employees
export function getEmployees(): Employee[] {
  return load("attendpro_employees", [] as Employee[]);
}
export function saveEmployees(employees: Employee[]): void {
  save("attendpro_employees", employees);
}
export function addEmployee(employee: Employee): void {
  save("attendpro_employees", [...getEmployees(), employee]);
}
export function updateEmployee(updated: Employee): void {
  save(
    "attendpro_employees",
    getEmployees().map((e) => (e.id === updated.id ? updated : e)),
  );
}
export function deleteEmployee(id: string): void {
  save(
    "attendpro_employees",
    getEmployees().filter((e) => e.id !== id),
  );
}

// Attendance
export function getAttendance(): AttendanceRecord[] {
  return load("attendpro_attendance", [] as AttendanceRecord[]);
}
export function saveAttendance(records: AttendanceRecord[]): void {
  save("attendpro_attendance", records);
}
export function addAttendanceRecord(record: AttendanceRecord): void {
  save("attendpro_attendance", [...getAttendance(), record]);
}
export function updateAttendanceRecord(updated: AttendanceRecord): void {
  save(
    "attendpro_attendance",
    getAttendance().map((r) => (r.id === updated.id ? updated : r)),
  );
}

// Leave
export function getLeaveRequests(): LeaveRequest[] {
  return load("attendpro_leave", [] as LeaveRequest[]);
}
export function saveLeaveRequests(requests: LeaveRequest[]): void {
  save("attendpro_leave", requests);
}
export function addLeaveRequest(request: LeaveRequest): void {
  save("attendpro_leave", [...getLeaveRequests(), request]);
}
export function updateLeaveRequest(updated: LeaveRequest): void {
  save(
    "attendpro_leave",
    getLeaveRequests().map((r) => (r.id === updated.id ? updated : r)),
  );
}

// Settings
export function getSettings(): Settings {
  return load("attendpro_settings", DEFAULT_SETTINGS);
}
export function saveSettings(settings: Settings): void {
  save("attendpro_settings", settings);
}

// Derived metrics — computed from live data only
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
  const settings = getSettings();
  const today = new Date().toISOString().split("T")[0];
  const currentMonth = today.slice(0, 7);

  const monthCheckIns = attendance.filter(
    (r) =>
      r.date.startsWith(currentMonth) &&
      (r.status === "On Time" || r.status === "Late"),
  ).length;

  const allPresent = attendance.filter(
    (r) => r.status === "On Time" || r.status === "Late",
  ).length;
  const allTotal = attendance.length;
  const avgRate =
    allTotal > 0 ? ((allPresent / allTotal) * 100).toFixed(1) : null;

  return {
    avgAttendance: avgRate !== null ? `${avgRate}%` : "—",
    monthCheckIns: monthCheckIns > 0 ? monthCheckIns.toLocaleString() : "—",
    workHours:
      settings.workStartTime && settings.workEndTime
        ? `${settings.workStartTime} – ${settings.workEndTime}`
        : "—",
  };
}
