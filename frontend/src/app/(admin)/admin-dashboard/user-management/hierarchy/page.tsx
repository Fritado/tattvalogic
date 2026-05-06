"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, GitBranch, User, RefreshCw, Loader2, Pencil, ChevronDown, ChevronRight } from "lucide-react";
import { API_BASE } from "@/config/apiConfig";

const ROLE_COLORS: Record<string, string> = {
  admin:     "border-violet-300 bg-violet-50",
  manager:   "border-blue-300 bg-blue-50",
  specialist:"border-emerald-300 bg-emerald-50",
  employee:  "border-zinc-200 bg-zinc-50",
};

const ROLE_BADGE: Record<string, string> = {
  admin:     "bg-violet-100 text-violet-700",
  manager:   "bg-blue-100 text-blue-700",
  specialist:"bg-emerald-100 text-emerald-700",
  employee:  "bg-zinc-100 text-zinc-600",
};

interface TreeNode {
  _id: string;
  email: string;
  role: string;
  isActive: boolean;
  employeeRef?: { fullName: string; employeeId: string; photoUrl?: string; designation?: string };
  children: TreeNode[];
}

function UserCard({ node, allUsers, depth, onManagerChange }: {
  node: TreeNode;
  allUsers: any[];
  depth: number;
  onManagerChange: (userId: string, managerId: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const [editing, setEditing] = useState(false);
  const [selectedManager, setSelectedManager] = useState("");
  const router = useRouter();

  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className={`ml-${depth > 0 ? 8 : 0}`}>
      <div className={`relative border-2 rounded-2xl p-4 mb-3 flex items-center gap-4 transition-all ${ROLE_COLORS[node.role] || 'border-zinc-200 bg-zinc-50'} ${!node.isActive ? 'opacity-50' : ''}`}>
        {/* Connector lines */}
        {depth > 0 && (
          <div className="absolute -left-8 top-1/2 w-8 h-px bg-zinc-200" />
        )}

        {/* Avatar */}
        <div className="w-10 h-10 rounded-xl overflow-hidden bg-white border border-white/60 shadow-sm flex items-center justify-center flex-shrink-0">
          {node.employeeRef?.photoUrl ? (
            <img src={`${API_BASE.replace('/api','')}${node.employeeRef.photoUrl}`} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm font-black text-zinc-400">{node.email.charAt(0).toUpperCase()}</span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {node.employeeRef ? (
            <>
              <p className="font-black text-sm text-zinc-900 truncate">{node.employeeRef.fullName}</p>
              <p className="text-[10px] text-zinc-500 font-mono">{node.employeeRef.employeeId}</p>
            </>
          ) : (
            <p className="font-black text-sm text-zinc-900 truncate">{node.email}</p>
          )}
          <p className="text-xs text-zinc-400 truncate">{node.employeeRef?.designation || node.email}</p>
        </div>

        {/* Role badge */}
        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider flex-shrink-0 ${ROLE_BADGE[node.role]}`}>
          {node.role}
        </span>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => setEditing(!editing)}
            className="p-1.5 rounded-lg hover:bg-white/60 text-zinc-400 hover:text-zinc-600 transition-all"
            title="Change manager"
          >
            <Pencil size={13} />
          </button>
          {hasChildren && (
            <button onClick={() => setExpanded(!expanded)} className="p-1.5 rounded-lg hover:bg-white/60 text-zinc-400 transition-all">
              {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          )}
        </div>
      </div>

      {/* Reassign manager inline */}
      {editing && (
        <div className="ml-12 mb-3 flex items-center gap-2 bg-white border border-zinc-200 rounded-xl p-3">
          <select
            value={selectedManager}
            onChange={e => setSelectedManager(e.target.value)}
            className="flex-1 text-sm bg-zinc-50 border border-zinc-100 rounded-xl py-2 px-3 outline-none"
          >
            <option value="">— No manager (top level) —</option>
            {allUsers
              .filter(u => u._id !== node._id)
              .map(u => (
                <option key={u._id} value={u._id}>
                  {u.employeeRef?.fullName || u.email} ({u.role})
                </option>
              ))}
          </select>
          <button
            onClick={() => { onManagerChange(node._id, selectedManager); setEditing(false); }}
            className="px-4 py-2 bg-zinc-900 text-white text-xs font-bold rounded-xl hover:bg-zinc-800 transition-all"
          >
            Save
          </button>
          <button onClick={() => setEditing(false)} className="px-3 py-2 bg-zinc-100 text-zinc-600 text-xs font-bold rounded-xl">
            Cancel
          </button>
        </div>
      )}

      {/* Children */}
      {hasChildren && expanded && (
        <div className="relative ml-5 pl-3 border-l-2 border-zinc-200">
          {node.children.map(child => (
            <UserCard key={child._id} node={child} allUsers={allUsers} depth={depth + 1} onManagerChange={onManagerChange} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function HierarchyPage() {
  const router = useRouter();
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const headers = { Authorization: `Bearer ${token}` };
      const [treeRes, usersRes] = await Promise.all([
        fetch(`${API_BASE}/users/hierarchy`, { headers }),
        fetch(`${API_BASE}/users`, { headers }),
      ]);
      const [treeData, usersData] = await Promise.all([treeRes.json(), usersRes.json()]);
      setTree(Array.isArray(treeData) ? treeData : []);
      setAllUsers(Array.isArray(usersData) ? usersData : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleManagerChange = async (userId: string, managerId: string) => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reportingManager: managerId || null })
      });
      if (res.ok) {
        await fetchData(); // Refresh tree
      } else {
        const err = await res.json();
        alert(err.message || "Failed to update reporting manager.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalNodes = (nodes: TreeNode[]): number =>
    nodes.reduce((sum, n) => sum + 1 + totalNodes(n.children), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between bg-white rounded-[2rem] border border-zinc-200 p-8 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-3 hover:bg-zinc-100 rounded-2xl text-zinc-400 transition-all">
            <ArrowLeft size={20} />
          </button>
          <div className="w-12 h-12 bg-violet-100 rounded-2xl flex items-center justify-center">
            <GitBranch size={22} className="text-violet-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-zinc-900">Reporting Hierarchy</h1>
            <p className="text-sm text-zinc-500">Visual org chart · Click ✎ to reassign reporting manager</p>
          </div>
        </div>
        <button onClick={fetchData} className="p-3 rounded-2xl border border-zinc-200 hover:bg-zinc-50 text-zinc-500 transition-all">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {[
          { role: "admin",     label: "Admin" },
          { role: "manager",   label: "Manager" },
          { role: "specialist",label: "Specialist" },
          { role: "employee",  label: "Employee" },
        ].map(({ role, label }) => (
          <div key={role} className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${ROLE_COLORS[role]}`}>
            <span className={`text-[10px] font-black uppercase tracking-wider ${ROLE_BADGE[role]} px-2 py-0.5 rounded-lg`}>{label}</span>
          </div>
        ))}
        <div className="ml-auto flex items-center gap-2 px-4 py-2 bg-zinc-100 rounded-xl">
          <span className="text-xs font-bold text-zinc-500">{totalNodes(tree)} users in hierarchy</span>
        </div>
      </div>

      {/* Tree */}
      <div className="bg-white rounded-[2rem] border border-zinc-200 p-8 shadow-sm min-h-64">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={32} className="animate-spin text-zinc-300" />
          </div>
        ) : tree.length === 0 ? (
          <div className="py-16 text-center">
            <GitBranch size={40} className="mx-auto text-zinc-200 mb-3" />
            <p className="text-zinc-400 font-medium">No users in the hierarchy yet.</p>
            <button
              onClick={() => router.push("/admin-dashboard/user-management/create")}
              className="mt-4 px-6 py-2 bg-zinc-900 text-white rounded-xl text-sm font-bold"
            >
              Create First User
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {tree.map(node => (
              <UserCard
                key={node._id}
                node={node}
                allUsers={allUsers}
                depth={0}
                onManagerChange={handleManagerChange}
              />
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
        <p className="text-xs text-amber-700 font-bold mb-1">ℹ️ How to use the hierarchy editor</p>
        <ul className="text-xs text-amber-600 space-y-1 list-disc list-inside">
          <li>Click the <strong>✎ pencil icon</strong> on any user card to reassign their reporting manager</li>
          <li>The system automatically detects and prevents <strong>circular reporting loops</strong></li>
          <li>Use the <strong>chevron ▼</strong> to collapse/expand team branches</li>
          <li>Users without a reporting manager appear at the <strong>top level</strong></li>
        </ul>
      </div>
    </div>
  );
}
