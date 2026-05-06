"use client";

import React, { useEffect, useState } from "react";
import { API_BASE } from "@/config/apiConfig";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target, 
  Plus, 
  Calendar,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  MessageSquare,
  CheckSquare,
  Activity,
  ArrowRight
} from "lucide-react";

export default function MarketingPerformance() {
  const [month, setMonth] = useState(new Date().toISOString().slice(5, 7));
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
   const [targets, setTargets] = useState({ leads: 0, conversions: 0, revenue: 0 });
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [detailsMap, setDetailsMap] = useState<Record<string, any>>({});
  const [loadingDetails, setLoadingDetails] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/performance/team?month=${month}&year=${year}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [month, year]);

  const toggleExpand = async (userId: string) => {
    if (expandedUserId === userId) {
      setExpandedUserId(null);
      return;
    }

    setExpandedUserId(userId);
    
    // Fetch details if not already fetched for this month/year
    if (!detailsMap[userId]) {
      setLoadingDetails(userId);
      try {
        const token = localStorage.getItem("admin_token");
        
        // Fetch Funnel Data
        const funnelRes = await fetch(`${API_BASE}/performance/funnel-report?userId=${userId}&month=${month}&year=${year}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const funnelData = await funnelRes.json();

        // Fetch Task/Activity Details
        const detailsRes = await fetch(`${API_BASE}/performance/user-details?userId=${userId}&month=${month}&year=${year}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const detailsData = await detailsRes.json();

        setDetailsMap(prev => ({
          ...prev,
          [userId]: { ...funnelData, ...detailsData }
        }));
      } catch (err) {
        console.error("Failed to fetch details:", err);
      } finally {
        setLoadingDetails(null);
      }
    }
  };

  const handleSetTarget = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("admin_token");
      await fetch(`${API_BASE}/performance/plans`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          userId: selectedUser._id,
          month,
          year,
          targets
        })
      });
      setIsModalOpen(false);
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  const calculateCompletion = (achieved: number, target: number) => {
    if (!target || target === 0) return achieved > 0 ? 100 : 0;
    return Math.round((achieved / target) * 100);
  };

  const getStatusColor = (percent: number) => {
    if (percent >= 100) return "text-emerald-600 bg-emerald-50 border-emerald-100";
    if (percent >= 70) return "text-amber-600 bg-amber-50 border-amber-100";
    return "text-rose-600 bg-rose-50 border-rose-100";
  };

  const getProgressColor = (percent: number) => {
    if (percent >= 100) return "bg-emerald-500";
    if (percent >= 70) return "bg-amber-500";
    return "bg-rose-500";
  };

  if (loading && !stats) return <div className="p-10 text-center">Loading Performance Data...</div>;

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Team Plan Vs Performance</h2>
          <p className="text-zinc-500 font-medium">Monthly Plan vs Achievement Tracking</p>
        </div>

        <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex items-center gap-2 px-3 border-r border-zinc-100">
            <Calendar size={16} className="text-zinc-400" />
            <select 
              value={month} 
              onChange={e => setMonth(e.target.value)}
              className="bg-transparent border-none text-sm font-bold outline-none cursor-pointer"
            >
              {Array.from({ length: 12 }, (_, i) => {
                const m = (i + 1).toString().padStart(2, '0');
                return <option key={m} value={m}>{new Date(2026, i).toLocaleString('default', { month: 'long' })}</option>
              })}
            </select>
          </div>
          <div className="px-3">
            <select 
              value={year} 
              onChange={e => setYear(e.target.value)}
              className="bg-transparent border-none text-sm font-bold outline-none cursor-pointer"
            >
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
            </select>
          </div>
        </div>
      </div>

      {/* Team Totals Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Target size={20} />
                </div>
                <span className="text-sm font-bold text-zinc-500">Total Leads</span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-black text-zinc-900">{stats.totals.achievements.leads} / {stats.totals.targets.leads}</p>
                  <p className="text-sm font-bold text-zinc-400 mt-1">{calculateCompletion(stats.totals.achievements.leads, stats.totals.targets.leads)}% completion</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <CheckCircle2 size={20} />
                </div>
                <span className="text-sm font-bold text-zinc-500">Total Conversions</span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-black text-zinc-900">{stats.totals.achievements.conversions} / {stats.totals.targets.conversions}</p>
                  <p className="text-sm font-bold text-zinc-400 mt-1">{calculateCompletion(stats.totals.achievements.conversions, stats.totals.targets.conversions)}% completion</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                  <TrendingUp size={20} />
                </div>
                <span className="text-sm font-bold text-zinc-500">Total Revenue</span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-black text-zinc-900">₹{stats.totals.achievements.revenue.toLocaleString()} / ₹{stats.totals.targets.revenue.toLocaleString()}</p>
                  <p className="text-sm font-bold text-zinc-400 mt-1">{calculateCompletion(stats.totals.achievements.revenue, stats.totals.targets.revenue)}% completion</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Individual Breakdown List */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-zinc-900">Team Member Performance</h3>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{stats?.individual.length || 0} Members Found</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50">
                <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">User</th>
                <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Leads</th>
                <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Conversions</th>
                <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Revenue</th>
                <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
               {stats?.individual.map((item: any) => {
                const leadPercent = calculateCompletion(item.achievements.leads, item.plan.targets.leads);
                const convPercent = calculateCompletion(item.achievements.conversions, item.plan.targets.conversions);
                const revPercent = calculateCompletion(item.achievements.revenue, item.plan.targets.revenue);
                const isExpanded = expandedUserId === item.user._id;
                const details = detailsMap[item.user._id];

                return (
                  <React.Fragment key={item.user._id}>
                    <tr 
                      className={`group cursor-pointer transition-all ${isExpanded ? 'bg-zinc-50' : 'hover:bg-zinc-50/50'}`}
                      onClick={() => toggleExpand(item.user._id)}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-center justify-center gap-1 w-6 shrink-0">
                            {isExpanded ? <ChevronDown size={14} className="text-primary" /> : <ChevronRight size={14} className="text-zinc-300 group-hover:text-zinc-400" />}
                          </div>
                          <div className="h-10 w-10 bg-zinc-100 rounded-full flex items-center justify-center font-bold text-zinc-500 uppercase shrink-0">
                            {item.user.email[0]}
                          </div>
                          <div className="truncate">
                            <p className="text-sm font-bold text-zinc-900 truncate">{item.user.employeeRef?.fullName || item.user.email}</p>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">{item.user.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1.5 min-w-[120px]">
                          <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-zinc-500">{item.achievements.leads} / {item.plan.targets.leads}</span>
                            <span className={leadPercent >= 100 ? "text-emerald-600" : "text-zinc-400"}>{leadPercent}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-1000 ${getProgressColor(leadPercent)}`} 
                              style={{ width: `${Math.min(leadPercent, 100)}%` }} 
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1.5 min-w-[120px]">
                          <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-zinc-500">{item.achievements.conversions} / {item.plan.targets.conversions}</span>
                            <span className={convPercent >= 100 ? "text-emerald-600" : "text-zinc-400"}>{convPercent}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-1000 ${getProgressColor(convPercent)}`} 
                              style={{ width: `${Math.min(convPercent, 100)}%` }} 
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1.5 min-w-[140px]">
                          <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-zinc-500">₹{item.achievements.revenue.toLocaleString()} / ₹{item.plan.targets.revenue.toLocaleString()}</span>
                            <span className={revPercent >= 100 ? "text-emerald-600" : "text-zinc-400"}>{revPercent}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-1000 ${getProgressColor(revPercent)}`} 
                              style={{ width: `${Math.min(revPercent, 100)}%` }} 
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUser(item.user);
                            setTargets(item.plan.targets);
                            setIsModalOpen(true);
                          }}
                          className="bg-zinc-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-zinc-800 transition-colors"
                        >
                          Set Targets
                        </button>
                      </td>
                    </tr>
                    
                    {/* Expanded Content */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={5} className="p-0 border-none bg-zinc-50/30">
                          <div className="p-8 animate-in slide-in-from-top-4 duration-300">
                            {loadingDetails === item.user._id ? (
                              <div className="flex items-center justify-center py-10">
                                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                              </div>
                            ) : details ? (
                              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* Funnel Visual */}
                                <div className="lg:col-span-4 space-y-4">
                                  <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <TrendingUp size={14} /> Pipeline Funnel
                                  </h4>
                                  <div className="space-y-3">
                                    {details.funnel.map((stage: any, idx: number) => (
                                      <div key={stage.id} className="relative">
                                        <div className="flex items-center justify-between mb-1">
                                          <span className="text-xs font-bold text-zinc-600">{stage.label}</span>
                                          <span className="text-xs font-black text-zinc-900">{stage.count}</span>
                                        </div>
                                        <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                                          <div 
                                            className="h-full bg-primary" 
                                            style={{ width: `${(stage.count / (details.funnel[0].count || 1)) * 100}%`, opacity: 1 - (idx * 0.15) }} 
                                          />
                                        </div>
                                      </div>
                                    ))}
                                    <div className="pt-4 border-t border-zinc-200 grid grid-cols-2 gap-4">
                                      <div className="bg-white p-3 rounded-xl border border-zinc-100">
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase">Conversion</p>
                                        <p className="text-lg font-black text-emerald-600">{details.stats.overallConversion.toFixed(1)}%</p>
                                      </div>
                                      <div className="bg-white p-3 rounded-xl border border-zinc-100">
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase">Leads Lost</p>
                                        <p className="text-lg font-black text-rose-500">{details.lostCount}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Activity & Tasks */}
                                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                  {/* Tasks */}
                                  <div>
                                    <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                      <CheckSquare size={14} /> Recent Tasks ({details.taskCount})
                                    </h4>
                                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                      {details.tasks.map((task: any) => (
                                        <div key={task._id} className="p-3 bg-white border border-zinc-100 rounded-xl flex items-start gap-3">
                                          <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${task.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                          <div className="flex-grow">
                                            <p className="text-xs font-bold text-zinc-900">{task.title}</p>
                                            <p className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5">
                                              <span className="font-bold text-primary">{task.leadId?.companyName || 'Lead'}</span> • {new Date(task.dueDate).toLocaleDateString()}
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                      {details.tasks.length === 0 && <p className="text-xs text-zinc-400 italic py-4">No tasks found</p>}
                                    </div>
                                  </div>

                                  {/* Activities */}
                                  <div>
                                    <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                      <Activity size={14} /> Activity Log ({details.activityCount})
                                    </h4>
                                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                      {details.activities.map((act: any) => (
                                        <div key={act._id} className="p-3 bg-white border border-zinc-100 rounded-xl">
                                          <div className="flex items-center justify-between mb-1">
                                            <span className="text-[10px] font-black text-primary uppercase">{act.type}</span>
                                            <span className="text-[9px] text-zinc-400">{new Date(act.createdAt).toLocaleDateString()}</span>
                                          </div>
                                          <p className="text-[11px] text-zinc-700 font-medium line-clamp-2">{act.notes}</p>
                                          {act.leadId && <p className="text-[9px] font-bold text-zinc-400 mt-1 uppercase tracking-tighter">On: {act.leadId.companyName}</p>}
                                        </div>
                                      ))}
                                      {details.activities.length === 0 && <p className="text-xs text-zinc-400 italic py-4">No activities found</p>}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-10 text-rose-500 text-sm font-bold flex items-center justify-center gap-2">
                                <AlertCircle size={16} /> Error loading details.
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Target Setting Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-zinc-100 bg-zinc-50/50">
              <h3 className="text-2xl font-black text-zinc-900 tracking-tight">Set Monthly Targets</h3>
              <p className="text-sm text-zinc-500 mt-1 font-medium">For {selectedUser.employeeRef?.fullName || selectedUser.email} • {new Date(2026, parseInt(month)-1).toLocaleString('default', { month: 'long' })} {year}</p>
            </div>
            
            <form onSubmit={handleSetTarget} className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Leads Target</label>
                  <input 
                    type="number" 
                    required 
                    value={targets.leads}
                    onChange={e => setTargets({...targets, leads: parseInt(e.target.value)})}
                    className="w-full p-3 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-primary text-sm font-bold" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Conversions Target</label>
                  <input 
                    type="number" 
                    required 
                    value={targets.conversions}
                    onChange={e => setTargets({...targets, conversions: parseInt(e.target.value)})}
                    className="w-full p-3 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-primary text-sm font-bold" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Revenue Target (₹)</label>
                  <input 
                    type="number" 
                    required 
                    value={targets.revenue}
                    onChange={e => setTargets({...targets, revenue: parseInt(e.target.value)})}
                    className="w-full p-3 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-primary text-sm font-bold" 
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-zinc-200 rounded-2xl text-sm font-bold text-zinc-600 hover:bg-zinc-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-3 bg-zinc-900 text-white rounded-2xl text-sm font-bold hover:bg-zinc-800 transition-colors"
                >
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
