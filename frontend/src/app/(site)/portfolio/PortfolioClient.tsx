"use client";

import React, { useState } from "react";
import { ExternalLink, Briefcase, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import FloatingOrbs from "@/components/shared/FloatingOrbs";

const portfolioItems = [
  {
    id: "critical-buzzer",
    name: "Critical Buzzer",
    url: "https://criticalbuzzer.com/",
    description: "AI-powered critical alert and emergency notification platform.",
    logo: null,
    category: "AI & SaaS"
  },
  {
    id: "fritado",
    name: "Fritado",
    url: "https://fritado.com/",
    description: "AI-driven SaaS platform for automated marketing, lead generation, and growth intelligence.",
    logo: "/images/portfolio/Fritado.png",
    category: "AI & Growth"
  },
  {
    id: "nutalz",
    name: "Nutalz",
    url: "https://nutalz.com/",
    description: "Digital platform focused on health, wellness, and nutrition solutions.",
    logo: "/images/portfolio/Nutalz.png",
    category: "HealthTech"
  },
  {
    id: "lexes",
    name: "Lexes",
    url: "http://lexes.co.in/",
    description: "Legal and compliance technology platform providing digital legal solutions.",
    logo: "/images/portfolio/Lexes-Technologies-logo.jpg",
    category: "LegalTech"
  },
  {
    id: "tapglobal360",
    name: "TapGlobal360",
    url: "https://tapglobal360.com/",
    description: "Global networking and digital transformation platform for businesses.",
    logo: "/images/portfolio/tapglobal360.webp",
    category: "Enterprise"
  },
  {
    id: "vidyabharati",
    name: "Vidya Bharati USA",
    url: "https://vidyabharatiusa.org/",
    description: "Educational and cultural integration platform fostering holistic development.",
    logo: "/images/portfolio/Vidyabhartiusa.webp",
    category: "EdTech"
  },
  {
    id: "duc-bank",
    name: "DUC Bank",
    url: "https://duc.bank.in/",
    description: "Digital cooperative banking platform offering modern financial services.",
    logo: "/images/portfolio/DUCBank.png",
    category: "FinTech"
  },
  {
    id: "apnapandit",
    name: "ApnaPandit",
    url: "https://apnapandit.com/",
    description: "Online platform connecting users with pandits for religious ceremonies and rituals.",
    logo: "/images/portfolio/apnapandit.png",
    category: "Consumer"
  },
  {
    id: "algroflix",
    name: "Algroflix",
    url: "https://algroflix.com/",
    description: "Digital media and entertainment platform.",
    logo: "/images/portfolio/Algroflix.jpg",
    category: "Media & Ent"
  }
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function PortfolioClient() {
  const [visibleItems, setVisibleItems] = useState(12);

  const loadMore = () => {
    setVisibleItems((prev: number) => prev + 4);
  };

  const currentItems = portfolioItems.slice(0, visibleItems);
  const hasMore = visibleItems < portfolioItems.length;

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
              const fallbackLogo = `https://ui-avatars.com/api/?name=${project.name}&background=e2e8f0&color=475569&bold=true`;
              const logoUrl = project.logo || fallbackLogo;

              return (
                <motion.div key={project.id} variants={fadeInUp}>
                  <div className="p-8 md:p-10 rounded-[2.5rem] bg-white border border-slate-100 hover:border-primary/30 transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] flex flex-col group h-full relative overflow-hidden">
                    {/* Hover Glow Effect - Subtle for Light Theme */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    <div className="flex justify-between items-start mb-8 relative z-10">
                      <div className="w-20 h-20 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex items-center justify-center p-3 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                        <img 
                          src={logoUrl} 
                          alt={`${project.name} Logo`}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                              (e.target as HTMLImageElement).src = fallbackLogo;
                          }}
                          loading="lazy"
                        />
                      </div>
                      <span className="px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-widest text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        {project.category}
                      </span>
                    </div>
                    
                    <div className="space-y-4 mb-8 flex-grow relative z-10">
                      <h3 className="text-2xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-slate-600 font-sans leading-relaxed text-lg group-hover:text-slate-700 transition-colors">
                        {project.description}
                      </p>
                    </div>
                    
                    <div className="pt-6 border-t border-slate-100 relative z-10">
                      <a 
                        href={project.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-primary transition-all duration-300 group/link"
                      >
                        Launch Project
                        <ArrowRight className="w-4 h-4 group-hover/link:translate-x-2 transition-transform" />
                      </a>
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
