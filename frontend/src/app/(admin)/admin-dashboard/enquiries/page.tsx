"use client";

import React, { useState, useEffect } from "react";
import { Search, Mail, Phone, Trash2, CheckCircle, Clock, Calendar } from "lucide-react";

import { API_BASE } from "@/config/apiConfig";

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/enquiries`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setEnquiries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const token = localStorage.getItem("admin_token");
    try {
      await fetch(`${API_BASE}/enquiries/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      fetchEnquiries();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteEnquiry = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    const token = localStorage.getItem("admin_token");
    try {
      await fetch(`${API_BASE}/enquiries/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEnquiries();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search leads..." 
            className="w-full bg-white border border-zinc-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="p-20 text-center text-zinc-400">Loading enquiries...</div>
        ) : enquiries.length === 0 ? (
          <div className="p-20 text-center text-zinc-400 bg-white border border-dashed border-zinc-200 rounded-[2rem]">No leads captured yet.</div>
        ) : enquiries.map((item) => (
          <div key={item._id} className="bg-white border border-zinc-200 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all group">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-lg font-bold text-zinc-900">{item.name}</h3>
                  {item.status === "new" ? (
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                       <Clock size={10} /> New Lead
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                       <CheckCircle size={10} /> Responded
                    </span>
                  )}
                </div>
                
                <p className="text-zinc-600 bg-zinc-50 p-6 rounded-2xl border border-zinc-100 mb-6 italic">
                  "{item.message}"
                </p>

                <div className="flex flex-wrap gap-4 text-sm font-medium">
                  <div className="flex items-center gap-2 text-zinc-500 bg-zinc-100/50 px-4 py-2 rounded-xl border border-zinc-100">
                    <Mail size={16} className="text-primary" /> {item.email}
                  </div>
                  {item.phone && (
                    <div className="flex items-center gap-2 text-zinc-500 bg-zinc-100/50 px-4 py-2 rounded-xl border border-zinc-100">
                      <Phone size={16} className="text-primary" /> {item.phone}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-zinc-500 bg-zinc-100/50 px-4 py-2 rounded-xl border border-zinc-100 ml-auto">
                    <Calendar size={16} /> {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="lg:w-48 flex lg:flex-col gap-3 justify-center lg:border-l border-zinc-100 lg:pl-8">
                {item.status === "new" && (
                  <button 
                    onClick={() => updateStatus(item._id, "responded")}
                    className="flex-1 bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={14} /> Mark Read
                  </button>
                )}
                <button 
                  onClick={() => deleteEnquiry(item._id)}
                  className="flex-1 bg-red-50 text-red-500 font-bold py-3 px-4 rounded-xl text-xs hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 border border-red-100"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
