"use client";

import React, { useEffect, useState } from "react";
import { API_BASE } from "@/config/apiConfig";
import { 
  Filter, 
  Calendar, 
  TrendingUp, 
  Users, 
  Target, 
  ArrowRight,
  Info,
  ChevronDown,
  Search
} from "lucide-react";

export default function FunnelReport() {
  const [month, setMonth] = useState(new Date().toISOString().slice(5, 7));
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<any>(null);
  const [filterStage, setFilterStage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchReport = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/performance/funnel-report?month=${month}&year=${year}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [month, year]);

  const filteredLeads = report?.leads.filter((l: any) => {
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

  const STAGE_COLORS: any = {
    'new': 'bg-indigo-500',
    'contacted': 'bg-blue-500',
    'qualified': 'bg-cyan-500',
    'proposal': 'bg-emerald-500',
    'won': 'bg-amber-500'
  };

  if (loading && !report) return <div className="p-10 text-center font-bold text-zinc-400">Generating Funnel Analytics...</div>;

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Lead Funnel Report</h2>
          <p className="text-zinc-500 font-medium">Cohort analysis for leads created in {new Date(2026, parseInt(month)-1).toLocaleString('default', { month: 'long' })} {year}</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Funnel Visualization */}
        <div className="lg:col-span-7 bg-white p-8 rounded-[2.5rem] border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-lg font-bold text-zinc-900">Conversion Funnel</h3>
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase">
              <Users size={14} />
              Total Leads: {report?.funnel[0].count}
            </div>
          </div>

          <div className="space-y-4">
            {report?.funnel.map((stage: any, idx: number) => {
              const maxCount = report.funnel[0].count;
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
                  
                  {/* Drop-off indicator between stages */}
                  {idx < report.funnel.length - 1 && (
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
          <div className="bg-zinc-900 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <TrendingUp size={80} />
            </div>
            <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-6">Conversion Efficiency</h3>
            
            <div className="space-y-6">
              {[
                { label: 'Lead → Contacted', value: report?.stats.leadToContacted, desc: 'Efficiency in initial outreach' },
                { label: 'Contacted → Qualified', value: report?.stats.contactedToQualified, desc: 'Quality of target leads' },
                { label: 'Qualified → Won', value: report?.stats.qualifiedToWon, desc: 'Closing performance' },
                { label: 'Overall Conversion', value: report?.stats.overallConversion, desc: 'Final success rate' }
              ].map((kpi, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <ArrowRight size={16} className="text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold">{kpi.label}</p>
                      <span className="text-2xl font-black text-primary">{Math.round(kpi.value)}%</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 font-medium">{kpi.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-200 shadow-sm">
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Loss Analysis</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-black text-rose-500">{report?.lostCount}</p>
                <p className="text-xs font-bold text-zinc-400">Leads Lost this cohort</p>
              </div>
              <div className="p-4 bg-rose-50 rounded-full text-rose-500">
                <Target size={32} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Drill-down Table */}
      <div className="bg-white rounded-[2.5rem] border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-zinc-900">Detailed Lead Breakdown</h3>
            <p className="text-sm text-zinc-400 font-medium">
              {filterStage ? `Showing leads currently in stage: ${filterStage.toUpperCase()}` : "Showing all leads in this cohort"}
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
                className="pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary w-full md:w-64"
              />
            </div>
            {filterStage && (
              <button 
                onClick={() => setFilterStage(null)}
                className="text-xs font-bold text-primary hover:underline"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50">
                <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Lead / Company</th>
                <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Contact</th>
                <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Current Status</th>
                <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Value (₹)</th>
                <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredLeads.map((lead: any) => (
                <tr key={lead._id} className="hover:bg-zinc-50/30 transition-colors group">
                  <td className="p-4">
                    <p className="text-sm font-bold text-zinc-900">{lead.companyName}</p>
                    <p className="text-[10px] font-medium text-zinc-400">{lead.leadId}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-bold text-zinc-700">{lead.contacts[0]?.name}</p>
                    <p className="text-[10px] font-medium text-zinc-400">{lead.contacts[0]?.email}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                      lead.status === 'Won' ? 'bg-emerald-100 text-emerald-700' : 
                      lead.status === 'Lost' ? 'bg-rose-100 text-rose-700' : 'bg-zinc-100 text-zinc-600'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-sm text-zinc-900">
                    ₹{lead.dealValue?.toLocaleString() || '0'}
                  </td>
                  <td className="p-4 text-xs text-zinc-400 font-medium">
                    {new Date(lead.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-zinc-400 font-bold">No leads found for this stage/search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
