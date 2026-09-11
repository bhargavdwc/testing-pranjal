import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowLeft,
  Clock,
  Sparkles,
  ChevronRight,
  BookOpen,
  ArrowUpRight,
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import authorAvatar from '../assets/pranjalsarkar/pranjal-sarkar-portrait.webp';
import { API_URL } from '../../config';

// Inline SVGs for social platforms
function LinkedInIcon({ className = "w-4 h-4 fill-current" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

interface ArticleData {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  coverImage: string;
  tags: string[];
  takeaways?: string[];
  sections?: {
    heading: string;
    body: string;
    quote?: string;
  }[];
  htmlContent?: string;
  rawContent?: string;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  keywords?: string[];
  schema?: string;
  longContent?: string;
}

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  // Track reading scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch article from backend API
  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    setLoading(true);

    fetch(`${API_URL}/api/blog/public/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.blog) {
          const b = data.blog;
          const isHtml = /<[a-z][\s\S]*>/i.test(b.content || '');
          setArticle({
            id: b._id,
            slug: b.slug,
            title: b.title,
            excerpt: b.excerpt || '',
            readTime: b.readTime || '5 min read',
            date: b.date
              ? new Date(b.date).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              : '',
            author: {
              name: 'Pranjal Sarkar',
              role: 'Founder & Executive Mentor, AIPLS',
              avatar: authorAvatar,
            },
            coverImage:
              b.featureImage || '/events/Pranjal-Sarkar-Delivering-Session-07.webp',
            tags: Array.isArray(b.category)
              ? b.category
              : b.category
              ? [b.category]
              : [],
            takeaways: [],
            htmlContent: isHtml ? b.content : undefined,
            rawContent: !isHtml ? b.content : undefined,
            metaTitle: b.metaTitle,
            metaDescription: b.metaDescription,
            canonicalUrl: b.canonicalUrl,
            keywords: Array.isArray(b.keywords) ? b.keywords : [],
            schema: b.schema,
            longContent: b.longContent,
          });
        } else {
          setArticle(null);
        }
      })
      .catch(() => {
        setArticle(null);
      })
      .finally(() => {
        setLoading(false);
      });

    // Fetch related articles from API (excluding current article)
    fetch(`${API_URL}/api/blog/public?limit=6`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.blogs)) {
          const others = data.blogs
            .filter((p: any) => p.slug !== slug)
            .slice(0, 3)
            .map((p: any) => ({
              id: p._id,
              slug: p.slug,
              title: p.title,
              excerpt: p.excerpt || '',
              readTime: p.readTime || '5 min read',
              date: p.date
                ? new Date(p.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : '',
              coverImage:
                p.featureImage || '/events/Pranjal-Sarkar-Delivering-Session-07.webp',
              tags: Array.isArray(p.category) ? p.category : [],
            }));
          setRelatedPosts(others);
        }
      })
      .catch(() => {});
  }, [slug]);

  // Loading indicator
  if (loading) {
    return (
      <div className="relative bg-[#000001] text-white min-h-screen flex flex-col font-sans overflow-hidden">
        <Navbar />
        <main className="flex-1 relative z-10 flex flex-col items-center justify-center px-4 py-36 text-center">
          <div className="w-10 h-10 border-3 border-[#0080C7]/30 border-t-[#0080C7] rounded-full animate-spin mb-4" />
          <p className="text-gray-400 text-sm">Loading article...</p>
        </main>
        <Footer />
      </div>
    );
  }

  // 404 fallback if article slug not found
  if (!article) {
    return (
      <div className="relative bg-[#000001] text-white min-h-screen flex flex-col font-sans overflow-hidden">
        <Navbar />
        <main className="flex-1 relative z-10 flex flex-col items-center justify-center px-4 py-36 text-center">
          <BookOpen className="w-16 h-16 text-[#0080C7] mb-6 opacity-80" />
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-white mb-3">
            Article Not Found
          </h1>
          <p className="text-gray-400 text-base max-w-md mb-8">
            The article you are looking for might have been moved, renamed, or is currently unavailable.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-linear-to-r from-[#0080C7] to-[rgba(24,37,226,0.9)] text-white font-bold text-sm shadow-[0_0_20px_rgba(24,37,226,0.4)] hover:shadow-[0_0_30px_rgba(24,37,226,0.6)] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to All Articles</span>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const shareUrl =
    article.canonicalUrl ||
    (typeof window !== 'undefined' ? window.location.href : '');

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    author: {
      '@type': 'Person',
      name: article.author.name,
      jobTitle: article.author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: 'AI Product Leadership Studio',
      logo: {
        '@type': 'ImageObject',
        url: 'https://productleadership.studio/og-image.jpg',
      },
    },
  };

  return (
    <div className="relative bg-[#000001] text-white min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-[#0077ff9c] selection:text-white">
      <Helmet>
        <title>
          {article.metaTitle
            ? `${article.metaTitle} | Pranjal Sarkar`
            : `${article.title} | Pranjal Sarkar`}
        </title>
        <meta
          name="description"
          content={article.metaDescription || article.excerpt}
        />
        {article.keywords && article.keywords.length > 0 && (
          <meta name="keywords" content={article.keywords.join(', ')} />
        )}
        {article.canonicalUrl && <link rel="canonical" href={article.canonicalUrl} />}
        <meta
          property="og:title"
          content={`${article.title} | AI Product Leadership Studio`}
        />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:image" content={article.coverImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.excerpt} />
        <meta name="twitter:image" content={article.coverImage} />
        {article.schema ? (
          <script type="application/ld+json">{article.schema}</script>
        ) : (
          <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
        )}
      </Helmet>

      {/* Reading Progress Indicator Bar */}
      <div className="fixed top-0 left-0 right-0 z-60 h-[3px] bg-white/5 pointer-events-none">
        <div
          className="h-full bg-linear-to-r from-[#0080C7] via-[#00a8ff] to-[#38bdf8] shadow-[0_0_12px_rgba(0,168,255,0.8)] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Ambient Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(0,136,255,0.2)_0%,rgba(0,60,180,0.08)_45%,transparent_75%)] blur-[80px]" />
        <div className="absolute top-[1200px] right-[-10%] w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(0,168,255,0.08)_0%,transparent_60%)] blur-[90px]" />

        {/* Fine Texture Dot Matrix */}
        <div
          className="absolute inset-0 opacity-10 mix-blend-screen pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1.5px 1.5px, rgba(0, 140, 255, 0.35) 1.5px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Main Navigation */}
      <Navbar />

      <main className="flex-1 relative z-10 pt-28 sm:pt-36 pb-24">
        {/* ====================================================================
            ARTICLE CONTAINER
           ==================================================================== */}
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
          {/* 1. Header Area */}
          <header className="mb-10">
            {/* Top Bar: Back Link */}
            <div className="flex items-center justify-between gap-4 mb-8">
              <button
                onClick={() => navigate('/blog')}
                className="group inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Articles</span>
              </button>
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-400 mb-4">
              <span className="text-[#38bdf8] font-semibold">
                {article.tags[0] || 'Studio Insights'}
              </span>
              <span>{article.date}</span>
              <span>•</span>
              <span>{article.readTime}</span>
            </div>

            {/* Title */}
            <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-white leading-[1.18] tracking-tight mb-5">
              {article.title}
            </h1>

            {/* Excerpt */}
            {article.excerpt && (
              <p className="text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed font-light">
                {article.excerpt}
              </p>
            )}
          </header>

          {/* 2. Cover Banner */}
          <div className="relative rounded-xl overflow-hidden aspect-16/9 md:aspect-[18/9] bg-[#0a0f1d] border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] mb-12">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-fill"
              loading="eager"
            />
          </div>

          {/* 3. Key Takeaways Box (if available) */}
          {article.takeaways && article.takeaways.length > 0 && (
            <div className="bg-[#070d1a] border border-[#0080C7]/25 rounded-xl p-6 sm:p-8 mb-12 shadow-[0_0_20px_rgba(0,128,199,0.08)]">
              <div className="flex items-center gap-2 text-[#38bdf8] font-semibold text-xs uppercase tracking-wider mb-4">
                <Sparkles className="w-4 h-4" />
                <span>Key Takeaways</span>
              </div>
              <ul className="space-y-3">
                {article.takeaways.map((takeaway, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-sm sm:text-base text-gray-200 leading-relaxed"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00a8ff] shrink-0 mt-2" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 4. Article Editorial Content */}
          {article.sections && article.sections.length > 0 ? (
            <article className="space-y-12">
              {article.sections.map((sec, idx) => {
                const paragraphs = sec.body.split('\n\n').filter(Boolean);

                return (
                  <section key={idx} className="space-y-5">
                    <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white tracking-tight pt-2">
                      {sec.heading}
                    </h2>

                    <div className="space-y-5">
                      {paragraphs.map((para, pIdx) => (
                        <p
                          key={pIdx}
                          className="text-gray-300 text-[17px] sm:text-[18px] leading-[1.85] font-normal"
                        >
                          {para}
                        </p>
                      ))}
                    </div>

                    {sec.quote && (
                      <blockquote className="border-l-2 border-[#0080C7] pl-5 sm:pl-6 my-8 py-1">
                        <p className="font-serif italic text-xl sm:text-2xl text-blue-100/90 leading-relaxed">
                          "{sec.quote}"
                        </p>
                      </blockquote>
                    )}
                  </section>
                );
              })}
            </article>
          ) : article.htmlContent ? (
            <article
              className="space-y-6 text-gray-300 text-[17px] sm:text-[18px] leading-[1.85] [&>h2]:font-serif [&>h2]:font-bold [&>h2]:text-2xl [&>h2]:sm:text-3xl [&>h2]:text-white [&>h2]:tracking-tight [&>h2]:pt-6 [&>h3]:font-serif [&>h3]:font-bold [&>h3]:text-xl [&>h3]:text-blue-200 [&>p]:leading-[1.85] [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:space-y-2 [&>blockquote]:border-l-2 [&>blockquote]:border-[#0080C7] [&>blockquote]:pl-5 [&>blockquote]:italic [&>blockquote]:text-blue-100/90 [&>blockquote]:my-6 [&>a]:text-[#00a8ff] [&>a]:underline"
              dangerouslySetInnerHTML={{ __html: article.htmlContent }}
            />
          ) : (
            <article className="space-y-6">
              {(article.rawContent || '').split('\n\n').filter(Boolean).map((para, pIdx) => (
                <p
                  key={pIdx}
                  className="text-gray-300 text-[17px] sm:text-[18px] leading-[1.85] font-normal"
                >
                  {para}
                </p>
              ))}
            </article>
          )}

          {/* Hidden long content for SEO/screen readers */}
          {article.longContent && (
            <div className="sr-only" aria-hidden="true">
              {article.longContent}
            </div>
          )}

          {/* 5. Article Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-8 mt-12 border-t border-white/10">
              <span className="text-xs text-gray-400 font-medium mr-2">Tags:</span>
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-md bg-white/5 text-gray-300 border border-white/10"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* 6. Author Bio Card */}
          <div className="relative mt-14 rounded-2xl bg-[#080e1c]/90 border border-white/10 p-8 sm:p-10 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-linear-to-r from-transparent via-[#0080C7]/50 to-transparent" />

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 md:gap-10">
              {/* Author Photo */}
              <img
                src={authorAvatar}
                alt={article.author.name}
                className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full object-cover border-2 border-[#0080C7] shrink-0 shadow-[0_0_25px_rgba(0,128,199,0.3)]"
              />

              {/* Author Details */}
              <div className="text-center sm:text-left flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                  <div>
                    <h3 className="font-serif font-bold text-2xl sm:text-3xl text-white tracking-tight">
                      {article.author.name}
                    </h3>
                    <div className="text-sm sm:text-base text-[#38bdf8] font-medium tracking-wide mt-1">
                      {article.author.role}
                    </div>
                  </div>

                  <a
                    href="https://linkedin.com/in/pranjalsarkar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0080C7]/15 border border-[#0080C7]/30 text-xs sm:text-sm font-semibold text-blue-200 hover:bg-[#0080C7]/25 hover:text-white transition-all shadow-sm self-center sm:self-auto"
                  >
                    <LinkedInIcon className="w-4 h-4 fill-current text-[#00a8ff]" />
                    <span>LinkedIn Profile</span>
                    <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                  </a>
                </div>

                <p className="text-base sm:text-lg text-gray-300 leading-[1.8] font-normal mt-4">
                  Guiding senior product leaders, engineering managers, and directors through realistic executive simulations, boardroom decision frameworks, and AI product judgment.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================================
            RELATED ARTICLES SECTION
           ==================================================================== */}
        {relatedPosts.length > 0 && (
          <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-20 sm:mt-24 pt-14 border-t border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-bold tracking-widest text-[#00a8ff] uppercase mb-1 block">
                  Keep Exploring
                </span>
                <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white">
                  More Insights from the Studio
                </h2>
              </div>
              <Link
                to="/blog"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#00a8ff] hover:underline"
              >
                <span>View All Articles</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {relatedPosts.map((rPost) => (
                <Link
                  key={rPost.id}
                  to={`/blog/${rPost.slug}`}
                  className="group relative rounded-xl p-px bg-linear-to-b from-[#00a8ff]/30 via-white/10 to-white/5 hover:from-[#00a8ff] hover:to-[#2563EB] hover:shadow-[0_0_35px_rgba(0,168,255,0.25)] transition-all duration-300 hover:-translate-y-1.5 flex flex-col overflow-hidden text-left"
                >
                  <div className="relative bg-[#060a14]/90 backdrop-blur-xl rounded-xl overflow-hidden flex flex-col h-full border border-white/5">
                    <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-linear-to-r from-transparent via-[#00a2ff]/60 to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />

                    <div className="relative w-full aspect-16/9 overflow-hidden bg-[#001026]">
                      <img
                        src={rPost.coverImage}
                        alt={rPost.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-[#060a14] via-transparent to-transparent opacity-85" />
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#0080C7]/20 border border-[#0080C7]/40 text-[#38bdf8] text-[11px] font-semibold backdrop-blur-md">
                        {rPost.tags?.[0] || 'Leadership'}
                      </div>
                      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] text-gray-300 border border-white/10">
                        <Clock className="w-3 h-3 text-[#00a8ff]" />
                        <span>{rPost.readTime}</span>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
                      <div>
                        <div className="text-xs text-gray-400 mb-2">
                          {rPost.date}
                        </div>
                        <h3 className="font-serif font-bold text-lg sm:text-xl text-white group-hover:text-blue-300 transition-colors leading-snug line-clamp-2 mb-2">
                          {rPost.title}
                        </h3>
                        <p className="text-gray-400 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                          {rPost.excerpt}
                        </p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#00a8ff]">
                        <span>Read Article</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
