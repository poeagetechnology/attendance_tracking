import { useState, useEffect } from 'react';
import { UserPlus, Search, Edit2, Trash2, X, Check } from 'lucide-react';
import { getEmployees, addEmployee, updateEmployee, deleteEmployee, Employee, Department } from '../../store/dataStore';

const DEPARTMENTS: Department[] = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design'];

const deptColors: Record<Department, string> = {
  Engineering: 'bg-blue-500/20 text-blue-400',
  Marketing: 'bg-purple-500/20 text-purple-400',
  Sales: 'bg-green-500/20 text-green-400',
  HR: 'bg-pink-500/20 text-pink-400',
  Finance: 'bg-yellow-500/20 text-yellow-400',
  Operations: 'bg-orange-500/20 text-orange-400',
  Design: 'bg-cyan-500/20 text-cyan-400',
};

const EMPTY_FORM: Omit<Employee, 'id' | 'avatar'> = {
  name: '', employeeId: '', department: 'Engineering', position: '',
  email: '', phone: '', joinDate: '', status: 'Active',
};

export function EmployeeDirectory() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState<string>('All');
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Employee | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => { setEmployees(getEmployees()); }, []);

  function refresh() { setEmployees(getEmployees()); }

  function openAdd() {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  }

  function openEdit(emp: Employee) {
    setEditTarget(emp);
    setForm({ name: emp.name, employeeId: emp.employeeId, department: emp.department, position: emp.position, email: emp.email, phone: emp.phone, joinDate: emp.joinDate, status: emp.status });
    setShowModal(true);
  }

  function handleSubmit() {
    if (!form.name.trim() || !form.employeeId.trim() || !form.email.trim()) return;
    const avatar = form.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    if (editTarget) {
      updateEmployee({ ...editTarget, ...form, avatar });
    } else {
      addEmployee({ id: crypto.randomUUID(), avatar, ...form });
    }
    setShowModal(false);
    refresh();
  }

  function handleDelete(id: string) {
    deleteEmployee(id);
    setDeleteConfirm(null);
    refresh();
  }

  const filtered = employees.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.employeeId.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === 'All' || e.department === deptFilter;
    return matchSearch && matchDept;
  });

  return (
    <main className="p-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Employee Directory</h2>
          <p className="text-sm text-[#94a3b8]">{employees.filter(e => e.status === 'Active').length} active employees</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-[#D4AF37] hover:bg-[#B8941E] text-[#0B0F19] font-medium rounded-lg transition-colors">
          <UserPlus className="w-4 h-4" />
          Add Employee
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
          <input
            type="text"
            placeholder="Search by name, ID or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#1E293B] text-white placeholder:text-[#94a3b8] pl-10 pr-4 py-2.5 rounded-lg border border-[rgba(148,163,184,0.2)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          />
        </div>
        <select
          value={deptFilter}
          onChange={e => setDeptFilter(e.target.value)}
          className="bg-[#1E293B] text-white px-4 py-2.5 rounded-lg border border-[rgba(148,163,184,0.2)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
        >
          <option value="All">All Departments</option>
          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#1E293B] border border-[rgba(148,163,184,0.2)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0B0F19]">
              <tr>
                {['Employee', 'Department', 'Position', 'Email', 'Phone', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-medium text-[#94a3b8] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(148,163,184,0.2)]">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-[#94a3b8]">No employees found</td></tr>
              ) : filtered.map(emp => (
                <tr key={emp.id} className="hover:bg-[#0B0F19]/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8941E] flex items-center justify-center text-sm font-bold text-[#0B0F19]">
                        {emp.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{emp.name}</p>
                        <p className="text-xs text-[#94a3b8]">{emp.employeeId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${deptColors[emp.department]}`}>{emp.department}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{emp.position}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#94a3b8]">{emp.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#94a3b8]">{emp.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${emp.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(emp)} className="p-2 hover:bg-[#0B0F19] rounded-lg transition-colors text-[#94a3b8] hover:text-[#D4AF37]">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {deleteConfirm === emp.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleDelete(emp.id)} className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"><Check className="w-4 h-4" /></button>
                          <button onClick={() => setDeleteConfirm(null)} className="p-2 hover:bg-[#0B0F19] rounded-lg transition-colors text-[#94a3b8]"><X className="w-4 h-4" /></button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirm(emp.id)} className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-[#94a3b8] hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-[rgba(148,163,184,0.2)]">
          <p className="text-sm text-[#94a3b8]">Showing {filtered.length} of {employees.length} employees</p>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E293B] border border-[rgba(148,163,184,0.2)] rounded-xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(148,163,184,0.2)]">
              <h3 className="text-lg font-bold text-white">{editTarget ? 'Edit Employee' : 'Add New Employee'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-[#0B0F19] rounded-lg text-[#94a3b8]"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#94a3b8] mb-1.5">Full Name *</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-[#0B0F19] text-white px-3 py-2 rounded-lg border border-[rgba(148,163,184,0.2)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-xs text-[#94a3b8] mb-1.5">Employee ID *</label>
                  <input value={form.employeeId} onChange={e => setForm({ ...form, employeeId: e.target.value })} className="w-full bg-[#0B0F19] text-white px-3 py-2 rounded-lg border border-[rgba(148,163,184,0.2)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm" placeholder="EMP-011" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#94a3b8] mb-1.5">Department</label>
                  <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value as Department })} className="w-full bg-[#0B0F19] text-white px-3 py-2 rounded-lg border border-[rgba(148,163,184,0.2)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm">
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#94a3b8] mb-1.5">Position</label>
                  <input value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} className="w-full bg-[#0B0F19] text-white px-3 py-2 rounded-lg border border-[rgba(148,163,184,0.2)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm" placeholder="Job title" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-[#94a3b8] mb-1.5">Email *</label>
                <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} type="email" className="w-full bg-[#0B0F19] text-white px-3 py-2 rounded-lg border border-[rgba(148,163,184,0.2)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm" placeholder="john@attendpro.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#94a3b8] mb-1.5">Phone</label>
                  <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full bg-[#0B0F19] text-white px-3 py-2 rounded-lg border border-[rgba(148,163,184,0.2)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm" placeholder="+1 555-0000" />
                </div>
                <div>
                  <label className="block text-xs text-[#94a3b8] mb-1.5">Join Date</label>
                  <input value={form.joinDate} onChange={e => setForm({ ...form, joinDate: e.target.value })} type="date" className="w-full bg-[#0B0F19] text-white px-3 py-2 rounded-lg border border-[rgba(148,163,184,0.2)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-[#94a3b8] mb-1.5">Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as 'Active' | 'Inactive' })} className="w-full bg-[#0B0F19] text-white px-3 py-2 rounded-lg border border-[rgba(148,163,184,0.2)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-[rgba(148,163,184,0.2)]">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 bg-[#0B0F19] text-white border border-[rgba(148,163,184,0.2)] rounded-lg hover:border-[#D4AF37] transition-colors font-medium text-sm">Cancel</button>
              <button onClick={handleSubmit} className="flex-1 px-4 py-2.5 bg-[#D4AF37] hover:bg-[#B8941E] text-[#0B0F19] rounded-lg transition-colors font-medium text-sm">
                {editTarget ? 'Save Changes' : 'Add Employee'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
