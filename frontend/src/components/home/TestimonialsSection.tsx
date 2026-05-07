"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

interface TestimonialsSectionProps {
    combinedTestimonials: any[];
    activeTestimonial: number;
    setActiveTestimonial: (i: number) => void;
    prevTestimonial: () => void;
    nextTestimonial: () => void;
    setIsPaused: (b: boolean) => void;
    fadeUp: any;
}

export default function TestimonialsSection({
    combinedTestimonials,
    activeTestimonial,
    setActiveTestimonial,
    prevTestimonial,
    nextTestimonial,
    setIsPaused,
    fadeUp
}: TestimonialsSectionProps) {
    return (
        <section className="py-28 bg-muted/20 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="text-center max-w-3xl mx-auto mb-16"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                >
                    <span className="section-badge">Testimonials</span>
                    <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-4">
                        What Our <span className="hero-gradient-text">Clients Say</span>
                    </h2>
                </motion.div>

                <div className="relative max-w-7xl mx-auto group/carousel">
                    {combinedTestimonials.length > 3 && (
                        <>
                            <button 
                                onClick={prevTestimonial}
                                className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white border border-zinc-100 shadow-lg text-zinc-400 hover:text-primary hover:scale-110 transition-all opacity-0 group-hover/carousel:opacity-100 hidden md:flex"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button 
                                onClick={nextTestimonial}
                                className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white border border-zinc-100 shadow-lg text-zinc-400 hover:text-primary hover:scale-110 transition-all opacity-0 group-hover/carousel:opacity-100 hidden md:flex"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </>
                    )}

                    <div 
                        className="overflow-hidden px-4"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        <motion.div 
                            className={`flex gap-6 ${combinedTestimonials.length <= 3 ? "justify-center" : ""}`}
                            animate={{ 
                                x: combinedTestimonials.length > 3 ? `calc(-${activeTestimonial * (100 / (typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3))}%)` : 0 
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            {combinedTestimonials.map((t: any, i: number) => {
                                const colors = ["from-blue-600 to-indigo-600", "from-purple-600 to-fuchsia-600", "from-emerald-600 to-teal-600"];
                                const color = t.color || colors[i % colors.length];
                                const avatar = t.clientName ? t.clientName.split(' ').map((n: string) => n[0]).join('').toUpperCase() : "?";
                                
                                const baseUrl = typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_API_URL || "/api").replace(/\/+$/, "").replace('/api', '') : "";
                                const imageUrl = t.clientImage ? (t.clientImage.startsWith('http') ? t.clientImage : `${baseUrl}${t.clientImage}`) : null;

                                return (
                                    <motion.div
                                        key={i}
                                        className={`testimonial-card shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] h-full flex flex-col ${activeTestimonial === i ? "testimonial-card-active border-primary/30 shadow-xl" : "border-zinc-100"}`}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        onClick={() => setActiveTestimonial(i)}
                                    >
                                        <Quote className="w-8 h-8 text-primary/30 mb-4" />
                                        <div className="flex mb-4">
                                            {Array.from({ length: t.rating || 5 }).map((_, s) => (
                                                <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                        <p className="text-foreground leading-relaxed mb-6 flex-grow font-medium text-lg italic">
                                            &ldquo;{t.testimonialText || t.quote}&rdquo;
                                        </p>
                                        <div className="flex items-center gap-3 mt-auto pt-6 border-t border-zinc-50">
                                            <div className={`testimonial-avatar relative overflow-hidden bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold shrink-0 shadow-inner`}>
                                                {imageUrl ? (
                                                    <img src={imageUrl} alt={t.clientName || t.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    avatar
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-foreground text-base tracking-tight">{t.clientName || t.name}</p>
                                                <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                                                    {t.clientDesignation || (t.title ? t.title.split(', ')[0] : "")}
                                                    { (t.companyName || (t.title && t.title.split(', ')[1])) ? `, ${t.companyName || t.title.split(', ')[1]}` : "" }
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>
                </div>

                <div className="flex justify-center gap-3 mt-12">
                    {combinedTestimonials.map((_: any, i: number) => (
                        <button
                            key={i}
                            aria-label={`View testimonial ${i + 1}`}
                            onClick={() => setActiveTestimonial(i)}
                            className="p-2 -m-2 flex items-center justify-center focus:outline-none group"
                        >
                            <div
                                className={`h-2 rounded-full transition-all duration-500 ${
                                    activeTestimonial === i ? "w-8 bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" : "w-2 bg-zinc-200 group-hover:bg-zinc-300"
                                }`}
                            />
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
