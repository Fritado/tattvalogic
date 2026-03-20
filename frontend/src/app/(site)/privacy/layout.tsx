import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | TattvaLogic",
    description: "TattvaLogic's Privacy Policy and data handling practices.",
};

export default function PrivacyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
