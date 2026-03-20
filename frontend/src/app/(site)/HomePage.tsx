"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, useMotionValue, useSpring, animate } from "framer-motion";
import {
  ArrowRight, Code2, BrainCircuit, Users, ShieldCheck,
  CheckCircle2, Sparkles, Zap, Globe2, TrendingUp,
  Star, Quote, ChevronRight, Play
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import HeroCarousel from "@/components/shared/HeroCarousel";
import FloatingOrbs from "@/components/shared/FloatingOrbs";


/* ─────────────────────────────────────────────── */
/*  Animation Variants                            */
/* ─────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1] as any, delay }
  })
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, delay }
  })
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } }
};

/* ─────────────────────────────────────────────── */
/*  Animated Counter                              */
/* ─────────────────────────────────────────────── */
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 60, damping: 18 });

  useEffect(() => {
    if (inView) {
      motionVal.set(0);
      animate(motionVal, value, { duration: 2, ease: "easeOut" });
    }
  }, [inView, value, motionVal]);

  useEffect(() => {
    return spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = Math.round(v) + suffix;
    });
  }, [spring, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}


/* ─────────────────────────────────────────────── */
/*  Marquee Ticker                                */
/* ─────────────────────────────────────────────── */
const techStack = [
  "React", "Next.js", "Python", "TensorFlow", "Node.js", "AWS",
  "Kubernetes", "PostgreSQL", "LLMs", "TypeScript", "GraphQL", "Docker",
  "React", "Next.js", "Python", "TensorFlow", "Node.js", "AWS",
  "Kubernetes", "PostgreSQL", "LLMs", "TypeScript", "GraphQL", "Docker",
];

