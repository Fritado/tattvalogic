"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, Edit, Trash2, Globe, Lock as LockIcon, Search, 
  Image as ImageIcon, X, ChevronRight, 
  Save, Users, Linkedin, Twitter, Facebook, ArrowUpDown
} from "lucide-react";
import { API_BASE } from "@/config/apiConfig";

export default function TeamPage() {
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Form State
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [subRole, setSubRole] = useState("");
  const [bio, setBio] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const [facebook, setFacebook] = useState("");
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [memberImage, setMemberImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/team/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setTeam(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      setMemberImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("admin_token");
    const method = editingMember ? "PUT" : "POST";
    const url = editingMember ? `${API_BASE}/team/${editingMember._id}` : `${API_BASE}/team`;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("designation", designation);
    formData.append("subRole", subRole);
    formData.append("bio", bio);
    formData.append("linkedin", linkedin);
    formData.append("twitter", twitter);
    formData.append("facebook", facebook);
    formData.append("order", String(order));
    formData.append("isActive", String(isActive));
    
    if (memberImage) {
      formData.append("image", memberImage);
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        setShowModal(false);
        resetForm();
        fetchTeam();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setEditingMember(null);
    setName("");
    setDesignation("");
    setSubRole("");
    setBio("");
    setLinkedin("");
    setTwitter("");
    setFacebook("");
    setOrder(0);
    setIsActive(true);
    setMemberImage(null);
    setPreviewImage("");
  };

  const openEdit = (member: any) => {
    setEditingMember(member);
    setName(member.name || "");
    setDesignation(member.designation || "");
    setSubRole(member.subRole || "");
    setBio(member.bio || "");
    setLinkedin(member.linkedin || "");
    setTwitter(member.twitter || "");
    setFacebook(member.facebook || "");
    setOrder(member.order || 0);
    setIsActive(member.isActive ?? true);
    setPreviewImage(member.image || "");
    setShowModal(true);
  };

  const deleteMember = async (id: string) => {
    if (!confirm("Are you sure you want to remove this team member?")) return;
    const token = localStorage.getItem("admin_token");
    try {
      await fetch(`${API_BASE}/team/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTeam();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTeam = team.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.designation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Our Team</h1>
          <p className="text-zinc-500 font-medium">Manage the core experts and leadership.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-primary text-white px-8 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20"
        >
          <Plus size={20} strokeWidth={3} /> Add Member
        </button>
      </div>

      <div className="flex items-center gap-4 bg-white p-2 border border-zinc-200 rounded-2xl w-full max-w-md shadow-sm">
        <Search className="text-zinc-400 w-5 h-5 ml-2" />
        <input 
          type="text" 
          placeholder="Filter by name or role..." 
          className="flex-1 bg-transparent border-none py-2 text-sm focus:outline-none font-medium placeholder:text-zinc-300"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full h-64 flex flex-col items-center justify-center text-zinc-400 font-bold uppercase tracking-widest text-xs gap-4 bg-zinc-50 rounded-3xl border border-dashed border-zinc-200">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            Synchronizing team data...
          </div>
        ) : filteredTeam.length === 0 ? (
          <div className="col-span-full h-64 flex flex-col items-center justify-center text-zinc-300 font-bold uppercase tracking-widest text-xs bg-zinc-50 rounded-3xl border border-dashed border-zinc-200">
            No team members found.
          </div>
        ) : filteredTeam.map((member) => (
          <div key={member._id} className="group bg-white border border-zinc-200 p-6 rounded-[2.5rem] hover:shadow-2xl hover:shadow-zinc-200/50 transition-all duration-500 relative">
            <div className="flex items-start gap-6">
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-zinc-100 flex-shrink-0 border border-zinc-100">
                {member.image ? (
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-300">
                    <ImageIcon size={24} />
                  </div>
                )}
                <div className="absolute top-1 right-1">
                  {member.isActive ? (
                    <span className="bg-emerald-500/90 backdrop-blur-md text-white p-1 rounded-full shadow-lg">
                      <Globe size={10} />
                    </span>
                  ) : (
                    <span className="bg-zinc-500/90 backdrop-blur-md text-white p-1 rounded-full shadow-lg">
                      <LockIcon size={10} />
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.1em] text-primary">{member.designation}</span>
                  <span className="text-zinc-300 font-bold text-[10px]"># {member.order}</span>
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${member.isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-zinc-100 text-zinc-400'}`}>
                    {member.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-zinc-900 truncate mb-1">{member.name}</h3>
                <p className="text-xs text-zinc-400 font-medium line-clamp-2">{member.subRole}</p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-zinc-50">
               <div className="flex gap-2">
                 {member.linkedin && <Linkedin size={14} className="text-zinc-400" />}
                 {member.twitter && <Twitter size={14} className="text-zinc-400" />}
               </div>
               <div className="flex items-center gap-2">
                 <button 
                  onClick={() => openEdit(member)}
                  className="p-2.5 bg-zinc-50 text-zinc-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => deleteMember(member._id)}
                  className="p-2.5 bg-zinc-50 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 size={16} />
                </button>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Team Member Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm p-4 md:p-6">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-zinc-100 flex items-center justify-between bg-white z-30 flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                  <Users size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-zinc-900 leading-none">{editingMember ? "Edit Member" : "Add Team Expert"}</h2>
                    <p className="text-zinc-400 text-sm font-medium mt-1">Expanding the TattvaLogic intelligence network.</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-3 hover:bg-zinc-50 rounded-2xl text-zinc-400 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                   {/* Left Column: Image Upload */}
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Profile Visual</label>
                      <div 
                        onClick={() => document.getElementById('member-upload')?.click()}
                        className="relative w-full aspect-square bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-[2rem] overflow-hidden group cursor-pointer hover:border-primary/40 transition-all"
                      >
                        {previewImage ? (
                          <img src={previewImage} className="w-full h-full object-cover" alt="Preview" />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-300 gap-2">
                            <ImageIcon size={40} strokeWidth={1.5} />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-center px-4">Upload Photo</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white font-bold uppercase tracking-widest text-[10px]">Change Image</span>
                        </div>
                      </div>
                      <input id="member-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                      <p className="text-[10px] text-zinc-400 italic">Recommended: 800x800px, PNG or JPG.</p>
                   </div>

                   {/* Right Column: Form Fields */}
                   <div className="md:col-span-2 space-y-6">
                      <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Full Name</label>
                          <input className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none" placeholder="e.g. Saswati Ray" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Main Designation</label>
                            <input className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none" placeholder="e.g. Director" value={designation} onChange={(e) => setDesignation(e.target.value)} required />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Display Order</label>
                            <input type="number" className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none" value={order} onChange={(e) => setOrder(Number(e.target.value))} />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Detailed Role / Sub-Role</label>
                          <input className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none" placeholder="e.g. Tattvalogic - Customer Success" value={subRole} onChange={(e) => setSubRole(e.target.value)} />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Short Bio</label>
                          <textarea className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none h-24 resize-none" placeholder="Briefly describe their impact..." value={bio} onChange={(e) => setBio(e.target.value)} />
                        </div>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-zinc-100">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2"><Linkedin size={12} className="text-[#0A66C2]" /> LinkedIn</label>
                      <input className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-2xl outline-none" placeholder="URL" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2"><Twitter size={12} className="text-[#1DA1F2]" /> Twitter</label>
                      <input className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-2xl outline-none" placeholder="URL" value={twitter} onChange={(e) => setTwitter(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">Visibility Status</label>
                      <select className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-2xl outline-none appearance-none font-bold" value={isActive ? "true" : "false"} onChange={(e) => setIsActive(e.target.value === "true")}>
                        <option value="true">Active & Visible</option>
                        <option value="false">Hidden / Disabled</option>
                      </select>
                    </div>
                </div>

                <div className="pt-8 flex gap-4">
                  <button type="submit" className="flex-1 bg-primary text-white p-5 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-2">
                    <Save size={20} /> {editingMember ? "Commit Changes" : "Create Member Profile"}
                  </button>
                  <button onClick={() => setShowModal(false)} type="button" className="flex-1 bg-zinc-100 p-5 rounded-2xl font-bold text-zinc-500 hover:bg-zinc-200 transition-all">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
