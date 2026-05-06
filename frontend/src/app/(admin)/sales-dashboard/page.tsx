"use client";

import React, { useEffect, useState } from "react";
import { 
  TrendingUp,
  LayoutDashboard,
  Target,
  ArrowRight,
  Search,
  Filter,
  Users
} from "lucide-react";
import { API_BASE } from "@/config/apiConfig";

export default function UserDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filterStage, setFilterStage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  if (!stats || (!stats.widgets && !stats.performance)) {
    return (
      <div className="flex flex-col items-center justify-center bg-white border border-zinc-200 rounded-[2rem] p-16 text-center shadow-sm">
        <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
          <LayoutDashboard size={32} className="text-zinc-300" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 mb-2">No Modules Assigned Yet</h2>
        <p className="text-zinc-500 max-w-md mx-auto">
          Please contact your administrator to grant you access to leads or other modules.
        </p>
      </div>
    );
  }

  const STAGE_COLORS: any = {
    'new': 'bg-indigo-500',
    'contacted': 'bg-blue-500',
    'qualified': 'bg-cyan-500',
    'proposal': 'bg-emerald-500',
    'won': 'bg-amber-500'
  };

  const filteredLeads = stats.performance?.leads.filter((l: any) => {
    const matchesSearch = l.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          l.contacts[0]?.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStage) {
      const stageMap: any = {
        'new': ['New Lead'],
        'contacted': ['Contacted'],
        'qualified': ['Qualification'],
        'proposal': ['Proposal Sent', 'Negotiation'],
        'won': ['Won']
      };
      return matchesSearch && stageMap[filterStage].includes(l.status);
    }
    return matchesSearch;
  });

  return (
    <div className="space-y-10 pb-20">
      {/* 1. Monthly Performance Analytics */}
      {stats.performance && (
        <div className="space-y-10">
          <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-200 shadow-sm overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <TrendingUp size={120} strokeWidth={3} />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Performance Overview</h2>
                  <p className="text-zinc-500 font-medium">{stats.performance.monthName} {stats.performance.year} • Target Tracking</p>
                </div>
                <div className="px-4 py-2 bg-primary/10 text-primary rounded-2xl text-[10px] font-black uppercase tracking-widest border border-primary/20 animate-pulse">
                  Live Analytics
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {[
                  { label: 'Leads Generated', current: stats.performance.achievements.leads, target: stats.performance.targets.leads, color: 'emerald' },
                  { label: 'Conversions', current: stats.performance.achievements.conversions, target: stats.performance.targets.conversions, color: 'blue' },
                  { label: 'Revenue (₹)', current: stats.performance.achievements.revenue, target: stats.performance.targets.revenue, color: 'amber' }
                ].map((metric, idx) => {
                  const percent = metric.target > 0 ? Math.round((metric.current / metric.target) * 100) : (metric.current > 0 ? 100 : 0);
                  const c = metric.color;

                  return (
                    <div key={idx} className="space-y-4">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">{metric.label}</p>
                          <p className="text-3xl font-black text-zinc-900">
                            {metric.label.includes('Revenue') ? `₹${metric.current.toLocaleString()}` : metric.current}
                            <span className="text-sm text-zinc-300 font-bold ml-2">/ {metric.label.includes('Revenue') ? `₹${metric.target.toLocaleString()}` : metric.target}</span>
                          </p>
                        </div>
                        <div className={`text-xl font-black text-${c}-500`}>{percent}%</div>
                      </div>
                      <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 bg-${c}-500`}
                          style={{ width: `${Math.min(percent, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 2. Lead Funnel Section (VERTICAL FULL VIEW) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Funnel Visualization */}
            <div className="lg:col-span-7 bg-white p-8 rounded-[2.5rem] border border-zinc-200 shadow-sm">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-lg font-bold text-zinc-900">Conversion Funnel</h3>
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase">
                  <Users size={14} />
                  Total Leads: {stats.performance.funnel[0].count}
                </div>
              </div>

              <div className="space-y-4">
                {stats.performance.funnel.map((stage: any, idx: number) => {
                  const maxCount = stats.performance.funnel[0].count;
                  const width = maxCount > 0 ? (stage.count / maxCount) * 100 : 0;
                  const isSelected = filterStage === stage.id;

                  return (
                    <div key={stage.id} className="relative">
                      <div 
                        onClick={() => setFilterStage(isSelected ? null : stage.id)}
                        className={`group cursor-pointer flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${isSelected ? 'bg-zinc-100 scale-[1.02]' : 'hover:bg-zinc-50'}`}
                      >
                        <div className="flex items-center gap-4 z-10">
                          <div className={`w-10 h-10 rounded-xl ${STAGE_COLORS[stage.id]} flex items-center justify-center text-white font-bold`}>
                            {idx + 1}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-zinc-900">{stage.label}</p>
                            <p className="text-xs font-bold text-zinc-400">{stage.count} Leads</p>
                          </div>
                        </div>
                        
                        <div className="relative flex-grow mx-8 h-10 bg-zinc-50 rounded-lg overflow-hidden border border-zinc-100">
                          <div 
                            className={`absolute inset-y-0 left-0 transition-all duration-1000 ${STAGE_COLORS[stage.id]} opacity-20`}
                            style={{ width: `${width}%` }}
                          />
                          <div 
                            className={`absolute inset-y-0 left-0 h-1 transition-all duration-1000 ${STAGE_COLORS[stage.id]}`}
                            style={{ width: `${width}%` }}
                          />
                        </div>

                        <div className="text-right z-10">
                          <p className="text-lg font-black text-zinc-900">{Math.round(width)}%</p>
                        </div>
                      </div>
                      
                      {idx < stats.performance.funnel.length - 1 && (
                        <div className="flex justify-center -my-2 relative z-0">
                          <div className="h-4 w-px bg-zinc-200" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* KPI Section */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-200 shadow-sm relative overflow-hidden h-full flex flex-col justify-between">
                <div className="absolute top-0 right-0 p-8 opacity-5 text-primary">
                  <TrendingUp size={120} strokeWidth={3} />
                </div>
                <h3 className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-8 border-b border-zinc-100 pb-4">Efficiency Metrics</h3>
                
                <div className="space-y-8 flex-grow flex flex-col justify-center">
                  {[
                    { label: 'Lead → Contacted', value: stats.performance.stats.leadToContacted, desc: 'Outreach speed', iconColor: 'text-indigo-500', bgColor: 'bg-indigo-50' },
                    { label: 'Contacted → Qualified', value: stats.performance.stats.contactedToQualified, desc: 'Lead quality', iconColor: 'text-blue-500', bgColor: 'bg-blue-50' },
                    { label: 'Qualified → Won', value: stats.performance.stats.qualifiedToWon, desc: 'Closing skill', iconColor: 'text-emerald-500', bgColor: 'bg-emerald-50' },
                    { label: 'Overall Rate', value: stats.performance.stats.overallConversion, desc: 'Net success', iconColor: 'text-primary', bgColor: 'bg-primary/5' }
                  ].map((kpi, idx) => (
                    <div key={idx} className="flex items-center gap-5 group">
                      <div className={`p-3 ${kpi.bgColor} ${kpi.iconColor} rounded-2xl transition-transform group-hover:scale-110`}>
                        <ArrowRight size={18} />
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-baseline justify-between">
                          <p className="text-sm font-bold text-zinc-900">{kpi.label}</p>
                          <span className={`text-xl font-black ${kpi.iconColor}`}>{Math.round(kpi.value)}%</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 font-medium">{kpi.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 pt-8 border-t border-zinc-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-black text-rose-500">{stats.performance.lostCount}</p>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Leads Lost</p>
                    </div>
                    <div className="p-4 bg-rose-50 rounded-2xl text-rose-500">
                      <Target size={28} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Detailed Lead Breakdown */}
          <div className="bg-white rounded-[2.5rem] border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Detailed Breakdown</h3>
                <p className="text-sm text-zinc-400 font-medium">
                  {filterStage ? `Filtered: ${filterStage.toUpperCase()} stage` : "Current cohort lead journey"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search leads..." 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary w-64"
                  />
                </div>
                {filterStage && (
                  <button onClick={() => setFilterStage(null)} className="text-xs font-bold text-primary">Clear</button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50/50">
                    <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Company</th>
                    <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Lead Stage</th>
                    <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Value</th>
                    <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Last Activity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filteredLeads.map((lead: any) => (
                    <tr key={lead._id} className="hover:bg-zinc-50/50 transition-colors group">
                      <td className="p-4">
                        <p className="text-sm font-bold text-zinc-900">{lead.companyName}</p>
                        <p className="text-[10px] font-medium text-zinc-400">{lead.contacts[0]?.name}</p>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                          lead.status === 'Won' ? 'bg-emerald-100 text-emerald-700' : 
                          lead.status === 'Lost' ? 'bg-rose-100 text-rose-700' : 'bg-zinc-100 text-zinc-600'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-sm text-zinc-900 italic">₹{lead.dealValue?.toLocaleString()}</td>
                      <td className="p-4 text-xs text-zinc-400 font-medium">{new Date(lead.updatedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. Legacy Widgets (if any) */}
      <div className="grid grid-cols-1 gap-8">
        {stats.widgets?.map((widget: any) => {
          return (
            <div key={widget.id} className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
              <h2 className="text-lg font-bold text-zinc-900 mb-6">{widget.title}</h2>
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
    </div>
  );
}
