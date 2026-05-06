"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, type LucideIcon } from "lucide-react";

interface Service {
    title: string;
    desc: string;
    icon: LucideIcon;
    link: string;
    gradient: string;
    iconBg: string;
    iconColor: string;
}

interface ServicesSectionProps {
    services: Service[];
    fadeUp: any;
    stagger: any;
}

export default function ServicesSection({ services, fadeUp, stagger }: ServicesSectionProps) {
    return (
        <section id="capabilities" className="py-28 bg-muted/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="text-center max-w-3xl mx-auto mb-20"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    variants={fadeUp}
                >
                    <span className="section-badge">Our Services</span>
                    <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
                        Comprehensive Technology
                        <span className="hero-gradient-text"> Expertise</span>
                    </h2>
                    <p className="text-xl text-muted-foreground">
                        End-to-end technology services designed to modernize, scale, and future-proof your business.
                    </p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    variants={stagger}
                >
                    {services.map((svc, i) => (
                        <motion.div key={i} variants={fadeUp} custom={i * 0.1}>
                            <Link href={svc.link} className="service-card group block h-full">
                                <div className={`absolute inset-0 bg-gradient-to-br ${svc.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
                                <div className="relative z-10 flex flex-col h-full p-7">
                                    <div className={`service-icon-wrap ${svc.iconBg} mb-5`}>
                                        <svc.icon className={`w-6 h-6 ${svc.iconColor}`} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                                        {svc.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed flex-grow">
                                        {svc.desc}
                                    </p>
                                    <div className="flex items-center gap-2 mt-6 text-sm font-semibold text-primary">
                                        Learn more
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="mt-12 text-center">
                    <Link href="/services" className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-border hover:border-primary/50 hover:text-primary transition-all text-sm font-semibold group">
                        View All Services
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
