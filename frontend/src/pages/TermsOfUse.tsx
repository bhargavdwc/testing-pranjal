import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function TermsOfUse() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative bg-[#000001] text-white min-h-screen flex flex-col font-sans overflow-hidden">
      <Helmet>
        <title>Terms of Use | Pranjal Sarkar</title>
        <meta name="description" content="Terms of Use for Pranjal Sarkar's AI Product Leadership Studio. Read our guidelines, intellectual property policies, and terms of service." />
        <meta property="og:title" content="Terms of Use | Pranjal Sarkar" />
        <meta property="og:description" content="Terms of Use for Pranjal Sarkar's AI Product Leadership Studio. Read our guidelines, intellectual property policies, and terms of service." />
        <meta name="twitter:title" content="Terms of Use | Pranjal Sarkar" />
        <meta name="twitter:description" content="Terms of Use for Pranjal Sarkar's AI Product Leadership Studio. Read our guidelines, intellectual property policies, and terms of service." />
      </Helmet>
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-[#0080C7] blur-[150px] opacity-20 pointer-events-none z-0" />
      
      <Navbar />

      <main className="flex-1 relative z-10 pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 md:px-12 max-w-4xl mx-auto w-full">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-[34px] sm:text-3xl md:text-5xl font-serif font-bold leading-[1.15] md:leading-normal mb-2">
            <span className="relative inline-block text-transparent bg-clip-text bg-linear-to-b from-[rgba(24,37,226,1)] to-[#006eff] drop-shadow-[0_0_15px_rgba(24,37,226,0.6)] pb-2">
              Terms of Use
              {/* Horizontal flare line */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 sm:w-64 md:w-96 h-0.5 bg-linear-to-r from-transparent via-[#0080C7] to-transparent shadow-[0_0_20px_rgba(0,128,199,0.9)] opacity-90" />
            </span>
          </h1>
          <p className="text-gray-400 text-[13px] sm:text-sm mt-3 sm:mt-4">Last updated: April 2026</p>
        </div>
        
        <div className="space-y-5 sm:space-y-6 text-gray-300 leading-[1.65] sm:leading-relaxed text-[14.5px] md:text-[16px] text-justify sm:text-left">
          <p>This page is currently under construction. Please check back later for our full Terms of Use.</p>
          <p>For any immediate questions, please write to <a href="mailto:office@pranjalsarkar.com" className="text-[#3B82F6] hover:underline">office@pranjalsarkar.com</a></p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
