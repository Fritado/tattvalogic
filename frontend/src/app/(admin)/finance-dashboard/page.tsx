"use client";

import React, { useEffect, useState } from "react";
import { 
  FileText, 
  MessageSquare, 
  Briefcase, 
  Users, 
  TrendingUp,
  LayoutDashboard
} from "lucide-react";
import { API_BASE } from "@/config/apiConfig";

export default function UserDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        const res = await fetch(`${API_BASE}/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Blank State Case: No features assigned
  if (!stats || !stats.widgets || stats.widgets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center bg-white border border-zinc-200 rounded-[2rem] p-16 text-center shadow-sm">
        <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
          <LayoutDashboard size={32} className="text-zinc-300" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 mb-2">No Modules Assigned Yet</h2>
        <p className="text-zinc-500 max-w-md mx-auto">
          Your dashboard is clean because you haven't been assigned any feature permissions. 
          Please contact your administrator to grant you access to leads, pipelines, or other modules.
        </p>
      </div>
    );
  }

  // Icons map
  const ICONS: Record<string, any> = {
    'leads': MessageSquare,
    'applications': Users,
    'employees': Briefcase,
    'blogs': FileText,
    'team-overview': Users,
  };

  const COLORS: Record<string, string> = {
    'leads': 'bg-purple-500',
    'applications': 'bg-amber-500',
    'employees': 'bg-emerald-500',
    'blogs': 'bg-blue-500',
    'team-overview': 'bg-indigo-500',
  };

  return (
    <div className="space-y-8">
      {stats.widgets.map((widget: any) => {
        const Icon = ICONS[widget.id] || LayoutDashboard;
        const colorClass = COLORS[widget.id] || 'bg-zinc-800';

        return (
          <div key={widget.id} className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-zinc-900">{widget.title}</h2>
              <div className={`p-2 rounded-xl ${colorClass} text-white bg-opacity-10`}>
                <Icon size={18} className={`text-${colorClass.replace('bg-', '')}`} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {widget.data.map((item: any, idx: number) => (
                <div key={idx} className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                  <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">{item.label}</h3>
                  <p className="text-3xl font-black text-zinc-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
