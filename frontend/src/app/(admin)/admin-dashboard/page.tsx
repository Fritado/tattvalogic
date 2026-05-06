"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, TrendingUp, Clock, AlertCircle, CheckCircle2, 
  PlusCircle, UserPlus, CalendarDays, ClipboardList, 
  BarChart3, Settings, ShieldCheck, ArrowRight,
  UserCheck, Briefcase, MessageSquare, Activity
} from "lucide-react";
import Link from "next/link";
import { API_BASE } from "@/config/apiConfig";

export default function AdminDashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const headers = { Authorization: `Bearer ${token}` };

      const [summaryRes, activityRes, alertsRes] = await Promise.all([
        fetch(`${API_BASE}/dashboard/summary`, { headers }),
        fetch(`${API_BASE}/dashboard/activities`, { headers }),
        fetch(`${API_BASE}/dashboard/alerts`, { headers })
      ]);

      const [summaryData, activityData, alertsData] = await Promise.all([
        summaryRes.json(),
        activityRes.json(),
        alertsRes.json()
      ]);

      setSummary(summaryData);
      setActivities(activityData);
      setAlerts(alertsData);
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // Real-time polling every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const quickActions = [
    { name: "Add New Lead", icon: PlusCircle, href: "/admin-dashboard/crm", color: "text-blue-600", bg: "bg-blue-50" },
    { name: "Add Employee", icon: UserPlus, href: "/admin-dashboard/employees", color: "text-emerald-600", bg: "bg-emerald-50" },
    { name: "Assign Leave", icon: CalendarDays, href: "/admin-dashboard/hr/leaves", color: "text-purple-600", bg: "bg-purple-50" },
    { name: "Review Leaves", icon: ClipboardList, href: "/admin-dashboard/hr/leaves", color: "text-amber-600", bg: "bg-amber-50" },
    { name: "View Reports", icon: BarChart3, href: "/admin-dashboard/performance", color: "text-rose-600", bg: "bg-rose-50" },
    { name: "Manage Users", icon: ShieldCheck, href: "/admin-dashboard/user-management", color: "text-zinc-600", bg: "bg-zinc-50" },
  ];

  if (loading && !summary) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-zinc-400">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="font-bold uppercase tracking-widest text-xs">Initializing Operational Intelligence...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Top Section: Today at a Glance */}
      <div className="bg-zinc-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-zinc-200">
        <div className="relative z-10">
          <h1 className="text-3xl font-black tracking-tight mb-2">Today at a Glance</h1>
          <p className="text-zinc-400 font-medium">Real-time operational overview for {new Date().toLocaleDateString(undefined, { dateStyle: 'full' })}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8">
            <div className="space-y-1">
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">New Leads Today</p>
              <p className="text-3xl font-black text-primary">{summary?.hr?.leavesAppliedToday || 0}</p>
            </div>
            <div className="space-y-1">
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Pending Approvals</p>
              <p className="text-3xl font-black text-amber-400">{summary?.hr?.pendingLeaveApprovals || 0}</p>
            </div>
            <div className="space-y-1">
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">On Leave Today</p>
              <p className="text-3xl font-black text-rose-400">{summary?.hr?.employeesOnLeaveToday || 0}</p>
            </div>
            <div className="space-y-1 text-right">
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">System Status</p>
                <div className="flex items-center justify-end gap-2 text-emerald-400 font-bold">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    Operational
                </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20" />
      </div>

      {/* Core Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
                    <Users size={24} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Workforce</span>
            </div>
            <h3 className="text-zinc-500 text-sm font-medium">Active Employees</h3>
            <p className="text-4xl font-black text-zinc-900 tracking-tight">{summary?.core?.totalEmployees || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl group-hover:scale-110 transition-transform">
                    <TrendingUp size={24} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Sales Pipeline</span>
            </div>
            <h3 className="text-zinc-500 text-sm font-medium">Total CRM Leads</h3>
            <p className="text-4xl font-black text-zinc-900 tracking-tight">{summary?.core?.totalLeads || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl group-hover:scale-110 transition-transform">
                    <Briefcase size={24} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Active Focus</span>
            </div>
            <h3 className="text-zinc-500 text-sm font-medium">Open Leads</h3>
            <p className="text-4xl font-black text-zinc-900 tracking-tight">{summary?.core?.openLeads || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform">
                        <UserCheck size={24} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">HR Health</span>
                </div>
                <h3 className="text-zinc-500 text-sm font-medium">Daily Attendance</h3>
                <p className="text-4xl font-black text-zinc-900 tracking-tight">94%</p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <BarChart3 size={120} />
            </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-200 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-primary/10 text-primary rounded-xl">
                <Settings size={20} />
            </div>
            <h2 className="text-xl font-black text-zinc-900">Quick Operations</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action) => (
                <Link 
                    key={action.name} 
                    href={action.href}
                    className={`flex flex-col items-center justify-center p-6 rounded-3xl border border-zinc-100 ${action.bg} hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all group`}
                >
                    <action.icon className={`${action.color} mb-3 group-hover:scale-110 transition-transform`} size={28} />
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-700 text-center">{action.name}</span>
                </Link>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Feed */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-zinc-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-100 text-zinc-900 rounded-xl">
                    <Activity size={20} />
                </div>
                <h2 className="text-xl font-black text-zinc-900">Real-Time Activity</h2>
            </div>
            <button className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2 hover:gap-3 transition-all">
                Full Log <ArrowRight size={14} />
            </button>
          </div>
          
          <div className="space-y-6 flex-grow">
            {activities.length > 0 ? activities.map((activity, idx) => (
              <div key={idx} className="flex gap-4 group">
                <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                        activity.type === 'CRM' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                    }`}>
                        {activity.type === 'CRM' ? <MessageSquare size={18} /> : <CalendarDays size={18} />}
                    </div>
                    {idx !== activities.length - 1 && <div className="w-px flex-grow bg-zinc-100 my-2" />}
                </div>
                <div className="flex-grow pt-1 pb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{activity.type} Activity</span>
                    <span className="text-[9px] font-bold text-zinc-300 flex items-center gap-1">
                        <Clock size={10} /> {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h4 className="font-bold text-zinc-900 group-hover:text-primary transition-colors">{activity.title}</h4>
                  <p className="text-sm text-zinc-500 mt-1">{activity.description}</p>
                </div>
              </div>
            )) : (
                <div className="h-full flex flex-col items-center justify-center text-zinc-300 gap-4 py-12">
                    <Clock size={48} strokeWidth={1} />
                    <p className="text-xs font-bold uppercase tracking-widest">No activities detected today</p>
                </div>
            )}
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-rose-50 text-rose-500 rounded-xl">
                        <AlertCircle size={20} />
                    </div>
                    <h2 className="text-xl font-black text-zinc-900">Critical Alerts</h2>
                </div>
                
                <div className="space-y-4">
                    {alerts.length > 0 ? alerts.map((alert, idx) => (
                        <Link 
                            key={idx} 
                            href={alert.action}
                            className={`block p-5 rounded-3xl border ${
                                alert.type === 'warning' ? 'bg-amber-50 border-amber-100 text-amber-900' : 'bg-blue-50 border-blue-100 text-blue-900'
                            } hover:scale-[1.02] transition-all`}
                        >
                            <p className="text-sm font-bold leading-tight">{alert.message}</p>
                            <p className="text-[10px] font-black uppercase mt-3 flex items-center gap-2">
                                Take Action <ArrowRight size={12} />
                            </p>
                        </Link>
                    )) : (
                        <div className="p-10 text-center space-y-3">
                            <CheckCircle2 size={40} className="mx-auto text-emerald-400" strokeWidth={1.5} />
                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">All Clear</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-zinc-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                    <h3 className="text-lg font-black mb-2">Pro Tip</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                        Unassigned leads reduce conversion by 40%. Head to the Sales CRM to delegate incoming enquiries immediately.
                    </p>
                    <Link href="/admin-dashboard/crm" className="inline-flex items-center gap-2 text-primary font-bold mt-6 text-sm group-hover:gap-3 transition-all">
                        Open CRM <ArrowRight size={16} />
                    </Link>
                </div>
                <ShieldCheck size={100} className="absolute -right-6 -bottom-6 text-white/5 group-hover:rotate-12 transition-transform duration-700" />
            </div>
        </div>
      </div>
    </div>
  );
}
