import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import psHeadshot from '../../assets/pranjalsarkar/pranjal-sarkar-about-headshot.webp';
const youtubeVideo = '/video/Aipls%20Simulation%20Explainer%20Video1.mp4';
import { Play } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 90,
      damping: 18,
    },
  },
} as const;

const floatAnimation = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  }
};

export default function AboutSection() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };


  return (
    <section id="about" className="relative py-8 md:py-14 overflow-hidden border-b border-white/8 bg-[#000001]">

      {/* Background Radial Glow */}
      <div className="absolute top-1/4 -left-1/4 w-[60%] h-[60%] z-0 bg-[radial-gradient(ellipse_at_center,rgba(0,128,199,0.12)_0%,transparent_60%)] pointer-events-none" />

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >

        {/* Header Block */}
        <motion.div className="flex flex-col text-center justify-center mb-4 sm:mb-12" variants={itemVariants}>
          <h2 className="font-serif font-bold text-[34px] sm:text-4xl md:text-5xl lg:text-5xl leading-[1.15] md:leading-tight tracking-tight text-white mb-2 sm:mb-4 text-center">
            The Person Behind{' '} <br />
            <span className="text-transparent bg-clip-text bg-linear-to-b from-[rgba(24,37,226,1)] to-[#006eff] drop-shadow-[0_0_15px_rgba(24,37,226,0.6)]">
              AIPLS
            </span>
          </h2>
          <p className="text-gray-200 text-[14px] sm:text-base md:text-xl max-w-2xl mx-auto">
            Why AIPLS was built and the experience that shaped it.
          </p>
        </motion.div>

        {/* The Real Reason - Simple Clean Rows */}
        <motion.div className="max-w-7xl mx-auto  px-4" variants={itemVariants}>


        </motion.div>

        {/* Two Column Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

          {/* Left Column (Desktop): Premium Image Card with Floating Animation */}
          <motion.div
            className="lg:col-span-5 w-full max-w-full lg:max-w-xl mx-auto relative"
            variants={itemVariants}
            {...floatAnimation}
          >
            <div className="relative rounded-xl overflow-hidden border border-white/10 transition-all duration-500 hover:border-white/20 shadow-[0_0_40px_rgba(0,128,199,0.15)] hover:shadow-[0_0_50px_rgba(0,128,199,0.3)] group">
              <div className="relative aspect-4/5 w-full bg-[#0a0c10]">
                {/* Visual shadow mask overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none" />

                <img
                  src={psHeadshot}
                  alt="Pranjal Sarkar - Founder and Lead Mentor"
                  className="w-full h-full object-cover transition-all duration-700 transform "
                />

                {/* Live Mentor Indicator Pill */}
                <div className="absolute md:top-3 md:left-3 top-1 left-1 z-20 px-3 py-1.5 bg-[#0a0c10]/80 backdrop-blur-md border border-[#0080C7]/50 rounded-full flex items-center gap-2 shadow-[0_0_20px_rgba(0,128,199,0.3)] group-hover:shadow-[0_0_25px_rgba(0,128,199,0.5)] transition-shadow">
                  <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,1)] animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white font-mono drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">Founder</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column (Desktop): Metrics & Narrative */}
          <div className="lg:col-span-7 flex flex-col justify-center  ">

            {/* Biography Narratives */}
            <motion.div variants={itemVariants} className="mb-2">
              <h3 className="text-[26px] sm:text-3xl font-serif font-bold text-white mb-2 leading-[1.2] sm:leading-normal">The Gap I Kept Seeing</h3>
              <p className="text-gray-300 text-[14.5px] text-justify md:text-[14px] lg:text-[16px] leading-[1.6] md:leading-6 font-sans">
                After years of mentoring experienced Product Managers, I kept seeing the same gap. They knew how to build products, but leadership required them to make business decisions, influence across teams, think beyond their own product and defend their judgment with senior leaders. Very few had a place to practise these capabilities before the role demanded them.
              </p>
              <br className="hidden sm:block" />
              <div className="h-4 sm:hidden"></div>
              <p className="text-gray-300 text-[14.5px] text-justify md:text-left md:text-[15px] lg:text-[16px] leading-[1.6] md:leading-6 mb-5 sm:mb-4 font-sans">
                AIPLS was built to create that practice ground, where experienced Product Managers can develop leadership judgment before the stakes become real.
              </p>

              <h3 className="text-[26px] sm:text-3xl font-serif font-bold text-white mb-2 leading-[1.2] sm:leading-normal">Pranjal Sarkar</h3>
              <p className="text-gray-300 text-[14.5px] text-justify md:text-left md:text-[15px] lg:text-[16px] leading-[1.6] md:leading-6 font-sans">
                Over the last 20 years, I have built three startups from zero, scaled products and businesses across growth stages, owned business outcomes and led product strategy and GTM at enterprise scale. Alongside my industry work, I have mentored product professionals across 10 countries.
              </p>
            </motion.div>

            {/* Quick Metrics Row - Separate Cards */}
            <motion.div className="grid grid-cols-4 gap-2 sm:gap-4 mt-6 md:mt-2" variants={itemVariants}>

              {/* Card 1 */}
              <div className="relative flex flex-col text-center bg-[#0a0c10] border border-white/20 rounded-lg shadow-[0_0_30px_rgba(0,128,199,0.2)] md:shadow-[0_0_30px_rgba(0,128,199,0.3)] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,168,255,0.15)_0%,transparent_70%)] pointer-events-none" />
                <div className="relative z-10 py-2 sm:p-3 md:p-5 border-b border-white/20 flex-1 flex flex-col justify-center">
                  <div className="text-4xl sm:text-5xl font-serif md:text-7xl font-bold text-transparent bg-clip-text bg-linear-to-b from-[rgba(24,37,226,1)] to-[#006eff] drop-shadow-[0_0_15px_rgba(24,37,226,0.6)] mb-0 sm:mb-1">20</div>
                  <div className="text-white text-[9px] sm:text-sm md:text-base">Years</div>
                </div>
                <div className="relative z-10 px-1 py-1.5 sm:p-3 md:p-4 flex-1 flex items-center justify-center">
                  <div className="text-[8px] sm:text-xs text-gray-300 leading-tight sm:leading-snug">Product and Business<br className="hidden lg:block" /> Leadership</div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="relative flex flex-col text-center bg-[#0a0c10] border border-white/20 rounded-lg shadow-[0_0_30px_rgba(0,128,199,0.2)] md:shadow-[0_0_30px_rgba(0,128,199,0.3)] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,168,255,0.15)_0%,transparent_70%)] pointer-events-none" />
                <div className="relative z-10 py-2 sm:p-3 md:p-5 border-b border-white/20 flex-1 flex flex-col justify-center">
                  <div className="text-4xl sm:text-5xl font-serif md:text-7xl font-bold text-transparent bg-clip-text bg-linear-to-b from-[rgba(24,37,226,1)] to-[#006eff] drop-shadow-[0_0_15px_rgba(24,37,226,0.6)] mb-0 sm:mb-2">03</div>
                  <div className="text-white text-[9px] sm:text-sm md:text-base">Startups</div>
                </div>
                <div className="relative z-10 px-1 py-1.5 sm:p-3 md:p-4 flex-1 flex items-center justify-center">
                  <div className="text-[8px] sm:text-xs text-gray-300 leading-tight sm:leading-snug">Built from Idea<br className="hidden lg:block" /> to Business</div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="relative flex flex-col text-center bg-[#0a0c10] border border-white/20 rounded-lg shadow-[0_0_30px_rgba(0,128,199,0.2)] md:shadow-[0_0_30px_rgba(0,128,199,0.3)] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,168,255,0.15)_0%,transparent_70%)] pointer-events-none" />
                <div className="relative z-10 py-2 sm:p-3 md:p-5 border-b border-white/20 flex-1 flex flex-col justify-center">
                  <div className="text-4xl sm:text-5xl font-serif md:text-7xl font-bold text-transparent bg-clip-text bg-linear-to-b from-[rgba(24,37,226,1)] to-[#006eff] drop-shadow-[0_0_15px_rgba(24,37,226,0.6)] mb-0 sm:mb-2">04</div>
                  <div className="text-white text-[9px] sm:text-sm md:text-base">Orgs</div>
                </div>
                <div className="relative z-10 px-1 py-1.5 sm:p-3 md:p-4 flex-1 flex items-center justify-center">
                  <div className="text-[8px] sm:text-xs text-gray-300 leading-tight sm:leading-snug">Exp Across Small to Large Enterprises</div>
                </div>
              </div>

              {/* Card 4 */}
              <div className="relative flex flex-col text-center bg-[#0a0c10] border border-white/20 rounded-lg shadow-[0_0_30px_rgba(0,128,199,0.2)] md:shadow-[0_0_30px_rgba(0,128,199,0.3)] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,168,255,0.15)_0%,transparent_70%)] pointer-events-none" />
                <div className="relative z-10 py-2 sm:p-3 md:p-5 border-b border-white/20 flex-1 flex flex-col justify-center">
                  <div className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold text-transparent bg-clip-text bg-linear-to-b from-[rgba(24,37,226,1)] to-[#006eff] drop-shadow-[0_0_15px_rgba(24,37,226,0.6)] mb-0 sm:mb-2">10</div>
                  <div className="text-white text-[9px] sm:text-sm md:text-base">Countries</div>
                </div>
                <div className="relative z-10 px-1 py-1.5 sm:p-3 md:p-4 flex-1 flex items-center justify-center">
                  <div className="text-[8px] sm:text-xs text-gray-300 leading-tight sm:leading-snug">Product Professionals<br className="hidden lg:block" /> Mentored</div>
                </div>
              </div>

            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Origin Story Video Block - Independently animated */}
      <motion.div
        className="max-w-7xl mx-auto mt-6 sm:mt-24 px-4 sm:px-6 md:px-8 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
        }}
      >
        <div className="text-center mb-4 sm:mb-10 relative">
          <h3 className="text-white font-serif font-bold text-[28px] sm:text-3xl md:text-5xl leading-[1.2] md:leading-tight mb-3 sm:mb-4">
            The Exact Moment I Decided <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-b from-[rgba(24,37,226,1)] to-[#006eff] drop-shadow-[0_0_15px_rgba(24,37,226,0.6)]">This Program Needed to Exist</span>
          </h3>
          <p className="text-gray-400 text-[15px] md:text-lg mb-6 sm:mb-8">A message from the founder</p>
          {/* Highlight Line */}
          <div className="w-40 sm:w-64 md:w-96 h-0.5 mx-auto bg-linear-to-r from-transparent via-[#0080C7] to-transparent shadow-[0_0_15px_rgba(0,128,199,0.8)]"></div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col items-center mt-6 md:mt-8">
          {/* Video Placeholder */}
          <div
            className="w-full aspect-video rounded-xl bg-[#0a0e17] border border-white/10 shadow-[0_0_40px_rgba(24,37,226,0.15)] relative overflow-hidden flex items-center justify-center group cursor-pointer mb-6"
            onClick={toggleVideo}
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,168,255,0.05)_0%,transparent_70%)] pointer-events-none z-10" />

            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover [&:fullscreen]:object-contain [&:-webkit-full-screen]:object-contain z-0"
              src={youtubeVideo}
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
              controls={isVideoPlaying}
            />

            {!isVideoPlaying && (
              <>
                {/* Thumbnail overlay */}
                <img
                  src="/thumbnail/about-video-thumbnail.webp"
                  alt="Pranjal Sarkar Simulation and Explainer Video Preview"
                  className="absolute inset-0 w-full h-full object-fill z-[5] pointer-events-none"
                />

                {/* Play Button Glow */}
                <div className="absolute w-16 h-16 sm:w-24 sm:h-24 bg-[#0080C7]/30 blur-[20px] sm:blur-[30px] rounded-full group-hover:bg-[#0080C7]/50 transition-all duration-500 z-20 pointer-events-none" />

                {/* Play Button */}
                <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white/10 border border-white/20 backdrop-blur-md rounded-full flex items-center justify-center relative z-20 group-hover:scale-110 transition-transform duration-300 pointer-events-none">
                  <Play className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white ml-1 sm:ml-1.5 opacity-90 group-hover:opacity-100" fill="currentColor" />
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
