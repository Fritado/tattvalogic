"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft, Save, RefreshCw, Eye, EyeOff,
  Loader2, User, Users, Mail, Lock, ChevronDown
} from "lucide-react";
import { API_BASE } from "@/config/apiConfig";

// ─── Permission Matrix Config ─────────────────────────────────────────────────
const FEATURES = [
  { key: "dashboard",      label: "Dashboard",      actions: ["view"] },
  { key: "leads",          label: "Leads",          actions: ["view", "create", "edit", "delete"] },
  { key: "employees",      label: "Employees",      actions: ["view", "create", "edit", "delete"] },
  { key: "onboarding",     label: "Onboarding",     actions: ["view", "create", "edit", "delete"] },
  { key: "reports",        label: "Reports",        actions: ["view"] },
  { key: "settings",       label: "Settings",       actions: ["view", "edit"] },
  { key: "userManagement", label: "User Management",actions: ["view", "create", "edit", "delete"] },
];

// ─── Role Permission Templates ─────────────────────────────────────────────────
const ROLE_TEMPLATES: Record<string, any> = {
  admin: {
    dashboard:      { view: true },
    leads:          { view: true, create: true, edit: true, delete: true },
    employees:      { view: true, create: true, edit: true, delete: true },
    onboarding:     { view: true, create: true, edit: true, delete: true },
    reports:        { view: true },
    settings:       { view: true, edit: true },
    userManagement: { view: true, create: true, edit: true, delete: true },
  },
  manager: {
    dashboard:      { view: true },
    leads:          { view: true, create: true, edit: true, delete: false },
    employees:      { view: true, create: false, edit: false, delete: false },
    onboarding:     { view: true, create: false, edit: false, delete: false },
    reports:        { view: true },
    settings:       { view: false, edit: false },
    userManagement: { view: false, create: false, edit: false, delete: false },
  },
  specialist: {
    dashboard:      { view: true },
    leads:          { view: true, create: true, edit: true, delete: false },
    employees:      { view: false, create: false, edit: false, delete: false },
    onboarding:     { view: false, create: false, edit: false, delete: false },
    reports:        { view: false },
    settings:       { view: false, edit: false },
    userManagement: { view: false, create: false, edit: false, delete: false },
  },
  employee: {
    dashboard:      { view: true },
    leads:          { view: false, create: false, edit: false, delete: false },
    employees:      { view: false, create: false, edit: false, delete: false },
    onboarding:     { view: false, create: false, edit: false, delete: false },
    reports:        { view: false },
    settings:       { view: false, edit: false },
    userManagement: { view: false, create: false, edit: false, delete: false },
  }
};

const blankPermissions = () => ({
  dashboard:      { view: false },
  leads:          { view: false, create: false, edit: false, delete: false },
  employees:      { view: false, create: false, edit: false, delete: false },
  onboarding:     { view: false, create: false, edit: false, delete: false },
  reports:        { view: false },
  settings:       { view: false, edit: false },
  userManagement: { view: false, create: false, edit: false, delete: false },
});

