import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tattvalogic.com"),
  title: {
    default: "Digital Transformation & IT Solutions | TattvaLogic",
    template: "%s | TattvaLogic",
  },
  description: "TattvaLogic delivers scalable IT solutions, AI-driven platforms, and digital transformation services to accelerate your business growth.",
  keywords: ["Digital Transformation", "Custom Enterprise Software", "AI Solutions", "Staff Augmentation", "Next-Gen Architecture", "IT Consulting"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "TattvaLogic - Digital Innovation Partner",
    description: "Empowering businesses with scalable IT solutions and AI-driven transformation. Scale faster, innovate better.",
    url: "https://tattvalogic.com",
    siteName: "TattvaLogic",
    type: "website",
    images: [
      {
        url: "/TattvaLogic.png", // Fallback branded OS image
        width: 1200,
        height: 630,
        alt: "TattvaLogic Enterprise Software Innovation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TattvaLogic - Digital Innovation Partner",
    description: "Empowering businesses with scalable IT solutions and AI-driven transformation.",
    images: ["/TattvaLogic.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.fritado.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${inter.variable} ${outfit.variable} antialiased`}
        suppressHydrationWarning
      >
        <GoogleAnalytics gaId="G-BZ2Z92FE9R" />
        <Script
          src="https://server.fritado.com/chatpilot.js"
          data-token="3d91f4197059691122072755f3f53bf3"
          strategy="lazyOnload"
        />

        {children}
        <Script 
          src="https://server.fritado.com/lead-sdk.js" 
          data-project-key="pk_live_969c80bf9eab4d0197f19fc232c5b59d"
        />
      </body>
    </html>
  );
}
