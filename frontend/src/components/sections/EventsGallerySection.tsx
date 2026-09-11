import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, X, ChevronLeft, ChevronRight, Calendar, MapPin } from 'lucide-react';

import { EVENT_IMAGES } from '../../constants/eventsGalleryData';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
    },
  },
} as const;

export default function EventsGallerySection() {
  const [selectedTag] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const sliderRef = useRef<HTMLDivElement>(null);

  const filteredImages = selectedTag === 'All'
    ? EVENT_IMAGES
    : EVENT_IMAGES.filter((img) => img.tag === selectedTag);

  // Reset scroll when changing filters
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [selectedTag]);

  // Carousel Navigation
  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  // Lightbox Navigation
  const handlePrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredImages.length - 1));
  }, [lightboxIndex, filteredImages.length]);

  const handleNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null && prev < filteredImages.length - 1 ? prev + 1 : 0));
  }, [lightboxIndex, filteredImages.length]);

  // Keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') setLightboxIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, handlePrev, handleNext]);

  return (
    <section id="events" className="relative py-6 md:py-14 overflow-hidden  bg-[#010308]">

      {/* Background glow */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-10 sm:-top-25 left-[50%] -translate-x-1/2 w-[150%] sm:w-200 h-75 sm:h-200 bg-[radial-gradient(ellipse_at_center,rgba(0,128,199,0.15)_0%,transparent_60%)] blur-[30px] sm:blur-[50px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">

        {/* Header Block & Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-center text-center items-center gap-6 mb-6 sm:mb-12">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4 sm:mb-6">
              <h2 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl lg:text-5xl leading-tight tracking-tight text-white mb-2 max-w-2xl">
                Speaking & Mentoring <br />
                <span className="relative inline-block text-transparent bg-clip-text bg-linear-to-b from-[rgba(24,37,226,1)] to-[#006eff] drop-shadow-[0_0_15px_rgba(24,37,226,0.6)]">In Action</span>
              </h2>
              {/* Horizontal flare line (centered) */}
              <div className="absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 w-40 sm:w-48 md:w-80 h-0.5 bg-linear-to-r from-transparent via-[#0080C7] to-transparent shadow-[0_0_15px_rgba(0,128,199,0.9)] opacity-80" />
            </div>

            <p className="text-[#ffffff] text-sm md:text-base lg:text-lg max-w-2xl font-light leading-relaxed px-2 sm:px-0">
              Interactive workshops, executive strategy masterclasses, and keynote panels in action.
            </p>
          </div>
        </div>


        {/* Sliding Carousel Wrapper */}
        <div className="relative w-full overflow-visible group/slider">
          {/* Side Fades for Premium Aesthetics */}
          <div className="absolute top-0 bottom-0 -left-6 w-8 bg-linear-to-r from-[#000001]/90 to-transparent z-10 pointer-events-none hidden md:block" />
          <div className="absolute top-0 bottom-0 -right-6 w-8 bg-linear-to-l from-[#000001]/90 to-transparent z-10 pointer-events-none hidden md:block" />

          {/* Navigation Buttons (visible on hover) */}
          <button 
            onClick={scrollLeft} 
            className="absolute -left-2 md:-left-5 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 bg-black/60 backdrop-blur-md flex items-center justify-center text-white shadow-[0_0_15px_rgba(0,0,0,0.5)] z-20 opacity-100 md:opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:bg-[#ea580c] hover:border-[#ea580c] cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={scrollRight} 
            className="absolute -right-2 md:-right-5 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 bg-black/60 backdrop-blur-md flex items-center justify-center text-white shadow-[0_0_15px_rgba(0,0,0,0.5)] z-20 opacity-100 md:opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:bg-[#ea580c] hover:border-[#ea580c] cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>

          <motion.div
            ref={sliderRef}
            layout
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none pb-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredImages.map((img) => (
                <motion.div
                  key={img.src}
                  layout
                  variants={itemVariants}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => {
                    const fullIndex = filteredImages.findIndex((fi) => fi.src === img.src);
                    setLightboxIndex(fullIndex);
                  }}
                  className="group snap-start shrink-0 w-[85%] sm:w-[calc(50%-8px)] md:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)] relative aspect-4/3 sm:aspect-square rounded-xl overflow-hidden bg-neutral-900 border border-white/8 hover:border-[#0080C7]/40 shadow-lg hover:shadow-[0_0_20px_rgba(0,128,199,0.25)] cursor-pointer transition-all duration-500 ease-out"
                >
                  {/* Image */}
                  <img
                    src={img.src}
                    alt={img.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />

                  {/* Clean hover overlay with just magnifying glass icon */}
                  <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                    <span className="w-10 h-10 rounded-full bg-[#0080C7] flex items-center justify-center text-black shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300 ease-out">
                      <Maximize2 className="w-5 h-5" />
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

      </div>

      {/* FULLSCREEN LIGHTBOX */}
      <AnimatePresence>
        {lightboxIndex !== null && filteredImages[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-999 flex flex-col justify-between bg-black/95 backdrop-blur-md text-white"
            onClick={(e) => {
              if (e.target === e.currentTarget) setLightboxIndex(null);
            }}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-linear-to-b from-black/80 to-transparent z-10">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-xs font-mono font-bold tracking-widest text-[#3399FF] bg-[#0080C7]/10 border border-[#0080C7]/20 px-3 py-1.5 rounded">
                  {lightboxIndex + 1} / {filteredImages.length}
                </span>
                <span className="hidden sm:inline bg-white/10 text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded border border-white/5">
                  {filteredImages[lightboxIndex].tag}
                </span>
              </div>

              <button
                onClick={() => setLightboxIndex(null)}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 text-white"
                aria-label="Close Lightbox"
              >
                <X className="w-5 h-5 text-gray-300" />
              </button>
            </div>

            {/* Main Image Slider Area */}
            <div className="relative flex-1 flex items-center justify-center px-4 sm:px-12 md:px-24">

              {/* Left Arrow */}
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="absolute left-2 sm:left-8 z-10 w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white/70 hover:text-[#0080C7] hover:border-[#0080C7]/40 hover:bg-black/80 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Centered Image Container */}
              <motion.div
                key={filteredImages[lightboxIndex].src}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="relative max-w-full max-h-[72vh] flex items-center justify-center p-1 bg-neutral-900/60 border border-white/10 rounded-xl overflow-hidden shadow-2xl"
              >
                <img
                  src={filteredImages[lightboxIndex].src}
                  alt={filteredImages[lightboxIndex].title}
                  className="max-w-[90vw] max-h-[68vh] object-contain rounded-lg"
                />
              </motion.div>

              {/* Right Arrow */}
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="absolute right-2 sm:right-8 z-10 w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white/70 hover:text-[#0080C7] hover:border-[#0080C7]/40 hover:bg-black/80 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

            </div>

            {/* Bottom Caption & Mini-Carousel Strip */}
            <div className="bg-linear-to-t from-black/90 via-black/80 to-transparent pt-4 pb-6 px-4 sm:pt-6 sm:pb-8 sm:px-6 z-10">
              <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4 border-b border-white/10 pb-4 sm:pb-6 mb-4 sm:mb-6">
                <div>
                  <h3 className="font-serif text-lg sm:text-2xl font-bold leading-tight tracking-wide text-white">
                    {filteredImages[lightboxIndex].title}
                  </h3>
                  <div className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-1 mt-1.5 sm:mt-2 text-[10.5px] sm:text-xs text-white/60 font-light">
                    <span className="flex items-center gap-1 sm:gap-1.5">
                      <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#3399FF]" />
                      {filteredImages[lightboxIndex].location}
                    </span>
                    <span className="flex items-center gap-1 sm:gap-1.5">
                      <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#3399FF]" />
                      {filteredImages[lightboxIndex].date}
                    </span>
                  </div>
                </div>
              </div>

              {/* Miniature Thumbnail Strips */}
              <div className="max-w-4xl mx-auto flex justify-start sm:justify-center gap-2 sm:gap-2.5 overflow-x-auto py-1 scrollbar-none snap-x pr-4 sm:pr-0">
                {filteredImages.map((thumb, idx) => (
                  <button
                    key={thumb.src}
                    onClick={() => setLightboxIndex(idx)}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden shrink-0 border transition-all duration-300 cursor-pointer snap-center ${lightboxIndex === idx
                      ? 'border-[#0080C7] scale-110 shadow-[0_0_15px_rgba(0,128,199,0.5)] brightness-110 z-10'
                      : 'border-white/20 opacity-40 hover:opacity-85 hover:scale-105'
                      }`}
                  >
                    <img src={thumb.src} alt={thumb.title} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
