"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import FloatingOrbs from "@/components/shared/FloatingOrbs";
import { ArrowRight, Calendar, User, Search, Filter, Rocket, Brain, Code, Cpu } from "lucide-react";

import { API_BASE } from "@/config/apiConfig";

const categories = [
    { name: "All", icon: <Rocket size={14} /> },
    { name: "Engineering", icon: <Code size={14} /> },
    { name: "Strategy", icon: <Brain size={14} /> },
    { name: "Technical", icon: <Cpu size={14} /> },
    { name: "Culture", icon: <User size={14} /> },
];

export default function BlogPage() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        fetchBlogs();
    }, [selectedCategory]);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost";
            const url = new URL(`${API_BASE}/blogs`, baseUrl);
            if (selectedCategory !== "All") url.searchParams.append("category", selectedCategory);
            if (search) url.searchParams.append("search", search);
            
            const res = await fetch(url.toString());
            const data = await res.json();
            setBlogs(data.blogs || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchBlogs();
    };

    const featuredPost = blogs.length > 0 ? blogs[0] : null;
    const remainingPosts = blogs.length > 1 ? blogs.slice(1) : [];

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            {/* Header / Hero */}
            <section className="subpage-header">
                <FloatingOrbs />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-4xl mx-auto"
                    >
                        <span className="section-badge-dark mb-8">Engineering & Innovation</span>
                        <h1 className="text-[2rem] md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter leading-none text-white whitespace-nowrap">
                            The <span className="hero-gradient-text">Engineering</span> Journal
                        </h1>
                        <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-2xl mx-auto font-sans font-medium leading-relaxed">
                            Deep dives into software architecture, product strategy, and the future of technical innovation.
                        </p>

                        {/* Search & Filter Bar */}
                        <div className="flex flex-col md:flex-row items-center gap-4 max-w-3xl mx-auto bg-white rounded-[2rem] p-2 border border-slate-200 shadow-xl">
                            <form onSubmit={handleSearch} className="flex-1 flex items-center gap-3 pl-6 w-full">
                                <Search size={18} className="text-slate-400" />
                                <input 
                                    type="text" 
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search architectural insights..." 
                                    className="bg-transparent border-none py-4 text-sm font-medium focus:outline-none w-full text-slate-900 placeholder:text-slate-400"
                                />
                            </form>
                            <div className="flex flex-wrap items-center gap-2 p-1 bg-slate-50 rounded-2xl w-full md:w-auto">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.name}
                                        onClick={() => setSelectedCategory(cat.name)}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                            selectedCategory === cat.name 
                                            ? "bg-primary text-white shadow-lg shadow-primary/20" 
                                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                        }`}
                                    >
                                        {cat.icon}
                                        <span className="hidden lg:inline">{cat.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Featured Post */}
            {!loading && featuredPost && selectedCategory === "All" && !search && (
                <section className="section-padding container mx-auto px-4 max-w-7xl relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="group relative h-[600px] rounded-[3rem] overflow-hidden border border-slate-100 shadow-2xl"
                    >
                         <img 
                            src={featuredPost.featuredImage || "/placeholder-blog.jpg"} 
                            alt={featuredPost.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#060608]/95 via-[#060608]/60 to-[#060608]/30 sm:via-[#060608]/50 sm:to-[#060608]/20 transition-opacity duration-500" />
                        <Link href={`/blog/${featuredPost.slug}`} className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 max-w-4xl z-10">
                            <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4 drop-shadow-md">Featured Insight</span>
                            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight group-hover:text-primary transition-colors drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]">
                                {featuredPost.title}
                            </h2>
                            <p className="text-lg md:text-xl text-white/90 mb-8 font-serif italic max-w-2xl line-clamp-2 drop-shadow-md">
                                {featuredPost.excerpt}
                            </p>
                            <div className="flex items-center gap-8 text-xs font-black uppercase tracking-widest text-white/80 drop-shadow-md">
                                <span className="flex items-center gap-2 font-black uppercase tracking-widest leading-[0.1em]"><User size={14} className="text-primary drop-shadow-none" /> {featuredPost.author}</span>
                                <span className="flex items-center gap-2 font-black uppercase tracking-widest leading-[0.1em]"><Calendar size={14} className="text-primary drop-shadow-none" /> {new Date(featuredPost.publishDate).toLocaleDateString()}</span>
                                <span className="text-primary flex items-center gap-2 group-hover:gap-4 transition-all font-black uppercase tracking-widest leading-[0.1em] ml-auto sm:ml-0 drop-shadow-none">Read Full Story <ArrowRight size={16} /></span>
                            </div>
                        </Link>
                    </motion.div>
                </section>
            )}

            {/* Blog Grid */}
            <section className="pb-32 container mx-auto px-4 max-w-7xl relative z-10">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="aspect-[4/5] bg-slate-100 rounded-[2.5rem] animate-pulse border border-slate-100" />
                        ))}
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                        <div className="text-slate-400 text-xl font-bold uppercase tracking-widest">No articles found matching your criteria.</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {(featuredPost && selectedCategory === "All" && !search ? remainingPosts : blogs).map((post, i) => (
                            <motion.div
                                key={post._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: (i % 3) * 0.1 }}
                                className="group relative flex flex-col bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2"
                            >
                                <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
                                    <div className="relative h-64 overflow-hidden">
                                        <img 
                                            src={post.featuredImage || "/placeholder-blog.jpg"} 
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent opacity-80 pointer-events-none" />
                                        <div className="absolute top-4 left-4 z-10">
                                            <span className="px-3 py-1 bg-white/95 backdrop-blur-md border border-slate-100 text-primary text-[9px] font-black uppercase tracking-widest rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
                                                {post.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-8 flex flex-col flex-1">
                                        <h3 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors leading-tight line-clamp-2 tracking-tight text-slate-900">
                                            {post.title}
                                        </h3>
                                        <p className="text-slate-500 text-sm font-medium line-clamp-3 mb-8 flex-grow leading-relaxed font-sans italic">
                                            {post.excerpt}
                                        </p>
                                        <div className="pt-6 border-t border-slate-50 flex flex-col space-y-4">
                                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-black uppercase tracking-[0.1em]">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-3 h-3 text-primary" />
                                                    {post.author}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-3 h-3 text-primary" />
                                                    {new Date(post.publishDate).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div className="flex items-center text-primary text-xs font-black uppercase tracking-widest group-hover:gap-4 transition-all duration-300 pointer-events-none">
                                                Discover <ArrowRight className="ml-2 w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
