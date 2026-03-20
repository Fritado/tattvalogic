"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Code2, 
  BrainCircuit, 
  Users, 
  ShieldCheck, 
  Sparkles 
} from "lucide-react";
import FloatingOrbs from "@/components/shared/FloatingOrbs";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({ 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] as any, delay } 
  })
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

const services = [
  {
    title: "AI Solutions",
    desc: "Transform business operations using cutting-edge Generative AI, machine learning, and intelligent automation pipelines.",
    icon: BrainCircuit,
    link: "/services/ai-solutions",
    badge: "Future-Ready",
    gradient: "from-purple-500/20 to-fuchsia-500/10",
    iconBg: "bg-purple-500/15",
    iconColor: "text-purple-500",
  },
  {
    title: "IT Services",
    desc: "Modern software engineering and cloud architecture designed to help enterprises legacy systems and scale gracefully.",
    icon: Code2,
    link: "/services/it-services",
    badge: "Enterprise",
    gradient: "from-blue-500/20 to-cyan-500/10",
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-500",
  },
  {
    title: "Staff Augmentation",
    desc: "Access top 1% global technology talent on demand to scale your engineering capacity without the hiring overhead.",
    icon: Users,
    link: "/services/staff-augmentation",
    badge: "Global Talent",
    gradient: "from-emerald-500/20 to-teal-500/10",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-500",
  },
  {
    title: "IT Maintenance",
    desc: "Proactive 24/7 infrastructure monitoring, security hardening, and dedicated performance optimization support.",
    icon: ShieldCheck,
    link: "/services/it-maintenance",
    badge: "24/7 Support",
    gradient: "from-orange-500/20 to-amber-500/10",
    iconBg: "bg-orange-500/15",
    iconColor: "text-orange-500",
  }
];

const techStack = [
  "React", "Next.js", "Python", "TensorFlow", "Node.js", "AWS",
  "Kubernetes", "PostgreSQL", "LLMs", "TypeScript", "GraphQL", "Docker",
  "Azure", "PyTorch", "Rust", "Go", "Redis", "Solidity"
];

function TechMarquee() {
  return (
    <div className="py-12 bg-muted/20 border-y border-border/50 overflow-hidden">
      <div className="marquee-track flex gap-12 whitespace-nowrap animate-marquee">
        {[...techStack, ...techStack].map((item, i) => (
          <span key={i} className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-muted-foreground/60">
            <Sparkles className="w-3 h-3 text-primary" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ServicesPage() {
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
              variants={stagger}
            >
              <motion.div variants={fadeInUp}>
                <span className="section-badge mb-6">Our Expertise</span>
              </motion.div>
              <motion.h1 
                variants={fadeInUp}
                className="text-5xl md:text-7xl font-bold mb-8 tracking-tight text-white leading-tight"
              >
                Digital <span className="hero-gradient-text">Services</span> & Talent
              </motion.h1>
              <motion.p 
                variants={fadeInUp}
                className="text-xl md:text-2xl text-white/70 mb-10 text-balance font-sans leading-relaxed"
              >
                Empowering enterprises with cutting-edge technology, elite engineering talent, and intelligent AI solutions built for the future.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="section-padding bg-background relative overflow-hidden">
        {/* Subtle background texture for the section */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none hero-grid" />
        
        <div className="container mx-auto px-4 relative z-10 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                whileHover={{ y: -12, scale: 1.01 }}
                className="group relative h-full"
              >
                <Link href={service.link} className="block h-full cursor-pointer">
                  <div className="h-full p-10 md:p-12 rounded-[2.5rem] bg-white border border-zinc-200/60 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] transition-all duration-700 group-hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] group-hover:border-primary/20 flex flex-col relative overflow-hidden">
                    {/* Interior Glows */}
                    <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/5 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    
                    <div className="relative z-10 flex justify-between items-start mb-12">
                      <motion.div 
                        whileHover={{ rotate: 8, scale: 1.1 }}
                        className={`w-20 h-20 rounded-2xl ${service.iconBg} flex items-center justify-center border border-white shadow-xl shadow-zinc-200/50 group-hover:bg-primary transition-all duration-500`}
                      >
                        <service.icon className={`w-10 h-10 ${service.iconColor} group-hover:text-white transition-colors`} />
                      </motion.div>
                      <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 group-hover:text-primary transition-colors px-5 py-2.5 rounded-full border border-zinc-100 bg-zinc-50/50">
                        {service.badge}
                      </span>
                    </div>
                    
                    <h2 className="relative z-10 text-4xl md:text-5xl font-bold mb-8 text-zinc-900 group-hover:text-primary transition-colors tracking-tight leading-[1.1]">
                      {service.title}
                    </h2>
                    <p className="relative z-10 text-xl text-zinc-500 font-sans leading-relaxed mb-12 flex-grow group-hover:text-zinc-700 transition-colors">
                      {service.desc}
                    </p>
                    
                    <div className="relative z-10 pt-10 border-t border-zinc-100 flex items-center text-zinc-400 font-bold group-hover:text-primary transition-all duration-500 uppercase text-xs tracking-[0.3em]">
                      <span className="group-hover:translate-x-2 transition-transform duration-500">Explore {service.title}</span>
                      <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-3 transition-transform duration-500" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Mastery Marquee */}
      <TechMarquee />

      {/* The global ReadyToBuild CTA is provided by layout.tsx, so we don't need a redundant final CTA here */}
    </div>
  );
}
