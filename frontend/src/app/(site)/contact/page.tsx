import { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us | IT Consultants & AI Engineers',
  description: 'Connect with TattvaLogic\'s engineering experts. Request a consultation for digital transformation, AI solutions, staff augmentation, and enterprise IT services.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact TattvaLogic - Top IT Consultants',
    description: 'Connect with TattvaLogic\'s engineering experts. Request a consultation today.',
    url: 'https://tattvalogic.com/contact',
  }
};

export default function Page() {
  return <ContactClient />;
}
