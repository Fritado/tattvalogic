"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, MousePointer2, Eye, ArrowUpRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function GrowthShowcase() {
    const stats = [
        { 
            label: "Total Clicks", 
            before: "815", 
            after: "8.85K", 
            increase: "+985%", 
            icon: MousePointer2,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        { 
            label: "Total Impressions", 
            before: "6K", 
            after: "660K", 
            increase: "+10,900%", 
            icon: Eye,
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        },
        { 
            label: "Avg. Position", 
            before: "37.8", 
            after: "16.7", 
            increase: "Top 20", 
            icon: TrendingUp,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10"
        },
    ];

    return (
        <section className="py-28 bg-white relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full hero-grid opacity-[0.03] pointer-events-none" />
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-4xl mx-auto text-center mb-20">
                    <motion.span 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="section-badge mb-6"
                    >
                        Case Study: Growth
                    </motion.span>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-bold mb-8 tracking-tight text-slate-900"
                    >
                        Real Data. <span className="hero-gradient-text">Real Results.</span>
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-600 font-sans leading-relaxed"
                    >
                        We don&apos;t just build websites; we build growth engines. See how we transformed this client&apos;s digital presence in just 6 months.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
                    {stats.map((stat, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 relative group overflow-hidden"
                        >
                            <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            
                            <div className="space-y-1 mb-6">
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-4xl font-bold text-slate-900">{stat.after}</span>
                                    <span className="text-sm font-black text-emerald-500 flex items-center gap-0.5">
                                        <ArrowUpRight className="w-3 h-3" />
                                        {stat.increase}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Before Optimization</p>
                                    <p className="text-lg font-bold text-slate-500 line-through decoration-slate-300">{stat.before}</p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                </div>
                            </div>

                            {/* Decoration */}
                            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
                                <stat.icon size={120} />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Comparison Visual */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-widest">
                            August 2024 (Before)
                        </div>
                        <div className="rounded-3xl border border-slate-100 overflow-hidden shadow-2xl shadow-slate-200/50 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                            <Image 
                                src="/assets/case-study/traffic-before.png" 
                                alt="Traffic Before Optimization" 
                                width={800} 
                                height={400}
                                className="w-full h-auto"
                            />
                        </div>
                        <p className="text-slate-500 font-sans italic text-sm text-center">
                            "Stagnant traffic with minimal search engine visibility and low authority."
                        </p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold uppercase tracking-widest">
                            January 2025 (After TattvaLogic)
                        </div>
                        <div className="rounded-3xl border-2 border-emerald-500/20 overflow-hidden shadow-2xl shadow-emerald-500/10 ring-4 ring-emerald-500/5">
                            <Image 
                                src="/assets/case-study/traffic-after.png" 
                                alt="Traffic After Optimization" 
                                width={800} 
                                height={400}
                                className="w-full h-auto"
                            />
                        </div>
                        <p className="text-slate-700 font-sans font-medium text-sm text-center">
                            "Exponential growth driven by architecture optimization and AI-led content strategy."
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
