"use client";

import React, { useEffect, useState } from "react";
import { 
  Plus, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Trash2, 
  Pencil,
  AlertCircle,
  CheckCircle2,
  Send,
  Download,
  Clock
} from "lucide-react";
import { API_BASE } from "@/config/apiConfig";

export default function HolidayCalendar() {
  const [holidays, setHolidays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    isOptional: false,
    applicableFor: ["All"]
  });
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [myRequests, setMyRequests] = useState<any[]>([]);

  const fetchHolidays = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/hr/holidays?year=${year}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setHolidays(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRequests = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/leave/my-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setMyRequests(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const userString = localStorage.getItem("admin_user");
    if (userString) {
      const user = JSON.parse(userString);
      setIsAdmin(user.role === 'admin' || user.role === 'hr');
    }
    fetchHolidays();
    fetchMyRequests();
  }, [year]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("admin_token");
      const url = editingHoliday 
        ? `${API_BASE}/hr/holidays/${editingHoliday._id}` 
        : `${API_BASE}/hr/holidays`;
      const method = editingHoliday ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingHoliday(null);
        setFormData({ title: "", date: "", isOptional: false, applicableFor: ["All"] });
        fetchHolidays();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this holiday?")) return;
    try {
      const token = localStorage.getItem("admin_token");
      await fetch(`${API_BASE}/hr/holidays/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchHolidays();
    } catch (err) {
      console.error(err);
    }
  };

  const handleApplyLeave = async (holiday: any) => {
    setApplyingId(holiday._id);
    setAlert(null);
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/leave/apply`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          leaveType: "Optional Holiday",
          fromDate: holiday.date.split('T')[0],
          toDate: holiday.date.split('T')[0],
          reason: `Applying for optional holiday: ${holiday.title}`
        })
      });

      const data = await res.json();
      if (res.ok) {
        setAlert({ type: 'success', message: "Leave applied successfully!" });
        fetchMyRequests();
      } else {
        setAlert({ type: 'error', message: data.message || "Failed to apply leave." });
      }
    } catch (err) {
      console.error(err);
      setAlert({ type: 'error', message: "An error occurred while applying." });
    } finally {
      setApplyingId(null);
      setTimeout(() => setAlert(null), 5000);
    }
  };

  const groupHolidaysByMonth = () => {
    const months = Array.from({ length: 12 }, (_, i) => {
      const name = new Date(year, i).toLocaleString('default', { month: 'long' });
      const monthHolidays = holidays.filter(h => new Date(h.date).getMonth() === i);
      return { name, holidays: monthHolidays };
    });
    return months;
  };

  const getDayName = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('default', { weekday: 'short' });
  };

  const getDateNum = (dateStr: string) => {
    return new Date(dateStr).getDate().toString().padStart(2, '0');
  };

  const getHolidayStatus = (holiday: any) => {
    const holidayDate = holiday.date.split('T')[0];
    const request = myRequests.find(r => 
      r.leaveType === "Optional Holiday" && 
      new Date(r.fromDate).toISOString().split('T')[0] === holidayDate &&
      !r.isDeleted
    );
    return request ? request.status : null;
  };

  if (loading && holidays.length === 0) {
    return <div className="p-10 text-center font-bold text-zinc-400">Loading Holiday Calendar...</div>;
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Holiday Calendar {year}</h2>
          <p className="text-zinc-500 font-medium">Month-wise company holidays and optional leaves</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-white p-1 rounded-2xl border border-zinc-200 shadow-sm">
            <button onClick={() => setYear(year - 1)} className="p-2 hover:bg-zinc-50 rounded-xl transition-colors">
              <ChevronLeft size={20} />
            </button>
            <div className="px-6 py-2 font-black text-zinc-900">{year}</div>
            <button onClick={() => setYear(year + 1)} className="p-2 hover:bg-zinc-50 rounded-xl transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>

          {isAdmin && (
            <button 
              onClick={() => {
                setEditingHoliday(null);
                setFormData({ title: "", date: "", isOptional: false, applicableFor: ["All"] });
                setIsModalOpen(true);
              }}
              className="bg-primary text-white px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              <Plus size={18} /> Add Holiday
            </button>
          )}
        </div>
      </div>

      {alert && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${alert.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
          {alert.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <p className="text-sm font-bold">{alert.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {groupHolidaysByMonth().map((month, mIdx) => (
          <div key={mIdx} className="bg-white rounded-[2.5rem] border border-zinc-200 shadow-sm overflow-hidden flex flex-col min-h-[300px]">
            <div className={`p-6 border-b border-zinc-100 flex items-center justify-between ${new Date().getMonth() === mIdx && new Date().getFullYear() === year ? 'bg-primary/5' : 'bg-zinc-50/50'}`}>
              <h3 className="text-lg font-black text-zinc-900 uppercase tracking-tighter">{month.name}</h3>
              <span className="text-xs font-bold text-zinc-400">{month.holidays.length} Holidays</span>
            </div>

            <div className="p-4 flex-grow space-y-3">
              {month.holidays.length > 0 ? (
                month.holidays.map((holiday) => (
                  <div key={holiday._id} className="group relative bg-zinc-50 hover:bg-zinc-100/80 p-4 rounded-2xl transition-all border border-transparent hover:border-zinc-200">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center justify-center min-w-[40px]">
                        <span className="text-lg font-black text-zinc-900 leading-none">{getDateNum(holiday.date)}</span>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase">{getDayName(holiday.date)}</span>
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm font-bold text-zinc-900 leading-tight mb-1">{holiday.title}</p>
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md ${holiday.isOptional ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
                            {holiday.isOptional ? 'Optional' : 'Mandatory'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {isAdmin ? (
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            setEditingHoliday(holiday);
                            setFormData({
                              title: holiday.title,
                              date: holiday.date.split('T')[0],
                              isOptional: holiday.isOptional,
                              applicableFor: holiday.applicableFor
                            });
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 text-zinc-400 hover:text-primary transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(holiday._id)}
                          className="p-1.5 text-zinc-400 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ) : (
                      holiday.isOptional && (
                        (() => {
                          const status = getHolidayStatus(holiday);
                          if (status) {
                            return (
                              <span className={`absolute bottom-4 right-4 text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-lg border flex items-center gap-1.5 ${status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                {status === 'Approved' ? <CheckCircle2 size={10} /> : status === 'Rejected' ? <Trash2 size={10} /> : <Send size={10} />}
                                {status === 'Pending' ? 'Applied' : status}
                              </span>
                            );
                          }
                          return (
                            <button 
                              onClick={() => handleApplyLeave(holiday)}
                              disabled={applyingId === holiday._id}
                              className="absolute bottom-4 right-4 text-[10px] font-bold bg-white px-3 py-1 rounded-lg border border-zinc-200 text-zinc-600 hover:border-primary hover:text-primary transition-all disabled:opacity-50"
                            >
                              {applyingId === holiday._id ? 'Applying...' : 'Apply'}
                            </button>
                          );
                        })()
                      )
                    )}
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-10 opacity-30 grayscale">
                  <Calendar size={32} strokeWidth={1} />
                  <p className="text-xs font-bold mt-2 uppercase tracking-widest">No Holidays</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-zinc-100 flex items-center justify-between">
              <h2 className="text-2xl font-black text-zinc-900">{editingHoliday ? "Edit Holiday" : "New Holiday"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Holiday Title</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. Republic Day"
                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary text-sm font-bold"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Holiday Date</label>
                  <input 
                    type="date" 
                    required 
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary text-sm font-bold"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <div>
                    <p className="text-sm font-bold text-zinc-900">Optional Holiday</p>
                    <p className="text-[10px] font-medium text-zinc-500">Allow users to apply for this holiday</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, isOptional: !formData.isOptional})}
                    className={`w-12 h-6 rounded-full transition-all relative ${formData.isOptional ? 'bg-primary' : 'bg-zinc-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isOptional ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Applicable For</label>
                  <div className="flex flex-wrap gap-2">
                    {["All", "Engineering", "Marketing", "Finance", "HR"].map(dept => (
                      <button
                        key={dept}
                        type="button"
                        onClick={() => {
                          if (dept === "All") {
                            setFormData({...formData, applicableFor: ["All"]});
                          } else {
                            const newDepts = formData.applicableFor.includes("All") ? [] : [...formData.applicableFor];
                            if (newDepts.includes(dept)) {
                              setFormData({...formData, applicableFor: newDepts.filter(d => d !== dept)});
                            } else {
                              setFormData({...formData, applicableFor: [...newDepts, dept]});
                            }
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${formData.applicableFor.includes(dept) ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-grow py-4 text-sm font-bold text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-grow bg-primary text-white py-4 rounded-2xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                  {editingHoliday ? "Update Holiday" : "Create Holiday"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
