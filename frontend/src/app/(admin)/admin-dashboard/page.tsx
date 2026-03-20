"use client";

import React from "react";
import { 
  FileText, 
  MessageSquare, 
  Briefcase, 
  Users, 
  TrendingUp,
  Clock
} from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { name: "Total Blogs", value: "12", icon: FileText, color: "bg-blue-500" },
    { name: "New Enquiries", value: "45", icon: MessageSquare, color: "bg-purple-500" },
    { name: "Active Careers", value: "8", icon: Briefcase, color: "bg-emerald-500" },
    { name: "Applications", value: "128", icon: Users, color: "bg-amber-500" },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.color} text-white`}>
                <stat.icon size={24} />
              </div>
              <span className="flex items-center text-emerald-500 text-sm font-bold">
                <TrendingUp size={16} className="mr-1" /> +12%
              </span>
            </div>
            <h3 className="text-zinc-500 text-sm font-medium">{stat.name}</h3>
            <p className="text-3xl font-bold text-zinc-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-zinc-900">Recent Enquiries</h2>
            <button className="text-primary text-sm font-bold hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-zinc-50 transition-colors border border-transparent hover:border-zinc-200">
                <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center font-bold text-zinc-400">
                  {String.fromCharCode(64 + i)}
                </div>
                <div className="flex-grow">
                  <h4 className="font-bold text-zinc-900">John Doe {i}</h4>
                  <p className="text-sm text-zinc-500 truncate">Interested in AI automation for enterprise...</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-zinc-100 text-zinc-500 px-2 py-1 rounded-md flex items-center gap-1">
                    <Clock size={10} /> 2h ago
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-zinc-900">System Health</h2>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full">Optimal</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">DB Connections</p>
                <p className="text-2xl font-bold text-zinc-900">Live</p>
            </div>
            <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Server Latency</p>
                <p className="text-2xl font-bold text-zinc-900">24ms</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
