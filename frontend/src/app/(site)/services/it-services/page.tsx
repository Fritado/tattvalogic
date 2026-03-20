import React from "react";
import { CheckCircle2, Server, Globe, Smartphone, Cloud, Shield, Headphones, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Metadata } from "next";
import FloatingOrbs from "@/components/shared/FloatingOrbs";

export const metadata: Metadata = {
    title: "IT Services | TattvaLogic",
    description: "Modern software engineering and digital solutions designed for performance and scalability.",
};

export default function ITServicesPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="subpage-header">
                <FloatingOrbs />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="max-w-5xl mx-auto">
                        <span className="section-badge mb-6">Digital Excellence</span>
                        <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight text-white leading-tight md:whitespace-nowrap">
                            Modern <span className="hero-gradient-text">IT Services</span> & Solutions
                        </h1>
                        <p className="text-xl md:text-2xl text-white/70 mb-10 text-balance font-sans leading-relaxed">
                            End-to-end software engineering, website design, and application development to help enterprises modernize legacy systems and scale.
                        </p>
                        <Button size="lg" className="rounded-full px-10 py-7 text-lg group" asChild>
                            <Link href="/contact">
                                Start Your Project
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Services Breakdown */}
            <section className="section-padding bg-background relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10 max-w-6xl">
                    <div className="text-center mb-16">
                        <span className="section-badge mb-6">Our Core Offerings</span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Digital Products</h2>
                        <p className="text-xl text-muted-foreground font-sans max-w-2xl mx-auto">Scalable, performant, and secure solutions engineered for the modern web.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: "Website Design", desc: "Modern, responsive, and accessible websites designed for top-tier performance and global scalability.", icon: Globe },
                            { title: "App Development", desc: "Full-cycle custom web and mobile application engineering using React, Next.js, and modern cloud stacks.", icon: Smartphone },
                            { title: "Cloud Systems", desc: "AWS, Azure, and Google Cloud architecture design, migration, and management for enterprise solutions.", icon: Cloud },
                            { title: "Cyber Security", desc: "Comprehensive security audits, penetration testing, and compliance implementation (SOC2, HIPAA, GDPR).", icon: Shield },
                            { title: "24/7 Support", desc: "Dedicated helpdesk, system administration, and technical troubleshooting for your entire organization.", icon: Headphones },
                            { title: "Networks", desc: "Enterprise-grade network design, SD-WAN implementation, and secure remote access solutions.", icon: Server }
                        ].map((svc, i) => (
                            <div key={i} className="service-card group cursor-default">
                                <div className="p-8">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                                        <svc.icon className="w-6 h-6 text-primary group-hover:text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">{svc.title}</h3>
                                    <p className="text-muted-foreground font-sans leading-relaxed group-hover:text-foreground/80">{svc.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process & Benefits */}
            <section className="section-padding bg-background border-y border-border/50">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="section-badge mb-6">Partnership Benefits</span>
                            <h2 className="text-4xl font-bold mb-8">Why Work With Us?</h2>
                            <ul className="space-y-6">
                                {[
                                    "Cloud-native scalable architecture", 
                                    "Agile delivery methodologies", 
                                    "High security and compliance standards", 
                                    "Continuous integration and deployment (CI/CD)"
                                ].map((benefit, i) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <div className="mt-1 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                                        </div>
                                        <span className="text-lg font-sans text-muted-foreground">{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="glass-card p-10 border border-white/5">
                            <h3 className="text-2xl font-bold mb-8">Quick Support FAQ</h3>
                            <div className="space-y-8">
                                <div>
                                    <h4 className="font-bold text-lg mb-3">How long does development take?</h4>
                                    <p className="text-muted-foreground font-sans leading-relaxed">Typically 4–8 weeks depending on the complexity and integration requirements.</p>
                                </div>
                                <div className="h-px bg-white/5" />
                                <div>
                                    <h4 className="font-bold text-lg mb-3">Do you provide scalable architecture?</h4>
                                    <p className="text-muted-foreground font-sans leading-relaxed">Yes. All our systems are built from day one using modern cloud-native frameworks to ensure infinite scalability.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
