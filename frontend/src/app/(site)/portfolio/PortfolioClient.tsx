"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Briefcase, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import FloatingOrbs from "@/components/shared/FloatingOrbs";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function PortfolioClient() {
  const [portfolioItems, setPortfolioItems] = useState<any[]>([]);
  const [visibleItems, setVisibleItems] = useState(12);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/portfolio`);
        const data = await res.json();
        setPortfolioItems(data || []);
      } catch (err) {
        console.error("Failed to fetch portfolio:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  const loadMore = () => {
    setVisibleItems((prev: number) => prev + 4);
  };

  const currentItems = portfolioItems.slice(0, visibleItems);
  const hasMore = visibleItems < portfolioItems.length;

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <section className="subpage-header animate-pulse">
            <div className="container mx-auto px-4 h-64 flex flex-col justify-center items-center">
                <div className="h-4 w-32 bg-white/20 rounded-full mb-6" />
                <div className="h-12 w-64 bg-white/20 rounded-xl mb-4" />
                <div className="h-6 w-96 bg-white/20 rounded-lg" />
            </div>
        </section>
        <section className="section-padding">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-[400px] rounded-[2rem] bg-slate-50 border border-slate-100 animate-pulse overflow-hidden">
                    <div className="h-24 bg-slate-100" />
                    <div className="p-8">
                        <div className="w-20 h-20 bg-slate-200 rounded-2xl -mt-16 mb-6" />
                        <div className="h-8 w-3/4 bg-slate-200 rounded-lg mb-4" />
                        <div className="h-4 w-full bg-slate-100 rounded-md mb-2" />
                        <div className="h-4 w-full bg-slate-100 rounded-md mb-2" />
                        <div className="h-4 w-2/3 bg-slate-100 rounded-md" />
                    </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="subpage-header">
        <FloatingOrbs />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <span className="section-badge mb-6">Our Work</span>
              <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight text-white leading-tight">
                Delivering Digital <span className="hero-gradient-text">Excellence</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/70 mb-10 text-balance font-sans leading-relaxed">
                Explore our portfolio of scalable architectures, intelligent SaaS products, and enterprise platforms driving real business impact.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="section-padding relative overflow-hidden bg-white">
        {/* Branding Background Pattern - Light Mode */}
        <div className="hero-grid opacity-30" />
        
        {/* Softer Orbs for Light Theme */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
            initial="hidden" animate="visible" variants={staggerContainer}
          >
            {currentItems.map((project, idx) => {
              const fallbackLogo = `https://ui-avatars.com/api/?name=${project.title}&background=e2e8f0&color=475569&bold=true`;
              const baseUrl = typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_API_URL || "/api").replace(/\/+$/, "").replace('/api', '') : "";
              const logoUrl = project.thumbnail ? (project.thumbnail.startsWith('http') ? project.thumbnail : `${baseUrl}${project.thumbnail}`) : fallbackLogo;

              // Dynamic color scheme based on category
              const getCategoryStyle = (cat: string) => {
                const c = cat.toLowerCase();
                if (c.includes('web')) return { from: 'from-blue-600/10', to: 'to-indigo-600/10', text: 'text-blue-600', border: 'border-blue-100', dot: 'bg-blue-600' };
                if (c.includes('app') || c.includes('mobile')) return { from: 'from-purple-600/10', to: 'to-fuchsia-600/10', text: 'text-purple-600', border: 'border-purple-100', dot: 'bg-purple-600' };
                if (c.includes('ai') || c.includes('data')) return { from: 'from-emerald-600/10', to: 'to-teal-600/10', text: 'text-emerald-600', border: 'border-emerald-100', dot: 'bg-emerald-600' };
                return { from: 'from-orange-600/10', to: 'to-red-600/10', text: 'text-primary', border: 'border-primary/10', dot: 'bg-primary' };
              };

              const style = getCategoryStyle(project.category || 'other');

              return (
                <motion.div key={project._id} variants={fadeInUp}>
                  <div className="group h-full flex flex-col bg-white rounded-[2rem] border border-slate-100 hover:border-primary/30 transition-all duration-500 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] relative overflow-hidden">
                    {/* Top Decorative Header */}
                    <div className={`h-24 bg-gradient-to-br ${style.from} ${style.to} relative overflow-hidden`}>
                      <div className="absolute inset-0 hero-grid opacity-10" />
                      <div className={`absolute top-4 right-6 px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm border ${style.border} flex items-center gap-2`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${style.text}`}>
                          {project.category}
                        </span>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-8 pt-0 flex-grow relative flex flex-col">
                      {/* Logo Offset */}
                      <div className="relative -mt-10 mb-6 flex justify-between items-end">
                        <div className="w-20 h-20 bg-white rounded-2xl shadow-[0_12px_24px_rgba(0,0,0,0.08)] border border-slate-50 flex items-center justify-center p-3 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                          <img 
                            src={logoUrl} 
                            alt={`${project.title} Logo`}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = fallbackLogo;
                            }}
                            loading="lazy"
                          />
                        </div>
                        
                        <div className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-500">
                          <ExternalLink className="w-5 h-5 text-primary" />
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-slate-600 font-sans leading-relaxed text-base mb-8 flex-grow">
                        {project.description}
                      </p>

                      <div className="pt-6 border-t border-slate-50 mt-auto">
                        <a 
                          href={project.projectUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-between group/link w-full"
                        >
                          <span className="text-sm font-bold text-slate-400 group-hover/link:text-primary transition-colors">
                            Launch Project
                          </span>
                          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover/link:bg-primary group-hover/link:text-white transition-all duration-300">
                            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" />
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Load More Button */}
          {hasMore && (
            <div className="mt-20 text-center">
              <Button size="lg" variant="outline" className="rounded-full px-12 py-7 border-white/10 text-white hover:bg-white/5" onClick={loadMore}>
                Load More Projects
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
