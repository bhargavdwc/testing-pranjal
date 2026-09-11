import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/SignatureSticker.webp';

const navLinks = [
  { label: 'Program', href: '/#program' },
  { label: 'Simulation', href: '/#simulation' },
  { label: 'Curriculum', href: '/#curriculum' },
  { label: 'Transformation', href: '/#transformation' },
  { label: 'Exposure', href: '/#exposure' },
];

const sectionToNavLinkMap: Record<string, string> = {
  hero: '',
  mirror: '',
  program: 'program',
  simulation: 'simulation',
  exposure: 'exposure',
  transformation: 'transformation',
  about: '',
  testimonials: '',
  logos: '',
  'who-should-apply': '',
  curriculum: 'curriculum',
  events: '',
  faq: '',
  'final-cta': '',
  contact: '',
};


export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState('');

  /* ── Scroll glass effect ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Active section highlighting ── */
  useEffect(() => {
    const ids = Object.keys(sectionToNavLinkMap);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(sectionToNavLinkMap[entry.target.id]);
          }
        });
      },
      { threshold: 0.2, rootMargin: '-72px 0px -20% 0px' }
    );

    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  /* ── Menu side-effects (scroll lock & auto-close) ── */
  useEffect(() => {
    const close = () => { if (menuOpen) setMenuOpen(false); };
    window.addEventListener('scroll', close, { passive: true });

    const handleResize = () => {
      if (window.innerWidth >= 1024 && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize, { passive: true });

    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener('scroll', close);
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      {/* ── Floating Fixed Navbar ── */}
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
        <nav
          className={[
            'w-[98%] max-w-7xl transition-all duration-300 rounded-xl h-18 border',
            scrolled
              ? 'bg-[#0A101F]/90 backdrop-blur-md border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
              : 'bg-[#0A101F]/80 backdrop-blur-sm border-white/5',
          ].join(' ')}
        >
          <div className="flex justify-between items-center h-full px-3 md:px-4 py-2 lg:py-0">

            {/* ── Logo ── */}
            <Link to="/#hero" className="flex items-center gap-3 no-underline shrink-0">
              <img src={Logo} alt="Pranjal Sarkar" className="w-40 md:w-52 h-auto object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
            </Link>

            {/* ── Center: Desktop nav links ── */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map(l => {
                const isActive = activeId === l.href.replace('/#', '');
                return (
                  <Link
                    key={l.label}
                    to={l.href}
                    className={[
                      'text-lg font-medium no-underline transition-colors duration-200',
                      isActive
                        ? 'text-white'
                        : 'text-[#dee2e9] hover:text-white',
                    ].join(' ')}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </div>

            {/* ── Right: CTA + Hamburger ── */}
            <div className="flex justify-end items-center shrink-0">
                {/* Desktop CTA */}
                <Link
                  to="/#contact"
                  className="hidden lg:inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-white text-[14px] font-bold tracking-wide no-underline transition-all duration-300 bg-[#2563EB]  shadow-[0_0_80px_rgba(37,99,235,0.4)] hover:-translate-y-px"
                >
                  Submit Interview Request <span>→</span>
                </Link>

                {/* Hamburger — mobile only */}
                <button
                  onClick={() => setMenuOpen(o => !o)}
                  aria-label="Toggle menu"
                  aria-expanded={menuOpen}
                  className={[
                    'lg:hidden flex flex-col items-center justify-center gap-1.25 w-10 h-10 rounded-md border cursor-pointer transition-all duration-150',
                    menuOpen
                      ? 'bg-white/5 border-white/15'
                      : 'bg-transparent border-white/0 hover:bg-white/0',
                  ].join(' ')}
                > 
                  <span
                    className={[
                      'block w-5 h-0.5 rounded-sm transition-all duration-150',
                      menuOpen ? 'bg-[#3B82F6] rotate-45 translate-y-1.75' : 'bg-white',
                    ].join(' ')}
                  />
                  <span
                    className={[
                      'block w-5 h-0.5 rounded-sm transition-opacity duration-150',
                      menuOpen ? 'opacity-0 bg-[#3B82F6]' : 'opacity-100 bg-white',
                    ].join(' ')}
                  />
                  <span
                    className={[
                      'block w-5 h-0.5 rounded-sm transition-all duration-150',
                      menuOpen ? 'bg-[#3B82F6] -rotate-45 -translate-y-1.75' : 'bg-white',
                    ].join(' ')}
                  />
                </button>
            </div>


          </div>
        </nav>
      </div>

      {/* ── Mobile menu overlay ── */}
      <div
        className={[
          'fixed inset-0 bg-[#0A101F]/80 backdrop-blur-sm z-60 lg:hidden transition-all duration-300',
          menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        ].join(' ')}
        onClick={() => setMenuOpen(false)}
      />

      {/* ── Mobile menu sidebar (Left Slide-in) ── */}
      <div
        className={[
          'fixed top-0 left-0 bottom-0 w-70 md:w-96 bg-[#0A101F] border-r border-white/10 z-70 lg:hidden flex flex-col transition-transform duration-300 ease-in-out shadow-[20px_0_50px_rgba(0,0,0,0.5)]',
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        ].join(' ')}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-5 md:p-8 border-b border-white/5">
          <Link to="/#hero" onClick={() => setMenuOpen(false)} className="no-underline shrink-0">
            <img src={Logo} alt="Pranjal Sarkar" className="w-32 md:w-48 h-auto object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="p-2 -mr-2 text-white/50 hover:text-white transition-colors flex items-center justify-center cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-8 md:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Sidebar Links */}
        <div className="flex flex-col gap-2 p-5 md:p-8 overflow-y-auto flex-1">
          {navLinks.map(l => {
            const isActive = activeId === l.href.replace('/#', '');
            return (
              <Link
                key={l.label}
                to={l.href}
                onClick={() => setMenuOpen(false)}
                className={[
                  'flex items-center justify-between px-4 md:px-6 py-3.5 md:py-5 rounded-lg text-[15px] md:text-xl no-underline transition-all duration-200',
                  isActive
                    ? 'text-[#2563EB] font-bold bg-white/5'
                    : 'text-[#9CA3AF] font-medium hover:text-white hover:bg-white/5 hover:translate-x-1',
                ].join(' ')}
                aria-current={isActive ? 'page' : undefined}
              >
                <span>{l.label}</span>
                {isActive && <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#2563EB] shadow-[0_0_10px_rgba(37,99,235,0.8)]" />}
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer CTA */}
        <div className="p-5 md:p-8 border-t border-white/5 pb-8 md:pb-12">
          <Link
            to="/#contact"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-4 md:py-6 rounded-xl text-white text-[15px] md:text-lg font-bold no-underline tracking-wide bg-linear-to-r from-[#2563EB] to-[#050B14] shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all"
          >
            Submit Interview Request →
          </Link>
        </div>
      </div>
    </>
  );
}
