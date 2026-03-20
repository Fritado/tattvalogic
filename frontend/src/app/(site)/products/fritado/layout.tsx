import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Fritado AI - Stop Losing Customers | TattvaLogic",
    description: "Fritado AI automates competitor analysis, content creation, lead generation, outreach, and campaigns.",
};

export default function FritadoLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
