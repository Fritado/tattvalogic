"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface ProductsSectionProps {
    fadeUp: any;
}

export default function ProductsSection({ fadeUp }: ProductsSectionProps) {
    return (
        <section className="py-28 bg-background relative overflow-hidden">
            <div className="absolute inset-0 products-bg pointer-events-none" />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    className="text-center max-w-3xl mx-auto mb-20"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                >
                    <span className="section-badge">Our Products</span>
                    <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
                        Proprietary SaaS
                        <span className="hero-gradient-text"> Platforms</span>
                    </h2>
                    <p className="text-xl text-muted-foreground">
                        Battle-tested products accelerating businesses worldwide.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Fritado */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
                        className="product-card product-fritado group"
                    >
                        <div className="product-glow product-glow-blue" />
                        <div className="relative z-10 flex flex-col h-full p-10 lg:p-12">
                            <div className="flex items-start justify-between mb-8">
                                <div>
                                    <span className="inline-block py-1 px-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold tracking-widest uppercase mb-4">
                                        Marketing Platform
                                    </span>
                                    <h3 className="text-5xl font-bold text-foreground">Fritado</h3>
                                </div>
                                <div className="product-badge bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
                                    SaaS
                                </div>
                            </div>

                            <p className="text-lg text-muted-foreground mb-8 flex-grow leading-relaxed">
                                AI-powered marketing automation platform — generate qualified leads,
                                optimize campaigns with machine learning, and scale digital growth effortlessly.
                            </p>

                            <div className="grid grid-cols-3 gap-4 mb-8">
                                {["Lead Gen", "AI Content", "Analytics"].map((f, i) => (
                                    <div key={i} className="product-feature-chip bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                                        {f}
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link href="/products/fritado" className="product-btn-primary bg-blue-600 hover:bg-blue-700">
                                    Explore Fritado
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <a href="https://fritado.com" target="_blank" rel="noopener noreferrer" className="product-btn-secondary">
                                    Visit Website
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    {/* Critical Buzzer */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
                        className="product-card product-buzzer group"
                    >
                        <div className="product-glow product-glow-red" />
                        <div className="relative z-10 flex flex-col h-full p-10 lg:p-12">
                            <div className="flex items-start justify-between mb-8">
                                <div>
                                    <span className="inline-block py-1 px-3 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-bold tracking-widest uppercase mb-4">
                                        Operations Platform
                                    </span>
                                    <h3 className="text-4xl font-bold text-foreground leading-tight whitespace-nowrap">Critical Buzzer</h3>
                                </div>
                                <div className="product-badge bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
                                    SaaS
                                </div>
                            </div>

                            <p className="text-lg text-muted-foreground mb-8 flex-grow leading-relaxed">
                                Smart alerting and incident management for mission-critical operations.
                                Detect anomalies instantly, auto-escalate, and resolve before customers notice.
                            </p>

                            <div className="grid grid-cols-3 gap-4 mb-8">
                                {["Alerting", "Monitoring", "Incident Mgmt"].map((f, i) => (
                                    <div key={i} className="product-feature-chip bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">
                                        {f}
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link href="/products/critical-buzzer" className="product-btn-primary bg-red-600 hover:bg-red-700 whitespace-nowrap">
                                    Explore Critical Buzzer
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <a href="https://criticalbuzzer.com" target="_blank" rel="noopener noreferrer" className="product-btn-secondary">
                                    Visit Website
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
