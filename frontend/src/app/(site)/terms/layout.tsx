import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service | TattvaLogic",
    description: "TattvaLogic's Terms of Service and legal agreements.",
};

export default function TermsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
