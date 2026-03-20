import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog & Insights | TattvaLogic",
    description: "Latest trends in AI innovation, software architecture, and digital transformation.",
};

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
