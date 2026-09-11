import { useState } from 'react';
import { Users, TrendingUp } from 'lucide-react';
import pranjalsarkar from "../../assets/pranjalsarkar/pranjal-sarkar-portrait.webp";
import { stats } from '../../constants/heroData';

export default function HeroSection() {
  const [fading] = useState(false);

  return (
    <section id="hero" className="relative w-full lg:min-h-screen flex flex-col justify-between overflow-hidden bg-[#000001] border-b border-white/8 pt-24 lg:pt-28 pb-6 lg:pb-8">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(37,99,235,0.25)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left_center,rgba(0,168,255,0.1)_0%,transparent_50%)]" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 flex flex-col justify-center flex-1 gap-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-4 items-stretch">

          {/* Left Column - Content */}
          <div className="order-2 lg:order-1 lg:col-span-7 flex flex-col items-center text-center lg:items-start lg:text-left self-center mt-0">
            <div
              className={`w-full transition-all duration-300 ease-out ${fading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                }`}
            >
              {/* Pre-headline */}
              <div className="flex justify-center lg:justify-start mb-6 lg:mb-5">
                <span className="inline-flex items-center gap-2 px-4 py-1 bg-[#0080C7]/10 border border-[#0080C7]/20 rounded-full text-[12px] md:text-[15px] font-semibold text-blue-300 shadow-[0_0_15px_rgba(0,128,199,0.15)] max-w-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0080C7] shadow-[0_0_8px_rgba(0,128,199,0.9)] shrink-0" />
                  <span className="text-center lg:text-left leading-tight">For professionals with 5+ years of experience preparing for leadership in Product Management.</span>
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-serif font-bold leading-[1.1] tracking-tight text-white mb-6 text-2xl md:text-3xl lg:text-5xl">
                The Rules Change When You <span className="text-transparent bg-clip-text bg-linear-to-b from-[rgba(24,37,226,1)] to-[#006eff] drop-shadow-[0_0_15px_rgba(24,37,226,0.6)]">Step Into Product Leadership.</span>
              </h1>

              {/* Horizontal flare line */}
              <div className="w-24 md:w-32 lg:w-40 h-[2.5px] bg-linear-to-r from-[#00a8ff] via-[#2563EB] to-transparent mb-5 rounded-full shadow-[0_0_12px_rgba(0,168,255,0.8)] mx-auto lg:mx-0" />

              {/* Sub-headline Part 2 */}
              <p className="text-gray-200 text-[16px] md:text-[18px] leading-relaxed max-w-2xl mx-auto mb-4">
                AIPLS is a 5-week leadership development system followed by up to 30 days of real company exposure. Every week you make executive decisions, face the consequences inside a realistic business simulation and discover exactly where your judgment is strong and where it needs to grow.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col items-center lg:items-start gap-2 justify-start pt-6 pb-6">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-1.5 px-8 py-3.5 rounded-md text-white text-[14px] lg:text-[15px] font-bold tracking-wide no-underline transition-all duration-200 bg-linear-to-r from-[#0080C7] to-[rgba(24,37,226,0.9)] shadow-[0_0_20px_rgba(24,37,226,0.4)] hover:from-[#00a8ff] hover:to-[rgba(24,37,226,1)] hover:shadow-[0_0_30px_rgba(24,37,226,0.6)] hover:-translate-y-0.5 w-full md:w-fit"
                >
                  Submit Interview Request <span className="text-[14px] lg:text-[15px] font-bold">→</span>
                </a>
                <p className="text-gray-400 text-xs md:text-xs font-medium text-center lg:text-left lg:ml-1">
                  Every application includes a 1:1 conversation with Pranjal Sarkar before enrollment.
                </p>
              </div>

              {/* Trust line */}
              <div className="mt-4 flex items-center justify-center lg:justify-start gap-3 lg:ml-1 w-full">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-blue-900 border-2 border-[#000001] flex items-center justify-center z-30"><Users size={12} className="text-blue-300" /></div>
                  <div className="w-7 h-7 rounded-full bg-blue-800 border-2 border-[#000001] flex items-center justify-center z-20"><TrendingUp size={12} className="text-blue-200" /></div>
                </div>
                <p className="text-gray-300 text-[13px] font-semibold">1,000+ product professionals mentored across 10 countries.</p>
              </div>

            </div>
          </div>

          {/* Right Column - Image of Pranjal Sarkar */}
          <div className="order-1 lg:order-2 lg:col-span-5 flex justify-center lg:justify-end relative self-end translate-y-0 lg:translate-y-8">
            {/* Background Radial Glow & Concentric Circles */}
            <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none translate-x-12 translate-y-12">
              <div className="absolute w-[140%] aspect-square rounded-full bg-[radial-gradient(circle_at_center,rgba(0,128,199,0.25)_0%,transparent_60%)] blur-[20px]" />
              {/* Concentric rings matching the reference */}
              <div className="absolute w-[50%] aspect-square rounded-full border border-[#0080C7]/4" />
              <div className="absolute w-[65%] aspect-square rounded-full border border-[#0080C7]/[0.07]" />
              <div className="absolute w-[80%] aspect-square rounded-full border border-[#0080C7]/9" />
              <div className="absolute w-[95%] aspect-square rounded-full border border-[#0080C7]/9" />
              <div className="absolute w-[130%] aspect-square rounded-full border border-[#0080C7]/5" />
              <div className="absolute w-[150%] aspect-square rounded-full border border-[#0080C7]/5" />
              <div className="absolute w-[170%] aspect-square rounded-full border border-[#0080C7]/5" />
              <div className="absolute w-[190%] aspect-square rounded-full border border-[#0080C7]/2" />
            </div>

            <div className="relative w-full max-w-80 md:max-w-95 lg:max-w-120 aspect-3.5/4 z-10">
              <img
                src={pranjalsarkar}
                alt="Pranjal Sarkar Portrait"
                className="w-full h-full object-fill object-center drop-shadow-[0px_0px_113px_rgba(24,37,226,0.6)]"
              />
            </div>
          </div>

        </div>

        {/* Trust Stats Container - Box with Glow */}
        <div className="flex flex-col w-full max-w-7xl mt-1 lg:mt-0 mb-4 relative z-20 gap-4">
          <div className="grid grid-cols-2 md:grid-cols-4 bg-[#0a0e17]/80 backdrop-blur-md border border-white/5 rounded-xl shadow-xl overflow-hidden">
            {stats.map((st, i) => (
              <div
                key={i}
                className={`flex flex-col items-center justify-center py-5 px-4 cursor-default border-white/5 ${i % 2 !== 0 ? 'border-l' : ''} ${i > 0 ? 'md:border-l' : ''} ${i >= 2 ? 'border-t md:border-t-0' : ''}`}
              >
                
                <span className="font-sans font-bold text-6xl md:text-8xl leading-none mb-1.5 text-transparent bg-clip-text bg-linear-to-b from-[rgba(24,37,226,1)] to-[#006eff] drop-shadow-[0_0_15px_rgba(24,37,226,0.6)]">
                  {st.num}
                </span>
                <span className="text-white text-xs md:text-sm font-medium tracking-wide text-center">
                  {st.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}