export default function CreateUserPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const isEdit = !!editId;

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEdit);
  const [employees, setEmployees] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    email: "",
    personalEmail: "",
    password: "",
    role: "specialist",
    department: "",
    employeeRef: "",
    reportingManager: "",
    sendInvite: true,
    loginEnabled: true,
  });

  const handleEmployeeChange = (empId: string) => {
    const selectedEmp = employees.find(e => e._id === empId);
    if (selectedEmp) {
      // Autofill Department
      const dept = selectedEmp.department || "";
      
      // Auto-assign Role based on designation (optional but helpful)
      let role = "employee";
      const desig = (selectedEmp.designation || "").toLowerCase();
      if (desig.includes("admin")) role = "admin";
      else if (desig.includes("manager") || desig.includes("lead") || desig.includes("head")) role = "manager";
      else if (desig.includes("sales") || desig.includes("specialist") || desig.includes("growth")) role = "specialist";

      setForm(prev => ({ 
        ...prev, 
        employeeRef: empId, 
        department: dept,
        role: role,
        personalEmail: selectedEmp.personalEmail || ""
      }));
      
      // Also apply the permission template for the auto-assigned role
      setPermissions(ROLE_TEMPLATES[role] || blankPermissions());
    } else {
      setForm(prev => ({ ...prev, employeeRef: empId }));
    }
  };

  const [permissions, setPermissions] = useState<any>(blankPermissions());

  const generatePassword = () => {
    const chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789@#$";
    return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  };

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem("admin_token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [empRes, usersRes] = await Promise.all([
        fetch(`${API_BASE}/users/available-employees`, { headers }),
        fetch(`${API_BASE}/users`, { headers }),
      ]);
      const [empData, usersData] = await Promise.all([empRes.json(), usersRes.json()]);
      setEmployees(Array.isArray(empData) ? empData : []);
      setAllUsers(Array.isArray(usersData) ? usersData : []);

      if (isEdit) {
        const userRes = await fetch(`${API_BASE}/users/${editId}`, { headers });
        const userData = await userRes.json();
        setForm({
          email: userData.email || "",
          personalEmail: userData.personalEmail || "",
          password: "",
          role: userData.role || "specialist",
          department: userData.department || "",
          employeeRef: userData.employeeRef?._id || "",
          reportingManager: userData.reportingManager?._id || "",
          sendInvite: false,
          loginEnabled: userData.loginEnabled !== undefined ? userData.loginEnabled : true,
        });
        setPermissions(userData.permissions || blankPermissions());
        // If editing, add the linked employee back to the dropdown list
        if (userData.employeeRef) {
          setEmployees(prev => [userData.employeeRef, ...prev.filter((e: any) => e._id !== userData.employeeRef._id)]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPageLoading(false);
    }
  }, [editId, isEdit]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const applyTemplate = (role: string) => {
    setPermissions(ROLE_TEMPLATES[role] || blankPermissions());
  };

  const togglePerm = (feature: string, action: string) => {
    setPermissions((prev: any) => ({
      ...prev,
      [feature]: { ...prev[feature], [action]: !prev[feature]?.[action] }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email) return alert("Email is required.");
    if (!isEdit && !form.password) return alert("Password is required.");
    setSaving(true);
    try {
      const token = localStorage.getItem("admin_token");
      const body: any = {
        email: form.email,
        role: form.role,
        department: form.department,
        employeeRef: form.employeeRef || null,
        reportingManager: form.reportingManager || null,
        permissions,
        sendInvite: form.sendInvite,
        loginEnabled: form.loginEnabled,
        personalEmail: form.personalEmail || null,
      };
      if (form.password) body.password = form.password;

      const url = isEdit ? `${API_BASE}/users/${editId}` : `${API_BASE}/users`;
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message || "Failed to save user."); return; }
      router.push("/admin-dashboard/user-management");
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button type="button" onClick={() => router.back()} className="p-3 rounded-2xl hover:bg-zinc-100 text-zinc-400 transition-all">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-zinc-900">{isEdit ? "Edit User" : "Create Portal User"}</h1>
          <p className="text-sm text-zinc-500">Link an employee, assign a role and configure feature access</p>
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-white rounded-[2rem] border border-zinc-200 p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
          <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center">
            <User size={16} className="text-zinc-600" />
          </div>
          <h2 className="text-sm font-black uppercase tracking-widest text-zinc-700">Account Details</h2>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* 1. Employee Link (On Top) */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Link to Employee</label>
            <div className="relative">
              <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <select
                value={form.employeeRef}
                onChange={e => handleEmployeeChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm focus:ring-1 focus:ring-zinc-400 outline-none appearance-none"
              >
                <option value="">— Not linked —</option>
                {employees.map((emp: any) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.fullName} ({emp.employeeId})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. Reporting Manager (Next) */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Reporting Manager</label>
            <div className="relative">
              <Users size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <select
                value={form.reportingManager}
                onChange={e => setForm({ ...form, reportingManager: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm focus:ring-1 focus:ring-zinc-400 outline-none appearance-none"
              >
                <option value="">— Top level (no manager) —</option>
                {allUsers
                  .filter(u => u._id !== editId)
                  .map((u: any) => (
                    <option key={u._id} value={u._id}>
                      {u.email} ({u.role}) {u.employeeRef ? `— ${u.employeeRef.fullName}` : ""}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Official Email */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Official Email (Login ID) *</label>
            <div className="relative">
              <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="email" required value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                disabled={isEdit}
                className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm focus:ring-1 focus:ring-zinc-400 outline-none disabled:opacity-50"
                placeholder="user@tattvalogic.com"
              />
            </div>
          </div>

          {/* Personal Email */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Personal Email</label>
            <div className="relative">
              <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="email" value={form.personalEmail}
                onChange={e => setForm({ ...form, personalEmail: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm focus:ring-1 focus:ring-zinc-400 outline-none"
                placeholder="john@gmail.com"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              {isEdit ? "New Password (leave blank to keep)" : "Password *"}
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-10 pr-10 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm focus:ring-1 focus:ring-zinc-400 outline-none font-mono"
                  placeholder={isEdit ? "••••••••" : "Enter password"}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <button
                type="button"
                onClick={() => setForm({ ...form, password: generatePassword() })}
                className="px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-500 transition-all" title="Auto-generate"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {/* Role */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Role *</label>
            <select
              value={form.role}
              onChange={e => { setForm({ ...form, role: e.target.value }); applyTemplate(e.target.value); }}
              className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-zinc-400 outline-none appearance-none"
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="specialist">Growth & Onboarding Specialist</option>
              <option value="employee">Employee</option>
            </select>
            <p className="text-[10px] text-zinc-400">Selecting a role auto-fills the permission template below.</p>
          </div>

          {/* Department */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Department *</label>
            <select
              required
              value={form.department}
              onChange={e => setForm({ ...form, department: e.target.value })}
              className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-zinc-400 outline-none appearance-none"
            >
              <option value="" disabled>Select Department</option>
              <option value="Marketing & Sales">Marketing & Sales</option>
              <option value="Engineering">Engineering</option>
              <option value="Administration">Administration</option>
              <option value="Finance">Finance</option>
            </select>
          </div>

          {/* Login Toggle */}
          <div className="col-span-2">
            <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-[1.5rem] border border-zinc-100">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${form.loginEnabled ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                        <Lock size={16} />
                    </div>
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-zinc-900">Portal Login Status</p>
                        <p className="text-[10px] text-zinc-400">{form.loginEnabled ? 'User can access the portal with official credentials.' : 'Portal access is currently revoked for this user.'}</p>
                    </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={form.loginEnabled} 
                        onChange={(e) => setForm({ ...form, loginEnabled: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-900"></div>
                </label>
            </div>
          </div>

          {/* Send invite */}
          {!isEdit && (
            <div className="col-span-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox" checked={form.sendInvite}
                  onChange={e => setForm({ ...form, sendInvite: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm text-zinc-700 group-hover:text-zinc-900 transition-colors">
                  Send login credentials via email to the user
                </span>
              </label>
            </div>
          )}
        </div>
      </div>


      {/* Actions */}
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-2xl border border-zinc-200 text-zinc-600 font-bold text-sm hover:bg-zinc-50">
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-zinc-900 text-white font-bold text-sm hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200 disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {isEdit ? "Save Changes" : "Create User"}
        </button>
      </div>
    </form>
  );
}
