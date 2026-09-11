import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import Logo from '../../assets/SignatureSticker.webp';

const footerLinks = {
  PROGRAM: [
    'Program Framework',
    'Post-Week 5',
    'Curriculum',
    'Who Should Apply',
    'Events',
    'FAQ',

  ],
  CONNECT: ['LinkedIn', 'Twitter / X', 'YouTube', 'Instagram', 'Facebook', 'Medium'],
  STUDIO: ['ProductLeadership.Studio', 'Blog'],
};

const footerLinkHashes: Record<string, string> = {
  'Program Framework': '/#judgment',
  'Post-Week 5': '/#post-week-5',
  'Curriculum': '/#curriculum',
  'Who Should Apply': '/#who-should-apply',
  'FAQ': '/#faq',
  'Events': '/#events',
  'About Pranjal Sarkar': '/#about',
  'Testimonials': '/#testimonials',
  'Application Process': '/#contact',
  'LinkedIn': 'https://linkedin.com/in/pranjalsarkar',
  'Twitter / X': 'https://x.com/thepsprinciples',
  'YouTube': 'https://youtube.com/@thepsprinciples',
  'Facebook': 'https://facebook.com/thepsprinciples',
  'Instagram': 'https://instagram.com/thepsprinciples',
  'Medium': 'https://medium.com/@pranjalsarkar',
  'ProductLeadership.Studio': '/#hero',
  'Blog': '/blog',
};

export default function Footer() {
  return (
    <footer className="bg-[#000000] pt-6 pb-6 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">

        {/* Top Section: Brand + Links */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-0 mb-6">

          {/* Brand Info (Left Col) */}
          <div className="lg:w-[35%] lg:pr-16 lg:border-r lg:border-white/50 flex flex-col items-center lg:items-start text-center lg:text-left">
            <img src={Logo} alt="Pranjal Sarkar" className="w-56 h-auto mb-3" style={{ filter: 'brightness(0) invert(1)' }} />

            {/* Glowing line */}
            <div className="w-28 h-0.5 bg-linear-to-r from-[#3B82F6]/10 via-[#3B82F6] to-[#3B82F6]/10 shadow-[0_0_15px_rgba(59,130,246,0.8)] mb-4 rounded-full" />

            <p className="text-[#D1D5DB] text-[15px] leading-relaxed mb-6 max-w-70 font-medium">
              Building future-ready product leaders<br />who create <span className="text-[#3B82F6] font-semibold">impact</span> that lasts.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 justify-center lg:justify-start flex-wrap">
              {[
                { name: 'LinkedIn', icon: <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>, href: 'https://linkedin.com/in/pranjalsarkar' },
                { name: 'X', icon: <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>, href: 'https://x.com/thepsprinciples' },
                { name: 'YouTube', icon: <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.108C19.524 3.545 12 3.545 12 3.545s-7.525 0-9.388.51a3.003 3.003 0 00-2.11 2.108C0 8.026 0 12 0 12s0 3.974.502 5.837a3.003 3.003 0 002.11 2.108c1.863.51 9.388.51 9.388.51s7.524 0 9.388-.51a3.003 3.003 0 002.11-2.108c.502-1.863.502-5.837.502-5.837s0-3.974-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>, href: 'https://youtube.com/@thepsprinciples' },
                { name: 'Instagram', icon: <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>, href: 'https://instagram.com/thepsprinciples' },
                { name: 'Facebook', icon: <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>, href: 'https://facebook.com/thepsprinciples' }
              ].map(s => (
                <a key={s.name} href={s.href} aria-label={`Pranjal Sarkar on ${s.name}`} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-xl border border-white/10 flex items-center justify-center text-[#3B82F6] hover:bg-[#3B82F6]/10 transition-all duration-200">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns (Right Col) */}
          <div className="lg:w-[65%] lg:pl-16 grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-12 lg:gap-8 pt-0 lg:pt-4">
            {Object.entries(footerLinks).map(([col, links]) => (
              <div key={col} className="col-span-1">
                <h4 className="text-[#3B82F6] text-[13px] md:text-[14px] font-bold tracking-widest uppercase mb-3">
                  {col}
                </h4>
                <div className="w-12 md:w-16 h-[2.5px] bg-linear-to-r from-[#3B82F6] to-transparent mb-6 md:mb-8 rounded-full" />
                <ul className="flex flex-col gap-4 md:gap-5">
                  {links.map(l => {
                    const href = footerLinkHashes[l] || '/#contact';
                    const isExternal = href.startsWith('http');
                    const isInternal = href.startsWith('/');
                    return (
                      <li key={l} className="flex items-start md:items-center gap-2.5 md:gap-3.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] mt-2 md:mt-0 shrink-0" />
                        {isInternal ? (
                          <Link
                            to={href}
                            className="text-[#D1D5DB] text-[13px] md:text-[14px] font-medium hover:text-white transition-colors duration-150 leading-snug"
                          >
                            {l}
                          </Link>
                        ) : (
                          <a
                            href={href}
                            target={isExternal ? '_blank' : undefined}
                            rel={isExternal ? 'noopener noreferrer' : undefined}
                            className="text-[#D1D5DB] text-[13px] md:text-[14px] font-medium hover:text-white transition-colors duration-150 leading-snug"
                          >
                            {l}
                          </a>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/50 pt-4 pb-2 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 relative">
          <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-4 z-10">
            <div className="flex items-center justify-center shrink-0">
              <ShieldCheck className="w-8 h-8 text-[#3B82F6]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[#9CA3AF] text-[13px] md:text-[14px]">
                © 2026 Pranjal Sarkar. All rights reserved.
              </span>
              <span className="text-[#3B82F6] text-[13px] md:text-[14px] font-medium mt-1 md:mt-0.5">
                Product Leadership Studio
              </span>
            </div>
          </div>

          {/* Developer Credit */}
          <div className="text-[13px] md:text-[15px] text-white font-medium text-center z-10 md:absolute md:left-1/2 md:-translate-x-1/2 md:w-max">
            Digital Partner <a href="https://digitalwebconnection.com/" target="_blank" rel="noopener noreferrer" className="text-[#3B82F6] hover:text-[#002ec7] transition-colors ml-1">Digital Web Connection</a>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-3 md:gap-6 text-[#3B82F6] text-[13px] md:text-[14px] font-medium z-10">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
            <Link to="/terms-of-use" className="hover:text-white transition-colors">Terms of Use</Link>
            <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
            <Link to="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
