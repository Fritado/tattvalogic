"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

type BezierDef = [number, number, number, number];
const EASE_OUT: BezierDef = [0.25, 0.4, 0.25, 1];
const EASE_IN: BezierDef = [0.4, 0, 1, 1];


/* ════════════════════════════════════════════════════════ */
/*  SLIDE DATA                                             */
/* ════════════════════════════════════════════════════════ */
const slides = [
  {
    id: 0,
    tag: "Digital Transformation",
    headline: ["Build Future-Ready", "Digital Platforms"],
    pitch:
      "From powerful websites to enterprise applications, TattvaLogic delivers scalable digital solutions that accelerate business growth.",
    primaryCta: { label: "Start Your Project", href: "/contact" },
    secondaryCta: { label: "Explore IT Services", href: "/services/it-services" },
    accentColor: "#3b82f6",
    accentGlow: "rgba(59,130,246,0.25)",
    theme: "it",
  },
  {
    id: 1,
    tag: "AI & Automation",
    headline: ["Unlock Business", "Intelligence with AI"],
    pitch:
      "Transform your operations with AI-powered automation, predictive analytics, and intelligent systems designed to scale your business.",
    primaryCta: { label: "Get AI Consultation", href: "/contact" },
    secondaryCta: { label: "Explore AI Solutions", href: "/services/ai-solutions" },
    accentColor: "#a855f7",
    accentGlow: "rgba(168,85,247,0.28)",
    theme: "ai",
  },
  {
    id: 2,
    tag: "Staff Augmentation",
    headline: ["Scale Your Team with", "Elite Tech Talent"],
    pitch:
      "Access highly skilled developers, engineers, and IT experts on demand to accelerate your projects and reduce hiring complexity.",
    primaryCta: { label: "Hire Talent Now", href: "/contact" },
    secondaryCta: { label: "View Talent Solutions", href: "/services/staff-augmentation" },
    accentColor: "#10b981",
    accentGlow: "rgba(16,185,129,0.25)",
    theme: "staff",
  },
  {
    id: 3,
    tag: "SaaS & Innovation",
    headline: ["Powerful SaaS", "Built to Scale"],
    pitch:
      "Fritado and Critical Buzzer — automate workflows and accelerate business growth.",
    primaryCta: { label: "Request Demo", href: "/contact" },
    secondaryCta: { label: "View Products", href: "/products/fritado" },
    accentColor: "#f97316",
    accentGlow: "rgba(249,115,22,0.25)",
    theme: "saas",
  },
];

const SLIDE_DURATION = 5500; // ms

