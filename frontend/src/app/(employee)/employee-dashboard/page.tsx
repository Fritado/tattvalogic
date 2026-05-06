"use client";

import React, { useState, useEffect } from "react";
import { 
  CheckCircle, 
  Clock, 
  FileText, 
  Shield, 
  Briefcase,
  Calendar,
  ChevronRight
} from "lucide-react";
import { API_BASE } from "@/config/apiConfig";

export default function EmployeeDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/employees/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-zinc-400">Loading your portal...</div>;

  const stages = [
    'Offer Accepted', 
    'Document Submission', 
    'Verification', 
    'Account Creation', 
    'Training / Induction', 
    'Completed'
  ];

  const currentStageIdx = stages.indexOf(profile?.onboardingStage || 'Offer Accepted');

  return (
    <div className="space-y-8">
      {/* Welcome Hero */}
      <div className="bg-zinc-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full -mr-20 -mt-20" />
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {profile?.fullName}!</h2>
          <p className="text-zinc-400 font-sans">Emp ID: <span className="text-white font-mono">{profile?.employeeId}</span> • {profile?.designation}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Onboarding Summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-zinc-200 rounded-[2rem] p-8 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-8">Onboarding Progress</h3>
            
            <div className="flex items-center justify-between mb-8">
              {stages.map((stage, idx) => (
                <React.Fragment key={stage}>
                  <div className={`flex flex-col items-center gap-2 group relative`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                      idx <= currentStageIdx ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" : "bg-white border-zinc-100 text-zinc-300"
                    }`}>
                      {idx < currentStageIdx ? <CheckCircle size={14} /> : <span className="text-xs font-bold">{idx + 1}</span>}
                    </div>
                    {idx === currentStageIdx && (
                       <div className="absolute -bottom-6 whitespace-nowrap text-[10px] font-black uppercase tracking-widest text-primary animate-pulse">
                         Current Stage
                       </div>
                    )}
                  </div>
                  {idx < stages.length - 1 && (
                    <div className={`flex-grow h-0.5 mx-2 ${idx < currentStageIdx ? "bg-primary" : "bg-zinc-100"}`} />
                  )}
                </React.Fragment>
              ))}
            </div>

            <div className="mt-12 bg-zinc-50 rounded-2xl p-6 border border-zinc-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Current Action</p>
                <p className="font-bold text-zinc-900">{profile?.onboardingStage}</p>
              </div>
              <ChevronRight className="text-zinc-300" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white border border-zinc-200 rounded-[2rem] p-8 shadow-sm flex items-center gap-6">
                <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center text-blue-500">
                  <Briefcase size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Department</p>
                  <p className="font-bold text-zinc-900">{profile?.department}</p>
                </div>
             </div>
             <div className="bg-white border border-zinc-200 rounded-[2rem] p-8 shadow-sm flex items-center gap-6">
                <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center text-emerald-500">
                  <Calendar size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Joining Date</p>
                  <p className="font-bold text-zinc-900">{new Date(profile?.dateOfJoining).toLocaleDateString()}</p>
                </div>
             </div>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-zinc-200 rounded-[2rem] p-8 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-6">Pending Tasks</h3>
            <div className="space-y-4">
              {[
                { task: 'Upload ID Proof', icon: Shield, color: 'text-amber-500', bg: 'bg-amber-50' },
                { task: 'Sign NDA', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
                { task: 'Submit Bank Details', icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-50' }
              ].map(item => (
                <div key={item.task} className="flex items-center gap-4 p-4 hover:bg-zinc-50 rounded-2xl transition-colors cursor-pointer group">
                  <div className={`w-10 h-10 ${item.bg} ${item.color} rounded-xl flex items-center justify-center`}>
                    <item.icon size={18} />
                  </div>
                  <span className="text-sm font-bold text-zinc-700 group-hover:text-zinc-900">{item.task}</span>
                  <ChevronRight size={14} className="ml-auto text-zinc-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
