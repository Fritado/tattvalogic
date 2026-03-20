"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, delay: custom, ease: [0.22, 1, 0.36, 1] as any }
    })
};

const stagger = {
    visible: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function ReadyToBuild() {

    return (
        <section className="py-32 relative overflow-hidden cta-bg">
            <div className="cta-pattern" />
            <div className="cta-orb cta-orb-1" />
            <div className="cta-orb cta-orb-2" />
            <div className="container mx-auto px-4 relative z-10 text-center">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={stagger}
                    className="max-w-4xl mx-auto"
                >
                    <motion.div variants={fadeUp} custom={0}>
                        <span className="cta-badge">
                            Let&apos;s Build Together
                        </span>
                    </motion.div>
                    <motion.h2
                        className="text-5xl md:text-7xl font-bold mb-8 mt-6 text-white leading-tight"
                        variants={fadeUp}
                        custom={0.1}
                    >
                        Ready to Build the
                        <span className="text-primary"> Future?</span>
                    </motion.h2>
                    <motion.p
                        className="text-xl md:text-2xl mb-12 text-white/70 leading-relaxed"
                        variants={fadeUp}
                        custom={0.2}
                    >
                        Partner with TattvaLogic to architect, build, and scale your
                        next breakthrough product. Let&apos;s create something extraordinary together.
                    </motion.p>
                    <motion.div
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        variants={fadeUp}
                        custom={0.3}
                    >
                        <Link href="/contact" className="cta-button-primary group">
                            <span>Talk to Our Experts</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="/portfolio" className="cta-button-secondary">
                            View Our Work
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
