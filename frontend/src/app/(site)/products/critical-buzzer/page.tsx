"use client";

import React from "react";
import { ArrowRight, BellRing, Smartphone, ShieldAlert, Cpu, Bot, ChevronDown, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { motion } from "framer-motion";
import FloatingOrbs from "@/components/shared/FloatingOrbs";

export default function CriticalBuzzerProductPage() {
    const faqs = [
        {
            q: "What is CriticalBuzzer?",
            a: "CriticalBuzzer is an AI watchdog for SaaS. It's a risk mitigation system built for early detection that watches your app like a hawk to catch silent failures before they impact your users or revenue."
        },
        {
            q: "How difficult is the setup process?",
            a: "Setup takes less than 60 seconds. CriticalBuzzer acts as a universal webhook inbox that accepts any JSON event. There are no SDKs to install and no complex dev-ops configuration required."
        },
        {
            q: "How does CriticalBuzzer alert me?",
            a: "We use a 'Multi-Channel Assault' approach, including Slack, Telegram, WhatsApp, and Voice Calls. Alarms are persistent and ring until acknowledged, following your custom escalation policies so you never miss a critical severity."
        },
        {
            q: "How is it different from traditional log monitors?",
            a: "Instead of spitting out cryptic error codes spanning multiple lines, CriticalBuzzer uses AI to explain exactly what happened in plain English so you know exactly what broke and how urgent it is."
        },
        {
            q: "Does it work for AI Agents?",
            a: "Yes. CriticalBuzzer acts as the monitoring layer for AI agents with Auto-detect, Auto-configure, and Auto-fix capabilities to ensure your agents run flawlessly."
        }
    ];

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header / Hero */}
            <section className="subpage-header">
                <FloatingOrbs />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="section-badge mb-6">Risk Mitigation System</span>
                            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight text-white leading-tight text-balance">
                                The AI <span className="hero-gradient-text">Watchdog</span> for SaaS
                            </h1>
                            <p className="text-xl md:text-2xl text-white/70 mb-10 text-balance font-sans leading-relaxed">
                                Setup highly-intelligent monitoring in under 60 seconds. Detect early, pinpoint what&apos;s about to break, and act fast.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <Button size="lg" className="rounded-full px-10 py-7 text-lg group" asChild>
                                    <a href="https://criticalbuzzer.com" target="_blank" rel="noopener noreferrer">
                                        Try CriticalBuzzer
                                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                </Button>
                                <Button size="lg" variant="outline" className="rounded-full px-10 py-7 text-lg text-white border-white/20 bg-transparent hover:bg-white/5" asChild>
                                    <Link href="/contact">Book a Demo</Link>
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
                        <span className="section-badge mb-6">How It Works</span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Monitoring Redefined</h2>
                        <p className="text-xl text-muted-foreground font-sans max-w-2xl mx-auto">We don&apos;t give you another dashboard. We give you intelligent alarms.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: "Universal Webhook", desc: "Accepts any JSON event. When something feels wrong, send data. No SDK required.", icon: Cpu },
                            { title: "Multi-Channel Assault", desc: "Slack, Telegram, WhatsApp, Voice Calls. We find you wherever you are.", icon: Smartphone },
                            { title: "Persistent Alarms", desc: "Rings until you acknowledge it on desktop or mobile. Impossible to ignore.", icon: BellRing },
                            { title: "Escalation Policies", desc: "Alert me every 5 minutes until fixed. We don&apos;t stop until it&apos;s resolved.", icon: ShieldAlert },
                            { title: "Plain English AI", desc: "AI explains exactly what happened. No more deciphering cryptic error codes.", icon: Bot },
                            { title: "Auto-Fix Logic", desc: "Detect error patterns and trigger automated remediation scripts instantly.", icon: Zap },
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
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Common Questions</h2>
                        <p className="text-xl text-muted-foreground font-sans">Common questions about the CriticalBuzzer system.</p>
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
