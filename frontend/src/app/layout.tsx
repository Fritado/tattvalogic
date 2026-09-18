import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
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
        {/* 1. Fritado Website Form Lead Capture SDK */}
        <script
          src="https://server.fritado.com/lead-sdk.js"
          data-project-key="pk_live_7b7d58d8d4f282861a8ea9b0ac21bfe8"
        />

        {/* 2. Fritado Chatpilot AI Conversational Bot */}
        <script
          src="https://server.fritado.com/chatpilot.js"
          data-token="012a3d1d11bc4e92e454eb5a638d86b0"
          async
        />
      </head>
      <body
        className={`${inter.variable} ${outfit.variable} antialiased`}
        suppressHydrationWarning
      >
        <GoogleAnalytics gaId="G-BZ2Z92FE9R" />

        {children}
      </body>
    </html>
  );
}
