"use client";

import React, { useState, useEffect } from "react";
import { Search, Briefcase, MapPin, Target, DollarSign, Plus, Edit, Trash2, Users, X, ChevronRight } from "lucide-react";
import Link from "next/link";
import Editor from "@/components/admin/Editor";

import { API_BASE } from "@/config/apiConfig";

export default function CareersPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);

  // Form
  const [jobTitle, setJobTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("Full-time");
  const [experience, setExperience] = useState("");
  const [ctc, setCtc] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/careers/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setJobs(data);
      } else {
        setJobs([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("admin_token");
    const method = editingJob ? "PUT" : "POST";
    const url = editingJob ? `${API_BASE}/careers/${editingJob._id}` : `${API_BASE}/careers`;

    try {
      const skillsArray = skills.split(",").map(s => s.trim()).filter(s => s !== "");
      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          jobTitle, department, location, employmentType, experience, ctc, priority, description, isPublished,
          skills: skillsArray
        })
      });

      if (res.ok) {
        setShowModal(false);
        fetchJobs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (job: any) => {
    setEditingJob(job);
    setJobTitle(job.jobTitle);
    setDepartment(job.department);
    setLocation(job.location);
    setEmploymentType(job.employmentType);
    setExperience(job.experience || "");
    setCtc(job.ctc || "");
    setPriority(job.priority || "Medium");
    setDescription(job.description);
    setSkills(job.skills?.join(", ") || "");
    setIsPublished(job.isPublished ?? true);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job posting?")) return;
    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`${API_BASE}/careers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const togglePublish = async (job: any) => {
    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`${API_BASE}/careers/${job._id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isPublished: !job.isPublished })
      });
      if (res.ok) fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search jobs..." 
            className="w-full bg-white border border-zinc-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button 
          onClick={() => { 
            setEditingJob(null); 
            setJobTitle(""); setDepartment(""); setLocation(""); setExperience(""); setCtc(""); setPriority("Medium"); setDescription(""); setSkills(""); setIsPublished(true);
            setShowModal(true); 
          }}
          className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Plus size={20} /> Post Job
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 p-20 text-center text-zinc-400">Loading careers...</div>
        ) : filteredJobs.length === 0 ? (
          <div className="col-span-2 p-20 text-center text-zinc-400">No job postings found.</div>
        ) : filteredJobs.map((job) => (
          <div key={job._id} className="bg-white border border-zinc-200 rounded-[2.5rem] p-8 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/10 transition-colors`} />
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-black text-zinc-900 leading-tight mb-1">{job.jobTitle}</h3>
                  <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest">{job.department}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(job)} className="p-2.5 bg-zinc-50 hover:bg-zinc-100 rounded-xl text-zinc-500 transition-colors">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(job._id)} className="p-2.5 bg-red-50 hover:bg-red-100 rounded-xl text-red-400 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-8">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 text-zinc-500 text-[10px] font-black uppercase tracking-widest rounded-xl">
                  <MapPin size={12} /> {job.location}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 text-zinc-500 text-[10px] font-black uppercase tracking-widest rounded-xl">
                  <Briefcase size={12} /> {job.employmentType}
                </span>
                <button 
                  onClick={() => togglePublish(job)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${
                    job.isPublished ? "bg-emerald-100 text-emerald-600" : "bg-zinc-100 text-zinc-400"
                  }`}
                >
                  <Target size={12} /> {job.isPublished ? "Published" : "Draft"}
                </button>
              </div>

              <div className="mt-auto flex items-center justify-between border-t border-zinc-100 pt-6">
                <div className="flex items-center gap-2">
                    <Users size={16} className="text-zinc-400" />
                    <span className="text-sm font-bold text-zinc-900">Manage Pipeline</span>
                </div>
                <Link 
                  href="/admin-dashboard/applications"
                  className="text-primary text-xs font-black uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all"
                >
                  View Applicants <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-7xl max-h-[95vh] overflow-y-auto rounded-[2rem] p-8 md:p-12 shadow-2xl relative flex flex-col">
                <div className="flex items-center justify-between mb-8 sticky top-0 bg-white/95 backdrop-blur-sm z-20 pb-4 border-b border-zinc-100">
                  <h2 className="text-2xl font-black text-zinc-900">{editingJob ? "Edit Job Posting" : "Create New Job"}</h2>
                  <button onClick={() => setShowModal(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Job Title</label>
                        <input className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. Senior AI Engineer" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Department</label>
                        <input className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. Engineering" value={department} onChange={(e) => setDepartment(e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Location</label>
                        <input className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. Bangalore / Remote" value={location} onChange={(e) => setLocation(e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Employment Type</label>
                        <select className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 appearance-none" value={employmentType} onChange={(e) => setEmploymentType(e.target.value)}>
                          <option>Full-time</option>
                          <option>Part-time</option>
                          <option>Contract</option>
                          <option>Remote</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Required Experience</label>
                        <input className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. 5+ Years" value={experience} onChange={(e) => setExperience(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">CTC / Salary</label>
                        <input className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. $120k - $160k" value={ctc} onChange={(e) => setCtc(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Hiring Priority</label>
                        <select className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 appearance-none" value={priority} onChange={(e) => setPriority(e.target.value)}>
                          <option>Low</option>
                          <option>Medium</option>
                          <option>High</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Status</label>
                          <div className="flex items-center gap-4 p-4">
                            <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="w-5 h-5 accent-primary" />
                            <span className="text-sm font-bold text-zinc-700">Published to Site</span>
                          </div>
                      </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-zinc-100">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Job Description</label>
                            <p className="text-xs text-zinc-500 mb-4 ml-1">Use the rich text editor below to format your job posting (headings, lists, bold, etc.).</p>
                        </div>
                        <div className="bg-white rounded-[2rem] p-2 border border-zinc-200 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                            <Editor content={description} onChange={setDescription} />
                        </div>
                    </div>

                    <div className="space-y-2 pt-6">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Required Skills (Comma separated)</label>
                      <input className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20" placeholder="React, Node.js, TypeScript" value={skills} onChange={(e) => setSkills(e.target.value)} />
                    </div>

                    <div className="flex gap-4 pt-8 sticky bottom-0 bg-white border-t border-zinc-100 p-4 -mx-8 -mb-8 mt-8 z-20 rounded-b-[2rem]">
                      <button type="submit" className="flex-grow bg-primary text-white p-5 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
                        {editingJob ? "Update Posting" : "Publish Job Posting"}
                      </button>
                      <button onClick={() => setShowModal(false)} type="button" className="flex-grow bg-zinc-100 p-5 rounded-2xl font-bold text-zinc-500 hover:bg-zinc-200 transition-all">Cancel</button>
                    </div>
                </form>
          </div>
        </div>
      )}
    </div>
  );
}
