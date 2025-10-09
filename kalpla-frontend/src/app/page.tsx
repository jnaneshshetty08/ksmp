'use client';

import Layout from '@/components/Layout';
import HeroSection from '@/components/homepage/HeroSection';
import ProgramOverview, { ModulesBreakdown } from '@/components/homepage/ProgramOverview';
import KeyOutcomes, { ProgramFeatures } from '@/components/homepage/KeyOutcomes';
import WhyChooseKSMP from '@/components/homepage/WhyChooseKSMP';
import HowItWorks from '@/components/homepage/HowItWorks';
import CallToActionSection from '@/components/homepage/CallToActionSection';
import Footer from '@/components/homepage/Footer';

export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <ProgramOverview />
      <KeyOutcomes />
      <WhyChooseKSMP />
      <HowItWorks />
      <ModulesBreakdown />
      <ProgramFeatures />
      <CallToActionSection />
      <Footer />
    </Layout>
  );
}
