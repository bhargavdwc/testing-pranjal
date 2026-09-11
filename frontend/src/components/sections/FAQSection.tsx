import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';

import { faqs } from '../../constants/faqData';

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const displayedFaqs = showAll ? faqs : faqs.slice(0, 4);

  return (
    <section id="faq" className="relative py-8 md:py-14 overflow-hidden bg-[#000000] text-white">

      {/* Outer section dot matrix grid overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute inset-0 opacity-12 mix-blend-screen pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, rgba(0, 140, 255, 0.35) 1.5px, transparent 0)',
            backgroundSize: '28px 28px'
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 relative z-10">

        {/* Scoped Background Concentric Arcs & Radial Glow (Scoped to max-w-4xl) */}
        <div className="absolute -top-10 sm:-top-20 left-1/2 -translate-x-1/2 w-[150%] sm:w-full max-w-full sm:max-w-170 md:max-w-200 h-64 sm:h-130 pointer-events-none z-0">

          {/* Radial ambient glow behind title */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full sm:w-187.5 h-48 sm:h-100 bg-[radial-gradient(ellipse_at_top,rgba(0,136,255,0.25)_0%,rgba(0,60,180,0.1)_45%,transparent_75%)] blur-2xl" />

          {/* SVG Concentric Dome Arcs */}
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 960 520"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Outer Arc Gradient (Opacity 0 at center apex 50%) */}
              <linearGradient id="arc-grad-outer-scoped" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0044ff" stopOpacity="0.45" />
                <stop offset="25%" stopColor="#0070f3" stopOpacity="0.04" />
                <stop offset="50%" stopColor="#00c3ff" stopOpacity="0" />
                <stop offset="75%" stopColor="#0070f3" stopOpacity="0.04" />
                <stop offset="100%" stopColor="#0044ff" stopOpacity="0.45" />
              </linearGradient>

              {/* Inner Arc Gradient (Opacity 0 at center apex 50%) */}
              <linearGradient id="arc-grad-inner-scoped" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0033cc" stopOpacity="0.45" />
                <stop offset="25%" stopColor="#0066ff" stopOpacity="0.01" />
                <stop offset="50%" stopColor="#00a2ff" stopOpacity="0" />
                <stop offset="75%" stopColor="#0066ff" stopOpacity="0.01" />
                <stop offset="100%" stopColor="#0033cc" stopOpacity="0.45" />
              </linearGradient>

              <filter id="arc-glow-scoped" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Outer Concentric Dome Arc (Plain Solid Line) */}
            <path
              d="M 30 500 A 450 450 0 0 1 930 500"
              stroke="url(#arc-grad-outer-scoped)"
              strokeWidth="1.75"
              fill="none"
              filter="url(#arc-glow-scoped)"
            />

            {/* Inner Concentric Dome Arc (Plain Solid Line) */}
            <path
              d="M 125 500 A 355 355 0 0 1 835 500"
              stroke="url(#arc-grad-inner-scoped)"
              strokeWidth="1.5"
              fill="none"
              filter="url(#arc-glow-scoped)"
            />
          </svg>
        </div>

        {/* Centered Header */}
        <div className="text-center mb-2 md:mb-10 relative z-10">
          <div className="relative inline-block mb-2 md:mb-6">
            <h2 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl leading-tight tracking-tight text-white mb-2">
              Still Have  <br />
              <span className="relative inline-block text-transparent bg-clip-text bg-linear-to-b from-[rgba(24,37,226,1)] to-[#006eff] drop-shadow-[0_0_15px_rgba(24,37,226,0.6)]">Questions?</span>
            </h2>

            {/* Horizontal Lens Flare Line (Centered under Answered matching image 100%) */}
            <div className="relative mt-4 mx-auto w-48 sm:w-70 h-0.75 pointer-events-none flex items-center justify-center">
              {/* 1. Base laser line track */}
              <div className="w-full h-[1.5px] bg-linear-to-r from-transparent via-[#0066ff] via-25% to-transparent opacity-95" />

              {/* 2. Tight horizontal glow streak */}
              <div className="absolute inset-0 h-0.75 bg-linear-to-r from-transparent via-[#00d5ff] via-50% to-transparent blur-[1.5px]" />

              {/* 3. Centered Hotspot Flare Core (100% match to image center spot) */}

              <div className="absolute w-15 h-2 bg-[#0044ff] rounded-full blur-[10px] opacity-95 mix-blend-screen" />
              <div className="absolute w-44 h-2 bg-[#0070f3]/60 rounded-full blur-[7px]" />
            </div>
          </div>

          <p className="text-[#d9e1ec] text-base sm:text-lg leading-relaxed max-w-xl mx-auto mt-4">
            Here are the answers to the ones we hear most often.
          </p>
        </div>

        {/* Centered Accordion Cards (100% Wireframe Copy) */}
        <div className="max-w-5xl mx-auto flex flex-col gap-4">
          {displayedFaqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="group relative rounded-2xl p-px bg-linear-to-br from-[#0044ff]/90 via-white/10 to-white/10 shadow-[0_0_20px_rgba(0,0,0,0.3)] transition-all duration-300 ease-out hover:shadow-[0_0_30px_rgba(0,128,199,0.15)] hover:via-white/20 hover:to-white/20 flex flex-col"
              >
                <div className="relative h-full bg-[#060a14] group-hover:bg-[#0a0f1c] rounded-[15px] p-3.5 sm:p-5 flex flex-col overflow-hidden transition-colors duration-300">
                  {/* Inner top gradient highlight line */}
                  <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-linear-to-r from-transparent via-[#38bdf8]/60 to-transparent opacity-80" />

                  <button
                    id={`faq-btn-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${i}`}
                    className="w-full text-left flex justify-between items-center cursor-pointer bg-transparent border-none outline-none focus:outline-none gap-3 sm:gap-4 relative z-10"
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <div className="flex items-center gap-3 sm:gap-5 flex-1">
                      {/* Circular Question Icon Badge */}
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#0070f3]/50 bg-[#00142c] text-[#0070f3] flex items-center justify-center text-[18px] sm:text-2xl font-bold shrink-0">
                        ?
                      </div>
                      <span className="font-bold text-[14.5px] sm:text-[18px] text-white leading-snug">
                        {f.q}
                      </span>
                    </div>

                    {/* Circular Plus/Minus Toggle Icon */}
                    <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full border border-[#0070f3]/10 bg-[#001226] text-[#0070f3] flex items-center justify-center shrink-0 transition-all duration-300   group-hover:text-[#38bdf8] ${isOpen ? 'bg-[#001c38] text-[#0070f3] ' : ''
                      }`}>
                      {isOpen ? (
                        <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0070f3]" />
                      ) : (
                        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0070f3] group-hover:text-[#0070f3]" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-answer-${i}`}
                        role="region"
                        aria-labelledby={`faq-btn-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                        className="relative z-10 overflow-hidden"
                      >
                        <div className="pt-3 sm:pt-4 text-[#c8ced6] text-[13.5px] sm:text-base leading-relaxed pl-11 sm:pl-[3.85rem]">
                          {f.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>

        {faqs.length > 4 && (
          <div className="flex justify-center mt-8 sm:mt-12 relative z-10">
            <button
              onClick={() => setShowAll(!showAll)}
              className="group relative flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-[#001026] border border-[#0070f3]/40 text-[#00a8ff] font-bold text-sm tracking-wide shadow-[inset_0_0_10px_rgba(0,136,255,0.25)] hover:shadow-[0_0_20px_rgba(0,168,255,0.4)] hover:border-[#00a8ff]/60 hover:text-white transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            >
              <span>{showAll ? 'View Less' : 'View More FAQs'}</span>
              <div className="absolute inset-0 rounded-xl bg-linear-to-r from-transparent via-[#00a8ff]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
