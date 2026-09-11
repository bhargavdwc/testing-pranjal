import { motion } from 'motion/react';
import { useState, useRef } from 'react';
const introVideo = '/video/Aipls Introduction Video1.mp4';
import { Play } from 'lucide-react';
import { leadershipSteps, leadershipDetails } from '../../constants/programIntroData';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 16,
    },
  },
} as const;

export default function ProgramIntroSection() {
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
    <section id="program" className="relative pt-8 md:py-10 overflow-hidden border-b border-white/8 bg-[#000001]">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-0 w-[60%] h-[60%] z-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,128,199,0.15)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[70%] h-[70%] z-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(0,128,199,0.1)_0%,transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">

        {/* Section Header */}
        <motion.div
          className="text-center mb-6 max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif font-bold text-2xl md:text-4xl lg:text-5xl leading-tight tracking-tight text-white mb-8">
            AI Product Leadership Studio <br />
            <span className="relative inline-block text-transparent bg-clip-text bg-linear-to-b from-[rgba(24,37,226,1)] to-[#006eff] drop-shadow-[0_0_15px_rgba(24,37,226,0.6)]">
              Program Structure
              {/* Horizontal flare line */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-48 md:w-80 h-0.5 bg-linear-to-r from-transparent via-[#0080C7] to-transparent shadow-[0_0_20px_rgba(0,128,199,0.9)] opacity-90" />
            </span>
          </h2>
          <div className="text-gray-300 text-sm md:text-[13px] lg:text-[15px] leading-5 font-sans space-y-2">
            AIPLS develops Product Leadership through four connected layers:
          </div>
        </motion.div>

        {/* Leadership Steps Timeline */}
        <div className="relative max-w-7xl mx-auto mb-10 mt-10 px-4">
          <motion.div
            className="flex flex-row justify-between items-start gap-1 sm:gap-2 md:gap-4 relative"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Horizontal Line for all screens */}
            <div className="absolute top-7 md:top-12 left-[10%] right-[10%] h-0.5 bg-linear-to-r from-transparent via-white/10 to-transparent -z-10" />
            <motion.div
              className="absolute top-7 md:top-12 left-[10%] h-0.5 bg-linear-to-r from-[#00a8ff] to-[#0044cc] -z-10 shadow-[0_0_15px_rgba(0,168,255,0.6)]"
              initial={{ width: "0%" }}
              whileInView={{ width: "80%" }}
              transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
              viewport={{ once: true }}
            />

            {leadershipSteps.map((step, i) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="flex flex-col items-center group w-1/4 relative px-1 sm:px-2"
                >
                  {/* Icon Node Container */}
                  <div className="relative mb-3 md:mb-6 cursor-default">
                    {/* Glowing background on hover */}
                    <div className="absolute inset-0 bg-[#00a8ff]/20 rounded-xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-125" />

                    <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-24 md:h-24 rounded-xl bg-[#060a14] border border-[#00a8ff]/50 flex items-center justify-center relative z-10 transition-all duration-300 shadow-[0_0_40px_rgba(0,168,255,0.2)]">
                      <IconComponent
                        strokeWidth={1.5}
                        className="text-white/60 group-hover:text-[#00a8ff] transition-colors duration-300 drop-shadow-md w-6 h-6 sm:w-7 sm:h-7 md:w-11 md:h-11"
                      />
                    </div>
                  </div>

                  {/* Text Container */}
                  <div className="text-center px-0 md:px-4 cursor-default">
                    <h3 className="font-serif text-[10px] sm:text-xs md:text-2xl font-black text-white tracking-wider md:tracking-[0.15em] uppercase mb-2 group-hover:text-[#00a8ff] transition-colors duration-300 drop-shadow-md wrap-break-word">
                      {step.label}
                    </h3>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Leadership Details Section */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 mb-5 relative z-10 space-y-8">
          {leadershipDetails.map((detail, index) => (
            <motion.div
              key={index}
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="group relative rounded-xl p-px bg-linear-to-br from-[#0044cc]/90 via-transparent to-transparent shadow-[0_0_25px_rgba(0,68,204,0.2)] transition-all duration-500 ease-out hover:shadow-[0_0_40px_rgba(0,68,204,0.4)] hover:from-[#0066ff]/90"
            >
              <div className="relative h-full bg-[#060a14]/95 backdrop-blur-md rounded-[11px] px-4 py-6 md:p-8 flex flex-col overflow-hidden">
                {/* Subtle background glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(ellipse_at_top_right,rgba(0,68,204,0.15),transparent_70%)] pointer-events-none transition-opacity duration-500 opacity-50 group-hover:opacity-100" />

                <motion.div variants={itemVariants}>
                  <div className="flex items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 shrink-0 rounded-xl bg-linear-to-br from-[#0066ff] to-[#0044cc] flex items-center justify-center text-white font-bold text-lg shadow-[0_0_20px_rgba(0,102,255,0.5)] border-2 border-[#060a14]">
                        0{index + 1}
                      </div>
                      <h3 className="font-serif text-2xl md:text-3xl font-bold text-white tracking-wide group-hover:text-[#00a8ff] transition-colors duration-300">
                        {detail.title}
                      </h3>
                    </div>
                    
                    {/* Right-side icon */}
                    <div className="shrink-0 w-14 h-14 rounded-full bg-[#00a8ff]/10 flex items-center justify-center text-[#00a8ff] shadow-[0_0_15px_rgba(0,168,255,0.2)] group-hover:bg-[#00a8ff]/20 group-hover:shadow-[0_0_25px_rgba(0,168,255,0.4)] group-hover:scale-110 transition-all duration-300">
                      {(() => {
                        const Icon = leadershipSteps[index].icon;
                        return <Icon size={26} strokeWidth={2} className="drop-shadow-sm" />;
                      })()}
                    </div>
                  </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 relative z-10">
                  <motion.div variants={itemVariants} className="flex flex-col gap-3">
                    <h4 className="text-[#00a8ff] font-sans font-bold text-xs md:text-sm tracking-widest uppercase">What is it?</h4>
                    <p className="text-gray-300 text-[15px] leading-relaxed font-sans">{detail.whatIsIt}</p>
                  </motion.div>

                  <motion.div variants={itemVariants} className="flex flex-col gap-3">
                    <h4 className="text-[#00a8ff] font-sans font-bold text-xs md:text-sm tracking-widest uppercase">How does it work?</h4>
                    <p className="text-gray-300 text-[15px] leading-relaxed font-sans">{detail.howItWorks}</p>
                  </motion.div>

                  <motion.div variants={itemVariants} className="flex flex-col gap-3">
                    <h4 className="text-[#00a8ff] font-sans font-bold text-xs md:text-sm tracking-widest uppercase">What transformation does it bring?</h4>
                    <p className="text-gray-300 text-[15px] leading-relaxed font-sans">{detail.transformation}</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Video Block */}
        <motion.div
          className="max-w-7xl mx-auto px-4 md:px-8 relative z-10"
          initial="hidden"
          id='simulation'
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
          }}
        >
          <div className="max-w-full mx-auto flex flex-col items-center h-58 md:h-125 lg:h-150">
            {/* Video Placeholder */}
            <div
              className="w-full aspect-video rounded-lg bg-[#0a0e17] border border-white/10 shadow-[0_0_40px_rgba(24,37,226,0.15)] relative overflow-hidden flex items-center justify-center group cursor-pointer mb-5"
              onClick={toggleVideo}
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,168,255,0.05)_0%,transparent_70%)] pointer-events-none z-10" />

              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover [&:fullscreen]:object-contain [&:-webkit-full-screen]:object-contain z-0"
                src={introVideo}
                onPlay={() => setIsVideoPlaying(true)}
                onPause={() => setIsVideoPlaying(false)}
                controls={isVideoPlaying}
              />

              {!isVideoPlaying && (
                <>
                  {/* Thumbnail overlay */}
                  <img
                    src="/thumbnail/program-intro-thumbnail.webp"
                    alt="AI Product Leadership Studio Introduction Video Preview by Pranjal Sarkar"
                    className="absolute inset-0 w-full h-full object-fill z-[5] pointer-events-none"
                  />

                  {/* Play Button Glow */}
                  <div className="absolute w-24 h-24 bg-[#0080C7]/30 blur-[30px] rounded-full group-hover:bg-[#0080C7]/50 transition-all duration-500 z-20 pointer-events-none" />

                  {/* Play Button */}
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 border border-white/20 backdrop-blur-md rounded-full flex items-center justify-center relative z-20 group-hover:scale-110 transition-transform duration-300 pointer-events-none">
                    <Play className="w-8 h-8 md:w-10 md:h-10 text-white ml-1.5 opacity-90 group-hover:opacity-100" fill="currentColor" />
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
