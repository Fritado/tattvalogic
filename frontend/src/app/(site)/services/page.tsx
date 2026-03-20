import { Metadata } from 'next';
import ServicesClient from './ServicesClient';

export const metadata: Metadata = {
  title: 'Enterprise IT Services & Custom AI Solutions',
  description: 'Explore TattvaLogic\'s comprehensive technology services including AI automation, custom software engineering, IT maintenance, and staff augmentation.',
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title: 'Enterprise IT Services & Custom AI Solutions | TattvaLogic',
    description: 'Explore TattvaLogic\'s comprehensive technology services including AI automation, custom software engineering, IT maintenance, and staff augmentation.',
    url: 'https://tattvalogic.com/services',
  }
};

export default function Page() {
  return <ServicesClient />;
}
