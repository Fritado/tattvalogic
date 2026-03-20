"use client";

import React from "react";
import { Metadata } from "next";
import FloatingOrbs from "@/components/shared/FloatingOrbs";
import { motion } from "framer-motion";

export default function PrivacyPolicyPage() {
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
                                Privacy <span className="hero-gradient-text">Policy</span>
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
                            At TattvaLogic, we are committed to protecting your privacy and ensuring the security of your personal and enterprise data. This Privacy Policy outlines how we collect, use, and safeguard your information when you interact with our website, services, and AI products.
                        </p>

                        <div className="space-y-12">
                            <article>
                                <h2 className="text-2xl font-bold text-foreground mb-6">1. Information We Collect</h2>
                                <p className="mb-4">We collect information to provide better services to our enterprise clients. This includes:</p>
                                <ul className="list-disc pl-6 space-y-3">
                                    <li><strong className="text-foreground">Contact Information:</strong> Name, email address, phone number, and company details when you request a demo or fill out a form.</li>
                                    <li><strong className="text-foreground">Usage Data:</strong> Information about IP addresses, browser types, and navigation paths.</li>
                                    <li><strong className="text-foreground">Service Data:</strong> Data processed on your behalf governed by specific service agreements and NDAs.</li>
                                </ul>
                            </article>

                            <article>
                                <h2 className="text-2xl font-bold text-foreground mb-6">2. How We Use Your Information</h2>
                                <p className="mb-4">We use the collected information for the following purposes:</p>
                                <ul className="list-disc pl-6 space-y-3 text-muted-foreground/80">
                                    <li>To provide, operate, and maintain our IT consulting and SaaS services.</li>
                                    <li>To improve, personalize, and expand our platform offerings.</li>
                                    <li>To communicate with you for customer service, updates, and marketing.</li>
                                    <li>To find and prevent fraud and improve platform security.</li>
                                </ul>
                            </article>

                            <article>
                                <h2 className="text-2xl font-bold text-white mb-6">3. AI & Data Processing</h2>
                                <p>
                                    As a provider of enterprise AI Solutions, TattvaLogic adheres to strict data isolation protocols. When implementing custom LLMs or RAG architectures, client data is <strong className="text-primary italic">never</strong> used to train public models. All AI workloads are processed in secure, private cloud environments.
                                </p>
                            </article>

                            <article>
                                <h2 className="text-2xl font-bold text-white mb-6">4. Data Security</h2>
                                <p>
                                    We implement a variety of security measures including encryption and firewalls to maintain the safety of your information. However, no method of transmission over the Internet is 100% secure.
                                </p>
                            </article>
                        </div>

                        <div className="mt-20 p-10 bg-white/5 rounded-3xl border border-white/5">
                            <h2 className="text-2xl font-bold text-white mb-4">5. Contact Us</h2>
                            <p className="mb-6">
                                If you have any questions or concerns about this Privacy Policy, please contact our data protection team:
                            </p>
                            <a
                                href="mailto:support@tattvalogic.com"
                                className="text-xl font-bold text-primary hover:text-primary/80 transition-colors"
                            >
                                support@tattvalogic.com
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