/* ════════════════════════════════════════════════════════ */
/*  TECH BACKGROUND VISUALS (SVG-based, per theme)         */
/* ════════════════════════════════════════════════════════ */
function ITBackground({ color }: { color: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice" aria-hidden>
      {/* Grid lines */}
      {Array.from({ length: 18 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 90} y1="0" x2={i * 90} y2="800" stroke={color} strokeOpacity="0.07" strokeWidth="1" />
      ))}
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 75} x2="1440" y2={i * 75} stroke={color} strokeOpacity="0.07" strokeWidth="1" />
      ))}
      {/* Code bracket shapes */}
      <text x="780" y="200" fill={color} fillOpacity="0.06" fontSize="260" fontFamily="monospace" fontWeight="900">{`{}`}</text>
      <text x="60" y="680" fill={color} fillOpacity="0.05" fontSize="180" fontFamily="monospace">{`</>`}</text>
      {/* Cloud Infrastructure Panel */}
      <rect x="820" y="100" width="560" height="320" rx="16" fill="rgba(255,255,255,0.02)" stroke={color} strokeOpacity="0.12" strokeWidth="1.5" />
      <rect x="820" y="100" width="560" height="36" rx="16" fill={color} fillOpacity="0.08" />
      {[0, 1, 2].map(i => <circle key={i} cx={840 + i * 18} cy={118} r="6" fill={color} fillOpacity={0.2 + i * 0.05} />)}
      
      {/* Abstracted Server Monitoring */}
      {[20, 60, 40, 80, 30, 90, 50, 70].map((h, i) => (
        <rect key={i} x={860 + i * 60} y={350 - h} width="40" height={h} rx="4" fill={color} fillOpacity={0.1}>
          <animate attributeName="height" values={`0;${h};${h}`} dur="2s" begin={`${i * 0.1}s`} />
          <animate attributeName="y" values={`350;${350 - h};${350 - h}`} dur="2s" begin={`${i * 0.1}s`} />
        </rect>
      ))}
      <rect x="860" y="160" width="200" height="12" rx="6" fill={color} fillOpacity="0.15" />
      <rect x="860" y="185" width="140" height="8" rx="4" fill={color} fillOpacity="0.1" />
      <rect x="860" y="205" width="160" height="8" rx="4" fill={color} fillOpacity="0.1" />

      {/* Floating nodes */}
      {[[200, 130], [900, 80], [1250, 200], [400, 450], [1050, 520], [700, 700]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill={color} fillOpacity="0.35">
          <animate attributeName="r" values="3;5;3" dur={`${3 + i * 0.7}s`} repeatCount="indefinite" />
          <animate attributeName="fillOpacity" values="0.35;0.7;0.35" dur={`${3 + i * 0.7}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {/* Connecting lines */}
      <polyline points="200,130 400,450 700,700" stroke={color} strokeOpacity="0.08" strokeWidth="1" fill="none" strokeDasharray="6,6" />
      <polyline points="900,80 1050,520 1250,200" stroke={color} strokeOpacity="0.08" strokeWidth="1" fill="none" strokeDasharray="6,6" />
      {/* Cloud box */}
      <rect x="1100" y="580" width="280" height="150" rx="16" stroke={color} strokeOpacity="0.12" strokeWidth="1.5" fill="none" />
      <rect x="1130" y="610" width="80" height="10" rx="5" fill={color} fillOpacity="0.12" />
      <rect x="1130" y="632" width="120" height="8" rx="4" fill={color} fillOpacity="0.08" />
      <rect x="1130" y="650" width="100" height="8" rx="4" fill={color} fillOpacity="0.08" />
    </svg>
  );
}

function AIBackground({ color }: { color: string }) {
  const nodes = [
    [720, 400], [440, 220], [1000, 220], [220, 440], [560, 630], [880, 630], [1220, 440],
    [330, 150], [1110, 150], [160, 600], [1280, 600], [720, 100], [720, 700],
  ];
  const edges = [
    [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [1, 3], [1, 7], [1, 2], [2, 8], [2, 6], [3, 9], [4, 9], [5, 10], [6, 10], [4, 5], [0, 11], [0, 12],
  ];
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice" aria-hidden>
      {edges.map(([a, b], i) => (
        <line key={i}
          x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}
          stroke={color} strokeOpacity="0.1" strokeWidth="1.2">
          <animate attributeName="strokeOpacity" values="0.1;0.22;0.1" dur={`${4 + i * 0.3}s`} repeatCount="indefinite" />
        </line>
      ))}
      {nodes.map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="12" fill={color} fillOpacity="0.07">
            <animate attributeName="r" values="12;16;12" dur={`${3.5 + i * 0.5}s`} repeatCount="indefinite" />
          </circle>
          <circle cx={cx} cy={cy} r="4" fill={color} fillOpacity="0.4">
            <animate attributeName="fillOpacity" values="0.4;0.9;0.4" dur={`${3.5 + i * 0.5}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
      {/* Data stream lines */}
      <line x1="0" y1="200" x2="1440" y2="200" stroke={color} strokeOpacity="0.04" strokeWidth="40" />
      <line x1="0" y1="600" x2="1440" y2="600" stroke={color} strokeOpacity="0.03" strokeWidth="30" />
      {/* Neural Processing Panel */}
      <rect x="820" y="100" width="560" height="320" rx="16" fill="rgba(255,255,255,0.02)" stroke={color} strokeOpacity="0.12" strokeWidth="1.5" />
      <rect x="820" y="100" width="560" height="36" rx="16" fill={color} fillOpacity="0.08" />
      {[0, 1, 2].map(i => <circle key={i} cx={840 + i * 18} cy={118} r="6" fill={color} fillOpacity={0.2 + i * 0.05} />)}

      {/* Central Pulsing AI Core */}
      <circle cx="1100" cy="260" r="60" fill="none" stroke={color} strokeOpacity="0.15" strokeWidth="2" strokeDasharray="10,10">
        <animateTransform attributeName="transform" type="rotate" from="0 1100 260" to="360 1100 260" dur="10s" repeatCount="indefinite" />
      </circle>
      <circle cx="1100" cy="260" r="40" fill={color} fillOpacity="0.1">
        <animate attributeName="r" values="40;45;40" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="1100" cy="260" r="10" fill={color} fillOpacity="0.5">
        <animate attributeName="fillOpacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* Activity Waves */}
      {[0, 1, 2, 3].map(i => (
        <circle key={i} cx="1100" cy="260" r="60" fill="none" stroke={color} strokeOpacity="0.2">
          <animate attributeName="r" values="60;140" dur="4s" begin={`${i * 1}s`} repeatCount="indefinite" />
          <animate attributeName="strokeOpacity" values="0.2;0" dur="4s" begin={`${i * 1}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* Horizontal scan line anim */}
      <line x1="0" y1="0" x2="1440" y2="0" stroke={color} strokeOpacity="0.15" strokeWidth="1.5">
        <animate attributeName="y1" values="0;800;0" dur="6s" repeatCount="indefinite" />
        <animate attributeName="y2" values="0;800;0" dur="6s" repeatCount="indefinite" />
      </line>
    </svg>
  );
}

function StaffBackground({ color }: { color: string }) {
  const avatars = [[240, 300], [480, 200], [720, 260], [960, 200], [1200, 300], [360, 500], [600, 440], [840, 450], [1080, 500]];
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice" aria-hidden>
      {/* Connection lines between people */}
      {[[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [1, 5], [2, 6], [3, 7], [4, 8], [5, 6], [6, 7], [7, 8]].map(([a, b], i) => (
        <line key={i} x1={avatars[a][0]} y1={avatars[a][1]} x2={avatars[b][0]} y2={avatars[b][1]} stroke={color} strokeOpacity="0.1" strokeWidth="1" strokeDasharray="4,4">
          <animate attributeName="strokeOpacity" values="0.1;0.2;0.1" dur={`${4 + i * 0.4}s`} repeatCount="indefinite" />
        </line>
      ))}
      {avatars.map(([cx, cy], i) => (
        <g key={i}>
          {/* Person silhouette - circle head + rect body */}
          <circle cx={cx} cy={cy - 18} r="14" fill={color} fillOpacity="0.12" stroke={color} strokeOpacity="0.2" strokeWidth="1.5">
            <animate attributeName="fillOpacity" values="0.12;0.22;0.12" dur={`${3 + i * 0.6}s`} repeatCount="indefinite" />
          </circle>
          <path d={`M${cx - 18},${cy + 30} Q${cx},${cy + 5} ${cx + 18},${cy + 30}`} fill={color} fillOpacity="0.1" stroke={color} strokeOpacity="0.15" strokeWidth="1" />
          {/* Orbit ring */}
          <circle cx={cx} cy={cy} r="26" fill="none" stroke={color} strokeOpacity="0.08" strokeWidth="1" strokeDasharray="3,4">
            <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`} dur={`${8 + i}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
      {/* Talent Matrix Panel */}
      <rect x="820" y="100" width="560" height="320" rx="16" fill="rgba(255,255,255,0.02)" stroke={color} strokeOpacity="0.12" strokeWidth="1.5" />
      <rect x="820" y="100" width="560" height="36" rx="16" fill={color} fillOpacity="0.08" />
      {[0, 1, 2].map(i => <circle key={i} cx={840 + i * 18} cy={118} r="6" fill={color} fillOpacity={0.2 + i * 0.05} />)}

      {/* Talent Grid */}
      {Array.from({ length: 4 }).map((_, row) => (
        Array.from({ length: 6 }).map((_, col) => {
          const x = 860 + col * 85;
          const y = 165 + row * 60;
          return (
            <g key={`${row}-${col}`}>
              <circle cx={x} cy={y} r="18" fill={color} fillOpacity="0.05" stroke={color} strokeOpacity="0.1" />
              <circle cx={x} cy={y-5} r="6" fill={color} fillOpacity="0.15" />
              <path d={`M${x-10},${y+10} Q${x},${y} ${x+10},${y+10}`} fill={color} fillOpacity="0.1" />
              {Math.random() > 0.7 && (
                <circle cx={x+12} cy={y-12} r="4" fill={color} fillOpacity="0.4">
                  <animate attributeName="fillOpacity" values="0.4;0.9;0.4" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
            </g>
          );
        })
      ))}

      {/* "Global" map grid subtle */}
      <ellipse cx="720" cy="400" rx="600" ry="300" fill="none" stroke={color} strokeOpacity="0.04" strokeWidth="1.5" />
      <ellipse cx="720" cy="400" rx="350" ry="300" fill="none" stroke={color} strokeOpacity="0.04" strokeWidth="1" />
      <line x1="120" y1="400" x2="1320" y2="400" stroke={color} strokeOpacity="0.04" strokeWidth="1" />
    </svg>
  );
}

function SaaSBackground({ color }: { color: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice" aria-hidden>
      {/* Dashboard panel 1 */}
      <rect x="820" y="100" width="560" height="320" rx="16" fill="rgba(255,255,255,0.02)" stroke={color} strokeOpacity="0.12" strokeWidth="1.5" />
      {/* Topbar */}
      <rect x="820" y="100" width="560" height="36" rx="16" fill={color} fillOpacity="0.08" />
      {[0, 1, 2].map(i => <circle key={i} cx={840 + i * 18} cy={118} r="6" fill={color} fillOpacity={0.2 + i * 0.05} />)}
      {/* Chart bars */}
      {[40, 80, 55, 95, 65, 110, 75, 90, 50, 120].map((h, i) => (
        <rect key={i} x={848 + i * 48} y={380 - h} width="30" height={h} rx="4" fill={color} fillOpacity={0.1 + i * 0.012}>
          <animate attributeName="height" values={`0;${h};${h}`} dur="1.5s" begin={`${i * 0.12}s`} />
          <animate attributeName="y" values={`380;${380 - h};${380 - h}`} dur="1.5s" begin={`${i * 0.12}s`} />
        </rect>
      ))}
      {/* Dashboard panel 2 */}
      <rect x="60" y="180" width="400" height="220" rx="14" fill="rgba(255,255,255,0.02)" stroke={color} strokeOpacity="0.1" strokeWidth="1.5" />
      <rect x="80" y="210" width="120" height="10" rx="5" fill={color} fillOpacity="0.15" />
      <rect x="80" y="232" width="80" height="8" rx="4" fill={color} fillOpacity="0.1" />
      {/* Metric circles */}
      {[[200, 311], [290, 311], [380, 311]].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="40" fill="none" stroke={color} strokeOpacity="0.1" strokeWidth="6" />
          <circle cx={cx} cy={cy} r="40" fill="none" stroke={color} strokeOpacity={0.3 + i * 0.1} strokeWidth="6"
            strokeDasharray={`${(60 + i * 20)} 251`} strokeLinecap="round"
            transform={`rotate(-90 ${cx} ${cy})`}>
            <animate attributeName="strokeDasharray" values={`0 251;${60 + i * 20} 251`} dur="1.8s" begin={`${i * 0.2}s`} />
          </circle>
          <text x={cx} y={cy + 5} textAnchor="middle" fill={color} fillOpacity="0.5" fontSize="12" fontWeight="700">{60 + i * 13}%</text>
        </g>
      ))}
      {/* Notification popups */}
      {[
        { x: 900, y: 460, label: "Lead converted!", icon: "✓" },
        { x: 60, y: 450, label: "Pipeline: $240K", icon: "↑" },
        { x: 480, y: 580, label: "Workflow triggered", icon: "⚡" },
      ].map((n, i) => (
        <g key={i}>
          <rect x={n.x} y={n.y} width="220" height="48" rx="10" fill="rgba(0,0,0,0.3)" stroke={color} strokeOpacity="0.15" strokeWidth="1">
            <animate attributeName="opacity" values="0;1;1" dur="0.5s" begin={`${1 + i * 0.6}s`} />
          </rect>
          <text x={n.x + 18} y={n.y + 20} fill={color} fillOpacity="0.7" fontSize="14">{n.icon}</text>
          <text x={n.x + 40} y={n.y + 20} fill={color} fillOpacity="0.5" fontSize="11" fontWeight="600">{n.label}</text>
        </g>
      ))}
      {/* Corner glow blob */}
      <radialGradient id="saas-glow" cx="80%" cy="15%" r="40%">
        <stop offset="0%" stopColor={color} stopOpacity="0.15" />
        <stop offset="100%" stopColor={color} stopOpacity="0" />
      </radialGradient>
      <rect x="0" y="0" width="1440" height="800" fill="url(#saas-glow)" />
    </svg>
  );
}

function SlideBackground({ theme, color }: { theme: string; color: string }) {
  if (theme === "it") return <ITBackground color={color} />;
  if (theme === "ai") return <AIBackground color={color} />;
  if (theme === "staff") return <StaffBackground color={color} />;
  return <SaaSBackground color={color} />;
}

/* ════════════════════════════════════════════════════════ */
/*  PARTICLES                                              */
/* ════════════════════════════════════════════════════════ */
function Particle({ color, delay, x, size }: { color: string; delay: number; x: number; size: number }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size, height: size,
        left: `${x}%`,
        background: color,
        opacity: 0,
        animation: `particle-float ${6 + delay}s ${delay}s ease-in-out infinite`,
      }}
    />
  );
}

/* ════════════════════════════════════════════════════════ */
/*  PROGRESS BAR                                           */
/* ════════════════════════════════════════════════════════ */
function ProgressBar({ active, duration }: { active: boolean; duration: number }) {
  return (
    <div className="hc-progress-track">
      <div
        className="hc-progress-fill"
        style={{
          animation: active ? `progress-fill ${duration}ms linear forwards` : "none",
          width: active ? undefined : "0%",
        }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════ */
/*  TEXT ANIMATION VARIANTS                                */
/* ════════════════════════════════════════════════════════ */
const slideContentVariants: Variants = {
  enter: { opacity: 0, y: 32 },
  center: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE_OUT, staggerChildren: 0.08 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.4, ease: EASE_IN } },
};
const itemVariants: Variants = {
  enter: { opacity: 0, y: 24 },
  center: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
  exit: { opacity: 0 },
};
const bgVariants: Variants = {
  enter: { opacity: 0, scale: 1.04 },
  center: { opacity: 1, scale: 1, transition: { duration: 0.9, ease: EASE_OUT } },
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.5 } },
};


/* ════════════════════════════════════════════════════════ */
/*  MAIN CAROUSEL COMPONENT                               */
/* ════════════════════════════════════════════════════════ */
export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback((idx: number, dir: "next" | "prev" = "next") => {
    setDirection(dir);
    setCurrent(idx);
  }, []);

  const goNext = useCallback(() => {
    goTo((current + 1) % slides.length, "next");
  }, [current, goTo]);

  const goPrev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length, "prev");
  }, [current, goTo]);

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(goNext, SLIDE_DURATION);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current, paused, goNext]);

  const slide = slides[current];

  return (
    <section className="hc-wrapper" aria-label="TattvaLogic Hero Carousel">
      {/* ──── Slide Background ──── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`bg-${slide.id}`}
          className="hc-bg-layer"
          variants={bgVariants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          {/* Deep dark base */}
          <div className="hc-dark-base" />
          {/* Accent gradient overlay */}
          <div
            className="hc-accent-overlay"
            style={{ background: `radial-gradient(ellipse 70% 60% at 70% 40%, ${slide.accentGlow}, transparent 70%)` }}
          />
          {/* Second subtle glow bottom-left */}
          <div
            className="hc-accent-overlay-2"
            style={{ background: `radial-gradient(ellipse 50% 50% at 15% 80%, ${slide.accentGlow.replace("0.25", "0.12").replace("0.28", "0.12")}, transparent 70%)` }}
          />
          {/* Tech SVG visuals */}
          <SlideBackground theme={slide.theme} color={slide.accentColor} />
          {/* Noise texture for depth */}
          <div className="hc-noise" />
        </motion.div>
      </AnimatePresence>

      {/* ──── Particles ──── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[12, 28, 45, 62, 78, 90].map((x, i) => (
          <Particle key={i} color={slide.accentColor} delay={i * 0.8} x={x} size={3 + (i % 3)} />
        ))}
      </div>

      {/* ──── Content ──── */}
      <div className="hc-content-wrapper">
        <div className="hc-content-inner">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${slide.id}`}
              className="hc-text-block"
              variants={slideContentVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {/* Tag pill */}
              <motion.div variants={itemVariants}>
                <span className="hc-tag" style={{ borderColor: `${slide.accentColor}40`, color: slide.accentColor, background: `${slide.accentColor}12` }}>
                  <span className="hc-tag-dot" style={{ background: slide.accentColor }} />
                  {slide.tag}
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1 className="hc-headline" variants={itemVariants}>
                {slide.headline.map((line, i) => (
                  <span key={i} className="block">
                    {i === 1
                      ? <span style={{ color: slide.accentColor }}>{line}</span>
                      : line}
                  </span>
                ))}
              </motion.h1>

              {/* Pitch */}
              <motion.p className="hc-pitch" variants={itemVariants}>
                {slide.pitch}
              </motion.p>

              {/* Buttons */}
              <motion.div className="hc-btn-group" variants={itemVariants}>
                <Link
                  href={slide.primaryCta.href}
                  className="hc-btn-primary group"
                  style={{
                    background: `linear-gradient(135deg, ${slide.accentColor}, ${slide.accentColor}cc)`,
                    boxShadow: `0 4px 24px ${slide.accentGlow}`,
                  }}
                >
                  <span>{slide.primaryCta.label}</span>
                  <span className="hc-btn-arrow group-hover:translate-x-1">→</span>
                </Link>
                <Link href={slide.secondaryCta.href} className="hc-btn-secondary group">
                  <span>{slide.secondaryCta.label}</span>
                  <span className="hc-btn-arrow group-hover:translate-x-1">→</span>
                </Link>
              </motion.div>

              {/* Trust row */}
              <motion.div className="hc-trust-row" variants={itemVariants}>
                {["10+ Years Experience", "50+ Global Clients", "Enterprise Grade"].map((t, i) => (
                  <span key={i} className="hc-trust-item">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="7" fill={slide.accentColor} fillOpacity="0.2" />
                      <path d="M4 7l2 2 4-4" stroke={slide.accentColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {t}
                  </span>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ──── Controls Row ──── */}
      <div className="hc-controls">
        {/* Prev / Next */}
        <button
          className="hc-arrow-btn"
          onClick={goPrev}
          aria-label="Previous slide"
          style={{ "--accent": slide.accentColor } as React.CSSProperties}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Slide indicators + progress bars */}
        <div className="hc-dots-wrap">
          {slides.map((s, i) => (
            <button
              key={s.id}
              className={`hc-dot-btn ${i === current ? "hc-dot-btn-active" : ""}`}
              onClick={() => goTo(i, i > current ? "next" : "prev")}
              aria-label={`Slide ${i + 1}`}
            >
              <span
                className="hc-dot-label"
                style={{ color: i === current ? s.accentColor : undefined }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <ProgressBar active={i === current && !paused} duration={SLIDE_DURATION} />
            </button>
          ))}
        </div>

        {/* Play / Pause */}
        <button
          className="hc-arrow-btn"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? "Play slideshow" : "Pause slideshow"}
          style={{ "--accent": slide.accentColor } as React.CSSProperties}
        >
          {paused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
        </button>

        {/* Next */}
        <button
          className="hc-arrow-btn"
          onClick={goNext}
          aria-label="Next slide"
          style={{ "--accent": slide.accentColor } as React.CSSProperties}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* ──── Slide counter ──── */}
      <div className="hc-slide-counter">
        <span className="hc-slide-num" style={{ color: slide.accentColor }}>
          {String(current + 1).padStart(2, "0")}
        </span>
        <span className="hc-slide-sep">/</span>
        <span className="hc-slide-total">{String(slides.length).padStart(2, "0")}</span>
      </div>

      {/* ──── Scroll cue ──── */}
      <div className="hc-scroll-cue">
        <div className="hc-scroll-line" style={{ background: slide.accentColor }} />
        <span className="hc-scroll-text">scroll</span>
      </div>
    </section>
  );
}
