"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Plus, 
  ExternalLink, 
  Trash2, 
  Edit, 
  X, 
  Target, 
  Image as ImageIcon, 
  Upload,
  ArrowUp,
  ArrowDown,
  Star,
  CheckCircle2
} from "lucide-react";
import { API_BASE } from "@/config/apiConfig";

export default function PortfolioManagement() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    projectUrl: "",
    isFeatured: false,
    status: "active",
    displayOrder: 0,
    technologies: ""
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/portfolio/admin`, {
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

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("admin_token");
      const url = editId ? `${API_BASE}/portfolio/${editId}` : `${API_BASE}/portfolio`;
      const method = editId ? "PUT" : "POST";
      
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("category", formData.category);
      payload.append("description", formData.description);
      payload.append("projectUrl", formData.projectUrl);
      payload.append("isFeatured", String(formData.isFeatured));
      payload.append("status", formData.status);
      payload.append("displayOrder", String(formData.displayOrder));
      payload.append("technologies", formData.technologies);
      
      if (thumbnailFile) {
        payload.append("thumbnail", thumbnailFile);
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
        fetchPortfolios();
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
      title: item.title || "",
      category: item.category || "",
      description: item.description || "",
      projectUrl: item.projectUrl || "",
      isFeatured: item.isFeatured || false,
      status: item.status || "active",
      displayOrder: item.displayOrder || 0,
      technologies: Array.isArray(item.technologies) ? item.technologies.join(", ") : ""
    });
    setThumbnailPreview(item.thumbnail ? (item.thumbnail.startsWith('http') ? item.thumbnail : `${API_BASE.replace('/api', '')}${item.thumbnail}`) : null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
    setFormData({
      title: "",
      category: "",
      description: "",
      projectUrl: "",
      isFeatured: false,
      status: "active",
      displayOrder: 0,
      technologies: ""
    });
    setThumbnailFile(null);
    setThumbnailPreview(null);
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this portfolio item?")) return;
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/portfolio/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchPortfolios();
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

    // Map new display orders
    const itemsToUpdate = newItems.map((item, index) => ({
      id: item._id,
      displayOrder: index + 1
    }));

    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/portfolio/reorder`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ items: itemsToUpdate })
      });
      if (res.ok) fetchPortfolios();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredItems = items.filter(item => 
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Portfolio Management</h2>
          <p className="text-zinc-500 text-sm">Create and manage your project showcase</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Filter projects..." 
              className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-zinc-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
          >
            <Plus size={18} /> New Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-zinc-400 animate-pulse">
            <Target className="mx-auto mb-4 opacity-20" size={48} />
            Loading portfolio data...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="col-span-full py-20 text-center text-zinc-400 border-2 border-dashed border-zinc-100 rounded-[2.5rem]">
            No projects found.
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

            <div className="w-16 h-16 bg-zinc-50 rounded-2xl mb-6 flex items-center justify-center p-2 border border-zinc-100 group-hover:rotate-3 transition-transform duration-500 overflow-hidden">
              <img 
                src={item.thumbnail ? (item.thumbnail.startsWith('http') ? item.thumbnail : `${API_BASE.replace('/api', '')}${item.thumbnail}`) : "https://ui-avatars.com/api/?name=P&background=f4f4f5&color=a1a1aa"} 
                alt={item.title} 
                className="w-full h-full object-contain"
              />
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2 h-2 rounded-full ${item.status === 'active' ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{item.category}</span>
                {item.isFeatured && <Star size={12} className="text-amber-400 fill-amber-400" />}
              </div>
              <h3 className="text-xl font-bold text-zinc-900 group-hover:text-primary transition-colors">{item.title}</h3>
            </div>

            <p className="text-zinc-500 text-sm line-clamp-2 mb-6 flex-grow">{item.description}</p>

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
                <span className="text-[10px] font-black text-zinc-300 ml-2">ORD: {item.displayOrder}</span>
              </div>
              
              {item.projectUrl && (
                <a href={item.projectUrl} target="_blank" className="text-zinc-400 hover:text-primary transition-colors">
                  <ExternalLink size={16} />
                </a>
              )}
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
                <h3 className="text-xl font-bold text-zinc-900">{editId ? "Update Project" : "Add Project"}</h3>
                <p className="text-zinc-500 text-xs">Fill in the project details for your portfolio</p>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-white rounded-xl text-zinc-400 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 overflow-y-auto custom-scrollbar space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Thumbnail Upload */}
                <div className="col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-3 ml-1">Thumbnail Image (Logo)</label>
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-[2rem] bg-zinc-50 border-2 border-dashed border-zinc-200 flex items-center justify-center overflow-hidden relative group">
                      {thumbnailPreview ? (
                        <img src={thumbnailPreview} className="w-full h-full object-contain p-2" alt="Preview" />
                      ) : (
                        <ImageIcon className="text-zinc-300" size={32} />
                      )}
                      <input 
                        type="file" 
                        className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                        onChange={handleThumbnailChange}
                        accept="image/*"
                      />
                    </div>
                    <div className="flex-grow space-y-2">
                      <p className="text-xs text-zinc-500">Upload a clear project logo or thumbnail.</p>
                      <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 cursor-pointer hover:bg-zinc-50 transition-colors">
                        <Upload size={14} /> Choose File
                        <input type="file" className="hidden" onChange={handleThumbnailChange} accept="image/*" />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Project Title</label>
                  <input 
                    required
                    type="text"
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g. Fritado AI"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Category</label>
                  <input 
                    required
                    type="text"
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g. AI & SaaS"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Project URL</label>
                  <input 
                    type="url"
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="https://..."
                    value={formData.projectUrl}
                    onChange={(e) => setFormData({...formData, projectUrl: e.target.value})}
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Description</label>
                  <textarea 
                    required
                    rows={3}
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                    placeholder="Tell us about this project..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Technologies (Comma separated)</label>
                  <input 
                    type="text"
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="React, Node.js, AI, MongoDB"
                    value={formData.technologies}
                    onChange={(e) => setFormData({...formData, technologies: e.target.value})}
                  />
                </div>

                <div className="flex items-center gap-6 col-span-2 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox"
                      className="w-4 h-4 rounded text-primary focus:ring-primary"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                    />
                    <span className="text-xs font-bold text-zinc-700">Mark as Featured</span>
                  </label>
                  
                  <div className="flex items-center gap-3 ml-auto">
                    <span className="text-xs font-bold text-zinc-700">Status:</span>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, status: formData.status === 'active' ? 'inactive' : 'active'})}
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                        formData.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-zinc-200 text-zinc-500'
                      }`}
                    >
                      {formData.status}
                    </button>
                  </div>
                </div>
              </div>
              
              <button 
                type="submit"
                className="w-full bg-zinc-900 text-white font-bold py-4 rounded-[2rem] hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200"
              >
                {editId ? "Update Portfolio Item" : "Publish Project"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
