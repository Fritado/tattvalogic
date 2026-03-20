"use client";

import React, { useState, useEffect } from "react";
import { Search, User, Mail, FileText, ChevronRight, CheckCircle, XCircle, Clock, X, Phone } from "lucide-react";

import { API_BASE } from "@/config/apiConfig";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [newNote, setNewNote] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/careers/applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setApplications(data);
      } else {
        setApplications([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`${API_BASE}/careers/applications/${id}/status`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchApplications();
        if (selectedApp) {
          const updated = await res.json();
          setSelectedApp(updated);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedApp) return;
    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`${API_BASE}/careers/applications/${selectedApp._id}/notes`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message: newNote })
      });
      if (res.ok) {
        setNewNote("");
        const updated = await res.json();
        // The endpoint returns the updated application, but we need to fetch all to be sure or just update local state
        setSelectedApp(updated);
        fetchApplications();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const forceDownload = async (url: string, candidateName: string) => {
    if (!url) return;
    setIsDownloading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      
      const extension = url.split(".").pop() || "pdf";
      const sanitizedName = candidateName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `resume_${sanitizedName}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("Forced download failed, falling back to new tab:", error);
      window.open(url, "_blank");
    } finally {
      setIsDownloading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Applied": return "bg-blue-100 text-blue-600";
      case "Screening": return "bg-amber-100 text-amber-600";
      case "Interview Scheduled": return "bg-purple-100 text-purple-600";
      case "Shortlisted": return "bg-indigo-100 text-indigo-600";
      case "Selected": return "bg-emerald-100 text-emerald-600";
      case "Rejected": return "bg-red-100 text-red-600";
      default: return "bg-zinc-100 text-zinc-600";
    }
  };

  const filteredApps = applications.filter(app => {
    const matchesSearch = 
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicantEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.careerId?.jobTitle || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statuses = ["Applied", "Screening", "Interview Scheduled", "Shortlisted", "Selected", "Rejected"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search candidates..." 
            className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full md:w-auto">
          {["All", ...statuses].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === status 
                  ? "bg-zinc-900 text-white shadow-md shadow-zinc-200" 
                  : "bg-white border border-zinc-200 text-zinc-500 hover:bg-zinc-50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-[2rem] overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-200">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Candidate</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Applied Role</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Status</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Date</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Source</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Resume</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {loading ? (
              <tr><td colSpan={6} className="p-20 text-center text-zinc-400">Loading candidate pipeline...</td></tr>
            ) : filteredApps.length === 0 ? (
              <tr><td colSpan={6} className="p-20 text-center text-zinc-400 font-sans">No candidates found matching the criteria.</td></tr>
            ) : filteredApps.map((app) => (
              <tr 
                key={app._id} 
                className="hover:bg-zinc-50/50 transition-colors group cursor-pointer"
                onClick={() => setSelectedApp(app)}
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-100 rounded-2xl flex items-center justify-center">
                      <User size={18} className="text-zinc-500" />
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900 leading-none mb-1">{app.applicantName}</p>
                      <p className="text-xs text-zinc-400 font-sans">{app.applicantEmail}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <p className="font-bold text-zinc-700">{app.careerId?.jobTitle || "Direct Submission"}</p>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-black">{app.careerId?.department || "General"}</p>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center w-fit gap-1.5 shadow-sm ${getStatusColor(app.status)}`}>
                    <div className="w-1 h-1 rounded-full bg-current" />
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-sm text-zinc-500 font-sans">
                  {new Date(app.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 py-1 px-2 border border-zinc-100 rounded-lg">{app.source || "Website"}</span>
                </td>
                <td className="px-6 py-5 text-right">
                  <a 
                    href={app.resumeLink} 
                    target="_blank" 
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center justify-center p-3 bg-zinc-50 hover:bg-zinc-100 rounded-xl text-zinc-600 transition-all hover:translate-x-1 border border-zinc-100"
                  >
                    <FileText size={18} />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm">
          <div 
            className="bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[2.5rem] shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-8 border-b border-zinc-100 flex items-start justify-between bg-zinc-50/50">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-white border border-zinc-200 rounded-[2rem] flex items-center justify-center shadow-sm">
                  <User size={32} className="text-zinc-400" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-black text-zinc-900">{selectedApp.applicantName}</h2>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(selectedApp.status)}`}>
                      {selectedApp.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-zinc-500 font-sans text-sm">
                    <span className="flex items-center gap-1.5"><Mail size={14} className="text-primary/60" /> {selectedApp.applicantEmail}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-300" />
                    <span className="flex items-center gap-1.5"><Phone size={14} className="text-primary/60" /> {selectedApp.applicantPhone || "Not provided"}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedApp(null)}
                className="p-3 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto grid grid-cols-1 lg:grid-cols-3">
              {/* Left Column: Details */}
              <div className="lg:col-span-2 p-8 space-y-8 border-r border-zinc-100">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4 ml-1">Applied For</h4>
                  <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100 border-dashed">
                    <p className="text-xl font-bold text-zinc-900 mb-1">{selectedApp.careerId?.jobTitle || "Direct Submission"}</p>
                    <p className="text-sm text-zinc-500 font-sans">{selectedApp.careerId?.department || "General Application"}</p>
                    <div className="flex gap-4 mt-4 pt-4 border-t border-zinc-200/50">
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase font-black text-zinc-400">Date Applied</span>
                        <span className="text-xs font-bold font-sans">{new Date(selectedApp.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase font-black text-zinc-400">Source</span>
                        <span className="text-xs font-bold font-sans">{selectedApp.source || "Website"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4 ml-1">Pipeline Status Management</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {statuses.map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusUpdate(selectedApp._id, status)}
                        className={`p-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                          selectedApp.status === status 
                            ? getStatusColor(status) + " border-current shadow-sm" 
                            : "bg-white border-zinc-200 text-zinc-400 hover:border-zinc-300"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4 ml-1 flex items-center justify-between">
                    Internal Recruiter Notes
                    <span className="bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded text-[8px]">{selectedApp.notes?.length || 0} Notes</span>
                  </h4>
                  <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {selectedApp.notes?.length > 0 ? (
                      selectedApp.notes.map((note: any, i: number) => (
                        <div key={i} className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100 relative group">
                          <p className="text-sm text-zinc-700 font-sans leading-relaxed">{note.message}</p>
                          <p className="mt-2 text-[9px] text-zinc-400 font-bold uppercase tracking-widest">
                            {new Date(note.date).toLocaleString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-8 text-zinc-400 font-sans text-sm italic border border-dashed border-zinc-200 rounded-2xl">No internal notes yet.</p>
                    )}
                  </div>
                  
                  <form onSubmit={handleAddNote} className="mt-6 flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Type a recruiter note..." 
                      className="flex-grow bg-zinc-50 border border-zinc-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/10 font-sans text-sm"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                    />
                    <button className="bg-zinc-900 text-white px-6 rounded-2xl font-bold text-sm hover:bg-zinc-800 transition-colors">
                      Log Note
                    </button>
                  </form>
                </div>
              </div>

              {/* Right Column: Resume & Actions */}
              <div className="bg-zinc-50/30 p-8 space-y-8">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4 ml-1">Resume / CV</h4>
                  <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-zinc-50 rounded-[1.5rem] flex items-center justify-center mb-4 border border-zinc-100">
                      <FileText size={28} className="text-primary/60" />
                    </div>
                    <p className="font-bold text-sm text-zinc-900 mb-1">Resume File</p>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-6 font-black">PDF / DOC Format</p>
                    <div className="w-full space-y-3">
                      <a 
                        href={selectedApp.resumeLink} 
                        target="_blank" 
                        className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-white p-4 rounded-2xl font-bold text-xs hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
                      >
                        View CV <ChevronRight size={14} />
                      </a>
                      <button 
                        onClick={() => forceDownload(selectedApp.resumeLink, selectedApp.applicantName)}
                        disabled={isDownloading}
                        className="w-full flex items-center justify-center gap-2 bg-white border border-zinc-200 p-4 rounded-2xl font-bold text-xs text-zinc-600 hover:bg-zinc-50 transition-all disabled:opacity-50"
                      >
                        {isDownloading ? "Downloading..." : "Download"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-zinc-200/50">
                   <button className="w-full py-4 text-xs font-black uppercase tracking-widest text-red-400 hover:bg-red-50 rounded-2xl transition-colors border border-transparent hover:border-red-100">
                      Archive Application
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
