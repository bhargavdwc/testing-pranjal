const Linkedin = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials } from '../../constants/testimonialsData';


function TestimonialCard({ t, onExpandChange }: { t: typeof testimonials[0], onExpandChange?: (expanded: boolean) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  const getFlagUrl = (loc: string) => {
    const l = loc.toLowerCase();
    if (l.includes("india")) return "in";
    if (l.includes("united state")) return "us";
    if (l.includes("sweden")) return "se";
    if (l.includes("south africa")) return "za";
    if (l.includes("germany")) return "de";
    return "";
  };

  useEffect(() => {
    if (!textRef.current) return;

    const checkTruncation = () => {
      if (textRef.current) {
        setIsTruncated(textRef.current.scrollHeight > textRef.current.clientHeight + 10);
      }
    };

    checkTruncation();

    const resizeObserver = new ResizeObserver(() => checkTruncation());
    resizeObserver.observe(textRef.current);

    return () => resizeObserver.disconnect();
  }, [t.quote]);

  const flagCode = getFlagUrl(t.location);

  return (
    <div className="shrink-0 px-4 sm:px-3 py-6 flex w-full sm:w-85 sm:flex-none">
      <div className="relative flex flex-col h-full w-full bg-linear-to-b from-[#080d1a] to-[#04060d] md:bg-[#080d1a] pb-10 sm:pb-12 shadow-[0_0_20px_rgba(0,168,255,0.15)] md:shadow-[0_0_35px_rgba(0,168,255,0.25)] border border-[#00a8ff]/20 rounded-xl overflow-visible transition-all duration-300 md:hover:shadow-[0_0_50px_rgba(0,168,255,0.4)] md:hover:-translate-y-1">

        {/* Upper Half: Image with Blue Border */}
        <div className="w-full shrink-0 h-74 pb-0">
          <div className="w-full h-full border border-[#00a8ff]/30 rounded-t-xl overflow-hidden shadow-[0_0_15px_rgba(0,168,255,0.1)]">
            <img src={t.image} alt={t.name} className="w-full h-full object-cover object-top" loading="lazy" />
          </div>
        </div>

        {/* Flag Icon */}
        <div className="flex justify-center mt-3 mb-2 h-6">
          {flagCode && (
            <img
              src={`https://flagcdn.com/w40/${flagCode}.png`}
              width="28"
              alt={`${t.location} flag`}
              className="drop-shadow-sm object-contain"
            />
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 px-4 sm:px-6 text-center z-10">
          {/* Name & Location (Fixed height to keep card sizes equal) */}
          <div className="mb-4 h-15 flex flex-col justify-center">
            <h3 className="font-sans text-white text-[18px] sm:text-[20px] tracking-widest uppercase mb-1 line-clamp-1">
              {t.name}
            </h3>
            <p className="text-white text-[10.5px] sm:text-[11px] font-bold tracking-wider line-clamp-1">
              {t.location}
            </p>
          </div>

          {/* Quote (Dynamic Height container) */}
          <div className={`relative mb-2 text-left flex flex-col transition-all duration-300 ${!isExpanded ? 'h-36.25 sm:h-40' : ''}`}>
            <div className="relative z-10 flex-1 overflow-hidden">
              <p
                ref={textRef}
                className={`text-gray-300 text-[11px] leading-loose ${!isExpanded ? 'line-clamp-6' : ''}`}
              >
                {t.quote}
              </p>
            </div>
            {(isTruncated || isExpanded) && (
              <div className="text-right mt-1 shrink-0">
                <button
                  onClick={() => {
                    const next = !isExpanded;
                    setIsExpanded(next);
                    if (onExpandChange) onExpandChange(next);
                  }}
                  className="text-white text-[12px] font-bold tracking-wide hover:text-gray-300 transition-colors cursor-pointer"
                >
                  {isExpanded ? 'Read Less' : 'Read More'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Prominent LinkedIn Icon overlapping bottom */}
        <div className="absolute -bottom-6 sm:-bottom-7 left-1/2 -translate-x-1/2">
          <a
            href={t.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`LinkedIn profile for ${t.name}`}
            className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-[#0a66c2] hover:bg-[#004182] rounded-full text-white transition-all duration-300 shadow-[0_4px_10px_rgba(0,0,0,0.8)]"
          >
            <Linkedin size={24} className="sm:hidden" />
            <Linkedin size={28} className="hidden sm:block" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const expandedCountRef = useRef(0);
  const isHoveringRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isHoveringRef.current || expandedCountRef.current > 0 || !scrollContainerRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const scrollStep = window.innerWidth < 640 ? clientWidth : 340;
        scrollContainerRef.current.scrollBy({ left: scrollStep, behavior: 'smooth' });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollStep = window.innerWidth < 640 ? -scrollContainerRef.current.clientWidth : -400;
      scrollContainerRef.current.scrollBy({ left: scrollStep, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollStep = window.innerWidth < 640 ? scrollContainerRef.current.clientWidth : 400;
      scrollContainerRef.current.scrollBy({ left: scrollStep, behavior: 'smooth' });
    }
  };

  return (
    <section id="testimonials" className="relative pt-8 md:pt-14 overflow-hidden border-b border-white/8 bg-[#000001]">

      {/* Ambient left side glow */}
      <div className="absolute top-1/4 -left-32 w-125 h-125 rounded-full z-0 bg-[#0044cc] blur-[130px] opacity-40 pointer-events-none" />

      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10 text-center mb-6 sm:mb-14">
        <h2 className="font-serif font-bold text-[34px] sm:text-3xl md:text-5xl leading-[1.15] md:leading-tight tracking-tight text-white mb-4 sm:mb-6">
          The results speak <br />
          <span className="relative inline-block text-transparent bg-clip-text bg-linear-to-b from-[rgba(24,37,226,1)] to-[#006eff] drop-shadow-[0_0_15px_rgba(24,37,226,0.6)]">
            louder than the pitch.
            {/* Horizontal flare line */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-40 md:w-64 h-0.5 bg-linear-to-r from-transparent via-[#0080C7] to-transparent shadow-[0_0_20px_rgba(0,128,199,0.9)] opacity-90" />
          </span>
        </h2>
      </div>

      {/* Manual Scrolling Track with side arrows */}
      <div 
        className="relative w-full z-10 max-w-7xl mx-auto px-4 sm:px-8 group"
        onMouseEnter={() => { isHoveringRef.current = true; }}
        onMouseLeave={() => { isHoveringRef.current = false; }}
        onTouchStart={() => { isHoveringRef.current = true; }}
        onTouchEnd={() => { isHoveringRef.current = false; }}
      >

        {/* Left Navigation Arrow */}
        <button
          onClick={scrollLeft}
          aria-label="Previous testimonial"
          className="absolute left-1 sm:left-4 top-[45%] -translate-y-1/2 z-20 w-9 h-9 sm:w-12 sm:h-12 rounded-full border border-white/10 bg-[#050b14]/80 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#00a8ff]/20 hover:border-[#00a8ff]/50 hover:text-[#00a8ff] transition-all duration-300 shadow-[0_0_15px_rgba(0,168,255,0.1)] hover:shadow-[0_0_25px_rgba(0,168,255,0.3)] opacity-90 sm:opacity-100 disabled:opacity-50"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div
          className="relative w-full overflow-hidden"
          style={{
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
            maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)'
          }}
        >
          <div
            ref={scrollContainerRef}
            className="flex sm:gap-4 overflow-x-auto snap-x snap-mandatory py-5 px-0 sm:px-12 scroll-smooth items-start"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style>{`
              .overflow-x-auto::-webkit-scrollbar { display: none; }
            `}</style>

            {testimonials.map((t, idx) => (
              <div className="snap-center shrink-0 w-full sm:w-auto flex justify-center" key={idx}>
                <TestimonialCard 
                  t={t} 
                  onExpandChange={(expanded) => {
                    if (expanded) expandedCountRef.current += 1;
                    else expandedCountRef.current = Math.max(0, expandedCountRef.current - 1);
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Navigation Arrow */}
        <button
          onClick={scrollRight}
          aria-label="Next testimonial"
          className="absolute right-1 sm:right-4 top-[45%] -translate-y-1/2 z-20 w-9 h-9 sm:w-12 sm:h-12 rounded-full border border-white/10 bg-[#050b14]/80 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#00a8ff]/20 hover:border-[#00a8ff]/50 hover:text-[#00a8ff] transition-all duration-300 shadow-[0_0_15px_rgba(0,168,255,0.1)] hover:shadow-[0_0_25px_rgba(0,168,255,0.3)] opacity-90 sm:opacity-100 disabled:opacity-50"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

      </div>

      {/* Final CTA */}
      <div className="mt-8 sm:mt-12 text-center pb-8 z-10 relative">
        <div className="inline-block relative group px-4 w-full sm:w-auto max-w-xl mx-auto">
          {/* Animated glow pulse effect behind the button */}
          <div className="absolute inset-0 bg-[#00a8ff] rounded-full blur-xl opacity-40 group-hover:opacity-70 group-hover:blur-2xl transition-all duration-500 animate-pulse" />

          <a
            href="#contact"
            className="relative flex sm:inline-flex items-center justify-center gap-3 px-8 py-3.5 sm:px-12 sm:py-4 md:px-14 md:py-2 bg-linear-to-r from-[#1749eb] via-[#0066ff] to-[#012368] text-white font-bold text-[17px] sm:text-xl md:text-2xl rounded-full shadow-[0_0_25px_rgba(0,168,255,0.6)] hover:shadow-[0_0_40px_rgba(0,168,255,0.8)] hover:-translate-y-1.5 transition-all duration-300 border border-white/20 hover:border-white/50 w-full sm:w-auto"
          >
            Submit Interview Request
            <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>

    </section>
  );
}
