"use client";

import React, { useEffect, useState } from "react";
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  FileText, 
  User, 
  Search,
  Filter,
  ChevronRight,
  AlertCircle,
  Settings
} from "lucide-react";
import { API_BASE } from "@/config/apiConfig";

export default function LeaveManagementView() {
  const [activeTab, setActiveTab] = useState("my-leaves");
  const [requests, setRequests] = useState<any[]>([]);
  const [adminRequests, setAdminRequests] = useState<any[]>([]);
  const [balance, setBalance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [user, setUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    leaveType: "Bereavement Leave",
    fromDate: "",
    toDate: "",
    reason: ""
  });

  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [policyData, setPolicyData] = useState({
    year: new Date().getFullYear(),
    bereavementLeave: 5,
    sickLeave: 8,
    privilegeLeave: 15
  });

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("admin_user") || "{}");
      setUser(storedUser);
      if (storedUser.role === 'admin' || storedUser.role === 'hr') {
        setActiveTab("admin-panel");
        fetchPolicy();
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
    }
    fetchData();
  }, []);

  const fetchPolicy = async () => {
    const token = localStorage.getItem("admin_token");
    const year = new Date().getFullYear();
    try {
      const res = await fetch(`${API_BASE}/leave/balance?year=${year}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // The balance endpoint returns the current applied policy if no balance exists
      // But we should have a specific policy endpoint or use the balance one carefully
      // For now, let's just use the balance one to get defaults
      const data = await res.json();
      if (data && data.bereavementAllocated) {
        setPolicyData({
          year,
          bereavementLeave: data.bereavementAllocated,
          sickLeave: data.sickAllocated,
          privilegeLeave: data.privilegeAllocated
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdatePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`${API_BASE}/leave/policy`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(policyData)
      });
      if (res.ok) {
        setIsPolicyModalOpen(false);
        fetchData(); // Refresh to show new balances
        alert("Leave policy updated successfully!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem("admin_token");
    try {
      // Only fetch personal data if not admin (since admin can't apply)
      const u = user || JSON.parse(localStorage.getItem("admin_user") || "{}");
      const isManagement = u.role === 'admin' || u.role === 'hr';

      const [reqRes, balRes] = await Promise.all([
        !isManagement ? fetch(`${API_BASE}/leave/my-requests`, { headers: { Authorization: `Bearer ${token}` } }) : Promise.resolve(null),
        !isManagement ? fetch(`${API_BASE}/leave/balance`, { headers: { Authorization: `Bearer ${token}` } }) : Promise.resolve(null)
      ]);
      
      if (reqRes && reqRes.ok) {
        const reqData = await reqRes.json();
        setRequests(Array.isArray(reqData) ? reqData : []);
      }

      if (balRes && balRes.ok) {
        const balData = await balRes.json();
        setBalance(balData);
      }

      if (isManagement) {
        const adminRes = await fetch(`${API_BASE}/leave/admin/all`, { headers: { Authorization: `Bearer ${token}` } });
        if (adminRes.ok) {
          const adminData = await adminRes.json();
          setAdminRequests(Array.isArray(adminData) ? adminData : []);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isAdminUser = () => {
    const u = user || JSON.parse(localStorage.getItem("admin_user") || "{}");
    return u.role === 'admin' || u.role === 'hr';
  };

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`${API_BASE}/leave/apply`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsApplyModalOpen(false);
        setFormData({ leaveType: "Casual Leave", fromDate: "", toDate: "", reason: "" });
        fetchData();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to apply leave");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const [employeeBalance, setEmployeeBalance] = useState<any>(null);

  useEffect(() => {
    if (isActionModalOpen && selectedLeave && isAdminUser()) {
      fetchEmployeeBalance(selectedLeave.userId?._id);
    }
  }, [isActionModalOpen, selectedLeave]);

  const fetchEmployeeBalance = async (empId: string) => {
    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`${API_BASE}/leave/balance?userId=${empId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setEmployeeBalance(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAction = async (status: 'Approved' | 'Rejected') => {
    const token = localStorage.getItem("admin_token");
    const endpoint = status === 'Approved' ? 'approve' : 'reject';
    try {
      const res = await fetch(`${API_BASE}/leave/${endpoint}/${selectedLeave._id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: status === 'Rejected' ? JSON.stringify({ rejectionReason }) : undefined
      });
      if (res.ok) {
        setIsActionModalOpen(false);
        setSelectedLeave(null);
        setRejectionReason("");
        setEmployeeBalance(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleWithdraw = async (id: string) => {
    if (!confirm("Are you sure you want to withdraw this leave request?")) return;
    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`${API_BASE}/leave/withdraw/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setIsActionModalOpen(false);
        setSelectedLeave(null);
        fetchData();
        alert("Leave request withdrawn successfully.");
      } else {
        const data = await res.json();
        alert(data.message || "Failed to withdraw leave");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Rejected': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Withdrawn': return 'bg-zinc-100 text-zinc-500 border-zinc-200 opacity-70';
      default: return 'bg-zinc-100 text-zinc-700 border-zinc-200';
    }
  };

  if (loading && !balance) return <div className="p-10 text-center font-bold text-zinc-400">Loading Leave System...</div>;

  return (
    <div className="space-y-8 pb-20">
      {/* Header & Apply Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Leave Management</h2>
          <p className="text-zinc-500 font-medium">
            {isAdminUser() ? "Review and manage employee leave requests and policies" : "Track balances, apply for leaves and manage history"}
          </p>
        </div>
        {isAdminUser() ? (
          <button 
            onClick={() => setIsPolicyModalOpen(true)}
            className="bg-white text-zinc-900 border border-zinc-200 px-8 py-4 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-zinc-50 transition-all shadow-sm"
          >
            <Settings size={20} /> Configure Policy
          </button>
        ) : (
          <button 
            onClick={() => setIsApplyModalOpen(true)}
            className="bg-primary text-white px-8 py-4 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            <Plus size={20} /> Apply for Leave
          </button>
        )}
      </div>

      {/* Balance Summary Cards - Only for employees */}
      {!isAdminUser() && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              label: "Bereavement Leave", 
              allocated: balance?.bereavementAllocated || 0, 
              used: balance?.bereavementUsed || 0, 
              pending: balance?.bereavementPending || 0,
              color: "text-indigo-600", bg: "bg-indigo-50" 
            },
            { 
              label: "Sick Leave", 
              allocated: balance?.sickAllocated || 0, 
              used: balance?.sickUsed || 0, 
              pending: balance?.sickPending || 0,
              color: "text-emerald-600", bg: "bg-emerald-50" 
            },
            { 
              label: "Privilege Leave", 
              allocated: balance?.privilegeAllocated || 0, 
              used: balance?.privilegeUsed || 0, 
              pending: balance?.privilegePending || 0,
              color: "text-amber-600", bg: "bg-amber-50" 
            },
            { 
              label: "Optional Holiday", 
              allocated: balance?.optionalAllocated || 0, 
              used: balance?.optionalUsed || 0, 
              pending: balance?.optionalPending || 0,
              color: "text-rose-600", bg: "bg-rose-50" 
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-[2rem] border border-zinc-100 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{item.label}</span>
                <div className={`${item.bg} ${item.color} p-2 rounded-xl`}>
                  <Calendar size={16} />
                </div>
              </div>
              <div>
                <p className="text-3xl font-black text-zinc-900">
                  {item.allocated - item.used - item.pending} <span className="text-xs font-medium text-zinc-400">/ {item.allocated}</span>
                </p>
                <div className="flex flex-col mt-2 gap-1">
                   <p className="text-[10px] font-bold text-zinc-500 uppercase flex justify-between">
                     <span>Consumed:</span> 
                     <span className="text-zinc-900">{item.used} Days</span>
                   </p>
                   <p className="text-[10px] font-bold text-zinc-400 uppercase flex justify-between">
                     <span>Pending:</span> 
                     <span className="text-amber-600">{item.pending} Days</span>
                   </p>
                   <p className="text-[10px] font-black text-emerald-600 uppercase flex justify-between pt-1 border-t border-zinc-50">
                     <span>Remaining:</span> 
                     <span>{item.allocated - item.used - item.pending} Days</span>
                   </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-zinc-200 w-fit">
        {!isAdminUser() && (
          <button 
            onClick={() => setActiveTab("my-leaves")}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "my-leaves" ? 'bg-zinc-900 text-white shadow-lg' : 'text-zinc-500 hover:bg-zinc-50'}`}
          >
            My Leaves
          </button>
        )}
        {isAdminUser() && (
          <button 
            onClick={() => setActiveTab("admin-panel")}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "admin-panel" ? 'bg-zinc-900 text-white shadow-lg' : 'text-zinc-500 hover:bg-zinc-50'}`}
          >
            Admin Panel
          </button>
        )}
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-[2.5rem] border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-zinc-100 flex items-center justify-between">
          <h3 className="text-xl font-black text-zinc-900 uppercase tracking-tighter">
            {activeTab === "my-leaves" ? "My Leave History" : "Pending Approvals"}
          </h3>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              placeholder="Search requests..." 
              className="bg-zinc-50 border border-zinc-100 pl-12 pr-6 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50">
                {activeTab === "admin-panel" && <th className="px-8 py-4 text-[10px] font-black uppercase text-zinc-400">Employee</th>}
                <th className="px-8 py-4 text-[10px] font-black uppercase text-zinc-400">Leave Type</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase text-zinc-400">Duration</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase text-zinc-400">Days</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase text-zinc-400">Status</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center font-bold text-zinc-400 animate-pulse">
                    Loading leave requests...
                  </td>
                </tr>
              ) : (
                <>
                  {((activeTab === "my-leaves" ? requests : adminRequests) || []).map((leave) => (
                    <tr key={leave._id} className="group hover:bg-zinc-50/50 transition-colors">
                  {activeTab === "admin-panel" && (
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-500">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-900">{leave.userId?.email?.split('@')[0]}</p>
                          <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-tight">{leave.userId?.employeeRef}</p>
                        </div>
                      </div>
                    </td>
                  )}
                  <td className="px-8 py-6">
                    <span className="text-sm font-bold text-zinc-900">{leave.leaveType}</span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-medium text-zinc-600">
                      {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-8 py-6 text-sm font-black text-zinc-900">{leave.totalDays} Days</td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusColor(leave.status)}`}>
                      {leave.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <button 
                      onClick={() => {
                        setSelectedLeave(leave);
                        setIsActionModalOpen(true);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                        leave.status === 'Pending' && isAdminUser() 
                          ? 'bg-zinc-900 text-white shadow-lg hover:bg-zinc-800' 
                          : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                      }`}
                    >
                      {isAdminUser() && leave.status === 'Pending' ? 'Review' : 'View Details'}
                      <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              </>
              )}
              {((activeTab === "my-leaves" ? requests : adminRequests) || []).length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center opacity-20">
                      <FileText size={48} strokeWidth={1} />
                      <p className="text-sm font-black mt-4 uppercase tracking-widest">No leave requests found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-zinc-100 flex items-center justify-between">
              <h2 className="text-2xl font-black text-zinc-900 italic tracking-tighter">Apply<span className="text-primary italic">Leave</span></h2>
              <button onClick={() => setIsApplyModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">✕</button>
            </div>
            <form onSubmit={handleApplyLeave} className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Leave Type</label>
                  <select 
                    value={formData.leaveType}
                    onChange={e => setFormData({...formData, leaveType: e.target.value})}
                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary text-sm font-bold appearance-none cursor-pointer"
                  >
                    <option>Bereavement Leave</option>
                    <option>Sick Leave</option>
                    <option>Privilege Leave</option>
                    <option>Optional Holiday</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">From Date</label>
                    <input 
                      type="date" 
                      required
                      value={formData.fromDate}
                      onChange={e => setFormData({...formData, fromDate: e.target.value})}
                      className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">To Date</label>
                    <input 
                      type="date" 
                      required
                      value={formData.toDate}
                      onChange={e => setFormData({...formData, toDate: e.target.value})}
                      className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary text-sm font-bold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Reason (Mandatory)</label>
                  <textarea 
                    required
                    value={formData.reason}
                    onChange={e => setFormData({...formData, reason: e.target.value})}
                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary text-sm font-bold min-h-[120px]"
                    placeholder="Briefly explain your reason for leave..."
                  ></textarea>
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full bg-primary text-white py-4 rounded-2xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Details/Action Modal */}
      {isActionModalOpen && selectedLeave && (
        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <h2 className="text-2xl font-black text-zinc-900">Leave Details</h2>
              <button onClick={() => setIsActionModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">✕</button>
            </div>
            
            <div className="p-8 space-y-8">
              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Employee</p>
                  <p className="text-sm font-bold text-zinc-900">{selectedLeave.userId?.email || 'Me'}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Type</p>
                  <p className="text-sm font-bold text-zinc-900">{selectedLeave.leaveType}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Period</p>
                  <p className="text-sm font-bold text-zinc-900">
                    {new Date(selectedLeave.fromDate).toLocaleDateString()} - {new Date(selectedLeave.toDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Total Days</p>
                  <p className="text-sm font-bold text-zinc-900">{selectedLeave.totalDays} Days</p>
                </div>
              </div>

              <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">Reason for Leave</p>
                <p className="text-sm font-medium text-zinc-700 leading-relaxed italic">"{selectedLeave.reason}"</p>
              </div>

              {selectedLeave.status === 'Pending' && !isAdminUser() && (
                <div className="pt-4">
                  <button 
                    onClick={() => handleWithdraw(selectedLeave._id)}
                    className="w-full bg-rose-50 text-rose-600 py-4 rounded-2xl text-sm font-bold hover:bg-rose-100 transition-all border border-rose-200 flex items-center justify-center gap-2"
                  >
                    <XCircle size={18} /> Withdraw Request
                  </button>
                  <p className="text-[10px] text-zinc-400 text-center mt-3 font-medium">You can only withdraw requests that are still pending approval.</p>
                </div>
              )}

              {selectedLeave.status !== 'Pending' && (
                <div className={`p-6 rounded-3xl border ${getStatusColor(selectedLeave.status)}`}>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-2">Outcome</p>
                  <div className="flex items-center gap-3">
                    {selectedLeave.status === 'Approved' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                    <span className="text-sm font-bold">{selectedLeave.status} by {selectedLeave.approvedBy?.email || 'Admin'}</span>
                  </div>
                  {selectedLeave.rejectionReason && (
                    <p className="mt-3 text-xs font-medium bg-white/50 p-3 rounded-xl border border-rose-200">
                      Reason: {selectedLeave.rejectionReason}
                    </p>
                  )}
                </div>
              )}

              {/* Live Leave Summary for Admin */}
              {activeTab === "admin-panel" && employeeBalance && (
                <div className="space-y-4 pt-4 border-t border-zinc-100">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-zinc-900 uppercase tracking-widest">Live Leave Summary</h4>
                    <span className="text-[10px] font-bold text-zinc-400 italic">Current Year Balance</span>
                  </div>
                  
                  {(() => {
                    const typeKeyMap: any = {
                      'Bereavement Leave': 'bereavement',
                      'Sick Leave': 'sick',
                      'Privilege Leave': 'privilege',
                      'Optional Holiday': 'optional'
                    };
                    const prefix = typeKeyMap[selectedLeave.leaveType];
                    const allocated = employeeBalance[`${prefix}Allocated`] || 0;
                    const used = employeeBalance[`${prefix}Used`] || 0;
                    const pending = employeeBalance[`${prefix}Pending`] || 0;
                    const remaining = allocated - used - pending;
                    const isInsufficient = selectedLeave.status === 'Pending' && remaining < selectedLeave.totalDays;

                    return (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-3">
                          <div className="flex justify-between text-[10px] font-bold uppercase text-zinc-400">
                            <span>Allocated</span>
                            <span className="text-zinc-900">{allocated}</span>
                          </div>
                          <div className="flex justify-between text-[10px] font-bold uppercase text-zinc-400">
                            <span>Used</span>
                            <span className="text-zinc-900">{used}</span>
                          </div>
                          <div className="flex justify-between text-[10px] font-bold uppercase text-zinc-400">
                            <span>Pending</span>
                            <span className="text-amber-600">{pending}</span>
                          </div>
                          <div className="flex justify-between text-[10px] font-black uppercase text-emerald-600 pt-2 border-t border-zinc-100">
                            <span>Remaining</span>
                            <span>{remaining}</span>
                          </div>
                        </div>

                        <div className="flex flex-col justify-center">
                          {isInsufficient ? (
                            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 flex items-start gap-3">
                              <AlertCircle className="text-rose-500 shrink-0" size={16} />
                              <div>
                                <p className="text-[10px] font-black text-rose-600 uppercase">Insufficient Balance</p>
                                <p className="text-[9px] font-medium text-rose-500 leading-tight mt-1">
                                  This request ({selectedLeave.totalDays}d) exceeds the remaining balance ({remaining}d).
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-3">
                              <CheckCircle2 className="text-emerald-500 shrink-0" size={16} />
                              <div>
                                <p className="text-[10px] font-black text-emerald-600 uppercase">Healthy Balance</p>
                                <p className="text-[9px] font-medium text-emerald-500 leading-tight mt-1">
                                  Policy compliant request. Remaining after approval: {remaining - selectedLeave.totalDays}d.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Admin Actions */}
              {activeTab === "admin-panel" && selectedLeave.status === 'Pending' && (
                <div className="space-y-4">
                  <textarea 
                    placeholder="Enter rejection reason (optional)..."
                    value={rejectionReason}
                    onChange={e => setRejectionReason(e.target.value)}
                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary text-sm font-bold min-h-[80px]"
                  ></textarea>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => handleAction('Rejected')}
                      className="flex-grow bg-rose-50 text-rose-600 py-4 rounded-2xl text-sm font-bold hover:bg-rose-100 transition-all border border-rose-200"
                    >
                      Reject
                    </button>
                    <button 
                      onClick={() => handleAction('Approved')}
                      className="flex-grow bg-emerald-500 text-white py-4 rounded-2xl text-sm font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Policy Modal */}
      {isPolicyModalOpen && (
        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-zinc-100 flex items-center justify-between">
              <h2 className="text-2xl font-black text-zinc-900">Leave Policy Settings</h2>
              <button onClick={() => setIsPolicyModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">✕</button>
            </div>
            <form onSubmit={handleUpdatePolicy} className="p-8 space-y-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Policy Year</label>
                  <input 
                    type="number" 
                    readOnly
                    value={policyData.year}
                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none text-sm font-bold text-zinc-400"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Bereavement Leave (BL)</label>
                    <input 
                      type="number" 
                      required
                      value={policyData.bereavementLeave}
                      onChange={e => setPolicyData({...policyData, bereavementLeave: parseInt(e.target.value) || 0})}
                      className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Sick Leave (SL)</label>
                    <input 
                      type="number" 
                      required
                      value={policyData.sickLeave}
                      onChange={e => setPolicyData({...policyData, sickLeave: parseInt(e.target.value) || 0})}
                      className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Privilege Leave (PL)</label>
                    <input 
                      type="number" 
                      required
                      value={policyData.privilegeLeave}
                      onChange={e => setPolicyData({...policyData, privilegeLeave: parseInt(e.target.value) || 0})}
                      className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary text-sm font-bold"
                    />
                  </div>
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full bg-zinc-900 text-white py-4 rounded-2xl text-sm font-bold hover:bg-zinc-800 transition-all shadow-lg"
              >
                Save Policy Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

