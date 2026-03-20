"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
                ? "bg-background/90 backdrop-blur-md border-b border-border shadow-sm py-3"
                : "bg-transparent py-5"
                }`}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="relative w-56 h-16">
                        <Image
                            src="/TattvaLogic.png"
                            alt="TattvaLogic Logo"
                            fill
                            sizes="(max-width: 768px) 160px, 224px"
                            className="object-contain object-left"
                            quality={60}
                            priority
                        />
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                        Home
                    </Link>
                    <div className="group relative">
                        <button className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors py-2">
                            Services <ChevronDown className="w-4 h-4" />
                        </button>
                        <div className="absolute top-full left-0 mt-2 w-56 bg-background border border-border rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                            <Link href="/services/it-services" className="block px-4 py-2 text-sm hover:bg-muted hover:text-primary">
                                IT Services
                            </Link>
                            <Link href="/services/staff-augmentation" className="block px-4 py-2 text-sm hover:bg-muted hover:text-primary">
                                Staff Augmentation
                            </Link>
                            <Link href="/services/ai-solutions" className="block px-4 py-2 text-sm hover:bg-muted hover:text-primary">
                                AI Solutions
                            </Link>
                            <Link href="/services/it-maintenance" className="block px-4 py-2 text-sm hover:bg-muted hover:text-primary">
                                IT Maintenance
                            </Link>
                        </div>
                    </div>
                    <div className="group relative">
                        <button className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors py-2">
                            Products <ChevronDown className="w-4 h-4" />
                        </button>
                        <div className="absolute top-full left-0 mt-2 w-56 bg-background border border-border rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                            <Link href="/products/fritado" className="block px-4 py-2 text-sm hover:bg-muted hover:text-primary">
                                Fritado
                            </Link>
                            <Link href="/products/critical-buzzer" className="block px-4 py-2 text-sm hover:bg-muted hover:text-primary">
                                Critical Buzzer
                            </Link>
                        </div>
                    </div>
                    <Link href="/portfolio" className="text-sm font-medium hover:text-primary transition-colors">
                        Portfolio
                    </Link>
                    <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
                        About Us
                    </Link>
                    <Link href="/blog" className="text-sm font-medium hover:text-primary transition-colors">
                        Blog
                    </Link>
                </nav>

                {/* CTA and Mobile Toggle */}
                <div className="flex items-center gap-4">
                    <Button className="hidden lg:flex" asChild>
                        <Link href="/contact">Get Free Consultation</Link>
                    </Button>
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border p-4 shadow-lg flex flex-col gap-4">
                    <Link href="/" className="text-base font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                        Home
                    </Link>
                    <div className="flex flex-col gap-2">
                        <span className="text-base font-medium text-muted-foreground">Services</span>
                        <Link href="/services/it-services" className="pl-4 text-sm" onClick={() => setIsMobileMenuOpen(false)}>IT Services</Link>
                        <Link href="/services/staff-augmentation" className="pl-4 text-sm" onClick={() => setIsMobileMenuOpen(false)}>Staff Augmentation</Link>
                        <Link href="/services/ai-solutions" className="pl-4 text-sm" onClick={() => setIsMobileMenuOpen(false)}>AI Solutions</Link>
                        <Link href="/services/it-maintenance" className="pl-4 text-sm" onClick={() => setIsMobileMenuOpen(false)}>IT Maintenance</Link>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-base font-medium text-muted-foreground">Products</span>
                        <Link href="/products/fritado" className="pl-4 text-sm" onClick={() => setIsMobileMenuOpen(false)}>Fritado</Link>
                        <Link href="/products/critical-buzzer" className="pl-4 text-sm" onClick={() => setIsMobileMenuOpen(false)}>Critical Buzzer</Link>
                    </div>
                    <Link href="/portfolio" className="text-base font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                        Portfolio
                    </Link>
                    <Link href="/about" className="text-base font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                        About Us
                    </Link>
                    <Link href="/blog" className="text-base font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                        Blog
                    </Link>
                    <Button className="w-full mt-4" asChild onClick={() => setIsMobileMenuOpen(false)}>
                        <Link href="/contact">Get Free Consultation</Link>
                    </Button>
                </div>
            )}
        </header>
    );
}
