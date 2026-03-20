"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(() => {
        if (typeof window === "undefined") return false;
        const consent = window.localStorage.getItem("tattvalogic-cookie-consent");
        return !consent;
    });

    const acceptAll = () => {
        localStorage.setItem("tattvalogic-cookie-consent", "all");
        setIsVisible(false);
    };

    const declineAll = () => {
        localStorage.setItem("tattvalogic-cookie-consent", "necessary");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-6 right-6 z-[100] md:left-auto md:max-w-xl">
            <div className="glass-card p-6 md:p-8 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl bg-black/40">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />
                
                <div className="flex flex-col gap-6 relative z-10">
                    <div>
                        <h4 className="font-bold text-xl mb-3 text-white">Privacy & Experience</h4>
                        <p className="text-sm text-blue-100/60 font-sans leading-relaxed">
                            We use cookies to enhance your browsing experience, analyze our traffic, and serve personalized content. By clicking &quot;Accept All&quot;, you consent to our use of cookies.
                        </p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                        <Button variant="outline" onClick={declineAll} className="flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent rounded-full">
                            Necessary Only
                        </Button>
                        <Button onClick={acceptAll} className="flex-1 rounded-full shadow-lg shadow-primary/20">
                            Accept All
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
