import { Check, X, Info } from 'lucide-react';
import { shouldApply, shouldNotApply } from '../../constants/whoShouldApplyData';

export default function WhoShouldApplySection() {

  return (
    <section id="who-should-apply" className="relative py-8 md:py-14 overflow-hidden border-b border-white/8 bg-[#000000]">
      {/* Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-25 left-1/2 -translate-x-1/2 w-[150%] sm:w-225 h-75 sm:h-150 bg-[radial-gradient(ellipse_at_top,rgba(0,136,255,0.25)_0%,rgba(0,60,180,0.12)_45%,transparent_75%)] blur-2xl sm:blur-[60px]" />

        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-10 mix-blend-screen pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, rgba(0, 140, 255, 0.35) 1.5px, transparent 0)',
            backgroundSize: '28px 28px'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">

        {/* Header */}
        <div className="text-center mb-6 sm:mb-14">
          <div className="relative mb-6 inline-block">
            <h2 className="font-serif font-bold text-[34px] sm:text-4xl md:text-5xl lg:text-5xl leading-[1.15] tracking-tight text-white mb-3 text-center">
              Who Should Apply.<br />
              <span className="text-transparent bg-clip-text bg-linear-to-b from-[rgba(24,37,226,1)] to-[#006eff] drop-shadow-[0_0_15px_rgba(24,37,226,0.6)]">
                And Who Shouldn't.
              </span>
            </h2>

            {/* Centered Lens Flare Line */}
            <div className="relative mt-2 mx-auto w-32 sm:w-48 h-0.75 pointer-events-none flex items-center justify-center">
              <div className="w-full h-[1.5px] bg-linear-to-r from-transparent via-[#0066ff] via-25% to-transparent opacity-95" />
              <div className="absolute inset-0 h-0.75 bg-linear-to-r from-transparent via-[#002ec7] via-50% to-transparent blur-[1.5px]" />
              <div className="absolute w-10 h-1.5 bg-[#0075ff] rounded-full blur-[3px] opacity-95 mix-blend-screen" />
              <div className="absolute w-20 h-2 bg-[#0075ff]/60 rounded-full blur-[7px]" />
            </div>
          </div>

          <p className="text-[#ffffff] text-[15px] md:text-base lg:text-lg leading-[1.6] md:leading-relaxed max-w-6xl mx-auto text-center font-normal mt-4 md:mt-3 px-2 md:px-0 opacity-90">
            AI Product Leadership Studio is designed for experienced Product Managers who are ready to move into product leadership roles. The simulations, decision principles and real company exposure assume you are already operating as a capable PM. If you are at an earlier stage of your career, then it is suggested that you will get far more value by building a stronger product management foundation first.  </p>
        </div>

        {/* Two columns for criteria */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

          {/* Should Apply Card */}
          <div className="group relative rounded-xl p-px bg-linear-to-br from-[#002ec7]/90 via-[#002ec7]/20 to-transparent shadow-[0_0_30px_rgba(0,136,255,0.15)] md:shadow-[-20px_-20px_60px_rgba(0,136,255,0.4),10px_10px_30px_rgba(0,136,255,0.3)] transition-all duration-300 ">
            <div className="relative h-full w-full bg-linear-to-b from-[#03060a] to-[#01081a] md:bg-[#03060a] rounded-xl p-4 sm:p-6 md:p-8 flex flex-col overflow-hidden z-10">
              <div className="absolute top-0 right-0 w-50 h-50 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-[radial-gradient(circle_at_top_right,rgba(0,136,255,0.35),transparent_70%)] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-[radial-gradient(circle_at_bottom_left,rgba(0,136,255,0.15),transparent_70%)] pointer-events-none" />

              <h3 className="font-serif text-[22px] sm:text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 border-b border-[#002ec7]/40 pb-4 relative z-10 drop-shadow-[0_0_10px_rgba(0,136,255,0.9)]">
                You Should Apply If...
              </h3>

              <div className="space-y-4 sm:space-y-5 relative z-10">
                {shouldApply.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3.5 sm:gap-4 group/item">
                    <div className="mt-0.5 shrink-0 w-6.5 h-6.5 sm:w-6 sm:h-6 rounded-full bg-[#0075ff]/30 flex items-center justify-center border border-[#00a8ff]/60  transition-all duration-300 ">
                      <Check size={14} className="text-[#00a8ff]" />
                    </div>
                    <p className="text-gray-100 text-[15px] sm:text-base leading-[1.6] md:leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Should Not Apply Card */}
          <div className="group relative rounded-xl p-px bg-linear-to-bl from-red-600/80 via-red-600/20 to-transparent shadow-[0_0_30px_rgba(239,68,68,0.15)] md:shadow-[20px_-20px_60px_rgba(239,68,68,0.3),-10px_10px_30px_rgba(239,68,68,0.2)] transition-all duration-300 ">
            <div className="relative h-full w-full bg-linear-to-b from-[#03060a] to-[#120303] md:bg-[#03060a] rounded-xl p-4 sm:p-6 md:p-8 flex flex-col overflow-hidden z-10">
              <div className="absolute top-0 right-0 w-50 h-50 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.35),transparent_70%)] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-[radial-gradient(circle_at_bottom_left,rgba(239,68,68,0.15),transparent_70%)] pointer-events-none" />

              <h3 className="font-serif text-[22px] sm:text-2xl md:text-3xl font-bold text-white/90 mb-6 md:mb-8 border-b border-red-500/40 pb-4 relative z-10 drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]">
                You Should Not Apply If...
              </h3>

              <div className="space-y-4 sm:space-y-5 relative z-10">
                {shouldNotApply.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3.5 sm:gap-4 group/item">
                    <div className="mt-0.5 shrink-0 w-6.5 h-6.5 sm:w-6 sm:h-6 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/50  transition-all duration-300 ">
                      <X size={14} className="text-red-400 " />
                    </div>
                    <p className="text-gray-300 text-[15px] sm:text-base leading-[1.6] md:leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Footer Note */}
        <div className="max-w-7xl mx-auto space-y-4 md:space-y-8 relative z-10">
          <div className="group relative rounded-xl p-px bg-linear-to-r from-[#00a8ff]/70 via-[#0075ff]/30 to-white/10 shadow-[0_0_25px_rgba(0,168,255,0.2)] md:shadow-[0_0_40px_rgba(0,168,255,0.3)] transition-all duration-300 md:hover:shadow-[0_0_60px_rgba(0,168,255,0.5)]">
            <div className="relative bg-linear-to-br from-[#060a14] to-[#03050a] md:bg-[#060a14] rounded-xl p-4 md:p-6 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,168,255,0.15),transparent_80%)] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="flex flex-col md:flex-row gap-4 md:gap-6 relative z-10 md:items-center">
                <div className="flex items-center gap-3.5 md:items-start">
                  <div className="shrink-0 w-10.5 h-10.5 md:w-12 md:h-12 rounded-full bg-[#0075ff]/25 flex items-center justify-center border border-[#00a8ff]/50 shadow-[0_0_15px_rgba(0,168,255,0.4)] transition-transform duration-300 group-hover:scale-110">
                    <Info className="w-5.5 h-5.5 md:w-6 md:h-6 text-[#00a8ff] drop-shadow-[0_0_10px_rgba(0,168,255,0.8)]" />
                  </div>
                  <h4 className="text-white font-bold text-[17px] md:hidden drop-shadow-[0_0_8px_rgba(0,168,255,0.4)]">A Note on Admissions</h4>
                </div>
                
                <div className="flex-1">
                  <h4 className="text-white font-bold text-lg mb-2 hidden md:block drop-shadow-[0_0_8px_rgba(0,168,255,0.4)]">A Note on Admissions:</h4>
                  <div className="space-y-3">
                    <p className="text-gray-200 text-[14.5px] sm:text-[15px] md:text-sm leading-[1.6] md:leading-relaxed">
                      This is an application-only program. We keep each cohort with very selective product managers to ensure every participant receives meaningful interaction, executive feedback, peer learning and an immersive leadership experience.
                    </p>
                    <p className="text-gray-200 text-[14.5px] sm:text-[15px] md:text-sm leading-[1.6] md:leading-relaxed">
                      Meeting the eligibility criteria does not automatically guarantee admission. We review every application to ensure the Studio remains valuable for everyone in the cohort.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-[#057aff] font-serif font-bold text-sm md:text-lg drop-shadow-[0_0_12px_rgba(0,168,255,0.8)] max-w-6xl mx-auto leading-relaxed relative z-10">
            This Studio is designed for a very specific stage of a Product Leader's journey. If you're at that stage, you'll get extraordinary value. If you're not, this isn't the right program yet.
          </p>
        </div>

      </div>
    </section>
  );
}
