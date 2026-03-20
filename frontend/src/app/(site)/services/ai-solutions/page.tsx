import React from "react";
import { Brain, Sparkles, MessageSquare, LineChart, Network, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Metadata } from "next";
import FloatingOrbs from "@/components/shared/FloatingOrbs";

export const metadata: Metadata = {
    title: "AI Solutions | TattvaLogic",
    description: "Transform business operations using cutting-edge AI automation and machine learning.",
};

export default function AISolutionsPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="subpage-header">
                <FloatingOrbs />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="max-w-4xl mx-auto">
                        <span className="section-badge mb-6">Future-Ready Innovation</span>
                        <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight text-white leading-tight">
                            Enterprise <span className="hero-gradient-text">AI Solutions</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-white/70 mb-10 text-balance font-sans leading-relaxed">
                            Harness the power of Generative AI, Machine Learning, and intelligent automation to unlock unprecedented operational efficiency.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Button size="lg" className="rounded-full px-10 py-7 text-lg group" asChild>
                                <Link href="/contact">
                                    Engineer Your AI Solution
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Offerings Grid */}
            <section className="section-padding bg-background relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10 max-w-6xl">
                    <div className="text-center mb-16">
                        <span className="section-badge mb-6">Our Capabilities</span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Core AI Services</h2>
                        <p className="text-xl text-muted-foreground font-sans max-w-2xl mx-auto">End-to-end artificial intelligence engineering tailored to your specific industry challenges.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: "Generative AI", desc: "Custom LLM integration, fine-tuning, and RAG architectures to generate text, code, and insights autonomously.", icon: Sparkles },
                            { title: "Predictive ML", desc: "Custom predictive models fine-tuned on your proprietary data sets to forecast trends and customer behavior.", icon: Brain },
                            { title: "Conversational Agents", desc: "Intelligent virtual assistants integrated into your customer support and internal portals for 24/7 service.", icon: MessageSquare },
                            { title: "AI Intelligence", desc: "Deep analytics dashboards powered by natural language processing to converse directly with your raw data.", icon: LineChart },
                            { title: "Computer Vision", desc: "Automated image and video analysis for quality control, security, facial recognition, and medical imaging.", icon: Network },
                            { title: "Workflow Automation", desc: "Robotic Process Automation (RPA) combined with AI to eliminate repetitive manual data entry.", icon: Sparkles }
                        ].map((card, i) => (
                            <div key={i} className="service-card group cursor-default">
                                <div className="p-8">
                                    <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-6 border border-violet-500/20 group-hover:bg-violet-500 group-hover:border-violet-500 transition-all duration-300">
                                        <card.icon className="w-6 h-6 text-violet-500 group-hover:text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 group-hover:text-violet-400 transition-colors">{card.title}</h3>
                                    <p className="text-muted-foreground font-sans leading-relaxed group-hover:text-foreground/80">{card.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Assessment CTA */}
            <section className="section-padding bg-background relative overflow-hidden">
                <div className="absolute inset-0 bg-violet-600/5" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="max-w-4xl mx-auto glass-card p-12 md:p-16 border border-white/5">
                        <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                            Ready to find out where <span className="text-violet-400">AI</span> can save you money?
                        </h2>
                        <p className="text-xl text-muted-foreground font-sans mb-12 max-w-2xl mx-auto">
                            Book a free AI readiness assessment. Our architects will review your workflows and identify the highest ROI automation opportunities.
                        </p>
                        <Button size="lg" className="rounded-full px-10 py-7 text-lg bg-violet-600 hover:bg-violet-700 text-white group" asChild>
                            <Link href="/contact">
                                Get Free AI Assessment
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="section-padding bg-background border-t border-border/50">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-16">
                        <span className="section-badge mb-6">FAQ</span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Implementation Context</h2>
                        <p className="text-xl text-muted-foreground font-sans">Common questions about implementing AI in the enterprise.</p>
                    </div>

                    <div className="space-y-6">
                        {[
                            {
                                q: "Can AI integrate with my existing enterprise legacy systems?",
                                a: "Absolutely. Our AI solutions and intelligent agents are built to securely integrate directly with enterprise ERPs, CRMs, and custom platform APIs without disrupting your existing operations."
                            },
                            {
                                q: "Is our proprietary data secure when using Generative AI?",
                                a: "Yes. We implement strict data privacy controls. When building custom LLM solutions, we utilize private cloud environments (like Azure OpenAI or AWS Bedrock) ensuring your data is never used to train public models."
                            },
                            {
                                q: "How long does an AI implementation typically take?",
                                a: "Proof of Concepts (PoC) can usually be developed in 4–6 weeks. Full enterprise deployments vary based on complexity, integration requirements, and data readiness, typically ranging from 3 to 6 months."
                            },
                            {
                                q: "Do we need to clean our data before starting an AI project?",
                                a: "While clean data yields the best results, it's not a prerequisite to start. Part of our AI consulting involves data engineering, pipeline structuring, and cleansing to prepare your infrastructure for machine learning."
                            }
                        ].map((faq, i) => (
                            <div key={i} className="glass-card p-8 border border-white/5 hover:border-violet-500/20 transition-all duration-300">
                                <h4 className="font-bold text-xl mb-4 text-foreground">{faq.q}</h4>
                                <p className="text-muted-foreground font-sans text-lg leading-relaxed">
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
