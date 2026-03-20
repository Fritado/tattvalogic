"use client";

import React from "react";
import FloatingOrbs from "@/components/shared/FloatingOrbs";
import { motion } from "framer-motion";

export default function TermsOfServicePage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
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
                            <span className="section-badge mb-6">Legal</span>
                            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight text-white leading-tight">
                                Terms of <span className="hero-gradient-text">Service</span>
                            </h1>
                            <p className="text-xl text-white/70 font-sans leading-relaxed">
                                Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="section-padding bg-background relative overflow-hidden">
                <div className="container mx-auto px-4 max-w-4xl relative z-10">
                    <div className="glass-card p-12 md:p-16 border border-border/50 font-sans leading-relaxed text-muted-foreground">
                        <p className="text-xl font-medium text-foreground mb-12 leading-relaxed border-l-4 border-primary pl-6">
                            By accessing or using TattvaLogic&apos;s website, services, and AI products, you agree to be bound by these Terms of Service. Please read them carefully.
                        </p>

                        <div className="space-y-12">
                            <article>
                                <h2 className="text-2xl font-bold text-foreground mb-6">1. Usage Rights</h2>
                                <p className="mb-4">TattvaLogic grants you a limited, non-exclusive, non-transferable license to access and use our platform for your internal business purposes.</p>
                                <ul className="list-disc pl-6 space-y-3">
                                    <li>You must not reverse-engineer any part of our AI architectures.</li>
                                    <li>You must not use our services for any illegal or unauthorized purpose.</li>
                                    <li>You are responsible for maintaining the security of your account credentials.</li>
                                </ul>
                            </article>

                            <article>
                                <h2 className="text-2xl font-bold text-foreground mb-6">2. Intellectual Property</h2>
                                <p className="mb-4">All content, including source code, AI models, design elements, and logos, is the property of TattvaLogic or its licensors.</p>
                                <p>
                                    Client data remains the property of the client. Any custom AI integration built for a client follows the intellectual property terms defined in the specific service agreement.
                                </p>
                            </article>

                            <article>
                                <h2 className="text-2xl font-bold text-foreground mb-6">3. Limitation of Liability</h2>
                                <p>
                                    To the maximum extent permitted by law, TattvaLogic shall not be liable for any indirect, incidental, or consequential damages resulting from your use of our services. Our services are provided &quot;as is&quot; without any warranties.
                                </p>
                            </article>
                        </div>

                        <div className="mt-20 p-10 bg-primary/5 rounded-3xl border border-primary/10 text-center">
                            <p className="mb-6">
                                For full legal inquiries or partner agreements, please contact:
                            </p>
                            <a
                                href="mailto:legal@tattvalogic.com"
                                className="text-xl font-bold text-primary hover:text-primary/80 transition-colors"
                            >
                                legal@tattvalogic.com
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
