import { Metadata } from 'next';
import CareersClient from './CareersClient';

export const metadata: Metadata = {
  title: 'Careers | Hiring AI Engineers & Software Developers',
  description: 'Join the TattvaLogic team. We are hiring top-tier global talent in software engineering, AI development, and digital transformation. Explore remote and onsite roles.',
  alternates: {
    canonical: '/careers',
  },
  openGraph: {
    title: 'Careers at TattvaLogic - Hiring Engineers',
    description: 'Join the TattvaLogic team. We are hiring top-tier global talent in software engineering and AI development.',
    url: 'https://tattvalogic.com/careers',
  }
};

export default function Page() {
  return <CareersClient />;
}
