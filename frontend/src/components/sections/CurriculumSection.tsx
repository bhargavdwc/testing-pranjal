import { useState } from 'react';
import {  Video, Box, Layers, Users, Calendar, Presentation, Handshake, FileText, DollarSign, Clock } from 'lucide-react';

import { modules } from '../../constants/curriculumData';

export default function CurriculumSection() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="curriculum" className="relative py-8 md:py-14 overflow-hidden border-b border-white/8 bg-[#010308]">

      {/* Enhanced Multi-Layer Ambient Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        {/* Top Center Primary Radial Glow */}
        <div className="absolute -top-25 left-1/2 -translate-x-1/2 w-225 h-150 bg-[radial-gradient(ellipse_at_top,rgba(0,136,255,0.25)_0%,rgba(0,60,180,0.12)_45%,transparent_75%)] blur-[60px]" />

        {/* Right Side Cyan Glow */}
        <div className="absolute top-[30%] right-[-10%] w-137.5 h-137.5 bg-[radial-gradient(circle_at_center,rgba(0,168,255,0.15)_0%,transparent_60%)] blur-[80px]" />

        {/* Fine Texture Dot Matrix Overlay */}
        <div
          className="absolute inset-0 opacity-10 mix-blend-screen pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, rgba(0, 140, 255, 0.35) 1.5px, transparent 0)',
            backgroundSize: '28px 28px'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">

        {/* Header Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-5">
          <div>


            <div className="relative mb-4 flex flex-col items-center lg:items-start text-center lg:text-left">
              <h2 className="font-serif font-bold text-4xl md:text-5xl lg:text-5xl leading-tight tracking-tight text-white mb-2">
                Everything You
                <br />
                <span className="text-transparent bg-clip-text bg-linear-to-b from-[rgba(24,37,226,1)] to-[#006eff] drop-shadow-[0_0_15px_rgba(24,37,226,0.6)]">Need to Know Before You Apply</span>
              </h2>

              {/* Horizontal Lens Flare Line */}

            </div>

          </div>

          {/* Key Facts List with Gradient Borders & Blue Glow */}
          <div className="grid grid-cols-2 gap-5">
            {[
              { label: 'Live sessions', value: '32+ hrs', icon: Video },
              { label: 'Weekly Practice', value: '3-5 hrs', icon: Box },
              { label: 'Program Duration', value: '5 Weeks', icon: Layers },
              { label: 'Company Exposure', value: '30 Days', icon: Users },
            ].map((s, i) => (
              <div
                key={i}
                className="group relative rounded-xl p-px bg-linear-to-br from-[#00a8ff]/70 via-white/10 to-white/10 transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,168,255,0.25)] hover:from-[#00a8ff] flex flex-col"
              >
                <div className="relative h-full bg-[#060a14] group-hover:bg-[#0a0f1c] rounded-xl p-3 sm:p-5 flex items-center gap-3 sm:gap-4 overflow-hidden transition-colors duration-300">
                  {/* Top highlight line */}
                  <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-linear-to-r from-transparent via-[#00a2ff]/60 to-transparent opacity-80" />

                  {/* Circular Icon Badge */}
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-[#0070f3]/10 bg-[#001026] text-[#0075ff] flex items-center justify-center shrink-0 shadow-[inset_0_0_10px_rgba(0,136,255,0.25)] group-hover:border-[#00a8ff] transition-colors">
                    <s.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#00a8ff] drop-shadow-[0_0_6px_rgba(0,168,255,0.6)]" />
                  </div>

                  <div className="flex flex-col justify-center min-w-0">
                    <span className="text-[#91a0b6] text-[8.5px] sm:text-[10px] uppercase font-bold tracking-widest mb-0.5 sm:mb-1 leading-tight">{s.label}</span>
                    <span className="font-['Outfit',sans-serif] text-[#0075ff] text-[15px] sm:text-[18px] md:text-[20px] font-black drop-shadow-[0_0_8px_rgba(0,168,255,0.5)] transition-colors whitespace-nowrap">{s.value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Split-Screen Dashboard & Mobile Tabbed View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Mobile Horizontal Navigation Tabs */}
          <div className="lg:hidden grid grid-cols-3 gap-2 pb-4 w-full">
            {modules.map((m, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`py-3 px-1 rounded-lg border text-[9px] sm:text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer flex items-center justify-center overflow-hidden text-ellipsis ${activeTab === i
                  ? 'bg-black text-white border-transparent shadow-[0_0_20px_rgba(0,168,255,0.5)]'
                  : 'bg-[#050B14] text-[#a1a1aa] border-[#0080C7]/20'
                  }`}
              >
                <span className="truncate">{m.week}</span>
              </button>
            ))}
          </div>

          {/* Left Column: Vertical Timeline selector (Desktop only) */}
          <div className="hidden lg:flex lg:col-span-5 flex-col gap-3 relative before:absolute before:left-6.75 before:top-8 before:bottom-8 before:w-0.5 before:bg-linear-to-b before:from-[#0080C7]/60 before:to-[#0080C7]/15">
            {modules.map((m, i) => {
              const isActive = activeTab === i;
              return (
                <div
                  key={i}
                  className={`group relative rounded-xl transition-all duration-300 ${isActive
                    ? 'p-px bg-linear-to-r from-[#00a8ff]/90 via-white/10 to-white/10 shadow-[0_0_20px_rgba(0,168,255,0.2)]'
                    : ''
                    }`}
                >
                  <button
                    onClick={() => setActiveTab(i)}
                    className={`w-full flex gap-5 items-center p-5 rounded-xl text-left cursor-pointer transition-all duration-300 group z-10 relative overflow-hidden ${isActive
                      ? 'bg-[#060a14] rounded-[11px]'
                      : 'bg-transparent border border-transparent hover:bg-[#050A14]/60 hover:border-[#0080C7]/20 hover:shadow-[0_0_15px_rgba(0,128,199,0.1)]'
                      }`}
                  >
                    {isActive && (
                      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-[#33a8ff]/60 to-transparent opacity-80" />
                    )}

                    {/* Timeline circle indicator */}
                    <span className={`w-4 h-4 rounded-full border-[3px] flex items-center justify-center shrink-0 transition-all duration-300 ${isActive
                      ? 'bg-[#00a8ff] border-[#001020] scale-125 shadow-[0_0_12px_#00a8ff]'
                      : 'bg-[#050B14] border-[#0080C7]/40 group-hover:border-[#33a8ff]'
                      }`}
                    />

                    <div className="min-w-0 z-10">
                      <div className="text-[#33a8ff] text-[9px] font-bold tracking-widest uppercase mb-1 font-mono">
                        {m.week}
                      </div>
                      <span className={`font-serif text-sm md:text-base font-bold transition-colors block ${isActive ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]' : 'text-[#a1a1aa] group-hover:text-white'
                        }`}>
                        {m.title}
                      </span>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Curriculum Card Panel with Signature Gradient Border */}
          <div className="lg:col-span-7 group relative rounded-xl p-px bg-linear-to-br from-[#0075ff]/90 via-white/10 to-white/10 shadow-[0_0_35px_rgba(0,128,199,0.25)] transition-all duration-300 flex flex-col">
            <div className="relative h-full w-full bg-[#000000] group-hover:bg-[#070e1c] rounded-[15px] p-4 md:p-8 flex flex-col justify-between overflow-hidden transition-colors duration-300 z-10 min-h-120">



              {/* Subtle inner radial glow */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,117,255,0.65)_0%,transparent_40%)] pointer-events-none" />

              <div className="relative z-10 w-full h-full flex flex-col">
                {/* Header Info */}
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div>
                    <span className="text-[#91a0b6] text-[12px] font-bold block mb-1">#{activeTab + 1}</span>
                    <h3 className="text-white text-3xl md:text-4xl font-sans tracking-wide">
                      {modules[activeTab].title}
                    </h3>
                  </div>
                  {(() => {
                    const iconMap: Record<string, React.ElementType> = {
                      Calendar,
                      Presentation,
                      Handshake,
                      FileText,
                      DollarSign,
                      Clock,
                    };
                    const IconComponent = iconMap[modules[activeTab].iconName] || Calendar;
                    return <IconComponent className="w-12 h-12 text-[#3399FF] drop-shadow-[0_0_8px_rgba(0,128,199,0.5)]" strokeWidth={1.5} />;
                  })()}
                </div>

                {/* Boxes */}
                <div className="relative z-10 flex-1 flex flex-col justify-center">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {modules[activeTab].boxes?.map((box, idx) => {
                      // Render an empty spacer if there's no text (used for layout alignment)
                      if (!box.text) {
                        return <div key={idx} className={`hidden sm:block ${box.colSpan === 2 ? 'sm:col-span-2' : 'sm:col-span-1'}`} aria-hidden="true" />;
                      }
                      
                      return (
                        <div key={idx} className={`flex flex-col ${box.colSpan === 2 ? 'sm:col-span-2' : 'sm:col-span-1'}`}>
                          {box.header ? (
                            <span className="text-gray-200 text-[11px] uppercase font-bold tracking-widest block mb-2">
                              {box.header}
                            </span>
                          ) : (
                            // Spacer to align boxes perfectly using exact same text styles but invisible
                            <span className="text-[11px] uppercase font-bold tracking-widest mb-2 invisible hidden sm:block" aria-hidden="true">
                              SPACER
                            </span>
                          )}
                          <div className="border border-[#0080C7]/40 bg-[#060a14] p-4 rounded-sm flex-1 flex items-center min-h-15">
                            <span className="font-sans text-[#0075ff] text-[14px] md:text-[15px] leading-snug font-medium tracking-wide whitespace-pre-wrap">
                              {box.text}
                            </span>
                          </div>
                        </div>
                      );
                    })}
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
