"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { MapPin, Phone, Mail, MessageSquare, CheckCircle2, ArrowRight, Sparkles, ChevronDown, Zap, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import FloatingOrbs from "@/components/shared/FloatingOrbs";

type ContactFormData = {
    name: string;
    email: string;
    mobile: string;
    service: string;
    message: string;
};

export default function ContactPage() {
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<ContactFormData>();
    const message = watch("message") || "";
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const onSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true);
        try {
            const { API_BASE } = await import("@/config/apiConfig");
            const apiUrl = `${API_BASE}`;
            const res = await fetch(`${apiUrl}/enquiries`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    phone: data.mobile,
                    message: `Service: ${data.service}\n\n${data.message}`
                })
            });
            if (res.ok) {
                setIsSuccess(true);
                reset();
            } else {
                const errorData = await res.json();
                alert(errorData.message || "Failed to send enquiry. Please try again.");
            }
        } catch (err) {
            console.error("Failed to send enquiry:", err);
            alert("An error occurred while sending your enquiry. Please check your connection.");
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setIsSuccess(false), 5000);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <section className="subpage-header">
                <FloatingOrbs />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="section-badge mb-6">Contact Us</span>
                            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight text-white leading-tight">
                                Let&apos;s Build the <span className="hero-gradient-text">Future</span> Together
                            </h1>
                            <p className="text-xl md:text-2xl text-white/70 mb-10 text-balance font-sans leading-relaxed">
                                Ready to accelerate your digital transformation? Reach out to our engineering experts.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>


            {/* Form Section - Now First for Maximum Prominence */}
            <section className="py-24 bg-background relative overflow-hidden">
                <div className="container mx-auto px-4 max-w-4xl relative z-10">
                    <div className="bg-white rounded-[40px] p-8 md:p-14 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] border border-slate-100 relative overflow-hidden">
                        {isSuccess ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-20 text-center h-full"
                            >
                                <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mb-8 border border-green-500/20">
                                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                                </div>
                                <h4 className="text-4xl font-bold mb-4 text-slate-900">Message Sent!</h4>
                                <p className="text-slate-500 font-sans text-xl max-w-md mx-auto">Thank you for reaching out. Our team will respond within 24 hours.</p>
                                <Button 
                                    onClick={() => setIsSuccess(false)}
                                    variant="outline" 
                                    className="mt-10 rounded-full border-slate-200 text-slate-600 hover:bg-slate-50"
                                >
                                    Send another message
                                </Button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-3">
                                        <label className="text-base font-bold text-slate-900 tracking-tight">Full Name *</label>
                                        <input
                                            {...register("name", { required: true })}
                                            className="w-full px-6 py-5 rounded-2xl border border-slate-200 bg-slate-50/30 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all font-sans text-lg text-slate-900 placeholder:text-slate-400"
                                            placeholder="John Doe"
                                        />
                                        {errors.name && <span className="text-xs text-red-500 font-sans ml-1">Full name is required</span>}
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-base font-bold text-slate-900 tracking-tight">Email *</label>
                                        <input
                                            {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                                            className="w-full px-6 py-5 rounded-2xl border border-slate-200 bg-slate-50/30 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all font-sans text-lg text-slate-900 placeholder:text-slate-400"
                                            placeholder="john@company.com"
                                        />
                                        {errors.email && <span className="text-xs text-red-500 font-sans ml-1">Valid email is required</span>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-3">
                                        <label className="text-base font-bold text-slate-900 tracking-tight">Mobile *</label>
                                        <input
                                            {...register("mobile", { required: true })}
                                            className="w-full px-6 py-5 rounded-2xl border border-slate-200 bg-slate-50/30 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all font-sans text-lg text-slate-900 placeholder:text-slate-400"
                                            placeholder="+91 ..."
                                        />
                                        {errors.mobile && <span className="text-xs text-red-500 font-sans ml-1">Mobile number is required</span>}
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-base font-bold text-slate-900 tracking-tight">Select Service</label>
                                        <div className="relative">
                                            <select
                                                {...register("service")}
                                                className="w-full px-6 py-5 rounded-2xl border border-slate-200 bg-slate-50/30 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all font-sans text-lg text-slate-900 appearance-none cursor-pointer"
                                            >
                                                <option value="IT Services">IT Services & Development</option>
                                                <option value="AI Solutions">AI Solutions</option>
                                                <option value="Staff Augmentation">Staff Augmentation</option>
                                                <option value="IT Maintenance">IT Maintenance</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                <ChevronDown className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-base font-bold text-slate-900 tracking-tight">Message *</label>
                                    <textarea
                                        {...register("message", { required: true, maxLength: 2000 })}
                                        className="w-full px-6 py-5 rounded-2xl border border-slate-200 bg-slate-50/30 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all font-sans text-lg text-slate-900 min-h-[220px] resize-none placeholder:text-slate-400"
                                        placeholder="Describe your project, timeline, or requirements..."
                                    />
                                    <div className="flex justify-between items-center mt-2 px-1">
                                        <div>
                                            {errors.message && <span className="text-xs text-red-500 font-sans">Message is required</span>}
                                        </div>
                                        <span className="text-sm font-sans font-medium text-slate-400">{message.length}/2000</span>
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="w-full py-6 rounded-2xl bg-primary hover:bg-primary-hover text-white font-bold text-xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-primary/20 active:scale-[0.99] disabled:opacity-70 group"
                                >
                                    {isSubmitting ? "Sending..." : "Submit Inquiry"}
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>


            {/* Contact Info Section - Now Below the Form */}
            <section className="section-padding bg-muted/30 relative overflow-hidden border-y border-border/50">
                <div className="container mx-auto px-4 max-w-6xl relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-6">Reach Us Directly</h2>
                        <p className="text-lg text-muted-foreground font-sans max-w-2xl mx-auto">
                            Prefer digital channels? Our team is available across various platforms to ensure we&apos;re always within reach.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { 
                                icon: MapPin, 
                                title: "Headquarters", 
                                content: "Bangalore, India", 
                                sub: "Global Engineering Hub",
                                action: { label: "View on Maps", href: "https://maps.google.com/?q=Bangalore,India" }
                            },
                            { 
                                icon: Phone, 
                                title: "Phone & WhatsApp", 
                                content: "+91 97411 56389", 
                                sub: "Mon-Fri, 9am - 6pm IST",
                                action: { label: "Chat Now", href: "https://wa.me/919741156389" }
                            },
                            { 
                                icon: Mail, 
                                title: "Email Support", 
                                content: "hello@tattvalogic.com", 
                                sub: "Typical response < 2 hours",
                                action: { label: "Email Us", href: "mailto:hello@tattvalogic.com" }
                            }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col p-8 rounded-3xl bg-white border border-slate-100 hover:border-primary/20 transition-all duration-300 group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowRight className="w-5 h-5 text-primary -rotate-45" />
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all duration-300 mb-6">
                                    <item.icon className="w-7 h-7" />
                                </div>
                                <div className="flex-grow">
                                    <h4 className="font-bold text-xl mb-1">{item.title}</h4>
                                    <p className="text-slate-600 font-sans text-lg mb-4">{item.content}</p>
                                    <div className="flex flex-col gap-2">
                                        <a 
                                            href={item.action.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-hover transition-colors"
                                        >
                                            {item.action.label}
                                            <ArrowRight className="w-4 h-4" />
                                        </a>
                                        {item.sub && <span className="text-[10px] text-muted-foreground/40 font-sans uppercase tracking-[0.2em] font-bold">{item.sub}</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-32 relative overflow-hidden bg-[#0a0a0c]">
                <div className="why-choose-pattern opacity-60" />
                <div className="cta-orb cta-orb-1 opacity-20" />
                <div className="cta-orb cta-orb-2 opacity-15" />
                
                <div className="container mx-auto px-4 max-w-4xl relative z-10">
                    <div className="text-center mb-16">
                        <span className="section-badge mb-6">Support FAQ</span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Common Questions</h2>
                        <p className="text-xl text-white/60 font-sans max-w-2xl mx-auto leading-relaxed">
                            Find quick answers to common enquiries about our specialized engineering process and engagement models.
                        </p>
                    </div>
                    <div className="grid gap-6">
                        {[
                            { 
                                q: "How quickly do you respond?", 
                                a: "Our support and sales teams typically respond within 2-4 business hours for all enquiries." 
                            },
                            { 
                                q: "Do you offer free proof-of-concepts?", 
                                a: "For enterprise-scale AI projects, we often conduct a discovery workshop and a limited pilot phase to prove value." 
                            },
                            { 
                                q: "Are you available for international projects?", 
                                a: "Absolutely. We are a global engineering hub with clients across North America, Europe, and the Middle East." 
                            },
                            { 
                                q: "What is your typical project engagement model?", 
                                a: "We offer Time & Material, Fixed-cost, and Dedicated Team models depending on project complexity and duration." 
                            }
                        ].map((item, i) => (
                            <div key={i} className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/10 hover:border-primary/40 hover:bg-white/[0.05] transition-all group backdrop-blur-sm">
                                <h4 className="text-xl font-bold mb-3 flex items-center gap-4 text-white">
                                    <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_12px_rgba(255,79,0,0.8)]" />
                                    {item.q}
                                </h4>
                                <p className="text-white/50 font-sans text-lg leading-relaxed pl-6 group-hover:text-white/70 transition-colors">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Engagement Process */}
            <section className="section-padding bg-background relative overflow-hidden border-y border-white/5">
                <div className="container mx-auto px-4 max-w-6xl relative z-10">
                    <div className="text-center mb-24">
                        <span className="section-badge mb-6">Our Methodology</span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">How We Work Together</h2>
                        <p className="text-xl text-muted-foreground font-sans max-w-2xl mx-auto leading-relaxed">
                            A transparent, results-driven process designed to move your project from concept to production-grade deployment.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        <div className="absolute top-[60px] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent hidden md:block" />
                        {[
                            { step: "01", title: "Discovery & Strategy", desc: "We dive deep into your requirements, target audience, and technical constraints.", bg: "bg-blue-500/10" },
                            { step: "02", title: "Architecture & Design", desc: "Our architects draft the blueprint for a scalable, high-performance ecosystem.", bg: "bg-primary/10" },
                            { step: "03", title: "Agile Development", desc: "Rapid sprints, continuous feedback loops, and production-ready code.", bg: "bg-green-500/10" }
                        ].map((item, i) => (
                            <div key={i} className="relative z-10 text-center space-y-8 group">
                                <div className={`w-28 h-28 rounded-[2rem] ${item.bg} border border-white/5 flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-500 relative`}>
                                    <div className="absolute inset-0 rounded-[2rem] bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span className="text-3xl font-black text-white/90 group-hover:text-primary transition-colors">{item.step}</span>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-bold">{item.title}</h3>
                                    <p className="text-muted-foreground font-sans leading-relaxed px-4">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tech Stack Marquee */}
            <div className="py-12 border-y border-white/5 bg-black/20 overflow-hidden">
                <div className="marquee-wrapper">
                    <div className="marquee-track">
                        {[
                            "React", "Next.js", "Python", "TensorFlow", "Node.js", "AWS",
                            "Kubernetes", "PostgreSQL", "LLMs", "TypeScript", "GraphQL", "Docker",
                        ].concat([
                            "React", "Next.js", "Python", "TensorFlow", "Node.js", "AWS",
                            "Kubernetes", "PostgreSQL", "LLMs", "TypeScript", "GraphQL", "Docker",
                        ]).map((item, i) => (
                            <span key={i} className="marquee-item text-white/40 font-bold tracking-widest uppercase flex items-center gap-3">
                                <Sparkles className="w-4 h-4 text-primary" />
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
