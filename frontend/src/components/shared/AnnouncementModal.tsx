"use client";

import React, { useState, useEffect } from "react";
import { X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

export default function AnnouncementModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if the user has already dismissed the popup in this session
    const isClosed = sessionStorage.getItem("announcement_closed");
    
    if (!isClosed) {
      // Add a small delay so it doesn't appear instantaneously upon page load
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    // Record that the user closed the announcement
    sessionStorage.setItem("announcement_closed", "true");
    setIsOpen(false);
  };

  // Prevent scrolling when modal is open without causing layout shift flicker
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" style={{ perspective: "1000px" }}>
          {/* Dark Overlay Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.6, bounce: 0 }}
            className="relative w-full max-w-2xl glass-card border border-white/10 overflow-hidden flex flex-col max-h-[90vh] bg-black/80 backdrop-blur-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="announcement-title"
          >
            {/* Header Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 z-30 p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all group"
              aria-label="Close announcement"
            >
              <X className="w-5 h-5 text-white/50 group-hover:text-white" />
            </button>

            {/* Scrollable Content Area */}
            <div className="p-8 sm:p-12 overflow-y-auto w-full h-full relative z-10 custom-scrollbar">
              
              {/* Optional UI: Logos Row */}
              <div className="flex items-center gap-6 mb-10 pt-2">
                <div className="flex items-center">
                  <span className="text-2xl font-bold tracking-tight text-white">
                    Tattva<span className="text-primary italic">Logic</span>
                  </span>
                </div>
                
                <div className="w-12 h-[1px] bg-white/10 hidden sm:block"></div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border border-white/10 rounded-xl flex items-center justify-center p-2 bg-white/5 backdrop-blur-sm shadow-xl">
                    <img src="/images/portfolio/Fritado.png" className="w-full h-full object-contain filter brightness-0 invert" alt="Fritado Logo" />
                  </div>
                  <span className="text-2xl font-bold tracking-tight text-white">
                      Fritado
                  </span>
                </div>
              </div>

              {/* Title */}
              <h2 id="announcement-title" className="text-3xl sm:text-4xl font-bold tracking-tight mb-10 text-white leading-tight text-balance">
                Strategic Acquisition <br/><span className="hero-gradient-text uppercase text-2xl tracking-widest">Announcement</span>
              </h2>

              {/* Message Body */}
              <div className="prose prose-invert max-w-none text-blue-100/70 font-sans leading-relaxed space-y-6">
                <p className="text-lg">
                  <strong className="text-white">TattvaLogic</strong> is currently in the final round of discussions regarding the acquisition of the <strong className="text-primary">Fritado</strong> brand and its AI-powered SaaS platform.
                </p>
                
                <div className="border-l-4 border-primary pl-6 py-4 my-8 bg-white/5 rounded-r-2xl border border-white/5">
                  <p className="m-0 text-white font-medium italic leading-relaxed">
                    Following the completion of the proposed merger, Fritado will operate as a core product within the TattvaLogic AI ecosystem.
                  </p>
                </div>
                <p>
                  Through this strategic move, TattvaLogic will gain access to Fritado&apos;s advanced technology and client base, strengthening our mission to deliver digital transformation globally.
                </p>
              </div>

              {/* Signature and CTA block */}
              <div className="mt-12 pt-10 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-10">
                <div>
                  <p className="text-[10px] text-primary mb-3 font-bold uppercase tracking-[0.2em]">Authorized By</p>
                  <p className="font-bold text-2xl text-white tracking-wide mb-1">Banhidipa Mallik</p>
                  <p className="text-blue-100/40 text-sm font-sans">Director – Brand Vision & Growth Strategy</p>
                </div>
                
                <div className="shrink-0 w-full sm:w-auto">
                  <Button className="w-full sm:w-auto rounded-full shadow-2xl h-14 px-8 font-bold" asChild>
                    <a href="https://fritado.com" target="_blank" rel="noopener noreferrer">
                      Platform Overview <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
