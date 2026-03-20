import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-secondary text-secondary-foreground pt-16 pb-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Info */}
                    <div className="space-y-4">
                        <div className="relative w-56 h-16 bg-white p-2 rounded-lg">
                            <Image
                                src="/TattvaLogic.png"
                                alt="TattvaLogic"
                                fill
                                className="object-contain object-left"
                            />
                        </div>
                        <p className="text-sm text-gray-300 mt-4 leading-relaxed">
                            TattvaLogic helps organizations accelerate innovation through AI, software engineering, and digital transformation services.
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                            <a aria-label="Visit TattvaLogic LinkedIn" href="https://www.linkedin.com/company/tattvalogic/about/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a aria-label="Visit TattvaLogic Twitter" href="#" className="text-gray-300 hover:text-primary transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a aria-label="Visit TattvaLogic Facebook" href="https://www.facebook.com/tattvalogic" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a aria-label="Visit TattvaLogic Instagram" href="#" className="text-gray-300 hover:text-primary transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4 text-white">Services</h3>
                        <ul className="space-y-3 shrink-0">
                            <li>
                                <Link href="/services/it-services" className="text-sm text-gray-300 hover:text-white transition-colors">
                                    IT Services
                                </Link>
                            </li>
                            <li>
                                <Link href="/services/staff-augmentation" className="text-sm text-gray-300 hover:text-white transition-colors">
                                    Staff Augmentation
                                </Link>
                            </li>
                            <li>
                                <Link href="/services/ai-solutions" className="text-sm text-gray-300 hover:text-white transition-colors">
                                    AI Solutions
                                </Link>
                            </li>
                            <li>
                                <Link href="/services/it-maintenance" className="text-sm text-gray-300 hover:text-white transition-colors">
                                    IT Maintenance
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Products */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4 text-white">Products</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/products/fritado" className="text-sm text-gray-300 hover:text-white transition-colors">
                                    Fritado
                                </Link>
                            </li>
                            <li>
                                <Link href="/products/critical-buzzer" className="text-sm text-gray-300 hover:text-white transition-colors">
                                    Critical Buzzer
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4 text-white">Company</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/portfolio" className="text-sm text-gray-300 hover:text-white transition-colors">
                                    Portfolio
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-sm text-gray-300 hover:text-white transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-sm text-gray-300 hover:text-white transition-colors">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="/careers" className="text-sm text-gray-300 hover:text-white transition-colors">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-sm text-gray-300 hover:text-white transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-400">
                        &copy; {new Date().getFullYear()} TattvaLogic. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
