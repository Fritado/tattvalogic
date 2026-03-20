import { Metadata } from 'next';
import HomePage from './HomePage';

export const metadata: Metadata = {
  title: 'Digital Transformation & Software Engineering Company',
  description: 'TattvaLogic builds next-generation enterprise software, AI solutions, and digital transformation architectures to help businesses scale globally.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'TattvaLogic - Digital Innovation Partner',
    description: 'Empowering businesses with scalable IT solutions and AI-driven transformation.',
    url: 'https://tattvalogic.com',
  }
};

export default function Page() {
  return <HomePage />;
}
