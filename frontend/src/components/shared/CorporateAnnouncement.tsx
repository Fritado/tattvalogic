"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Info, Award, Milestone } from "lucide-react";
import { Button } from "@/components/ui/Button";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

export default function CorporateAnnouncement() {
  return (
    <section className="py-24 bg-white dark:bg-zinc-950 border-b border-border/50 relative overflow-hidden">
      {/* Subtle Background Highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <motion.div
          className="mb-12 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wider uppercase mb-6">
            <Info className="w-4 h-4" /> Corporate Announcement
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-balance">Strategic Acquisition Announcement</h2>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 md:p-12 shadow-2xl border border-border relative overflow-hidden group"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          {/* Subtle gradient accent for the card */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-primary/10 transition-colors pointer-events-none" />
          
          <div className="relative z-10">
            {/* Header: Logos side by side */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 pb-8 border-b border-border/50">
               <div className="flex flex-wrap items-center justify-center gap-6">
                  {/* TattvaLogic */}
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold tracking-tight text-foreground">
                      Tattva<span className="text-primary">Logic</span>
                    </span>
                  </div>

                  {/* Divider arrow */}
                  <div className="text-muted-foreground bg-muted/50 p-2 rounded-full hidden sm:block">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                  {/* Divider plus for mobile */}
                  <div className="text-muted-foreground bg-muted/50 p-2 rounded-full sm:hidden">
                    <span className="text-lg font-bold">+</span>
                  </div>

                  {/* Fritado */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded flex items-center justify-center shadow-sm">
                      <img src="/images/portfolio/Fritado.png" className="w-6 h-6 object-contain" alt="Fritado" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-foreground">
                      Fritado
                    </span>
                  </div>
               </div>

               <div className="w-full md:w-auto text-center md:text-right shrink-0">
                  <p className="text-sm text-muted-foreground font-semibold uppercase tracking-widest bg-muted px-4 py-2 rounded-full inline-block">Official Statement</p>
               </div>
            </div>

            {/* Announcement Message */}
            <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-loose text-balance space-y-6">
              <p>
                At TattvaLogic, we continuously evaluate strategic opportunities that strengthen our technology ecosystem and expand the value we deliver to our clients.
              </p>
              <p>
                We are currently in the final round of discussions with the management of <strong>Fritado Technologies Private Limited</strong> regarding the acquisition of the Fritado brand and its AI-powered SaaS platform.
              </p>
              <p>
                As part of the proposed transaction, TattvaLogic plans to integrate the Fritado platform into its expanding product portfolio, positioning it as a flagship SaaS offering under the TattvaLogic ecosystem.
              </p>
              <p className="border-l-4 border-primary pl-6 my-8 italic text-foreground text-xl font-medium">
                Following the completion of the proposed merger, the Fritado platform will operate as a product of TattvaLogic, and the existing corporate structure of Fritado Technologies Private Limited is expected to be consolidated as part of the integration process.
              </p>
              <p>
                This strategic step will also enable TattvaLogic to extend its capabilities and serve the existing client base of Fritado, further strengthening our mission to deliver innovative AI-powered and digital transformation solutions globally.
              </p>
              <p>
                We look forward to sharing further updates as the process reaches its formal conclusion.
              </p>
            </div>

            {/* Signature and CTA */}
            <div className="mt-14 pt-10 border-t border-border/50 flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-zinc-50 dark:bg-zinc-950/50 -mx-8 -mb-8 px-8 pb-8 md:-mx-12 md:-mb-12 md:px-12 md:pb-12 rounded-b-[2rem]">
              <div className="flex items-start gap-5 pt-8">
                <div className="hidden sm:flex w-14 h-14 bg-white dark:bg-zinc-800 rounded-2xl items-center justify-center border border-border shadow-md shrink-0">
                   <span className="text-2xl font-serif italic text-primary font-bold">B</span>
                </div>
                <div>
                  <p className="text-xl font-black text-foreground font-serif tracking-wide mb-1">Banhidipa Mallik</p>
                  <p className="text-primary font-semibold text-sm tracking-wide uppercase mb-1">Director – Brand Vision & Growth Strategy</p>
                  <p className="text-sm text-muted-foreground font-medium">TattvaLogic</p>
                </div>
              </div>

              <div className="pt-8 lg:pt-8 flex justify-end">
                <Button size="lg" className="rounded-full shadow-xl w-full sm:w-auto h-14 px-8 text-lg" asChild>
                  <a href="https://fritado.com" target="_blank" rel="noopener noreferrer">
                    Learn More About Fritado <ArrowRight className="w-5 h-5 ml-2" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
