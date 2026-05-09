"use client";

import React, { useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { Quote, Star } from "lucide-react";

interface TestimonialsSectionProps {
    combinedTestimonials: any[];
    fadeUp: any;
}

export default function TestimonialsSection({
    combinedTestimonials,
    fadeUp
}: TestimonialsSectionProps) {
    const [isPaused, setIsPaused] = useState(false);

    // Triplicate testimonials to ensure seamless loop with no gaps
    const marqueeTestimonials = [...combinedTestimonials, ...combinedTestimonials, ...combinedTestimonials];

    return (
        <section className="py-28 bg-muted/20 overflow-hidden relative">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <motion.div
                    className="text-center max-w-3xl mx-auto"
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
            </div>

            <div 
                className="relative w-full overflow-hidden"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Gradient Masks for smooth fade in/out */}
                <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-muted/50 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-muted/50 to-transparent z-10 pointer-events-none" />

                <motion.div 
                    className="flex gap-6 px-6 w-max"
                    animate={{ 
                        x: isPaused ? undefined : ["0%", "-33.33%"] 
                    }}
                    transition={{ 
                        duration: 30,
                        ease: "linear",
                        repeat: Infinity,
                        repeatType: "loop"
                    }}
                >
                    {marqueeTestimonials.map((t: any, i: number) => {
                        const colors = ["from-blue-600 to-indigo-600", "from-purple-600 to-fuchsia-600", "from-emerald-600 to-teal-600"];
                        const color = t.color || colors[i % colors.length];
                        const avatar = t.clientName ? t.clientName.split(' ').map((n: string) => n[0]).join('').toUpperCase() : "?";
                        
                        const baseUrl = typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_API_URL || "/api").replace(/\/+$/, "").replace('/api', '') : "";
                        const imageUrl = t.clientImage ? (t.clientImage.startsWith('http') ? t.clientImage : `${baseUrl}${t.clientImage}`) : null;

                        return (
                            <div
                                key={`${t.id || i}-${i}`}
                                className="testimonial-card shrink-0 w-[85vw] md:w-[450px] border-zinc-100 flex flex-col hover:border-primary/30 transition-all duration-300"
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
                                        <span className="absolute inset-0 flex items-center justify-center">{avatar}</span>
                                        {imageUrl && (
                                            <img 
                                                src={imageUrl} 
                                                alt={t.clientName || t.name} 
                                                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.opacity = '0';
                                                }}
                                            />
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
                            </div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
