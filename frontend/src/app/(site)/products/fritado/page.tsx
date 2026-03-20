"use client";

import React from "react";
import { ArrowRight, Bot, Target, Mail, Users, LineChart, ChevronDown, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { motion } from "framer-motion";
import FloatingOrbs from "@/components/shared/FloatingOrbs";

export default function FritadoProductPage() {
    // ... faqs constant stays the same ...
    const faqs = [
        {
            q: "What is Fritado AI?",
            a: "Fritado AI is a complete AI Growth Engine that automates competitor analysis, content creation, lead generation, outreach, and campaigns so your business can grow on autopilot while others struggle manually."
        },
        {
            q: "How does the AI-Based Competitor Analysis work?",
            a: "Fritado analyzes exactly what your competitors rank for and uncovers opportunities before they dominate your niche. It removes the guesswork so you can start outranking them systematically."
        },
        {
            q: "Will Fritado replace my other marketing tools?",
            a: "Yes! Many of our growth-focused teams report that Fritado has replaced up to 5 separate marketing, SEO, and outreach tools, consolidating everything into one intelligent platform."
        },
        {
            q: "Do you offer a free trial?",
            a: "Absolutely. You can start a 14-Day Free Trial to experience exactly how Fritado can double your lead flow and multiply your content output without hiring additional writers."
        },
        {
            q: "What happens when I request the Free AI Website Audit?",
            a: "Our AI will instantly analyze your website and generate a comprehensive report detailing exactly what technical, SEO, or content issues are holding your growth back."
        }
    ];

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header / Hero */}
            <section className="subpage-header">
                <FloatingOrbs />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="section-badge mb-6">AI Growth Infrastructure</span>
                            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight text-white leading-tight md:whitespace-nowrap">
                                Outperform Your <span className="hero-gradient-text">Competitors</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-white/70 mb-10 text-balance font-sans leading-relaxed">
                                Fritado AI automates competitor analysis, content creation, and lead generation — so your business grows while others struggle.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <Button size="lg" className="rounded-full px-10 py-7 text-lg group" asChild>
                                    <a href="https://platform.fritado.com" target="_blank" rel="noopener noreferrer">
                                        Start 14-Day Free Trial
                                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                </Button>
                                <Button size="lg" variant="outline" className="rounded-full px-10 py-7 text-lg text-white border-white/20 bg-transparent hover:bg-white/5" asChild>
                                    <a href="https://fritado.com/demo" target="_blank" rel="noopener noreferrer">Book a Demo</a>
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features List */}
            <section className="section-padding bg-background relative overflow-hidden">
                <div className="container mx-auto px-4 max-w-6xl relative z-10">
                    <div className="text-center mb-16">
                        <span className="section-badge mb-6">Features</span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Complete AI Engine</h2>
                        <p className="text-xl text-muted-foreground font-sans max-w-2xl mx-auto">Everything you need to outpublish and outperform your competitors.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: "Target Analysis", desc: "Know what your rivals rank for before they dominate your niche.", icon: Target },
                            { title: "AI Blog Engine", desc: "Publish 3x more content automatically without hiring more writers.", icon: Bot },
                            { title: "Growth Analytics", desc: "Track conversions and rankings with real-time intelligent insights.", icon: LineChart },
                            { title: "Email Outreach", desc: "Hyper-personalized, AI-driven campaigns that land in the inbox.", icon: Mail },
                            { title: "Lead Generation", desc: "Automated pipelines that capture and nurture prospects 24/7.", icon: Users },
                            { title: "Social Sync", desc: "Sync your brand voice across 5+ social platforms automatically.", icon: Zap },
                        ].map((feature, i) => (
                            <div key={i} className="service-card group cursor-default">
                                <div className="p-8">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                                        <feature.icon className="w-6 h-6 text-primary group-hover:text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">{feature.title}</h3>
                                    <p className="text-muted-foreground font-sans leading-relaxed">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="section-padding bg-background border-t border-white/5">
                <div className="container mx-auto px-4 max-w-4xl relative z-10">
                    <div className="text-center mb-16">
                        <span className="section-badge mb-6">FAQ</span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Expert Insights</h2>
                        <p className="text-xl text-muted-foreground font-sans">Common questions about the Fritado AI platform.</p>
                    </div>

                    <div className="space-y-6">
                        {faqs.map((faq, i) => (
                            <div key={i} className="glass-card p-8 border border-white/5">
                                <h3 className="text-xl font-bold mb-4 flex items-start gap-4">
                                    <div className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
                                    {faq.q}
                                </h3>
                                <p className="text-muted-foreground font-sans leading-relaxed pl-6">
                                    {faq.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
}
