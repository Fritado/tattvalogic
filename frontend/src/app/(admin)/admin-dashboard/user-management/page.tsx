"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck, Plus, Search, Filter, Pencil, Trash2,
  GitBranch, CheckCircle, XCircle, User, Loader2, RefreshCw
} from "lucide-react";
import { API_BASE } from "@/config/apiConfig";

const ROLE_COLORS: Record<string, string> = {
  admin:     "bg-violet-100 text-violet-700",
  manager:   "bg-blue-100 text-blue-700",
  specialist:"bg-emerald-100 text-emerald-700",
  employee:  "bg-zinc-100 text-zinc-600",
};

const ROLE_LABELS: Record<string, string> = {
  admin:     "Admin",
  manager:   "Manager",
  specialist:"Specialist",
  employee:  "Employee",
};

export default function UserManagementPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (roleFilter) params.set("role", roleFilter);
      const res = await fetch(`${API_BASE}/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store'
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [search, roleFilter]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "Failed to delete user.");
      }
      fetchUsers();
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  const stats = {
    total:     users.length,
    admin:     users.filter(u => u.role === "admin").length,
    manager:   users.filter(u => u.role === "manager").length,
    specialist:users.filter(u => u.role === "specialist").length,
    active:    users.filter(u => u.isActive).length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-[2rem] border border-zinc-200 p-8 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-violet-100 rounded-2xl flex items-center justify-center">
            <ShieldCheck size={24} className="text-violet-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-zinc-900">User Management</h1>
            <p className="text-sm text-zinc-500">Manage portal users, roles, permissions & reporting hierarchy</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/admin-dashboard/user-management/hierarchy")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-200 text-zinc-600 text-sm font-bold hover:bg-zinc-50 transition-all"
          >
            <GitBranch size={16} /> View Hierarchy
          </button>
          <button
            onClick={() => router.push("/admin-dashboard/user-management/create")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
          >
            <Plus size={16} /> Create User
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total Users",   value: stats.total,      color: "bg-zinc-900 text-white" },
          { label: "Admins",        value: stats.admin,      color: "bg-violet-100 text-violet-700" },
          { label: "Managers",      value: stats.manager,    color: "bg-blue-100 text-blue-700" },
          { label: "Specialists",   value: stats.specialist, color: "bg-emerald-100 text-emerald-700" },
          { label: "Active",        value: stats.active,     color: "bg-green-100 text-green-700" },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-2xl p-5 flex flex-col gap-1`}>
            <p className="text-3xl font-black">{s.value}</p>
            <p className="text-xs font-bold opacity-70 uppercase tracking-widest">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400"
          />
        </div>
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="px-4 py-3 bg-white border border-zinc-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-1 focus:ring-zinc-400"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="specialist">Specialist</option>
          <option value="employee">Employee</option>
        </select>
        <button onClick={fetchUsers} className="p-3 bg-white border border-zinc-200 rounded-2xl text-zinc-500 hover:bg-zinc-50">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2rem] border border-zinc-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-zinc-400">
            <Loader2 size={32} className="animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="py-20 text-center">
            <ShieldCheck size={40} className="mx-auto text-zinc-200 mb-4" />
            <p className="text-zinc-400 font-medium">No users found</p>
            <button
              onClick={() => router.push("/admin-dashboard/user-management/create")}
              className="mt-4 px-6 py-2 bg-zinc-900 text-white rounded-xl text-sm font-bold"
            >
              Create First User
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-zinc-400">User</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-zinc-400">Role</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-zinc-400">Department</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-zinc-400">Employee Link</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-zinc-400">Reports To</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-zinc-400">Status</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {users.map(user => (
                <tr key={user._id} className="hover:bg-zinc-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-zinc-100 border border-zinc-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                        {user.employeeRef?.photoUrl ? (
                          <img src={`${API_BASE.replace('/api','')}${user.employeeRef.photoUrl}`} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs font-black text-zinc-400">{user.email.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900 text-sm">{user.email}</p>
                        <p className="text-xs text-zinc-400">Created {new Date(user.createdAt).toLocaleDateString('en-IN')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${ROLE_COLORS[user.role] || 'bg-zinc-100 text-zinc-500'}`}>
                      {ROLE_LABELS[user.role] || user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-zinc-700">
                    {user.department || "—"}
                  </td>
                  <td className="px-6 py-4">
                    {user.employeeRef ? (
                      <div>
                        <p className="text-sm font-bold text-zinc-800">{user.employeeRef.fullName}</p>
                        <p className="text-xs text-zinc-400 font-mono">{user.employeeRef.employeeId}</p>
                      </div>
                    ) : (
                      <span className="text-xs text-zinc-300">Not linked</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {user.reportingManager ? (
                      <p className="text-sm text-zinc-600">{user.reportingManager.email}</p>
                    ) : (
                      <span className="text-xs text-zinc-300">Top level</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {user.isActive ? (
                      <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
                        <CheckCircle size={14} /> Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-red-400 text-xs font-bold">
                        <XCircle size={14} /> Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => router.push(`/admin-dashboard/user-management/create?id=${user._id}`)}
                        className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition-all"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      {confirmDelete === user._id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(user._id)}
                            disabled={deletingId === user._id}
                            className="px-3 py-1.5 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-all"
                          >
                            {deletingId === user._id ? <Loader2 size={12} className="animate-spin" /> : "Confirm"}
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="px-3 py-1.5 rounded-xl bg-zinc-100 text-zinc-600 text-xs font-bold"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(user._id)}
                          className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-400 transition-all"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Confirm deactivate overlay - click outside to dismiss */}
      {confirmDelete && (
        <div className="fixed inset-0 z-0" onClick={() => setConfirmDelete(null)} />
      )}
    </div>
  );
}
