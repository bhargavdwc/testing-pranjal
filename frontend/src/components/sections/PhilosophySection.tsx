import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cardData } from '../../constants/philosophyData';

export default function PhilosophySection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const descRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const checkTruncation = () => {
      if (descRef.current && !isDescExpanded) {
        setShowReadMore(descRef.current.scrollHeight > descRef.current.clientHeight);
      }
    };

    // Slight delay to ensure DOM has painted after state change
    const timeout = setTimeout(checkTruncation, 50);
    window.addEventListener('resize', checkTruncation);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', checkTruncation);
    };
  }, [activeIdx, isDescExpanded]);

  const nextCard = () => {
    if (activeIdx < cardData.length - 1) {
      setActiveIdx((prev) => prev + 1);
      setIsDescExpanded(false);
    }
  };
  const prevCard = () => {
    if (activeIdx > 0) {
      setActiveIdx((prev) => prev - 1);
      setIsDescExpanded(false);
    }
  };

  const activeCard = cardData[activeIdx];

  return (
    <section id="transformation" className="relative py-8 md:py-14 overflow-hidden border-b border-white/8 bg-[#000001]">
      {/* Intense Background Radial Glows */}
      <div className="absolute top-[-5%] right-[-10%] w-[60%] h-[80%] z-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.45)_0%,transparent_70%)] blur-[90px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[60%] h-[60%] z-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,128,199,0.15)_0%,transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-12 items-center">

          {/* Left Column: Typography, Manifesto & CTA */}
          <div className="lg:col-span-6 flex flex-col justify-start items-center text-center lg:items-start lg:text-left">
            <h2 className="font-serif font-bold text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight text-white mb-6">
              What changes after this {" "}
              <span className="relative text-transparent bg-clip-text bg-linear-to-b from-[rgba(24,37,226,1)] to-[#006eff] drop-shadow-[0_0_15px_rgba(24,37,226,0.6)]">
                studio program?
                {/* Horizontal flare line */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-48 md:w-72 h-0.5 bg-linear-to-r from-transparent via-[#0080C7] to-transparent shadow-[0_0_20px_rgba(0,128,199,0.9)] opacity-90" />
              </span>
            </h2>

            {/* Manifesto Quote Block */}
            <div className="relative border-l-2 border-[#0080C7] pl-4 md:pl-6 my-6 shadow-[-4px_0_15px_-4px_rgba(0,128,199,0.6)] text-left w-full max-w-xl">
              <p className="text-lg md:text-xl font-serif  text-white/95 leading-relaxed drop-shadow-sm">
                "The Studio is designed to help you build judgment and not just knowledge."
              </p>
            </div>

            <p className="text-gray-300 text-sm md:text-[15px] lg:text-[17px] leading-8 max-w-xl mb-10 font-sans">
              None of these capabilities are developed by watching lectures or memorizing frameworks. They emerge through repeated executive decisions, boardroom discussions, AI leadership simulations, feedback, reflection, and real business challenges.
            </p>

            {/* See How It Works CTA Button */}
            <a
              href="#program"
              className="group flex sm:inline-flex w-full sm:w-auto justify-center items-center gap-2.5 px-10 py-4 bg-linear-to-r from-[#0080C7] to-[rgba(24,37,226,0.9)] rounded-full text-white font-bold text-sm transition-all duration-300 hover:from-[#00a8ff] hover:to-[rgba(24,37,226,1)] shadow-[0_0_20px_rgba(24,37,226,0.4)] hover:shadow-[0_0_30px_rgba(24,37,226,0.6)] hover:-translate-y-0.5 cursor-pointer self-center lg:self-start"
            >
              Submit Interview Request
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>

          {/* Right Column: Manual Cards */}
          <div className="lg:col-span-6 w-full flex flex-col justify-center items-center relative mt-10 lg:mt-0 px-0 lg:px-4">
            {/* Ambient backlight behind the cards */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[120%] bg-[#ea580c] blur-[120px] opacity-15 pointer-events-none -z-10" />

            <div className="relative w-full max-w-170">
              {/* The Card */}
              <div className="relative rounded-xl border border-[#8d5900]/80 transition-all duration-300 shadow-[0_0_60px_rgba(245,158,11,0.5)] hover:border-[#7c4f02] w-full sm:w-130 h-130 sm:h-162.5 lg:h-165 mx-auto">
                <div className="relative rounded-xl bg-[#0a0500] shadow-[inset_0_0_40px_rgba(245,158,11,0.1)] flex flex-col h-full w-full p-4 md:p-6 overflow-hidden">

                  {/* Center Ambient Glow Overlay */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[radial-gradient(circle_at_center,rgba(234,88,12,0.1),transparent_70%)] pointer-events-none z-0" />

                  <div className="relative z-10 flex flex-col justify-between items-center text-center h-full w-full">

                    {/* Background Image (Absolute positioning prevents layout shifts, visible on all cards) */}
                    {!activeCard.isCta && activeCard.image && (
                      <div className="absolute top-[54%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[85%] sm:max-w-92 h-70 sm:h-80.5 md:h-100 lg:h-80.5 flex items-center justify-center pointer-events-none z-0">
                        {/* Decorative glow behind image */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-[#ea580c]/30 blur-[60px] rounded-full" />
                        <img src={activeCard.image} alt={activeCard.title.replace(/\n/g, ' ')} className="relative z-10 w-full h-full object-contain mix-blend-screen scale-[1.25] lg:scale-[1.4]" />
                      </div>
                    )}

                    {/* Header Group */}
                    {!activeCard.isCta && (
                      <div className="flex flex-col items-center w-full z-10 relative">
                        <div className="mb-2">
                          <span className="inline-block px-4 py-1.5 bg-linear-to-r from-[#ea580c] to-[#f59e0b] text-white text-[11px] font-bold tracking-widest rounded-full uppercase shadow-[0_0_15px_rgba(234,88,12,0.4)]">
                            {`Transformation #${parseInt(activeCard.step, 10)}`}
                          </span>
                        </div>

                        <div className="flex flex-col items-center gap-1.5 mb-1">
                          <span className="text-[#f59e0b] text-[10px] font-bold tracking-[0.2em] uppercase">
                            After this program
                          </span>
                          <span className="text-[#f59e0b] text-lg font-bold tracking-[0.15em] uppercase">
                            You will develop
                          </span>
                        </div>

                        <h3 className="font-serif text-2xl md:text-3xl font-bold text-white leading-tight px-2 drop-shadow-md whitespace-pre-line">
                          {activeCard.title}
                        </h3>
                      </div>
                    )}

                    {/* Spacer to push content apart */}
                    {!activeCard.isCta && (
                      <div className="flex-1 w-full min-h-40 sm:min-h-55 md:min-h-65 z-10"></div>
                    )}

                    {/* Description Group */}
                    <div className={`flex flex-col items-center w-full z-10 relative ${activeCard.isCta ? 'flex-1 justify-center' : ''}`}>
                      {!activeCard.isCta ? (
                        <>
                          <p
                            ref={descRef}
                            className={`text-gray-300 text-sm md:text-[14px] font-medium max-w-xl mx-auto transition-all duration-300 mb-1 ${!isDescExpanded ? 'line-clamp-3 md:line-clamp-none' : ''}`}
                          >
                            {activeCard.desc}
                          </p>
                          {(showReadMore || isDescExpanded) && (
                            <button
                              onClick={() => setIsDescExpanded(!isDescExpanded)}
                              className=" text-[#ea580c] text-[11px] font-bold uppercase tracking-wider hover:text-[#f59e0b] transition-colors md:hidden"
                            >
                              {isDescExpanded ? 'Show Less' : 'Read More'}
                            </button>
                          )}
                        </>
                      ) : (
                        <a
                          href="#simulation"
                          className="px-10 py-3.5 bg-linear-to-r from-[#ea580c] to-[#f59e0b] rounded-full text-base font-bold text-white hover:shadow-[0_0_25px_rgba(234,88,12,0.6)] shadow-[0_0_15px_rgba(234,88,12,0.4)] transition-all hover:-translate-y-1 hover:scale-105"
                        >
                          Explore The Studio
                        </a>
                      )}
                    </div>

                    {/* Navigation Footer */}
                    <div className="flex flex-col w-full mt-1 pt-2 border-t border-white/15 z-10 relative">
                      <div className="flex justify-between items-center w-full relative px-2">
                        <button
                          onClick={prevCard}
                          disabled={activeIdx === 0}
                          aria-label="Previous card"
                          className={`w-10 h-10 rounded-full border border-[#f59e0b] bg-transparent flex items-center justify-center text-white transition-all duration-300 ${activeIdx === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#f59e0b]/20'}`}
                        >
                          <ChevronLeft size={20} />
                        </button>

                        <div className="flex flex-col items-center justify-center absolute left-1/2 -translate-x-1/2">
                          <div className="font-mono text-sm font-bold tracking-widest flex gap-2">
                            <span className="text-[#f59e0b]">{activeCard.step}</span>
                            <span className="text-gray-500">/</span>
                            <span className="text-white">08</span>
                          </div>
                        </div>

                        <button
                          onClick={nextCard}
                          disabled={activeIdx === cardData.length - 1}
                          aria-label="Next card"
                          className={`w-10 h-10 rounded-full border border-[#f59e0b] bg-transparent flex items-center justify-center text-white transition-all duration-300 ${activeIdx === cardData.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#f59e0b]/20'}`}
                        >
                          <ChevronRight size={20} />
                        </button>
                      </div>


                    </div>

                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
