import React from "react";
import { CheckCircle2, Workflow, Briefcase, Zap, UserPlus, ArrowRight, Search, FileText, Code, Terminal, MessageSquare, UserCheck, Rocket } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Metadata } from "next";
import FloatingOrbs from "@/components/shared/FloatingOrbs";

export const metadata: Metadata = {
    title: "Staff Augmentation | TattvaLogic",
    description: "Access top technology talent on demand to scale your engineering teams gracefully.",
};

export default function StaffAugmentationPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="subpage-header">
                <FloatingOrbs />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="max-w-4xl mx-auto">
                        <span className="section-badge mb-6">Talent Solutions</span>
                        <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight text-white leading-tight">
                            Elite <span className="hero-gradient-text">Engineering</span> Talent
                        </h1>
                        <p className="text-xl md:text-2xl text-white/70 mb-10 text-balance font-sans leading-relaxed">
                            Seamlessly scale your engineering capacity by accessing our vetted network of global technology talent.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Button size="lg" className="rounded-full px-10 py-7 text-lg group" asChild>
                                <Link href="/contact">
                                    Hire Developers Now
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Comprehensive Services Grid */}
            <section className="section-padding bg-background relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10 max-w-6xl">
                    <div className="text-center mb-16">
                        <span className="section-badge mb-6">Engagement Models</span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Flexible Staffing</h2>
                        <p className="text-xl text-muted-foreground font-sans max-w-2xl mx-auto">We tailor our solutions to perfectly match your project lifecycle and budget.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: "Dedicated AI Teams", desc: "Instantly deploy pods of ML engineers and Data Scientists to accelerate your AI adoption.", icon: Zap },
                            { title: "Managed Services", desc: "End-to-end product development where we take full ownership of the technical delivery.", icon: Workflow },
                            { title: "CTO Consulting", desc: "Access fractional CTOs and enterprise architects for strategy and system design reviews.", icon: Briefcase },
                            { title: "Contract to Hire", desc: "Evaluate top engineers on the job with a flexible contracting period before permanent hire.", icon: UserPlus },
                            { title: "Direct Placement", desc: "Permanent placement of elite technical talent sourced specifically for your company.", icon: CheckCircle2 },
                            { title: "Staff Augmentation", desc: "Integrate senior engineers directly into your agile workflows to speed up releases.", icon: Zap }
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
            {/* Talent Screening & Hiring Process Section */}
            <section className="section-padding bg-muted/30 relative overflow-hidden border-t border-border/50">
                <div className="container mx-auto px-4 relative z-10 max-w-6xl">
                    <div className="text-center mb-20">
                        <span className="section-badge mb-6">Quality Assurance</span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Talent Screening & Hiring Process</h2>
                        <p className="text-xl text-muted-foreground font-sans max-w-3xl mx-auto">
                            We follow a rigorous multi-stage evaluation process to ensure every candidate we recommend meets the highest standards of technical expertise and professionalism.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                step: "01",
                                title: "Talent Sourcing",
                                desc: "We source highly qualified professionals through our global talent network, industry platforms, and targeted recruitment channels.",
                                icon: Search
                            },
                            {
                                step: "02",
                                title: "Resume & Screening",
                                desc: "Our recruitment specialists carefully review each candidate's professional experience, technical stack, and project background to ensure alignment.",
                                icon: FileText
                            },
                            {
                                step: "03",
                                title: "Technical Assessment",
                                desc: "Candidates must complete online technical tests evaluating coding ability, problem solving, and real-world scenarios.",
                                icon: Code
                            },
                            {
                                step: "04",
                                title: "Technical Interview",
                                desc: "Our senior engineers conduct deep interviews to assess system design knowledge, practical experience, and code quality.",
                                icon: Terminal
                            },
                            {
                                step: "05",
                                title: "Culture Fit",
                                desc: "Candidates are evaluated for communication skills, collaboration ability, and professional mindset for seamless integration.",
                                icon: MessageSquare
                            },
                            {
                                step: "06",
                                title: "Client Interview",
                                desc: "Only the top candidates are presented to clients for final interviews and project alignment for total transparency.",
                                icon: UserCheck
                            },
                            {
                                step: "07",
                                title: "Seamless Onboarding",
                                desc: "Once selected, we ensure fast onboarding and smooth integration into the client's team and existing local workflows.",
                                icon: Rocket
                            }
                        ].map((item, i) => (
                            <div key={i} className={`service-card group cursor-default ${i === 6 ? 'lg:col-span-1 md:col-span-2 lg:translate-x-0' : ''}`}>
                                <div className="p-8 h-full flex flex-col">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                                            <item.icon className="w-7 h-7 text-primary group-hover:text-white" />
                                        </div>
                                        <span className="text-4xl font-black text-primary/5 group-hover:text-primary/10 transition-colors uppercase italic">{item.step}</span>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">{item.title}</h3>
                                    <p className="text-muted-foreground font-sans leading-relaxed flex-grow">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="section-padding bg-background border-y border-border/50">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="section-badge mb-6">Top 1% Talent</span>
                            <h2 className="text-4xl md:text-5xl font-bold mb-8">Engineering Excellence</h2>
                            <p className="text-lg text-muted-foreground font-sans mb-10 leading-relaxed">
                                We don't just find resumes. We technically vet every single engineer through rigorous live coding interviews, architectural discussions, and soft-skills assessments.
                            </p>
                            <ul className="space-y-6">
                                {[
                                    "Rigorous 4-stage technical vetting process",
                                    "Senior-level expertise in modern cloud and AI stacks",
                                    "Seamless cultural fit and communication skills",
                                    "Immediate availability for critical projects"
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

                        <div className="glass-card p-10 border border-white/5 bg-gradient-to-br from-white/5 to-transparent">
                            <h3 className="text-2xl font-bold mb-8">Hiring FAQ</h3>
                            <div className="space-y-8">
                                <div>
                                    <h4 className="font-bold text-lg mb-3">How quickly can resources deploy?</h4>
                                    <p className="text-muted-foreground font-sans leading-relaxed">Typically within 1–2 weeks, depending on the specialization and seniority required.</p>
                                </div>
                                <div className="h-px bg-white/5" />
                                <div>
                                    <h4 className="font-bold text-lg mb-3">What are your top skillsets?</h4>
                                    <p className="text-muted-foreground font-sans leading-relaxed">Our network specializes in Generative AI, React, Next.js, Python, AWS, and advanced DevOps practices.</p>
                                </div>
                                <div className="h-px bg-white/5" />
                                <div>
                                    <h4 className="font-bold text-lg mb-3">Risk-free trial period?</h4>
                                    <p className="text-muted-foreground font-sans leading-relaxed">We offer a 2-week trial. If you aren't satisfied, we'll replace the resource immediately at no cost.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
