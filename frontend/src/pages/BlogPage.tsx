import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ChevronRight } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { API_URL } from '../../config';

interface ApiBlog {
  _id: string;
  title: string;
  slug: string;
  category: string[];
  readTime: string;
  date: string;
  excerpt: string;
  featureImage: string;
  status: string;
}

export default function BlogPage() {
  const [apiBlogs, setApiBlogs] = useState<ApiBlog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Fetch published blogs from the API (public endpoint — no auth needed)
    fetch(`${API_URL}/api/blog/public?limit=50`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setApiBlogs(data.blogs ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative bg-[#000001] text-white min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-[#0077ff9c] selection:text-white">
      <Helmet>
        <title>Blog &amp; Studio Insights | AI Product Leadership Studio — Pranjal Sarkar</title>
        <meta name="description" content="Executive reflections, boardroom case studies, and practical frameworks on product judgment, AI strategy, and executive career progression by Pranjal Sarkar." />
        <meta property="og:title" content="Blog &amp; Studio Insights | AI Product Leadership Studio" />
        <meta property="og:description" content="Strategic perspectives for senior PMs, Directors, and Heads of Product navigating AI transformation and executive judgment." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://productleadership.studio/blog" />
        <meta property="og:image" content="https://productleadership.studio/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog &amp; Studio Insights | AI Product Leadership Studio" />
        <meta name="twitter:description" content="Strategic perspectives for senior PMs, Directors, and Heads of Product navigating AI transformation and executive judgment." />
      </Helmet>

      {/* Background Ambient Lighting & Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(0,136,255,0.22)_0%,rgba(0,60,180,0.12)_45%,transparent_75%)] blur-[70px]" />
        <div className="absolute top-[800px] right-[-10%] w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(0,168,255,0.12)_0%,transparent_60%)] blur-[90px]" />
        <div className="absolute bottom-[400px] left-[-10%] w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.15)_0%,transparent_60%)] blur-[90px]" />
        {/* Fine Dot Matrix Overlay */}
        <div
          className="absolute inset-0 opacity-10 mix-blend-screen pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, rgba(0, 140, 255, 0.35) 1.5px, transparent 0)', backgroundSize: '32px 32px' }}
        />
      </div>

      <Navbar />

      <main className="flex-1 relative z-10 pt-28 sm:pt-36 pb-20">
        {/* Hero */}
        <section id="blog-hero" className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-10 sm:mb-14">
          <div className="flex flex-col items-center text-center max-w-7xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#0080C7]/10 border border-[#0080C7]/20 rounded-full text-[12px] sm:text-[14px] font-semibold text-blue-300 shadow-[0_0_15px_rgba(0,128,199,0.2)] mb-5">
              <span className="w-2 h-2 rounded-full bg-[#0080C7] shadow-[0_0_10px_rgba(0,128,199,0.9)] animate-pulse" />
              <span>Studio Insights &amp; Field Notes</span>
            </div>
            <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight text-white mb-5">
              The AI Product Leadership{' '}
              <span className="relative inline-block text-transparent bg-clip-text bg-linear-to-b from-[rgba(24,37,226,1)] to-[#006eff] drop-shadow-[0_0_20px_rgba(24,37,226,0.6)] pb-1">
                Studio Journal
              </span>
            </h1>
            <div className="w-32 sm:w-48 md:w-64 h-[2.5px] bg-linear-to-r from-transparent via-[#00a8ff] to-transparent shadow-[0_0_20px_rgba(0,168,255,0.9)] rounded-full mb-6 opacity-90" />
            <p className="text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl font-normal">
              High-signal strategic perspectives, executive case studies, and mental models for senior product leaders transitioning to Director and VP levels in the age of autonomous intelligence.
            </p>
          </div>
        </section>

        {/* All Blog Cards */}
        <section id="all-articles" className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">

            {/* ── API-sourced blogs (published from admin panel) ── */}
            {apiBlogs.map((post) => (
              <Link
                key={post._id}
                to={`/blog/${post.slug}`}
                className="group relative rounded-xl p-px bg-linear-to-b from-[#00a8ff]/30 via-white/10 to-white/5 hover:from-[#00a8ff] hover:to-[#2563EB] hover:shadow-[0_0_35px_rgba(0,168,255,0.25)] transition-all duration-200 hover:-translate-y-1 flex flex-col overflow-hidden text-left"
              >
                <div className="relative bg-[#060a14]/90 backdrop-blur-xl rounded-xl overflow-hidden flex flex-col h-full border border-white/5">
                  <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-linear-to-r from-transparent via-[#00a2ff]/60 to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />

                  {/* Thumbnail */}
                  <div className="relative w-full aspect-video overflow-hidden bg-[#001026]">
                    {post.featureImage ? (
                      <img src={post.featureImage} alt={post.title || "Blog post cover image"} className="w-full h-full object-fill transition-transform duration-500" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#060d20]">
                        <span className="text-[#0080C7] opacity-30 text-5xl font-serif font-bold">PS</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-[#060a14] via-transparent to-transparent opacity-85" />
                    {post.readTime && (
                      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] text-gray-300 border border-white/10">
                        <Clock className="w-3 h-3 text-[#00a8ff]" />
                        <span>{post.readTime}</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2.5">
                        <Calendar className="w-3.5 h-3.5 text-[#00a8ff]" />
                        <span>{post.date ? new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</span>
                      </div>
                      <h3 className="font-serif font-bold text-xl sm:text-2xl text-white group-hover:text-blue-300 transition-colors leading-snug mb-3 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3 font-normal">{post.excerpt}</p>
                    </div>
                    <div>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {(post.category ?? []).slice(0, 2).map((tag) => (
                          <span key={tag} className="text-[10.5px] px-2.5 py-0.5 rounded-md bg-white/5 text-gray-400 border border-white/5">#{tag}</span>
                        ))}
                      </div>
                      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#00a8ff] group-hover:translate-x-1 transition-transform">Read Article</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#00a8ff] group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {/* Loading state */}
            {loading && (
              <div className="col-span-full py-24 flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-3 border-[#0080C7]/30 border-t-[#0080C7] rounded-full animate-spin mb-4" />
                <p className="text-gray-400 text-sm">Loading articles...</p>
              </div>
            )}

            {/* Empty state */}
            {!loading && apiBlogs.length === 0 && (
              <div className="col-span-full py-24 text-center text-gray-400">
                <p className="text-lg font-serif">No articles published yet.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

