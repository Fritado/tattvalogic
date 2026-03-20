import React from "react";
import { ShieldCheck, Activity, CloudFog, MonitorSmartphone, PenTool, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Metadata } from "next";
import FloatingOrbs from "@/components/shared/FloatingOrbs";

export const metadata: Metadata = {
    title: "IT Maintenance | TattvaLogic",
    description: "Reliable, secure, and always-on IT infrastructure support.",
};

export default function ITMaintenancePage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="subpage-header">
                <FloatingOrbs />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="max-w-5xl mx-auto">
                        <span className="section-badge mb-6">Enterprise Reliability</span>
                        <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight text-white leading-tight md:whitespace-nowrap">
                            Always-On, Secure <span className="hero-gradient-text">IT Maintenance</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-white/70 mb-10 text-balance font-sans leading-relaxed">
                            Proactive infrastructure monitoring, advanced security posture management, and 24/7 reliability for your critical digital assets.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Button size="lg" className="rounded-full px-10 py-7 text-lg group" asChild>
                                <Link href="/contact">
                                    Get a Support Plan
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
                        <span className="section-badge mb-6">Our Services</span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Comprehensive Support</h2>
                        <p className="text-xl text-muted-foreground font-sans max-w-2xl mx-auto">Everything you need to keep your systems fast, secure, and always online.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: "Infrastructure Monitoring", desc: "Active surveillance of cloud servers, databases, and networks to detect anomalies instantly.", icon: Activity },
                            { title: "System Patching", desc: "Routine health checks, automated zero-day patching, and seamless OS upgrades.", icon: PenTool },
                            { title: "Security Management", desc: "Continuous vulnerability scanning, WAF implementation, and enterprise-grade DDoS protection.", icon: ShieldCheck },
                            { title: "DevOps & CI/CD", desc: "Maintenance of deployment pipelines, automated testing suites, and dynamic cloud scaling.", icon: CloudFog },
                            { title: "Disaster Recovery", desc: "Automated daily backups, failover architecture design, and rapid data restoration protocols.", icon: MonitorSmartphone },
                            { title: "Legacy Modernization", desc: "Gradual refactoring of technical debt and updating legacy codebases to modern standards.", icon: Activity }
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

            {/* Why Proactive? */}
            <section className="section-padding why-choose-bg relative overflow-hidden">
                <div className="why-choose-pattern opacity-40" />
                <div className="container mx-auto px-4 relative z-10 max-w-5xl text-center">
                    <span className="section-badge-dark mb-6">Efficiency First</span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-16 text-white leading-tight">Why Choose <span className="hero-gradient-text">Proactive</span> Maintenance?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        {[
                            { title: "Zero Silent Failures", desc: "We detect and resolve database bottlenecks and API timeouts before your users ever notice a problem.", color: "primary" },
                            { title: "Predictable Costs", desc: "Avoid massive emergency repair bills. Our flat-rate maintenance plans keep your IT budget completely predictable.", color: "blue-500" },
                            { title: "Compliance Maintained", desc: "We ensure your infrastructure continuously meets SOC2, HIPAA, and GDPR regulatory requirements.", color: "green-500" }
                        ].map((item, i) => (
                            <div key={i} className="glass-card p-10 border border-white/5 hover:border-primary/30 transition-all duration-500 group">
                                <h4 className={`text-xl font-bold mb-4 text-white group-hover:text-primary transition-colors`}>{item.title}</h4>
                                <p className="text-white/60 font-sans leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="section-padding bg-background border-t border-border/50">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-16">
                        <span className="section-badge mb-6">FAQ</span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Support Agreements</h2>
                        <p className="text-xl text-muted-foreground font-sans">Common questions about our IT maintenance services.</p>
                    </div>

                    <div className="space-y-6">
                        {[
                            {
                                q: "What is your typical SLA (Service Level Agreement) response time?",
                                a: "For critical SEV-1 incidents (full system outages), our response time is under 15 minutes, 24/7/365. For standard maintenance requests, we respond within 4 hours during business days."
                            },
                            {
                                q: "Do you support legacy on-premise servers?",
                                a: "While our expertise lies in cloud-native infrastructure (AWS, Azure, GCP), we do offer hybrid support plans that cover legacy on-premise hardware during your transition to the cloud."
                            },
                            {
                                q: "How do you handle zero-day vulnerabilities?",
                                a: "Our security team continuously monitors global CVE databases. When a zero-day vulnerability affecting your stack is announced, we immediately deploy temporary WAF rules and apply official patches as soon as they are released."
                            },
                            {
                                q: "Can we use your maintenance services for an app you didn't build?",
                                a: "Yes. We begin with a comprehensive technical audit of your existing codebase and infrastructure to document the architecture and identify any immediate technical debt before taking over maintenance."
                            }
                        ].map((faq, i) => (
                            <div key={i} className="glass-card p-8 border border-white/5 hover:border-primary/20 transition-all duration-300">
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
