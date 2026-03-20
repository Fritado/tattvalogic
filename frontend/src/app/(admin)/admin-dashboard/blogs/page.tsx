"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, Edit, Trash2, Globe, Lock as LockIcon, Search, 
  MoreHorizontal, Image as ImageIcon, X, ChevronRight, 
  Eye, Save, Layout, Settings, Share2
} from "lucide-react";
import Editor from "@/components/admin/Editor";

import { API_BASE } from "@/config/apiConfig";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "seo">("content");
  const [editingBlog, setEditingBlog] = useState<any>(null);
  
  // Advanced Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("Engineering");
  const [tags, setTags] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");

  // SEO State
  const [seoTitle, setSeoTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [focusKeywords, setFocusKeywords] = useState("");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/blogs/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setBlogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      setFeaturedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleEditorImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    const token = localStorage.getItem("admin_token");
    
    const res = await fetch(`${API_BASE}/blogs/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
    });
    
    const data = await res.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("admin_token");
    const method = editingBlog ? "PUT" : "POST";
    const url = editingBlog ? `${API_BASE}/blogs/${editingBlog._id}` : `${API_BASE}/blogs`;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("content", content);
    formData.append("excerpt", excerpt);
    formData.append("category", category);
    formData.append("tags", tags);
    formData.append("isPublished", String(isPublished));
    formData.append("seoTitle", seoTitle);
    formData.append("metaDescription", metaDescription);
    formData.append("focusKeywords", focusKeywords);
    
    if (featuredImage) {
      formData.append("featuredImage", featuredImage);
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
        fetchBlogs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setEditingBlog(null);
    setTitle("");
    setSlug("");
    setContent("");
    setExcerpt("");
    setCategory("Engineering");
    setTags("");
    setIsPublished(false);
    setFeaturedImage(null);
    setPreviewImage("");
    setSeoTitle("");
    setMetaDescription("");
    setFocusKeywords("");
    setActiveTab("content");
  };

  const openEdit = (blog: any) => {
    setEditingBlog(blog);
    setTitle(blog.title || "");
    setSlug(blog.slug || "");
    setContent(blog.content || "");
    setExcerpt(blog.excerpt || "");
    setCategory(blog.category || "Engineering");
    setTags(Array.isArray(blog.tags) ? blog.tags.join(", ") : "");
    setIsPublished(blog.isPublished || false);
    setPreviewImage(blog.featuredImage || "");
    setSeoTitle(blog.seoTitle || "");
    setMetaDescription(blog.metaDescription || "");
    setFocusKeywords(Array.isArray(blog.focusKeywords) ? blog.focusKeywords.join(", ") : "");
    setShowModal(true);
  };

  const deleteBlog = async (id: string) => {
    if (!confirm("Delete this masterpiece?")) return;
    const token = localStorage.getItem("admin_token");
    try {
      await fetch(`${API_BASE}/blogs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBlogs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Blog Engine</h1>
          <p className="text-zinc-500 font-medium">Manage your insights and technical deep dives.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-primary text-white px-8 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20"
        >
          <Plus size={20} strokeWidth={3} /> New Story
        </button>
      </div>

      <div className="flex items-center gap-4 bg-white p-2 border border-zinc-200 rounded-2xl w-full max-w-md shadow-sm">
        <Search className="text-zinc-400 w-5 h-5 ml-2" />
        <input 
          type="text" 
          placeholder="Filter articles..." 
          className="flex-1 bg-transparent border-none py-2 text-sm focus:outline-none font-medium placeholder:text-zinc-300"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center text-zinc-400 font-bold uppercase tracking-widest text-xs gap-4 bg-zinc-50 rounded-3xl border border-dashed border-zinc-200">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            Synchronizing data...
          </div>
        ) : blogs.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-zinc-300 font-bold uppercase tracking-widest text-xs bg-zinc-50 rounded-3xl border border-dashed border-zinc-200">
            No drafts or stories yet.
          </div>
        ) : blogs.map((blog) => (
          <div key={blog._id} className="group bg-white border border-zinc-200 p-6 rounded-[2.5rem] hover:shadow-2xl hover:shadow-zinc-200/50 transition-all duration-500 flex flex-col md:flex-row md:items-center gap-6">
            <div className="relative w-full md:w-32 h-32 rounded-3xl overflow-hidden bg-zinc-100 flex-shrink-0 border border-zinc-100">
              {blog.featuredImage ? (
                <img src={blog.featuredImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-300">
                  <ImageIcon size={32} />
                </div>
              )}
              <div className="absolute top-2 left-2">
                {blog.isPublished ? (
                  <span className="bg-emerald-500/90 backdrop-blur-md text-white p-1.5 rounded-full shadow-lg">
                    <Globe size={12} />
                  </span>
                ) : (
                  <span className="bg-zinc-500/90 backdrop-blur-md text-white p-1.5 rounded-full shadow-lg">
                    <LockIcon size={12} />
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{blog.category}</span>
                <ChevronRight size={12} className="text-zinc-300" />
                <span className="text-xs text-zinc-400 font-medium">/{blog.slug}</span>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 group-hover:text-primary transition-colors truncate mb-2">{blog.title}</h3>
              <div className="flex items-center gap-6 text-xs text-zinc-400 font-bold uppercase tracking-widest">
                <span>{new Date(blog.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span className="w-1 h-1 bg-zinc-200 rounded-full" />
                <span>{blog.author || 'Admin'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
              <button 
                onClick={() => window.open(`/blog/${blog.slug}`, '_blank')}
                className="p-4 bg-zinc-50 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-2xl transition-all"
                title="View Live"
              >
                <Eye size={20} />
              </button>
              <button 
                onClick={() => openEdit(blog)}
                className="p-4 bg-zinc-50 text-zinc-400 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all"
                title="Edit Draft"
              >
                <Edit size={20} />
              </button>
              <button 
                onClick={() => deleteBlog(blog._id)}
                className="p-4 bg-zinc-50 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                title="Delete Story"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Advanced Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm p-4 md:p-6">
          <div className="bg-white w-full max-w-5xl h-[95vh] md:h-[90vh] rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-zinc-100 flex items-center justify-between bg-white z-30 flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                  <Layout size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-zinc-900 leading-none">{editingBlog ? "Edit Story" : "Craft New Insight"}</h2>
                    <p className="text-zinc-400 text-sm font-medium mt-1">Refining the architectural deep dive.</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-3 hover:bg-zinc-50 rounded-2xl text-zinc-400 transition-colors">
                <X size={24} />
              </button>
            </div>

                {/* Modal Tabs */}
                <div className="flex border-b border-zinc-100 px-8 bg-white z-20 flex-shrink-0">
                    <button 
                        onClick={() => setActiveTab("content")}
                        className={`px-8 py-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === 'content' ? 'text-primary' : 'text-zinc-400'}`}
                    >
                        <div className="flex items-center gap-2">
                             <Settings size={14} /> Content & Media
                        </div>
                        {activeTab === 'content' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />}
                    </button>
                    <button 
                        onClick={() => setActiveTab("seo")}
                        className={`px-8 py-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === 'seo' ? 'text-primary' : 'text-zinc-400'}`}
                    >
                        <div className="flex items-center gap-2">
                            <Share2 size={14} /> Search & SEO
                        </div>
                        {activeTab === 'seo' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />}
                    </button>
                </div>

                {/* Scrollable Form Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <form id="blog-form" onSubmit={handleSubmit} className="p-8 md:p-10 space-y-10">
                        {activeTab === "content" ? (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                <div className="lg:col-span-2 space-y-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Headline</label>
                                        <input 
                                            type="text" 
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl p-6 text-2xl font-black text-zinc-900 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-zinc-200"
                                            placeholder="Engineering a faster tomorrow..."
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                         <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Story Body</label>
                                         <Editor 
                                            content={content} 
                                            onChange={setContent} 
                                            onImageUpload={handleEditorImageUpload}
                                         />
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    <div className="space-y-4">
                                         <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Featured Media</label>
                                         <div 
                                            onClick={() => document.getElementById('featured-upload')?.click()}
                                            className="relative w-full aspect-video bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-[2rem] overflow-hidden group cursor-pointer hover:border-primary/40 transition-all"
                                         >
                                             {previewImage ? (
                                                 <img src={previewImage} className="w-full h-full object-cover" alt="Preview" />
                                             ) : (
                                                 <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-300 gap-2">
                                                     <ImageIcon size={40} strokeWidth={1.5} />
                                                     <span className="text-xs font-bold uppercase tracking-widest">Select Visual</span>
                                                 </div>
                                             )}
                                             <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                 <span className="text-white font-bold uppercase tracking-widest text-xs">Update Image</span>
                                             </div>
                                         </div>
                                         <input id="featured-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                    </div>

                                    <div className="space-y-6 bg-zinc-50 p-8 rounded-[2rem] border border-zinc-100">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Abstract (Excerpt)</label>
                                            <textarea 
                                                value={excerpt}
                                                onChange={(e) => setExcerpt(e.target.value)}
                                                className="w-full bg-white border border-zinc-200 rounded-2xl p-4 text-sm font-medium text-zinc-600 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all h-32"
                                                placeholder="A short punchy intro..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Category</label>
                                                <select 
                                                    value={category}
                                                    onChange={(e) => setCategory(e.target.value)}
                                                    className="w-full bg-white border border-zinc-200 rounded-xl p-3 text-xs font-bold text-zinc-900 focus:outline-none"
                                                >
                                                    <option>Engineering</option>
                                                    <option>Strategy</option>
                                                    <option>Technical</option>
                                                    <option>Culture</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Status</label>
                                                <select 
                                                    value={isPublished ? "true" : "false"}
                                                    onChange={(e) => setIsPublished(e.target.value === "true")}
                                                    className="w-full bg-white border border-zinc-200 rounded-xl p-3 text-xs font-bold text-zinc-900 focus:outline-none"
                                                >
                                                    <option value="false">Draft Mode</option>
                                                    <option value="true">Live Public</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Article Tags</label>
                                            <input 
                                                type="text" 
                                                value={tags}
                                                onChange={(e) => setTags(e.target.value)}
                                                className="w-full bg-white border border-zinc-200 rounded-xl p-3 text-xs font-medium text-zinc-900 focus:outline-none"
                                                placeholder="NextJS, AI, Architecture"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="max-w-3xl mx-auto space-y-10">
                                <div className="bg-emerald-50 rounded-[2rem] p-8 border border-emerald-100 flex items-start gap-6">
                                    <div className="p-4 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-500/20">
                                        <Globe size={28} />
                                    </div>
                                    <div>
                                        <h4 className="text-emerald-900 font-bold text-lg leading-tight">Search Engine Optimization</h4>
                                        <p className="text-emerald-700/70 text-sm font-medium mt-1">These fields control how your story appears in Google and Social Media feeds.</p>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-2 text-zinc-900">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Custom URL Slug</label>
                                        <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-2xl p-4">
                                            <span className="text-zinc-300 font-bold italic">/blog/</span>
                                            <input 
                                                type="text" 
                                                value={slug}
                                                onChange={(e) => setSlug(e.target.value)}
                                                className="flex-1 bg-transparent border-none text-zinc-900 font-bold focus:outline-none"
                                                placeholder="engineering-for-scale"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">SEO Title Tag</label>
                                        <input 
                                            type="text" 
                                            value={seoTitle}
                                            onChange={(e) => setSeoTitle(e.target.value)}
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/10"
                                            placeholder="Specific title for search engines"
                                        />
                                        <p className="text-[10px] text-zinc-400 font-bold italic uppercase tracking-widest text-right">{seoTitle.length} / 60 chars recommended</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Meta Description</label>
                                        <textarea 
                                            value={metaDescription}
                                            onChange={(e) => setMetaDescription(e.target.value)}
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-zinc-900 font-medium h-32 focus:outline-none"
                                            placeholder="What will users see in search snippets?"
                                        />
                                        <p className="text-[10px] text-zinc-400 font-bold italic uppercase tracking-widest text-right">{metaDescription.length} / 160 chars recommended</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Focus Keywords</label>
                                        <input 
                                            type="text" 
                                            value={focusKeywords}
                                            onChange={(e) => setFocusKeywords(e.target.value)}
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl p-4 font-bold text-primary focus:outline-none"
                                            placeholder="AI, Software, TattvaLogic"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                {/* Modal Footer */}
                <div className="px-8 py-6 bg-zinc-50 border-t border-zinc-100 flex gap-4 flex-shrink-0">
                    <button 
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="flex-1 bg-white border border-zinc-200 text-zinc-500 font-black uppercase tracking-widest text-xs py-4 rounded-2xl hover:bg-zinc-50 transition-all"
                    >
                        Discard
                    </button>
                    <button 
                        type="submit"
                        form="blog-form"
                        className="flex-1 bg-primary text-white font-black uppercase tracking-widest text-xs py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
                    >
                        <Save size={18} /> {editingBlog ? "Commit Changes" : "Push Live"}
                    </button>
                </div>
            </div>
          </div>
        )}
    </div>
  );
}
