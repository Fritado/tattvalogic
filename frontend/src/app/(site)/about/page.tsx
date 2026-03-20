import React from "react";
import { ArrowRight, Target, Lightbulb, Users, User, CheckCircle2, Linkedin, Zap, Brain, Rocket, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Metadata } from "next";
import FloatingOrbs from "@/components/shared/FloatingOrbs";

export const metadata: Metadata = {
  title: "About Us | Top AI & Digital Innovation Company",
  description: "Learn about TattvaLogic's mission, values, and expert team. We are a premier technology partner delivering intelligent digital ecosystems and enterprise IT services globally.",
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About TattvaLogic - Top AI Innovation Company',
    description: 'Learn about our mission, values, and expert team. We build intelligent digital ecosystems and enterprise IT services globally.',
    url: 'https://tattvalogic.com/about',
  }
};

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="subpage-header">
                <FloatingOrbs />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="max-w-5xl mx-auto">
                        <span className="section-badge mb-6">About TattvaLogic</span>
                        <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight text-white leading-tight md:whitespace-nowrap">
                            Building the <span className="hero-gradient-text">Future</span> of Intelligence
                        </h1>
                        <p className="text-xl md:text-2xl text-white/70 mb-10 text-balance font-sans leading-relaxed">
                            TattvaLogic is a premiere technology partner focused on building intelligent digital ecosystems using advanced AI and modern engineering.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="section-padding bg-background relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10 max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="service-card group">
                            <div className="p-10 flex flex-col h-full">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 border border-primary/20">
                                    <Target className="w-7 h-7 text-primary" />
                                </div>
                                <h2 className="text-3xl font-bold mb-6 text-foreground group-hover:text-primary transition-colors">Our Mission</h2>
                                <p className="text-lg text-muted-foreground font-sans leading-relaxed">
                                    To empower organizations with intelligent technology solutions that drive efficiency, scalability, and long-term business value. We believe in engineering excellence over everything.
                                </p>
                            </div>
                        </div>

                        <div className="service-card group">
                            <div className="p-10 flex flex-col h-full">
                                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-8 border border-blue-500/20">
                                    <Lightbulb className="w-7 h-7 text-blue-500" />
                                </div>
                                <h2 className="text-3xl font-bold mb-6 text-foreground group-hover:text-blue-500 transition-colors">Our Vision</h2>
                                <p className="text-lg text-muted-foreground font-sans leading-relaxed">
                                    To become a global leader in AI-powered digital transformation, recognized for our ability to solve the most complex technical challenges faced by modern enterprises.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="section-padding why-choose-bg relative overflow-hidden">
                <div className="why-choose-pattern opacity-40" />
                <div className="container mx-auto px-4 relative z-10 max-w-6xl text-center">
                    <span className="section-badge-dark mb-6">Our DNA</span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-20 text-white">Our Core Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { title: "Client Partnership", desc: "We act as an extension of your team, deeply aligning with your business goals.", icon: Users },
                            { title: "Continuous Innovation", desc: "We constantly adopt cutting-edge paradigm shifts, like GenAI, to keep you ahead.", icon: Lightbulb },
                            { title: "Engineering Excellence", desc: "We write clean, scalable, and maintainable code built for the enterprise.", icon: Target }
                        ].map((val, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 rotate-3 hover:rotate-0 transition-transform duration-300">
                                    <val.icon className="w-10 h-10 text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">{val.title}</h3>
                                <p className="text-gray-400 font-sans leading-relaxed">{val.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* AI R&D Department */}
            <section className="py-24 bg-violet-50 dark:bg-violet-950/20">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="inline-block px-4 py-1 rounded-full bg-violet-200 text-violet-800 font-bold uppercase tracking-wider mb-6 text-sm">
                                Innovation Hub
                            </span>
                            <h2 className="text-4xl font-bold mb-6">AI Research & Development</h2>
                            <p className="text-lg text-muted-foreground font-sans mb-6 leading-relaxed">
                                At TattvaLogic, we don't just use AI—we actively evolve how it is implemented and integrated across enterprise infrastructures. Our dedicated R&D department acts as an incubator for next-generation intelligence.
                            </p>
                            <ul className="space-y-4 mb-8">
                                {[
                                    "Exploring advanced RAG architectures and vector databases.",
                                    "Benchmarking open-source vs proprietary LLM performance.",
                                    "Developing autonomous multi-agent operational frameworks.",
                                    "Creating secure AI wrappers for sensitive enterprise data."
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <ArrowRight className="w-5 h-5 text-violet-600 shrink-0 mt-1" />
                                        <span className="text-lg font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <Button size="lg" className="rounded-full bg-violet-600 hover:bg-violet-700 text-white" asChild>
                                <Link href="/services/ai-solutions">Explore Our AI Offerings</Link>
                            </Button>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-3xl transform rotate-3 scale-105 opacity-20 blur-lg"></div>
                            <div className="bg-white dark:bg-zinc-900 border border-violet-100 dark:border-violet-900/30 p-8 rounded-3xl shadow-xl relative z-10 glass">
                                <Lightbulb className="w-16 h-16 text-violet-600 mb-6" />
                                <h3 className="text-2xl font-bold mb-4">Shaping the Future</h3>
                                <p className="text-muted-foreground font-sans text-lg italic">
                                    "Our R&D team ensures that when a new AI breakthrough happens, our clients are already positioned to integrate it flawlessly into their workflows."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Engagement Model Section */}
            <section className="section-padding bg-muted/30 relative overflow-hidden border-y border-border/50">
                <div className="container mx-auto px-4 relative z-10 max-w-6xl">
                    <div className="text-center mb-20">
                        <span className="section-badge mb-6">How We Work</span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Engagement Process</h2>
                        <p className="text-xl text-muted-foreground font-sans max-w-3xl mx-auto">
                            We follow a streamlined, outcome-driven methodology to ensure your projects move from concept to reality with precision and speed.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { step: "01", title: "Free Consultation", desc: "We dive deep into your business goals, technical challenges, and project requirements.", icon: MessageSquare },
                            { step: "02", title: "Strategic Planning", desc: "Our architects design a comprehensive roadmap, tech stack, and resource allocation plan.", icon: Target },
                            { step: "03", title: "Agile Engineering", desc: "Rapid, iterative development cycles with full transparency and weekly progress demos.", icon: Rocket },
                            { step: "04", title: "Scale & Succeed", desc: "Launch with confidence and scale your solution with our ongoing support and insights.", icon: Zap }
                        ].map((item, i) => (
                            <div key={i} className="service-card group cursor-default">
                                <div className="p-8 h-full flex flex-col">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                                            <item.icon className="w-7 h-7 text-primary group-hover:text-white" />
                                        </div>
                                        <span className="text-4xl font-black text-primary/5 group-hover:text-primary/10 transition-colors italic tracking-tighter">{item.step}</span>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">{item.title}</h3>
                                    <p className="text-muted-foreground font-sans leading-relaxed text-sm flex-grow">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Core Leadership Team */}
            <section className="section-padding bg-background">
                <div className="container mx-auto px-4 max-w-6xl text-center">
                    <span className="section-badge mb-6">The Experts</span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Meet the Core Team</h2>
                    <p className="text-xl text-muted-foreground font-sans mb-20 max-w-2xl mx-auto">The pioneers driving engineering and AI excellence at TattvaLogic.</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            {
                                name: "Banhidipa Mallik",
                                role: ["Director", "Fritado - Brand Vision & Growth Strategy"],
                                image: "/Banhidipa-mallik.jpeg",
                                linkedin: "https://www.linkedin.com/in/banhidipa-mallik-07949a93/"
                            },
                            {
                                name: "Salan Khalkho",
                                role: ["Director", "Critical Buzzer - AI Transformation & Automation"],
                                image: "/salan-khalkho.jpeg",
                                linkedin: "https://www.linkedin.com/in/salankhalkho/"
                            },
                            {
                                name: "Saswati Ray",
                                role: ["Director", "Tattvalogic - Customer Success"],
                                image: "/Saswati-ray.jpeg",
                                linkedin: "https://www.linkedin.com/in/saswati-ray-744447149/"
                            }
                        ].map((member, i) => (
                            <div key={i} className="group flex flex-col items-center">
                                <div className="relative w-56 h-56 mb-8">
                                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-muted/50 group-hover:border-primary transition-all duration-500 shadow-xl">
                                        <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
                                <div className="flex flex-col items-center gap-1 mb-6 text-center">
                                    <span className="text-primary font-bold tracking-wide uppercase text-xs">{member.role[0]}</span>
                                    <span className="text-muted-foreground font-semibold text-xs tracking-wide">{member.role[1]}</span>
                                </div>
                                <a
                                    href={member.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-primary transition-all gap-2 border border-border rounded-full px-6 py-2 hover:border-primary hover:bg-primary/5 group"
                                >
                                    <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                                    View Profile
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
