"use client";

import React, { useEffect, useState } from "react";
import { API_BASE } from "@/config/apiConfig";
import { 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  Calendar,
  AlertCircle
} from "lucide-react";

export default function MyPerformance() {
  const [month, setMonth] = useState(new Date().toISOString().slice(5, 7));
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const fetchMyStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/performance/stats?month=${month}&year=${year}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyStats();
  }, [month, year]);

  const calculateCompletion = (achieved: number, target: number) => {
    if (!target || target === 0) return achieved > 0 ? 100 : 0;
    return Math.round((achieved / target) * 100);
  };

  const getProgressColor = (percent: number) => {
    if (percent >= 100) return "bg-emerald-500";
    if (percent >= 70) return "bg-amber-500";
    return "bg-rose-500";
  };

  const getPercentageColor = (percent: number) => {
    if (percent >= 100) return "text-emerald-600";
    if (percent >= 70) return "text-amber-600";
    return "text-rose-600";
  };

  if (loading && !data) return <div className="p-10 text-center font-bold text-zinc-400">Calculating your performance...</div>;

  const leadPercent = calculateCompletion(data?.achievements.leads, data?.plan.targets.leads);
  const convPercent = calculateCompletion(data?.achievements.conversions, data?.plan.targets.conversions);
  const revPercent = calculateCompletion(data?.achievements.revenue, data?.plan.targets.revenue);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-zinc-900 tracking-tight">My Performance</h2>
          <p className="text-zinc-500 font-medium">Track your targets vs actual achievements</p>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Leads Card */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <Target size={24} />
            </div>
            <span className={`text-2xl font-black ${getPercentageColor(leadPercent)}`}>{leadPercent}%</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-1">Leads Generated</h3>
            <p className="text-4xl font-black text-zinc-900">{data?.achievements.leads} <span className="text-lg text-zinc-300">/ {data?.plan.targets.leads}</span></p>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-full bg-zinc-100 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${getProgressColor(leadPercent)}`} 
                style={{ width: `${Math.min(leadPercent, 100)}%` }} 
              />
            </div>
            <p className="text-xs font-bold text-zinc-400 italic">Target: {data?.plan.targets.leads} leads this month</p>
          </div>
        </div>

        {/* Conversions Card */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <CheckCircle2 size={24} />
            </div>
            <span className={`text-2xl font-black ${getPercentageColor(convPercent)}`}>{convPercent}%</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-1">Lead Conversions</h3>
            <p className="text-4xl font-black text-zinc-900">{data?.achievements.conversions} <span className="text-lg text-zinc-300">/ {data?.plan.targets.conversions}</span></p>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-full bg-zinc-100 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${getProgressColor(convPercent)}`} 
                style={{ width: `${Math.min(convPercent, 100)}%` }} 
              />
            </div>
            <p className="text-xs font-bold text-zinc-400 italic">Target: {data?.plan.targets.conversions} conversions this month</p>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <TrendingUp size={24} />
            </div>
            <span className={`text-2xl font-black ${getPercentageColor(revPercent)}`}>{revPercent}%</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-1">Revenue Closed</h3>
            <p className="text-4xl font-black text-zinc-900">₹{data?.achievements.revenue.toLocaleString()} <span className="text-lg text-zinc-300">/ ₹{data?.plan.targets.revenue.toLocaleString()}</span></p>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-full bg-zinc-100 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${getProgressColor(revPercent)}`} 
                style={{ width: `${Math.min(revPercent, 100)}%` }} 
              />
            </div>
            <p className="text-xs font-bold text-zinc-400 italic">Target: ₹{data?.plan.targets.revenue.toLocaleString()} revenue goal</p>
          </div>
        </div>
      </div>

      {/* Encouragement Banner */}
      <div className="bg-zinc-900 rounded-[2.5rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold mb-1">Keep it up! 🚀</h3>
          <p className="text-zinc-400 font-medium">You are doing great this month. Focus on converting those high-value leads!</p>
        </div>
        <div className="px-6 py-3 bg-white/10 rounded-2xl border border-white/10 text-sm font-bold">
          {leadPercent >= 70 ? "🔥 On Track" : "⏳ More Effort Needed"}
        </div>
      </div>
    </div>
  );
}
