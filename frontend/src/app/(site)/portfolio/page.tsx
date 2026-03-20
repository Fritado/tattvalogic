import React from 'react';
import { Metadata } from 'next';
import PortfolioClient from './PortfolioClient';

export const metadata: Metadata = {
  title: 'Portfolio | TattvaLogic',
  description: 'Explore our portfolio of digital platforms, SaaS products, and enterprise solutions developed by TattvaLogic.',
};

export default function PortfolioPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "TattvaLogic Portfolio",
    "description": "Explore our portfolio of digital platforms, SaaS products, and enterprise solutions developed by TattvaLogic.",
    "url": "https://tattvalogic.com/portfolio"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PortfolioClient />
    </>
  );
}
