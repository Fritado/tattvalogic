"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Plus, 
  Trash2, 
  Edit, 
  X, 
  Quote, 
  Image as ImageIcon, 
  Upload,
  ArrowUp,
  ArrowDown,
  Star,
  CheckCircle2
} from "lucide-react";
import { API_BASE } from "@/config/apiConfig";

export default function TestimonialManagement() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    clientName: "",
    clientDesignation: "",
    companyName: "",
    testimonialText: "",
    rating: 5,
    isActive: true,
    displayOrder: 0
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/testimonials/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setItems(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("admin_token");
      const url = editId ? `${API_BASE}/testimonials/${editId}` : `${API_BASE}/testimonials`;
      const method = editId ? "PUT" : "POST";
      
      const payload = new FormData();
      payload.append("clientName", formData.clientName);
      payload.append("clientDesignation", formData.clientDesignation);
      payload.append("companyName", formData.companyName);
      payload.append("testimonialText", formData.testimonialText);
      payload.append("rating", String(formData.rating));
      payload.append("isActive", String(formData.isActive));
      payload.append("displayOrder", String(formData.displayOrder));
      
      if (imageFile) {
        payload.append("clientImage", imageFile);
      }

      const res = await fetch(url, {
        method,
        headers: { 
          Authorization: `Bearer ${token}`
        },
        body: payload
      });

      if (res.ok) {
        closeModal();
        fetchTestimonials();
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.message || 'Failed to save record'}`);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while saving.");
    }
  };

  const openEditModal = (item: any) => {
    setEditId(item._id);
    setFormData({
      clientName: item.clientName || "",
      clientDesignation: item.clientDesignation || "",
      companyName: item.companyName || "",
      testimonialText: item.testimonialText || "",
      rating: item.rating || 5,
      isActive: item.isActive ?? true,
      displayOrder: item.displayOrder || 0
    });
    setImagePreview(item.clientImage ? (item.clientImage.startsWith('http') ? item.clientImage : `${API_BASE.replace('/api', '')}${item.clientImage}`) : null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
    setFormData({
      clientName: "",
      clientDesignation: "",
      companyName: "",
      testimonialText: "",
      rating: 5,
      isActive: true,
      displayOrder: 0
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/testimonials/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchTestimonials();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (item: any) => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/testimonials/${item._id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ isActive: !item.isActive })
      });
      if (res.ok) fetchTestimonials();
    } catch (err) {
      console.error(err);
    }
  };

  const reorder = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = items.findIndex(i => i._id === id);
    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === items.length - 1) return;

    const newItems = [...items];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    [newItems[currentIndex], newItems[targetIndex]] = [newItems[targetIndex], newItems[currentIndex]];

    const itemsToUpdate = newItems.map((item, index) => ({
      id: item._id,
      displayOrder: index + 1
    }));

    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/testimonials/reorder`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ items: itemsToUpdate })
      });
      if (res.ok) fetchTestimonials();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredItems = items.filter(item => 
    item.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Testimonials Management</h2>
          <p className="text-zinc-500 text-sm">Manage what your clients say about you</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search testimonials..." 
              className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-zinc-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
          >
            <Plus size={18} /> New Testimonial
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-zinc-400 animate-pulse">
            <Quote className="mx-auto mb-4 opacity-20" size={48} />
            Loading testimonials...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="col-span-full py-20 text-center text-zinc-400 border-2 border-dashed border-zinc-100 rounded-[2.5rem]">
            No testimonials found.
          </div>
        ) : filteredItems.map((item, idx) => (
          <div key={item._id} className="group bg-white border border-zinc-100 rounded-[2.5rem] p-6 hover:shadow-2xl hover:shadow-zinc-200 transition-all duration-500 flex flex-col relative overflow-hidden">
            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEditModal(item)} className="p-2 bg-white/90 backdrop-blur shadow-sm rounded-full text-zinc-600 hover:text-primary hover:scale-110 transition-all">
                <Edit size={16} />
              </button>
              <button onClick={() => deleteItem(item._id)} className="p-2 bg-white/90 backdrop-blur shadow-sm rounded-full text-zinc-600 hover:text-red-500 hover:scale-110 transition-all">
                <Trash2 size={16} />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-zinc-50 rounded-2xl flex items-center justify-center border border-zinc-100 overflow-hidden shrink-0">
                {item.clientImage ? (
                  <img 
                    src={item.clientImage.startsWith('http') ? item.clientImage : `${API_BASE.replace('/api', '')}${item.clientImage}`} 
                    alt={item.clientName} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                    {item.clientName.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 leading-tight">{item.clientName}</h3>
                <p className="text-zinc-500 text-xs">{item.clientDesignation}{item.companyName ? `, ${item.companyName}` : ""}</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={12} className={i < item.rating ? "text-amber-400 fill-amber-400" : "text-zinc-200"} />
                ))}
              </div>
              <p className="text-zinc-600 text-sm italic line-clamp-3 leading-relaxed">
                &ldquo;{item.testimonialText}&rdquo;
              </p>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-zinc-50 mt-auto">
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => reorder(item._id, 'up')}
                  disabled={idx === 0}
                  className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-900 disabled:opacity-30"
                >
                  <ArrowUp size={14} />
                </button>
                <button 
                  onClick={() => reorder(item._id, 'down')}
                  disabled={idx === filteredItems.length - 1}
                  className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-900 disabled:opacity-30"
                >
                  <ArrowDown size={14} />
                </button>
              </div>
              
              <button 
                onClick={() => toggleStatus(item)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  item.isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-zinc-50 text-zinc-400 border border-zinc-100'
                }`}
              >
                {item.isActive ? 'Active' : 'Hidden'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <div>
                <h3 className="text-xl font-bold text-zinc-900">{editId ? "Update Testimonial" : "Add Testimonial"}</h3>
                <p className="text-zinc-500 text-xs">Manage client feedback and visibility</p>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-white rounded-xl text-zinc-400 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 overflow-y-auto custom-scrollbar space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Client Image Upload */}
                <div className="col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-3 ml-1">Client Image</label>
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-[2rem] bg-zinc-50 border-2 border-dashed border-zinc-200 flex items-center justify-center overflow-hidden relative group">
                      {imagePreview ? (
                        <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <ImageIcon className="text-zinc-300" size={32} />
                      )}
                      <input 
                        type="file" 
                        className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                        onChange={handleImageChange}
                        accept="image/*"
                      />
                    </div>
                    <div className="flex-grow space-y-2">
                      <p className="text-xs text-zinc-500">Upload client photo or avatar.</p>
                      <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 cursor-pointer hover:bg-zinc-50 transition-colors">
                        <Upload size={14} /> Choose File
                        <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Client Name</label>
                  <input 
                    required
                    type="text"
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g. John Doe"
                    value={formData.clientName}
                    onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Designation</label>
                  <input 
                    type="text"
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g. CTO"
                    value={formData.clientDesignation}
                    onChange={(e) => setFormData({...formData, clientDesignation: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Company Name</label>
                  <input 
                    type="text"
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g. FinEdge Tech"
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Rating</label>
                  <select 
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                  >
                    {[5,4,3,2,1].map(r => (
                      <option key={r} value={r}>{r} Stars</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Testimonial Text</label>
                  <textarea 
                    required
                    rows={4}
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                    placeholder="Enter the client's feedback..."
                    value={formData.testimonialText}
                    onChange={(e) => setFormData({...formData, testimonialText: e.target.value})}
                  />
                </div>

                <div className="flex items-center gap-6 col-span-2 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-zinc-700">Display Order:</span>
                    <input 
                      type="number"
                      className="w-20 bg-white border border-zinc-200 rounded-lg py-1 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({...formData, displayOrder: parseInt(e.target.value)})}
                    />
                  </div>
                  
                  <div className="flex items-center gap-3 ml-auto">
                    <span className="text-xs font-bold text-zinc-700">Visible on Site:</span>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                        formData.isActive ? 'bg-emerald-500 text-white' : 'bg-zinc-200 text-zinc-500'
                      }`}
                    >
                      {formData.isActive ? 'Active' : 'Hidden'}
                    </button>
                  </div>
                </div>
              </div>
              
              <button 
                type="submit"
                className="w-full bg-zinc-900 text-white font-bold py-4 rounded-[2rem] hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200"
              >
                {editId ? "Update Testimonial" : "Publish Testimonial"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
