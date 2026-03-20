import { Metadata } from "next";

export const metadata: Metadata = {
    title: "CriticalBuzzer - The AI Watchdog for SaaS | TattvaLogic",
    description: "Risk mitigation system built for early detection. Setup SaaS monitoring in less than 60 seconds.",
};

export default function CriticalBuzzerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
