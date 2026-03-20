"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, User, Calendar, Share2, Facebook, Twitter, Linkedin, MessageSquare, ChevronRight } from "lucide-react";
import FloatingOrbs from "@/components/shared/FloatingOrbs";
import { motion, useScroll, useSpring } from "framer-motion";

export default function BlogPostClient({ post, relatedPosts }: any) {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const [toc, setToc] = useState<{ id: string; text: string; level: number }[]>([]);

    useEffect(() => {
        // Generate TOC from H2 and H3 tags
        const contentElement = document.getElementById('blog-content');
        if (contentElement) {
            const headings = Array.from(contentElement.querySelectorAll('h2, h3'));
            const tocItems = headings.map((heading, index) => {
                const text = heading.textContent || "";
                const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '') + `-${index}`;
                heading.id = id;
                return {
                    id,
                    text,
                    level: heading.tagName === 'H2' ? 2 : 3
                };
            });
            setToc(tocItems);
        }
    }, [post.content]);

    // JSON-LD for SEO
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "image": post.featuredImage,
        "author": {
            "@type": "Person",
            "name": post.author || "TattvaLogic Admin"
        },
        "publisher": {
            "@type": "Organization",
            "name": "TattvaLogic",
            "logo": {
                "@type": "ImageObject",
                "url": "https://tattvalogic.com/logo.png" // Placeholder
            }
        },
        "datePublished": post.publishDate,
        "description": post.excerpt
    };

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/30 font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            
            {/* Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-primary z-[100] origin-left"
                style={{ scaleX }}
            />
 
            {/* Header / Hero */}
            <section className="subpage-header">
                <FloatingOrbs />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-5xl mx-auto">
                        <Link href="/blog" className="group inline-flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-primary mb-12 transition-all">
                            <ArrowLeft className="w-4 h-4 mr-3 group-hover:-translate-x-2 transition-transform" />
                            Back to Journal
                        </Link>
                        
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <span className="section-badge-dark">
                                    {post.category}
                                </span>
                                <span className="w-1 h-1 bg-white/20 rounded-full" />
                                <span className="text-white/40 text-[10px] font-black uppercase tracking-widest leading-[0.1em]">8 Min Read</span>
                            </div>
 
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-12 tracking-tighter leading-[0.9] text-white">
                                {post.title}
                            </h1>
 
                            <div className="flex flex-col md:flex-row md:items-center gap-8 py-8 border-y border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                                        <User size={20} className="text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1 leading-[0.1em]">Architected By</p>
                                        <p className="font-bold text-white">{post.author || "Admin"}</p>
                                    </div>
                                </div>
                                <div className="hidden md:block w-px h-10 bg-white/10" />
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                        <Calendar size={20} className="text-white/40" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1 leading-[0.1em]">Published On</p>
                                        <p className="font-bold text-white">{new Date(post.publishDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                    </div>
                                </div>
                                <div className="ml-auto flex items-center gap-4">
                                    <button className="p-3 bg-white/5 hover:bg-primary text-white/60 hover:text-white transition-all rounded-full border border-white/10"><Twitter size={18} /></button>
                                    <button className="p-3 bg-white/5 hover:bg-primary text-white/60 hover:text-white transition-all rounded-full border border-white/10"><Linkedin size={18} /></button>
                                    <button className="p-3 bg-white/5 hover:bg-primary text-white/60 hover:text-white transition-all rounded-full border border-white/10"><Share2 size={18} /></button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
 
            {/* Featured Image */}
            <section className="container mx-auto px-4 max-w-7xl -mt-24 relative z-20">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="aspect-[21/9] rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-white/10 bg-slate-100"
                >
                    <img 
                        src={post.featuredImage || "/placeholder-blog.jpg"} 
                        alt={post.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder-blog.jpg";
                        }}
                    />
                </motion.div>
            </section>
 
            {/* Content Section */}
            <section className="py-24 relative overflow-hidden bg-background">
                <div className="container mx-auto px-4 max-w-7xl relative z-10 flex flex-col lg:flex-row gap-16">
                    {/* Sidebar / TOC */}
                    <aside className="lg:w-72 hidden lg:block sticky top-32 h-fit">
                        <div className="space-y-8">
                             <div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6">In this article</h4>
                                <nav className="space-y-4">
                                    {toc.map((item) => (
                                        <a 
                                            key={item.id} 
                                            href={`#${item.id}`}
                                            className={`block text-sm font-medium transition-all hover:text-primary ${item.level === 3 ? 'pl-4 text-slate-400' : 'text-slate-600'}`}
                                        >
                                            {item.text}
                                        </a>
                                    ))}
                                </nav>
                             </div>
                             <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                                <MessageSquare className="text-primary mb-4" />
                                <h5 className="font-bold text-lg mb-2 text-slate-900">Have a question?</h5>
                                <p className="text-slate-500 text-sm mb-6 leading-relaxed font-sans">Interested in implementing these architectural patterns?</p>
                                <Link href="/contact" className="text-primary text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
                                    Connect with us <ArrowRight size={14} />
                                </Link>
                             </div>
                        </div>
                    </aside>
 
                    {/* Main Content */}
                    <div className="flex-1 max-w-4xl mx-auto lg:mx-0">
                        <div className="mb-16">
                            <p className="text-2xl md:text-3xl text-slate-600 font-sans italic leading-relaxed border-l-4 border-primary pl-10">
                                {post.excerpt}
                            </p>
                        </div>
                        
                        <div 
                            id="blog-content"
                            className="prose prose-slate prose-2xl max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-headings:leading-none prose-p:text-slate-600 prose-p:font-sans prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-[2rem] prose-img:border prose-img:border-slate-100 prose-blockquote:border-primary prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:px-8 prose-blockquote:rounded-2xl"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
 
                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="mt-20 pt-10 border-t border-slate-100 flex flex-wrap gap-3">
                                {post.tags.map((tag: string) => (
                                    <span key={tag} className="px-5 py-2 rounded-full bg-slate-50 border border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
 
            {/* Related Posts */}
            {relatedPosts && relatedPosts.length > 0 && (
                <section className="py-32 bg-slate-50 border-t border-slate-100">
                    <div className="container mx-auto px-4 max-w-7xl">
                        <div className="flex items-center justify-between mb-16">
                            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">More Perspectives</h2>
                            <Link href="/blog" className="text-primary font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:gap-4 transition-all">
                                View Full Journal <ArrowRight size={16} />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {relatedPosts.map((post: any) => (
                                <Link key={post._id} href={`/blog/${post.slug}`} className="group bg-white p-8 rounded-[3rem] border border-slate-100 hover:border-primary/20 transition-all flex flex-col h-full hover:shadow-xl shadow-slate-200/50">
                                     <span className="text-primary font-black uppercase tracking-widest text-[9px] mb-4 leading-[0.1em]">{post.category}</span>
                                     <h3 className="text-2xl font-black mb-6 group-hover:text-primary transition-colors line-clamp-2 leading-tight text-slate-900">{post.title}</h3>
                                     <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-[0.1em]">{new Date(post.publishDate).toLocaleDateString()}</span>
                                         <ArrowRight className="text-primary w-5 h-5 transition-transform group-hover:translate-x-2" />
                                     </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
