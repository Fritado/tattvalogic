import React from "react";
import Link from "next/link";

export default function GlobalFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-6 px-8 border-t border-zinc-200 bg-white/50 backdrop-blur-sm mt-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs font-medium text-zinc-500">
          © {currentYear} <span className="text-primary font-bold">TattvaLogic</span>. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="text-[10px] font-bold text-zinc-400 hover:text-primary transition-colors uppercase tracking-widest">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-[10px] font-bold text-zinc-400 hover:text-primary transition-colors uppercase tracking-widest">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
