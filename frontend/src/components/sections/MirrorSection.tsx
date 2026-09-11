import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { painPoints } from '../../constants/mirrorData';

export default function MirrorSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % painPoints.length);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + painPoints.length) % painPoints.length);
  };


  const p = painPoints[currentIndex];
  const IconComponent = p.icon;

  return (
    <section id="mirror" className="relative py-8 md:py-14 overflow-hidden border-b border-white/8 ">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-0 w-full h-[150%] z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] left-[-10%] w-[80%] md:w-[60%] h-[80%] bg-[radial-gradient(ellipse_at_top_left,rgba(37,99,235,0.5)_0%,rgba(30,64,175,0.3)_30%,transparent_70%)] blur-[80px]" />
        <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] bg-[radial-gradient(circle_at_top_left,rgba(0,168,255,0.2)_0%,transparent_50%)] blur-[60px]" />
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-4">

        {/* Header */}
        <div className="max-w-6xl mx-auto text-center mb-10">
          <h2 className="font-serif font-bold text-2xl md:text-5xl leading-tight tracking-tight mb-4 text-white">
            These are real situations faced by<br />
            <span className="relative inline-block text-transparent bg-clip-text bg-linear-to-b from-[rgba(24,37,226,1)] to-[#006eff] drop-shadow-[0_0_15px_rgba(24,37,226,0.6)]">
              experienced Product Managers trying to become Product Leaders.
              {/* Horizontal flare line */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-32 md:w-48 h-0.5 bg-linear-to-r from-transparent via-[#0080C7] to-transparent shadow-[0_0_20px_rgba(0,128,199,0.9)] opacity-90" />
            </span>
          </h2>
        </div>

        {/* Single Pain Point Card Carousel */}
        <div 
          className="relative max-w-7xl mx-auto mt-4 z-10"
        >
          <div className="group relative rounded-xl p-px bg-linear-to-br from-[#00a8ff]/90 via-white/10 to-white/10 shadow-[0_0_20px_rgba(0,0,0,0.3)] transition-all duration-500 ease-out hover:shadow-[0_0_30px_rgba(0,128,199,0.15)] hover:via-white/20 hover:to-white/20 flex flex-col min-h-120 sm:min-h-95 md:min-h-80 lg:min-h-70">
            <div className="relative flex-1 w-full bg-[#060a14] group-hover:bg-[#0a0f1c] rounded-xl p-6 md:p-8 flex flex-col overflow-hidden transition-colors duration-300 justify-center">
              {/* Radial spotlight inside the card */}
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(0,128,199,0.08),transparent_70%)] pointer-events-none" />

              {/* Content Container */}
              <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 md:gap-8">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#0080C7]/5 border border-[#0080C7]/40 shadow-[0_0_15px_rgba(0,128,199,0.1)] flex items-center justify-center text-[#00a8ff] group-hover:bg-[#0080C7]/10 group-hover:border-[#0080C7]/70 group-hover:shadow-[0_0_20px_rgba(0,128,199,0.3)] transition-all duration-300 shrink-0">
                  <IconComponent size={32} strokeWidth={2} />
                </div>
                <div className="text-center sm:text-left flex-1">
                  <h3 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4 tracking-tight">
                    {p.title}
                  </h3>
                  <p className="text-gray-300 text-[15px] md:text-2xl  transition-colors duration-300 group-hover:text-white font-medium ">
                    "{p.body}"
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button 
            onClick={prevCard} 
            className="absolute -left-3.75 sm:-left-7.5 md:-left-6 lg:-left-15 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-[#060a14] border border-white/20 text-white hover:bg-[#0080C7]/20 hover:border-[#0080C7]/50 shadow-lg transition-all z-20 cursor-pointer focus:outline-none"
            aria-label="Previous card"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={nextCard} 
            className="absolute -right-3.75 sm:-right-7.5 md:-right-6 lg:-right-15 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-[#060a14] border border-white/20 text-white hover:bg-[#0080C7]/20 hover:border-[#0080C7]/50 shadow-lg transition-all z-20 cursor-pointer focus:outline-none"
            aria-label="Next card"
          >
            <ChevronRight size={24} />
          </button>

   
        </div>
       {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {painPoints.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className="p-2 md:p-3 focus:outline-none group flex items-center justify-center cursor-pointer"
                aria-label={`Go to card ${i + 1}`}
              >
                <span 
                  className={`h-2 md:h-2.5 rounded-full transition-all duration-300 ${
                    i === currentIndex ? "bg-[#00a8ff] w-8 md:w-8" : "bg-white/20 group-hover:bg-white/40 w-2 md:w-2.5"
                  }`}
                />
              </button>
            ))}
          </div>
        {/* Closing Copy */}
        <div className="max-w-7xl mx-auto mt-4 md:mt-8 relative z-10">
          <div className="p-2 md:p-2 border border-white/10 bg-[#0a0e17]/80 backdrop-blur-md rounded-xl shadow-[0_0_40px_rgba(24,37,226,0.15)] relative overflow-hidden">
            {/* Subtle inner glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,168,255,0.05)_0%,transparent_70%)]" />
            <p className="text-gray-200 text-[15px] md:text-[14px] leading-relaxed text-center relative z-10">
              The gap is rarely another Product Management skill. It is understanding what you need to do differently when you move from managing products to leading them.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}