import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function NotFoundPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative bg-[#000001] text-white min-h-screen flex flex-col font-sans overflow-hidden">
      <Helmet>
        <title>404 - Page Not Found | Pranjal Sarkar</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-[#0080C7] blur-[150px] opacity-20 pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-0 w-[50%] h-[50%] bg-[radial-gradient(ellipse_at_bottom_right,rgba(0,68,204,0.15)_0%,transparent_60%)] pointer-events-none z-0" />

      <Navbar />

      <main className="flex-1 relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 md:px-12 w-full text-center min-h-[80vh] py-20">
        
        {/* Core 404 Display */}
        <div className="relative group perspective-1000">
          {/* Intense center glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 bg-[#006eff] blur-[140px] opacity-40 pointer-events-none group-hover:opacity-60 group-hover:scale-110 transition-all duration-700" />
          
          <div className="relative flex flex-col items-center z-10">
            {/* Layered 3D 404 Text */}
            <div className="relative mb-2">
              <h1 className="relative z-10 font-sans font-bold text-8xl sm:text-[10rem] md:text-[12rem] leading-none text-transparent bg-clip-text bg-linear-to-b from-[#ffffff] via-[#93c5fd] to-[#1d4ed8] drop-shadow-[0_0_30px_rgba(29,78,216,0.8)] tracking-tighter">
                404
              </h1>
              {/* Back reflection */}
              <h1 className="absolute top-2 -left-2 z-0 font-sans font-bold text-8xl sm:text-[10rem] md:text-[12rem] leading-none text-[#0033cc] opacity-40 blur-sm tracking-tighter">
                404
              </h1>
              <h1 className="absolute -top-2 left-2 z-0 font-sans font-bold text-8xl sm:text-[10rem] md:text-[12rem] leading-none text-[#00a8ff] opacity-40 blur-[2px] tracking-tighter">
                404
              </h1>
            </div>

            {/* Premium Glassmorphic Info Card */}
            <div className="relative px-8 sm:px-12 py-8 sm:py-10  max-w-xl mx-auto overflow-hidden">
              {/* Card top edge highlight */}
              <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#3b82f6] to-transparent opacity-80" />
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight mb-4 flex flex-col items-center">
                Lost in the Matrix
                <div className="w-24 sm:w-32 h-0.5 bg-linear-to-r from-transparent via-[#00a8ff] to-transparent shadow-[0_0_15px_rgba(0,168,255,0.9)] mt-4 opacity-90" />
              </h2>
              
              <p className="text-[#9ca3af] text-sm sm:text-base md:text-lg mb-8 leading-relaxed font-medium">
                The digital footprint you are searching for has vanished. It might have been deleted, moved, or never existed in the first place.
              </p>

              <Link
                to="/"
                className="group relative inline-flex justify-center items-center gap-3 px-8 sm:px-10 py-4 rounded-full text-white font-bold text-sm sm:text-base overflow-hidden transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(0,112,243,0.3)] hover:shadow-[0_0_40px_rgba(0,112,243,0.6)]"
              >
                {/* Button Background Gradients */}
                <div className="absolute inset-0 bg-linear-to-r from-[#0044cc] to-[#0080C7] transition-all duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-linear-to-r from-[#0080C7] to-[#1e3a8a] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Button Content */}
                <span className="relative z-10 flex items-center gap-2 tracking-wide">
                  Return to Home
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-white group-hover:text-[#0044cc]">
                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={3} />
                  </div>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
