"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { API_BASE } from "@/config/apiConfig";
import { 
  Building, 
  User as UserIcon, 
  Mail, 
  Phone, 
  Globe, 
  Clock, 
  Activity as ActivityIcon,
  MessageSquare,
  Plus,
  Send,
  ArrowLeft,
  Trash2
} from "lucide-react";
import { use } from "react";
import Link from "next/link";

export default function LeadDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState("");
  const [activityType, setActivityType] = useState("Note");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchLead = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/crm/leads/${resolvedParams.id}`, {
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
    const user = JSON.parse(localStorage.getItem("admin_user") || "{}");
    setCurrentUser(user);
    setIsAdmin(user.role === 'admin');
    fetchLead();
  }, [resolvedParams.id]);

  const handleDeleteLead = async () => {
    if (!window.confirm("Are you sure you want to delete this lead? This action cannot be undone.")) {
      return;
    }

    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/crm/leads/${resolvedParams.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        router.push("/admin-dashboard/crm");
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete lead.");
      }
    } catch (err) {
      console.error("Delete Error:", err);
      alert("An error occurred while deleting the lead.");
    }
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    try {
      const token = localStorage.getItem("admin_token");
      await fetch(`${API_BASE}/crm/leads/${resolvedParams.id}/activities`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          type: activityType,
          notes: noteText
        })
      });
      setNoteText("");
      fetchLead(); // Refresh timeline
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Lead Details...</div>;
  if (!data || !data.lead) return <div className="p-10 text-center text-red-500">Lead not found</div>;

  const { lead, activities, tasks } = data;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin-dashboard/crm" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-zinc-900 transition-colors">
          <ArrowLeft size={16} /> Back to Pipeline
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Lead Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs font-black tracking-widest uppercase text-primary bg-primary/10 px-2 py-1 rounded-md mb-2 inline-block">{lead.leadId}</span>
                <h2 className="text-xl font-bold text-zinc-900">{lead.companyName}</h2>
                <p className="text-sm text-zinc-500">{lead.serviceInterest}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-xs font-bold px-3 py-1 bg-zinc-100 text-zinc-600 rounded-full">{lead.status}</span>
                {isAdmin && (
                  <button 
                    onClick={handleDeleteLead}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-red-400 hover:text-red-600 transition-colors uppercase tracking-widest"
                  >
                    <Trash2 size={12} /> Delete Lead
                  </button>
                )}
              </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Contacts</h3>
              <div className="space-y-3">
                {lead.contacts?.map((contact: any, idx: number) => (
                  <div key={idx} className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                    <div className="flex items-center gap-2 text-zinc-900 font-bold text-sm mb-1">
                      <UserIcon size={14} className="text-primary" />
                      {contact.name} {contact.designation && <span className="text-zinc-400 font-normal text-xs ml-1">({contact.designation})</span>}
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500 text-xs mt-1">
                      <Mail size={12} /> {contact.email}
                    </div>
                    {contact.mobile && (
                      <div className="flex items-center gap-2 text-zinc-500 text-xs mt-1">
                        <Phone size={12} /> {contact.mobile}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Domain & Source</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-zinc-600 text-sm">
                  <Building size={16} className="text-zinc-400" /> {lead.businessDomain || 'Not specified'}
                </div>
                <div className="flex items-center gap-3 text-zinc-600 text-sm">
                  <Globe size={16} className="text-zinc-400" /> {lead.source}
                </div>
              </div>
            </div>

            {lead.comments && (
              <div>
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Initial Comments</h3>
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 text-sm text-zinc-700 italic">
                  "{lead.comments}"
                </div>
              </div>
            )}
            
            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Created On</p>
                <p className="text-xs font-bold text-zinc-700">{new Date(lead.createdAt).toLocaleString([], { dateStyle: 'long', timeStyle: 'short' })}</p>
              </div>
              <Clock size={16} className="text-zinc-300" />
            </div>

            <div>
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Ownership & Responsibility</h3>
              <div className="space-y-3">
                <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Lead Owner (Creator)</p>
                  <p className="text-sm font-bold text-zinc-900 truncate">{lead.leadOwner?.email || 'N/A'}</p>
                  <p className="text-[10px] text-zinc-400 font-medium">{lead.leadOwner?.role}</p>
                </div>
                <div className="bg-primary/5 p-3 rounded-xl border border-primary/10">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-tighter">Currently Assigned To</p>
                  <p className="text-sm font-black text-primary truncate">{lead.assignedTo?.email || 'Unassigned'}</p>
                  <p className="text-[10px] text-primary/60 font-medium">{lead.assignedTo?.role}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-100">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Deal Value</p>
            <p className="text-3xl font-black text-emerald-600">₹{lead.dealValue?.toLocaleString() || 0}</p>
          </div>
        </div>
      </div>

      {/* Right Column: Timeline & Activities */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
          <h3 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
            <MessageSquare size={20} className="text-primary" /> Log Activity
          </h3>
          <form onSubmit={handleAddActivity} className="space-y-4">
            <div className="flex gap-4">
              <select 
                value={activityType}
                onChange={(e) => setActivityType(e.target.value)}
                className="p-3 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none"
              >
                {['Note', 'Call', 'Email', 'Meeting', 'Demo', 'WhatsApp'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <input 
                type="text" 
                placeholder="Log your interaction or add a note..." 
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="flex-grow p-3 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none"
              />
              <button 
                type="submit"
                className="bg-zinc-900 text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-zinc-800 transition-colors"
              >
                <Send size={16} /> Save
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
          <h3 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
            <ActivityIcon size={20} className="text-blue-500" /> Activity Timeline
          </h3>
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-200 before:to-transparent">
            {activities.map((act: any) => (
              <div key={act._id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-zinc-100 text-zinc-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  {act.type === 'Status Change' ? <ActivityIcon size={16} /> : <MessageSquare size={16} />}
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-zinc-200 bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${act.type === 'Status Change' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                      {act.type}
                    </span>
                    <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
                      <Clock size={10} /> {new Date(act.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-700">{act.notes}</p>
                  <p className="text-[10px] text-zinc-400 mt-2 text-right border-t border-zinc-100 pt-2">By: {act.performedBy?.email}</p>
                </div>
              </div>
            ))}
            {activities.length === 0 && (
              <p className="text-center text-sm text-zinc-500">No activity logged yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
