"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Briefcase, 
    MapPin, 
    Clock, 
    ArrowRight, 
    CheckCircle2, 
    Target, 
    Zap, 
    X,
    Upload,
    ChevronRight,
    Search,
    Brain,
    Rocket,
    FileText,
    Trash2,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import FloatingOrbs from "@/components/shared/FloatingOrbs";


export default function CareersPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [selectedJob, setSelectedJob] = useState<any | null>(null);
    const [isApplying, setIsApplying] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState("");

    React.useEffect(() => {
        const fetchJobs = async () => {
            try {
                const { API_BASE } = await import("@/config/apiConfig");
                const apiUrl = `${API_BASE}`;
                const res = await fetch(`${apiUrl}/careers`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    setJobs(data);
                } else {
                    setJobs([]);
                }
            } catch (err) {
                console.error("Failed to fetch jobs:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const filteredJobs = jobs.filter(job => 
        job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.department.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFileError("");
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const validTypes = [
                'application/pdf', 
                'application/msword', 
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ];
            
            if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx)$/i)) {
                setFileError("Invalid file type. Only PDF and Word documents are allowed.");
                setSelectedFile(null);
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setFileError("File is too large. Maximum size is 5MB.");
                setSelectedFile(null);
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedJob) return;
        if (!selectedFile) {
            setFileError("Please upload a resume before submitting.");
            return;
        }
        
        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);
        formData.append("careerId", selectedJob._id);
        formData.append("source", "Easy Apply");
        
        // Force the browser to encode as binary by explicitly including the filename
        formData.delete("resume");
        formData.append("resume", selectedFile as Blob, selectedFile.name);

        setIsApplying(true);
        try {
            const { API_BASE } = await import("@/config/apiConfig");
            const apiUrl = `${API_BASE}`;
            const res = await fetch(`${apiUrl}/careers/apply`, {
                method: "POST",
                body: formData // Sending as FormData for file upload
            });
            if (res.ok) {
                setIsSuccess(true);
            } else {
                const data = await res.json();
                alert(data.message || "Failed to submit application");
            }
        } catch (err) {
            console.error("Failed to apply:", err);
            alert("An error occurred. Please try again.");
        } finally {
            setIsApplying(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="subpage-header">
                <FloatingOrbs />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="max-w-4xl mx-auto">
                        <span className="section-badge mb-6">Career Opportunities</span>
                        <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight text-white leading-tight">
                            Join the <span className="hero-gradient-text">Future</span> of Innovation
                        </h1>
                        <p className="text-xl md:text-2xl text-white/70 mb-10 text-balance font-sans leading-relaxed">
                            Build impactful technology solutions with TattvaLogic. Explore opportunities to grow your career with a team focused on innovation, AI, and digital transformation.
                        </p>
                        <Button size="lg" className="rounded-full px-10 py-7 text-lg group" onClick={() => document.getElementById('openings')?.scrollIntoView({ behavior: 'smooth' })}>
                            View Open Positions
                            <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Why Work With Us Section */}
            <section className="section-padding bg-background relative overflow-hidden">
                <div className="container mx-auto px-4 max-w-6xl relative z-10">
                    <div className="text-center mb-16">
                        <span className="section-badge mb-6">Our Culture</span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Work With TattvaLogic?</h2>
                        <p className="text-xl text-muted-foreground font-sans max-w-2xl mx-auto">
                            We provide an environment where talent meets opportunity, driven by curiosity and a commitment to excellence.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: "Cutting-edge AI", icon: Brain, desc: "Work with the latest Generative AI and ML frameworks in real-world scenarios." },
                            { title: "Remote-First", icon: MapPin, desc: "Flexible work arrangements that prioritize productivity and work-life balance." },
                            { title: "Global Products", icon: Rocket, desc: "See your code power products used by enterprises across multiple continents." },
                            { title: "Continuous Growth", icon: Target, desc: "Generous learning stipends and mentorship from industry leaders." }
                        ].map((item, i) => (
                            <div key={i} className="glass-card p-8 border border-white/5 hover:border-primary/20 transition-all duration-300">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                                    <item.icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-muted-foreground font-sans text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Current Openings Section */}
            <section id="openings" className="section-padding bg-muted/30 border-y border-border/50">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
                        <div>
                            <h2 className="text-4xl font-bold mb-4">Current Openings</h2>
                            <p className="text-muted-foreground font-sans">Discover your next challenge at TattvaLogic.</p>
                        </div>
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input 
                                type="text" 
                                placeholder="Search by role..." 
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all font-sans"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        {loading ? (
                            <div className="text-center py-20">
                                <p className="text-muted-foreground animate-pulse font-sans">Loading opportunities...</p>
                            </div>
                        ) : filteredJobs.length > 0 ? (
                            filteredJobs.map((job) => (
                                <div key={job._id} className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-2xl font-bold text-slate-900">{job.jobTitle}</h3>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                job.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'
                                            }`}>
                                                {job.priority} Priority
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-6 text-slate-500 font-sans text-sm">
                                            <div className="flex items-center gap-2">
                                                <Briefcase className="w-4 h-4 text-primary/60" />
                                                {job.department}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-primary/60" />
                                                {job.location}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-primary/60" />
                                                {job.employmentType}
                                            </div>
                                        </div>
                                    </div>
                                    <Button 
                                        variant="outline" 
                                        className="rounded-full px-8 py-4 border-slate-200 group-hover:border-primary/30 group-hover:bg-primary/5 transition-all"
                                        onClick={() => setSelectedJob(job)}
                                    >
                                        View Details
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                                <p className="text-muted-foreground font-sans">No positions found matching your search.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Job Details Modal */}
            <AnimatePresence>
                {selectedJob && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-secondary/80 backdrop-blur-sm"
                            onClick={() => {
                                setSelectedJob(null);
                                setIsSuccess(false);
                            }}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="p-8 md:p-12 border-b border-slate-100 flex items-start justify-between bg-muted/20">
                                <div>
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className="text-sm font-bold text-primary uppercase tracking-widest">{selectedJob.department}</span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                        <span className="text-sm font-medium text-slate-500">{selectedJob.location}</span>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900">{selectedJob.jobTitle}</h2>
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedJob(null);
                                        setIsSuccess(false);
                                        setSelectedFile(null);
                                        setFileError("");
                                    }}
                                    className="p-3 rounded-full hover:bg-slate-100 transition-colors"
                                >
                                    <X className="w-6 h-6 text-slate-400" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-grow overflow-y-auto p-8 md:p-12 space-y-12 font-sans">
                                {isSuccess ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6 border border-green-500/20">
                                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-2">Application Submitted!</h3>
                                        <p className="text-muted-foreground max-w-md">
                                            Your application has been successfully submitted. Our recruitment team will review your profile and contact you if your qualifications match our requirements.
                                        </p>
                                        <Button className="mt-8 rounded-full" onClick={() => setSelectedJob(null)}>Close</Button>
                                    </div>
                                ) : (
                                    <>
                                        {/* Grid Info */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                            <div className="space-y-1">
                                                <p className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">Experience</p>
                                                <p className="font-bold text-slate-900">{selectedJob.experience || "Not Specified"}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Type</p>
                                                <p className="font-bold text-slate-900">{selectedJob.employmentType}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">CTC / Salary</p>
                                                <p className="font-bold text-slate-900">{selectedJob.ctc || "Competitive"}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Priority</p>
                                                <p className={`font-bold ${selectedJob.priority === 'High' ? 'text-red-600' : 'text-slate-900'}`}>{selectedJob.priority}</p>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <h4 className="text-xl font-bold mb-4 text-slate-900">About the Role</h4>
                                            <div className="text-slate-600 leading-relaxed text-lg prose prose-slate max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-li:marker:text-primary" dangerouslySetInnerHTML={{ __html: selectedJob.description }} />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                            <div>
                                                <h4 className="text-xl font-bold mb-4 text-slate-900">Required Skills</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedJob.skills?.map((skill: string, i: number) => (
                                                        <span key={i} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium text-sm">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Application Footer */}
                                        <div className="pt-8 border-t border-slate-100">
                                            <h4 className="text-2xl font-bold mb-8 text-center">Ready to Apply?</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="glass-card p-8 border border-slate-100 bg-slate-50/50 space-y-6">
                                                    <div className="text-center">
                                                        <h5 className="font-bold text-lg mb-2">Option 1 — Easy Apply</h5>
                                                        <p className="text-sm text-slate-500 mb-6">Quick application via resume upload.</p>
                                                    </div>
                                                    <form onSubmit={handleApply} className="space-y-4">
                                                        <input type="text" name="applicantName" placeholder="Full Name" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none" />
                                                        <input type="email" name="applicantEmail" placeholder="Email Address" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none" />
                                                        <input type="tel" name="applicantPhone" placeholder="Phone Number" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none" />
                                                        <div className="relative group">
                                                            {!selectedFile ? (
                                                                <>
                                                                    <input type="file" name="resume" accept=".pdf,.doc,.docx" required className="opacity-0 absolute inset-0 cursor-pointer z-10" onChange={handleFileChange} />
                                                                    <div className={`w-full px-4 py-6 rounded-xl border-2 border-dashed ${fileError ? 'border-red-300 bg-red-50' : 'border-slate-200'} flex flex-col items-center justify-center gap-2 text-slate-400 group-hover:border-primary/50 group-hover:text-primary transition-all text-center`}>
                                                                        <Upload className={`w-6 h-6 ${fileError ? 'text-red-400' : ''}`} />
                                                                        <span className={`text-xs font-bold uppercase tracking-wider ${fileError ? 'text-red-500' : ''}`}>Upload Resume (PDF/DOC)</span>
                                                                        {fileError && <span className="text-xs text-red-500 flex items-center justify-center gap-1 mt-1"><AlertCircle size={12}/> {fileError}</span>}
                                                                        {!fileError && <span className="text-[10px] text-slate-400 mt-1">Max file size: 5MB</span>}
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div className="w-full px-4 py-4 rounded-xl border border-emerald-200 bg-emerald-50 flex flex-col gap-3">
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                                                                                <FileText size={20} />
                                                                            </div>
                                                                            <div className="overflow-hidden">
                                                                                <p className="font-bold text-sm text-slate-900 truncate" title={selectedFile.name}>{selectedFile.name}</p>
                                                                                <p className="text-xs text-emerald-600 font-medium tracking-wide">✅ Attached successfully • {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                                                            </div>
                                                                        </div>
                                                                        <button type="button" onClick={() => setSelectedFile(null)} className="p-2 hover:bg-emerald-100 rounded-full transition-colors text-emerald-600 shrink-0">
                                                                            <Trash2 size={16} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <Button type="submit" disabled={isApplying || !selectedFile} className="w-full py-4 rounded-xl shadow-lg flex items-center justify-center gap-2">
                                                            {isApplying ? (
                                                                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading...</>
                                                            ) : "Easy Apply Now"}
                                                        </Button>
                                                    </form>
                                                </div>

                                                <div className="glass-card p-8 border border-slate-100 bg-primary/5 flex flex-col items-center justify-center text-center space-y-6">
                                                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100">
                                                        <Target className="w-8 h-8 text-primary" />
                                                    </div>
                                                    <div>
                                                        <h5 className="font-bold text-lg mb-2">Option 2 — Platform Apply</h5>
                                                        <p className="text-sm text-slate-500">
                                                            Apply through our screening platform powered by <span className="font-bold text-slate-700">Fritado</span> for a faster technical evaluation.
                                                        </p>
                                                    </div>
                                                    <Button variant="outline" className="w-full py-4 rounded-xl border-slate-300 bg-white" asChild>
                                                        <a href="https://fritado.com" target="_blank" rel="noopener noreferrer">
                                                            Apply via Screening Platform
                                                        </a>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
