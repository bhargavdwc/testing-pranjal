import ScrollStack, { ScrollStackItem } from './ScrollStack';
import { CheckCircle } from 'lucide-react';
import { stages } from '../../constants/judgementData';

export default function JudgementSection() {
  return (
    <section id="simulation" className="relative py-4 md:py-14 overflow-hidden border-b border-white/8 bg-[#000001]">
      {/* Background Decorative Gradients */}
      {/* Background Decorative Wavy Dots & Glow */}
      <div className="absolute top-0 right-0 w-150 h-150 md:w-225 md:h-225 opacity-80 pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(circle, #0080C7 2px, transparent 2px)',
          backgroundSize: '32px 32px',
          transform: 'perspective(800px) rotateX(60deg) rotateY(-20deg) skewX(20deg) scale(1.2) translateX(10%) translateY(-10%)',
          WebkitMaskImage: 'radial-gradient(circle at 70% 30%, black 10%, transparent 60%)',
          maskImage: 'radial-gradient(circle at 70% 30%, black 10%, transparent 60%)'
        }}
      />
      <div className="absolute top-0 right-0 w-[50%] h-[60%] z-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,68,204,0.4)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[60%] h-[60%] z-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,128,199,0.1)_0%,transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">

        {/* Header */}
        <div className="max-w-6xl mx-auto text-center justify-center mb-0">
          <h2 className="font-serif font-bold text-4xl md:text-5xl lg:text-5xl leading-tight tracking-tight text-white mb-4">
            What You Learn<br />
            <span className="relative inline-block text-transparent bg-clip-text bg-linear-to-b from-[rgba(24,37,226,1)] to-[#006eff] drop-shadow-[0_0_15px_rgba(24,37,226,0.6)]">
              Each Week
              {/* Horizontal flare line */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 md:w-80 h-0.5 bg-linear-to-r from-transparent via-[#0044cc] to-transparent shadow-[0_0_20px_rgba(0,68,204,0.9)] opacity-90" />
            </span>
          </h2>

          <p className="text-gray-300 text-sm md:text-[15px] lg:text-[17px] leading-8 max-w-6xl mx-auto font-sans">
            Every week builds one executive capability through simulation, live instruction, AI practice and independent study.
          </p>
        </div>

        {/* Disable ScrollStack overlap effect on mobile so tall cards can be read fully without being covered */}
        <style>{`
          @media (max-width: 1023px) {
            .mobile-no-stack .scroll-stack-card {
              transform: none !important;
              filter: none !important;
              margin-bottom: 3rem !important;
            }
          }
        `}</style>

        {/* Interactive Scroll Stack Container */}
        <ScrollStack
          className="mobile-no-stack"
          useWindowScroll={true}
          itemDistance={150}
          itemScale={0.03}
          itemStackDistance={20}
          stackPosition="4%"
          scaleEndPosition="2%"
          baseScale={0.9}
          blurAmount={0}
        >
          {stages.map((s, i) => (
            <ScrollStackItem key={i}>
              <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-12 px-4 py-6 md:p-8 rounded-xl bg-[#0a0c10] border border-white/10 border-l-[3px] border-l-[#0044cc] shadow-[inset_30px_30px_80px_-20px_rgba(0,68,204,0.4),0_15px_40px_rgba(0,0,0,0.5)] hover:shadow-[inset_30px_30px_100px_-20px_rgba(0,68,204,0.5),0_20px_50px_rgba(0,0,0,0.6)] hover:border-white/20 hover:border-l-[#0044cc] h-auto min-h-100 flex-col justify-between transition-all duration-500 relative overflow-hidden group">

                {/* Inner radial glow */}
                <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-[radial-gradient(ellipse_at_top_right,rgba(0,68,204,0.15),transparent_70%)] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Bottom-left Line Art Filler (Fills empty space without increasing card height) */}
                <div className="absolute bottom-0 left-0 w-70 h-full max-h-62.5 pointer-events-none opacity-15 group-hover:opacity-30 transition-opacity duration-700" style={{ WebkitMaskImage: 'linear-gradient(to top, black 10%, transparent 90%)', maskImage: 'linear-gradient(to top, black 10%, transparent 90%)' }}>
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id={`grid-pattern-${i}`} width="30" height="30" patternUnits="userSpaceOnUse">
                        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#00a8ff" strokeWidth="0.5"/>
                        <circle cx="30" cy="30" r="1.5" fill="#00a8ff" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#grid-pattern-${i})`} />
                  </svg>
                </div>

                {/* Left Column */}
                <div className="flex flex-col gap-8 relative z-10 lg:sticky lg:top-8 self-start">
                  <div>
                    <span className="text-[#0080C7] text-[32px] md:text-[40px] font-bold tracking-[0.2em] uppercase block mb-3 font-mono drop-shadow-[0_0_5px_rgba(0,128,199,0.5)]">
                      {s.phase}
                    </span>
                    <h3 className="font-serif text-2xl lg:text-2xl font-bold text-white mb-5 leading-tight tracking-tight drop-shadow-md pr-4">
                      {s.title}
                    </h3>
                  </div>

                  <div className="pt-6 lg:pt-0">
                    {/* Transformation Expected */}
                    <h3 className="text-[#3399FF] text-[16px] font-bold uppercase tracking-widest mb-3 font-mono drop-shadow-[0_0_5px_rgba(0,128,199,0.3)]">
                      Transformation Expected:
                    </h3>
                    <p className="text-gray-300 text-[14px] md:text-[18px] leading-relaxed font-sans italic border-l-2 border-[#0080C7]/40 pl-4 py-1 bg-linear-to-r from-[#0080C7]/5 to-transparent">
                      {s.transformation}
                    </p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-6 relative z-10 pt-6 lg:pt-0">
                  <div>

                    {/* Curriculum Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-x-10 md:gap-y-8">
                      {s.curriculum.map((cur, idx) => (
                        <div key={idx} className="flex flex-col bg-[#0f1624] md:bg-transparent p-5 md:p-0 rounded-xl md:rounded-none border border-[#0080C7]/20 md:border-transparent shadow-lg md:shadow-none relative">
                          <h3 className="text-white font-serif font-bold text-[17px] leading-tight mb-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                            {cur.category}
                          </h3>
                          <div className="mb-4 block max-w-[95%]">
                            {(() => {
                              const parts = cur.meta.split('. ');
                              const goal = parts[0] + (parts.length > 1 ? '.' : '');
                              const specs = parts.slice(1).join('. ').replace(/·/g, '|');
                              return (
                                <div className="flex flex-col gap-1.5">
                                  <span className="text-[13px] md:text-[14.5px] leading-relaxed font-medium text-[#00a8ff]">
                                    {goal}
                                  </span>
                                  {specs && (
                                    <span className="text-[11px] md:text-[18px] tracking-wider text-[#3399FF]">
                                      {specs}
                                    </span>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                          <ul className="space-y-3">
                            {cur.items.map((item, iIdx) => (
                              <li key={iIdx} className="flex items-start gap-2.5 text-gray-300 text-[14px] leading-relaxed font-sans">
                                <CheckCircle size={15} strokeWidth={2.5} className="text-[#0080C7] shrink-0 mt-0.75 drop-shadow-[0_0_5px_rgba(0,128,199,0.5)]" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>

        {/* Spacer to allow the final card to scroll cleanly without the next section overlapping it prematurely (Desktop only) */}
        <div className="hidden lg:block h-[60vh] min-h-75" aria-hidden="true" />


      </div>
    </section>
  );
}
