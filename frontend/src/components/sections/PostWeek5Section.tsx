import { CheckCircle } from 'lucide-react';

export default function PostWeek5Section() {
  return (
    <section id="exposure" className="relative pb-8 md:pb-14 overflow-hidden border-b border-white/8 bg-[#000001]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="relative z-20 mt-5">
          {/* Background Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#0044cc] opacity-10 blur-[150px] rounded-full pointer-events-none" />

          <div className=" relative z-10">
            <div className="text-center mb-10 relative">
              {/* Celebration Glow for Aha Moment */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] md:w-3/4 h-50 bg-yellow-500/20 blur-[100px] rounded-full pointer-events-none" />



              <h2 className="relative z-10 text-transparent bg-clip-text bg-linear-to-r from-yellow-400 via-yellow-200 to-yellow-500 text-4xl md:text-6xl lg:text-5xl font-bold tracking-tight mb-8 font-serif drop-shadow-[0_0_25px_rgba(252,211,77,0.6)]">
                What Happens After Week 5?
              </h2>

              <p className="relative z-10 text-gray-200 text-[18px] md:text-[22px] font-sans max-w-6xl mx-auto leading-relaxed px-4 drop-shadow-md">
                After five weeks of simulations, decision principles and AI practice, you move into up to <span className="text-white font-bold drop-shadow-[0_0_10px_rgba(255,255,255,0.6)] border-b-2 border-yellow-500/50 pb-1">30 days of real company exposure</span> where you work on a strategic challenge provided by a real product company.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {/* Step 01 */}
              <div className="bg-[#0a0c10] border border-[#0080C7]/20 p-6 rounded-xl hover:border-[#0080C7]/70 hover:bg-[#0080C7]/10 transition-all duration-300 group shadow-[0_0_20px_rgba(0,128,199,0.15)] hover:shadow-[0_0_40px_rgba(0,128,199,0.4)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#0080C7] opacity-0 group-hover:opacity-20 blur-[50px] transition-opacity duration-500 rounded-full" />
                <div className="text-[#3399FF] text-4xl font-serif font-bold mb-4 opacity-70 group-hover:opacity-100 transition-opacity drop-shadow-[0_0_15px_rgba(0,128,199,0.5)] group-hover:drop-shadow-[0_0_25px_rgba(0,128,199,0.8)] relative z-10">01</div>
                <h3 className="text-white text-lg font-bold mb-3 font-serif leading-snug drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] relative z-10">Understand the Business Challenge</h3>
                <p className="text-gray-400 text-[14px] leading-relaxed font-sans group-hover:text-gray-200 transition-colors relative z-10">
                  The real company leadership introduces the business context, strategic challenge, expectations and constraints you will work within.
                </p>
              </div>
              {/* Step 02 */}
              <div className="bg-[#0a0c10] border border-[#0080C7]/20 p-6 rounded-xl hover:border-[#0080C7]/70 hover:bg-[#0080C7]/10 transition-all duration-300 group shadow-[0_0_20px_rgba(0,128,199,0.15)] hover:shadow-[0_0_40px_rgba(0,128,199,0.4)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#0080C7] opacity-0 group-hover:opacity-20 blur-[50px] transition-opacity duration-500 rounded-full" />
                <div className="text-[#3399FF] text-4xl font-serif font-bold mb-4 opacity-70 group-hover:opacity-100 transition-opacity drop-shadow-[0_0_15px_rgba(0,128,199,0.5)] group-hover:drop-shadow-[0_0_25px_rgba(0,128,199,0.8)] relative z-10">02</div>
                <h3 className="text-white text-lg font-bold mb-3 font-serif leading-snug drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] relative z-10">Investigate and Build Your Point of View</h3>
                <p className="text-gray-400 text-[14px] leading-relaxed font-sans group-hover:text-gray-200 transition-colors relative z-10">
                  You study the real problem, gather evidence, work through incomplete information and decide what you believe the real company should do.
                </p>
              </div>
              {/* Step 03 */}
              <div className="bg-[#0a0c10] border border-[#0080C7]/20 p-6 rounded-xl hover:border-[#0080C7]/70 hover:bg-[#0080C7]/10 transition-all duration-300 group shadow-[0_0_20px_rgba(0,128,199,0.15)] hover:shadow-[0_0_40px_rgba(0,128,199,0.4)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#0080C7] opacity-0 group-hover:opacity-20 blur-[50px] transition-opacity duration-500 rounded-full" />
                <div className="text-[#3399FF] text-4xl font-serif font-bold mb-4 opacity-70 group-hover:opacity-100 transition-opacity drop-shadow-[0_0_15px_rgba(0,128,199,0.5)] group-hover:drop-shadow-[0_0_25px_rgba(0,128,199,0.8)] relative z-10">03</div>
                <h3 className="text-white text-lg font-bold mb-3 font-serif leading-snug drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] relative z-10">Build Your Strategy With Your Judgment</h3>
                <p className="text-gray-400 text-[14px] leading-relaxed font-sans group-hover:text-gray-200 transition-colors relative z-10">
                  You develop your own strategy and document the decisions, trade-offs, risks and reasoning behind your recommendation.
                </p>
              </div>
              {/* Step 04 */}
              <div className="bg-[#0a0c10] border border-[#0080C7]/20 p-6 rounded-xl hover:border-[#0080C7]/70 hover:bg-[#0080C7]/10 transition-all duration-300 group shadow-[0_0_20px_rgba(0,128,199,0.15)] hover:shadow-[0_0_40px_rgba(0,128,199,0.4)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#0080C7] opacity-0 group-hover:opacity-20 blur-[50px] transition-opacity duration-500 rounded-full" />
                <div className="text-[#3399FF] text-4xl font-serif font-bold mb-4 opacity-70 group-hover:opacity-100 transition-opacity drop-shadow-[0_0_15px_rgba(0,128,199,0.5)] group-hover:drop-shadow-[0_0_25px_rgba(0,128,199,0.8)] relative z-10">04</div>
                <h3 className="text-white text-lg font-bold mb-3 font-serif leading-snug drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] relative z-10">Face the Leadership Team and Defend Your Strategy</h3>
                <p className="text-gray-400 text-[14px] leading-relaxed font-sans group-hover:text-gray-200 transition-colors relative z-10">
                  You present your recommendation to real company leaders, respond to their questions and defend the judgment behind the decisions you made.
                </p>
              </div>
            </div>

            <div className="bg-[#0a0c10] border border-[#0080C7]/40 p-6 md:p-8 rounded-xl text-center max-w-7xl mx-auto relative overflow-hidden group hover:border-[#0080C7]/80 transition-all duration-500 shadow-[0_0_40px_-10px_rgba(0,128,199,0.4)] hover:shadow-[0_0_60px_-5px_rgba(0,128,199,0.6)]">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,128,199,0.25)_0%,transparent_70%)] pointer-events-none opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
              <h3 className="text-white font-serif text-2xl md:text-3xl font-bold mb-6 drop-shadow-[0_0_15px_rgba(0,128,199,0.8)] relative z-10">What You Walk Away With</h3>
              <div className="flex flex-col md:flex-row justify-center items-start md:items-center gap-4 md:gap-12 relative z-10 w-fit mx-auto md:w-auto">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-[#0080C7] drop-shadow-[0_0_8px_rgba(0,128,199,0.6)]" size={22} />
                  <span className="text-gray-200 font-sans text-[17px] font-medium drop-shadow-md">Certificate of Completion</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-[#0080C7] drop-shadow-[0_0_8px_rgba(0,128,199,0.6)]" size={22} />
                  <span className="text-gray-200 font-sans text-[17px] font-medium drop-shadow-md">Experience Letter</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-[#0080C7] drop-shadow-[0_0_8px_rgba(0,128,199,0.6)]" size={22} />
                  <span className="text-gray-200 font-sans text-[17px] font-medium drop-shadow-md">Product Leadership Award</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
