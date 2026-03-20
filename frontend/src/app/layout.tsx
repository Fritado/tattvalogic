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
      <body
        className={`${inter.variable} ${outfit.variable} antialiased`}
        suppressHydrationWarning
      >
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-BZ2Z92FE9R" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-BZ2Z92FE9R');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