function Marquee() {
  return (
    <div className="marquee-wrapper">
      <div className="marquee-track">
        {techStack.map((item, i) => (
          <span key={i} className="marquee-item">
            <Sparkles className="w-3 h-3 text-primary" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────── */
/*  Service Card                                  */
/* ─────────────────────────────────────────────── */
const services = [
  {
    title: "IT Services",
    desc: "Modern software engineering, cloud architecture, and full-stack digital solutions built for scale.",
    icon: Code2,
    link: "/services/it-services",
    color: "blue",
    gradient: "from-blue-500/20 to-cyan-500/10",
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-500",
    accent: "#3b82f6",
  },
  {
    title: "AI Solutions",
    desc: "Transform operations with custom LLMs, computer vision, and intelligent automation pipelines.",
    icon: BrainCircuit,
    link: "/services/ai-solutions",
    color: "purple",
    gradient: "from-purple-500/20 to-fuchsia-500/10",
    iconBg: "bg-purple-500/15",
    iconColor: "text-purple-500",
    accent: "#a855f7",
  },
  {
    title: "Staff Augmentation",
    desc: "Access elite global technology talent — engineers, architects, and PMs — on demand.",
    icon: Users,
    link: "/services/staff-augmentation",
    color: "green",
    gradient: "from-emerald-500/20 to-teal-500/10",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-500",
    accent: "#10b981",
  },
  {
    title: "IT Maintenance",
    desc: "Proactive, 24/7 infrastructure monitoring, security hardening, and performance optimization.",
    icon: ShieldCheck,
    link: "/services/it-maintenance",
    color: "orange",
    gradient: "from-orange-500/20 to-amber-500/10",
    iconBg: "bg-orange-500/15",
    iconColor: "text-orange-500",
    accent: "#f97316",
  },
];

/* ─────────────────────────────────────────────── */
/*  Stats                                         */
/* ─────────────────────────────────────────────── */
const stats = [
  { value: 10, suffix: "+", label: "Years of Excellence", icon: TrendingUp },
  { value: 50, suffix: "+", label: "Products Delivered", icon: Zap },
  { value: 30, suffix: "+", label: "Enterprise Clients", icon: Globe2 },
  { value: 98, suffix: "%", label: "Client Satisfaction", icon: Star },
];

/* ─────────────────────────────────────────────── */
/*  Testimonials                                  */
/* ─────────────────────────────────────────────── */
const testimonials = [
  {
    quote: "TattvaLogic transformed our legacy infrastructure in just 4 months. Their AI-first approach cut our operational costs by 40%. Truly world-class.",
    name: "Rajesh Kumar",
    title: "CTO, FinEdge Technologies",
    rating: 5,
    avatar: "RK",
    color: "from-blue-600 to-indigo-600",
  },
  {
    quote: "The staff augmentation team they provided felt like our own. Delivered on time, on budget, and beyond expectations. We're already planning our next phase.",
    name: "Priya Sharma",
    title: "VP Engineering, ScaleUp SaaS",
    rating: 5,
    avatar: "PS",
    color: "from-purple-600 to-fuchsia-600",
  },
  {
    quote: "Their Fritado platform accelerated our go-to-market by 3x. The team understands both technology and business — a rare combination.",
    name: "Arjun Mehta",
    title: "Founder & CEO, GrowthStack",
    rating: 5,
    avatar: "AM",
    color: "from-emerald-600 to-teal-600",
  },
];

/* ─────────────────────────────────────────────── */
/*  Blog Posts                                    */
/* ─────────────────────────────────────────────── */
const blogPosts = [
  {
    title: "Generative AI Trends Reshaping Enterprise in 2026",
    category: "AI Innovation",
    categoryColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    readTime: "5 min read",
    gradient: "from-purple-600/30 via-fuchsia-500/20 to-transparent",
  },
  {
    title: "Modern Software Architecture Patterns for Scale",
    category: "Technology",
    categoryColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    readTime: "7 min read",
    gradient: "from-blue-600/30 via-cyan-500/20 to-transparent",
  },
  {
    title: "The SaaS Product Development Playbook for 2026",
    category: "Digital Transformation",
    categoryColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    readTime: "6 min read",
    gradient: "from-emerald-600/30 via-teal-500/20 to-transparent",
  },
];

/* ─────────────────────────────────────────────── */
/*  Main Page Component                           */
/* ─────────────────────────────────────────────── */
export default function Home() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [latestBlogs, setLatestBlogs] = useState<any[]>(blogPosts);

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        const { API_BASE } = await import("@/config/apiConfig");
        const res = await fetch(`${API_BASE}/blogs?limit=3`);
        if (res.ok) {
          const data = await res.json();
          if (data.blogs && data.blogs.length > 0) {
            const dynamicBlogs = data.blogs.map((blog: any, index: number) => ({
              title: blog.title,
              category: blog.category,
              categoryColor: blogPosts[index % blogPosts.length].categoryColor,
              readTime: "5 min read",
              gradient: blogPosts[index % blogPosts.length].gradient,
              slug: blog.slug,
              featuredImage: blog.featuredImage
            }));
            setLatestBlogs(dynamicBlogs);
          }
        }
      } catch (err) {
        console.error("Failed to load latest blogs", err);
      }
    };
    fetchLatestBlogs();
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setActiveTestimonial((p) => (p + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col w-full overflow-hidden">

      {/* ══════════════════════════════════════════ */}
      {/* SECTION 1 — HERO CAROUSEL                  */}
      {/* ══════════════════════════════════════════ */}
      <HeroCarousel />

      {/* ══════════════════════════════════════════ */}
      {/* MARQUEE TICKER                            */}
      {/* ══════════════════════════════════════════ */}
      <div className="py-5 border-y border-border/30 bg-muted/20 overflow-hidden">
        <Marquee />
      </div>


      {/* ══════════════════════════════════════════ */}
      {/* SECTION 2 — STATS                        */}
      {/* ══════════════════════════════════════════ */}
      <section className="py-20 bg-background relative overflow-hidden">
        <div className="absolute inset-0 stats-bg pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                className="stat-card group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <div className="stat-icon-wrap">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-4xl font-bold text-foreground mt-3 mb-1">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* SECTION 3 — OUR EXPERTISE                */}
      {/* ══════════════════════════════════════════ */}
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

      {/* ══════════════════════════════════════════ */}
      {/* SECTION 4 — PRODUCTS                     */}
      {/* ══════════════════════════════════════════ */}
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

      {/* ══════════════════════════════════════════ */}
      {/* SECTION 5 — WHY CHOOSE US                */}
      {/* ══════════════════════════════════════════ */}
      <section className="py-28 why-choose-bg relative overflow-hidden">
        <div className="why-choose-pattern" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.span className="section-badge-dark" variants={fadeUp} custom={0}>
                Why TattvaLogic
              </motion.span>
              <motion.h2
                className="text-4xl md:text-5xl font-bold mb-6 mt-4 text-white"
                variants={fadeUp}
                custom={0.1}
              >
                Built Different. <br />
                <span className="text-primary">Delivering More.</span>
              </motion.h2>
              <motion.p
                className="text-lg text-gray-400 mb-10 leading-relaxed"
                variants={fadeUp}
                custom={0.2}
              >
                We combine deep technical expertise with a product-first mindset
                to deliver enterprise-grade solutions that create real, measurable business impact.
              </motion.p>

              <motion.ul className="space-y-5" variants={stagger}>
                {[
                  { text: "AI-first engineering mindset across all projects", icon: BrainCircuit },
                  { text: "Highly skilled technology consultants globally", icon: Globe2 },
                  { text: "Scalable, distributed development teams", icon: Users },
                  { text: "Enterprise-grade security & compliance built-in", icon: ShieldCheck },
                  { text: "Fast, predictable delivery with agile methods", icon: Zap },
                ].map((point, i) => (
                  <motion.li
                    key={i}
                    className="why-point"
                    variants={fadeUp}
                    custom={i * 0.1}
                  >
                    <div className="why-point-icon">
                      <point.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-white font-medium">{point.text}</span>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div className="mt-10" variants={fadeUp} custom={0.6}>
                <Link href="/about" className="hero-cta-primary group inline-flex">
                  <span>About TattvaLogic</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Stats panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="why-stats-panel"
            >
              {[
                { label: "Years of Engineering Excellence", value: "10+", color: "text-blue-400" },
                { label: "Products Successfully Delivered", value: "50+", color: "text-purple-400" },
                { label: "Enterprise Clients Worldwide", value: "30+", color: "text-emerald-400" },
                { label: "Client Satisfaction Rate", value: "98%", color: "text-orange-400" },
              ].map((item, i) => (
                <div key={i} className="why-stat-item">
                  <p className={`text-4xl font-bold ${item.color} mb-1`}>{item.value}</p>
                  <p className="text-gray-400 text-sm">{item.label}</p>
                  {i < 3 && <div className="why-stat-divider" />}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* SECTION 6 — INDUSTRIES                   */}
      {/* ══════════════════════════════════════════ */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-14"
          >
            <span className="section-badge">Industries</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4">
              Industries We <span className="hero-gradient-text">Serve</span>
            </h2>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {[
              { name: "Fintech", icon: "💳" },
              { name: "SaaS", icon: "☁️" },
              { name: "Healthcare", icon: "🏥" },
              { name: "Retail", icon: "🛍️" },
              { name: "Logistics", icon: "🚚" },
              { name: "Startups", icon: "🚀" },
              { name: "E-Commerce", icon: "🛒" },
              { name: "Education", icon: "🎓" },
            ].map((industry, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                custom={i * 0.05}
                className="industry-chip group"
              >
                <span>{industry.icon}</span>
                <span>{industry.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* SECTION 7 — TESTIMONIALS                 */}
      {/* ══════════════════════════════════════════ */}
      <section className="py-28 bg-muted/20 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <span className="section-badge">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-4">
              What Our <span className="hero-gradient-text">Clients Say</span>
            </h2>
          </motion.div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                className={`testimonial-card ${activeTestimonial === i ? "testimonial-card-active" : ""}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                onClick={() => setActiveTestimonial(i)}
              >
                <Quote className="w-8 h-8 text-primary/30 mb-4" />
                <div className="flex mb-4">
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-foreground leading-relaxed mb-6 flex-grow font-medium">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className={`testimonial-avatar bg-gradient-to-br ${t.color}`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">{t.name}</p>
                    <p className="text-muted-foreground text-xs">{t.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Dot nav */}
          <div className="flex justify-center gap-4 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                aria-label={`View testimonial ${i + 1}`}
                onClick={() => setActiveTestimonial(i)}
                className="p-3 -m-3 flex items-center justify-center focus:outline-none"
              >
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeTestimonial === i ? "w-8 bg-primary" : "w-2 bg-border"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* SECTION 8 — BLOG INSIGHTS                */}
      {/* ══════════════════════════════════════════ */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <span className="section-badge">Insights</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-4">
              Blog & <span className="hero-gradient-text">Insights</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Latest thinking on AI trends, software architecture, and digital transformation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestBlogs.map((post, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="blog-card group"
              >
                <Link href={`/blog/${post.slug || i}`}>
                  <div 
                    className={`blog-card-image bg-gradient-to-br ${post.gradient} relative overflow-hidden`}
                  >
                    {post.featuredImage && (
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: `url(${post.featuredImage})` }}
                      />
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    <div className="blog-card-tag relative z-10 bg-black/50 backdrop-blur-md text-white border-white/20">Read · {post.readTime}</div>
                  </div>
                  <div className="p-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${post.categoryColor}`}>
                      {post.category}
                    </span>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-4 text-sm text-primary font-semibold">
                      Read Article
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/blog" className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-border hover:border-primary/50 hover:text-primary transition-all text-sm font-semibold group">
              View All Posts
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
