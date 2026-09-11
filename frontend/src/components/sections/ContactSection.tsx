import { useState, useEffect, useRef } from 'react';
import { Phone, Calendar, User, Mail, Briefcase, Building2, Pencil, ShieldCheck, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';

import { API_URL } from '../../../config';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: '', company: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || 680);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      const newWidth = canvas.parentElement.offsetWidth;
      const newHeight = canvas.parentElement.offsetHeight;
      if (width !== newWidth || height !== newHeight) {
        width = canvas.width = newWidth;
        height = canvas.height = newHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    let step = 0;
    let isVisible = false;

    const render = () => {
      if (!isVisible) return;
      ctx.clearRect(0, 0, width, height);

      // 1. Intense bottom-left electric blue radial burst (exact match to wireframe)
      const glowGrad = ctx.createRadialGradient(
        0, height, 10,
        width * 0.15, height * 0.85, width * 0.55
      );
      glowGrad.addColorStop(0, 'rgba(0, 140, 255, 0.75)');
      glowGrad.addColorStop(0.2, 'rgba(0, 100, 240, 0.45)');
      glowGrad.addColorStop(0.55, 'rgba(0, 50, 170, 0.15)');
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. 3D Dotted Wave Grid matching wireframe curve
      const rows = 45; // Z-depth rows
      const cols = 90; // X-axis columns
      const xSeparation = (width * 1.3) / cols;

      step += 0.007; // gentle smooth animation

      for (let r = 0; r < rows; r++) {
        const depth = r / rows; // 0 = front (bottom), 1 = back (top)
        const pScale = Math.pow(1 - depth * 0.65, 1.7); // Perspective scaling
        const rowY = height * 0.96 - depth * (height * 0.5); // Grid baseline height

        for (let c = 0; c < cols; c++) {
          const normX = c / cols; // 0 (left) to 1 (right)
          const xPos = (c - cols / 2) * xSeparation * pScale + width * 0.46;

          // Double wave elevation profile matching the wireframe wave
          const waveLeftRise = Math.sin((normX - 0.05) * Math.PI * 1.8 - step + depth * 2.5) * 50;
          const waveRightSwell = Math.cos((normX - 0.4) * Math.PI * 1.6 + step * 0.5) * 30;
          const elevation = (waveLeftRise + waveRightSwell) * pScale;

          const yPos = rowY + elevation;

          if (xPos < -30 || xPos > width + 30 || yPos < 0 || yPos > height + 30) continue;

          // Alpha fade: brighter near bottom-left glow source and foreground
          const alphaDepth = Math.pow(1 - depth * 0.75, 1.6);
          const leftFactor = Math.max(0, 1 - normX * 1.8);
          const alpha = Math.min(1, Math.max(0.04, alphaDepth * (0.3 + leftFactor * 0.65)));

          const radius = Math.max(0.6, (1.8 * pScale) * (1 + leftFactor * 0.5));

          ctx.beginPath();
          ctx.arc(xPos, yPos, radius, 0, Math.PI * 2);

          if (leftFactor > 0.4) {
            ctx.fillStyle = `rgba(0, 225, 255, ${alpha})`;
          } else {
            ctx.fillStyle = `rgba(0, 136, 255, ${alpha})`;
          }
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
        if (isVisible) {
          render();
        } else {
          cancelAnimationFrame(animationFrameId);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, []);

  const getWordCount = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  };

  const messageWordCount = getWordCount(form.message);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);

    if (!form.name.trim()) {
      setSubmitError('Please enter your full name.');
      setIsSubmitting(false);
      return;
    }

    if (form.name.trim().length > 50) {
      setSubmitError('Full name must be 50 characters or less.');
      setIsSubmitting(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      setSubmitError('Please enter a valid email address.');
      setIsSubmitting(false);
      return;
    }

    const phoneRegex = /^\+?[0-9\s\-()]{7,15}$/;
    if (form.phone && !phoneRegex.test(form.phone.trim())) {
      setSubmitError('Please enter a valid phone number.');
      setIsSubmitting(false);
      return;
    }

    if (!form.role.trim()) {
      setSubmitError('Please enter your current role.');
      setIsSubmitting(false);
      return;
    }

    if (form.role.trim().length > 50) {
      setSubmitError('Current role must be 50 characters or less.');
      setIsSubmitting(false);
      return;
    }

    if (!form.company.trim()) {
      setSubmitError('Please enter your company name.');
      setIsSubmitting(false);
      return;
    }

    if (form.company.trim().length > 50) {
      setSubmitError('Company name must be 50 characters or less.');
      setIsSubmitting(false);
      return;
    }

    if (!form.message.trim()) {
      setSubmitError('Please enter a message or LinkedIn profile.');
      setIsSubmitting(false);
      return;
    }

    if (messageWordCount > 250) {
      setSubmitError(`Message exceeds the 250 words limit (currently ${messageWordCount} words).`);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          role: form.role.trim(),
          company: form.company.trim(),
          message: form.message.trim(),
          recaptchaToken,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitted(true);
        setForm({ name: '', email: '', phone: '', role: '', company: '', message: '' });
        setRecaptchaToken(null);
        recaptchaRef.current?.reset();
        setTimeout(() => {
          setSubmitted(false);
        }, 3000);
      } else {
        setSubmitError(data.message || 'Something went wrong. Please try again.');
        setRecaptchaToken(null);
        recaptchaRef.current?.reset();
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setSubmitError('Unable to connect to the server. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-8 md:py-14 overflow-hidden bg-[#000000] text-white border-b border-white/5">
      {/* Background 3D Dotted Wave Canvas (100% wireframe match) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <canvas ref={canvasRef} className="absolute bottom-0 left-0 w-full h-full opacity-70 mix-blend-screen" />

        {/* Fine background dot matrix grid overlay */}
        <div
          className="absolute inset-0 opacity-5 mix-blend-screen pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, rgba(0, 140, 255, 0.35) 1.5px, transparent 0)',
            backgroundSize: '28px 28px'
          }}
        />

        {/* Soft top-right dark glow vignette */}
        <div className="absolute top-0 right-0 w-150 h-150 bg-[radial-gradient(circle_at_top_right,rgba(0,70,180,0.12)_0%,transparent_60%)] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.25fr] gap-10 lg:gap-x-16 lg:gap-y-10 items-center">

          {/* Top Left: Header and Text */}
          <div className="max-w-xl lg:max-w-none mx-auto lg:mx-0 w-full lg:col-start-1 lg:row-start-1 lg:self-end">
            {/* Header with Horizontal Laser Flare Line */}
            <div className="relative mb-6 sm:mb-8 text-center lg:text-left">
              <h2 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl leading-[1.1] tracking-tight text-white mb-2">
                Ready to make<br />
                <span className="relative inline-block text-transparent bg-clip-text bg-linear-to-b from-[rgba(24,37,226,1)] to-[#006eff] drop-shadow-[0_0_15px_rgba(24,37,226,0.6)]">your move?</span>
              </h2>

              {/* Razor-thin 2px Horizontal Laser Flare Line */}
              <div className="relative mt-4 sm:mt-5 mb-3 w-40 sm:w-50 mx-auto lg:mx-0 h-0.75 pointer-events-none">
                <div className="absolute -bottom-3 left-1/2 lg:left-0 -translate-x-1/2 lg:translate-x-0 w-32 sm:w-48 md:w-80 h-0.5 bg-linear-to-r from-transparent via-[rgba(24,37,226,1)] to-transparent shadow-[0_0_15px_rgba(24,37,226,0.9)] opacity-80" />
              </div>
            </div>

            <p className="text-[#D1D5DB] text-sm sm:text-base md:text-lg leading-relaxed text-center lg:text-left max-w-lg mx-auto lg:mx-0">
              Fill out the application form. It takes 1–3 minutes. We review every application personally and respond within <span className="text-white font-bold">24 hours</span>.
            </p>

          </div>

          {/* Right Column — Glowing Form Box (100% copy of wireframe) */}
          <div className="relative w-full rounded-xl bg-[#040914]/90 border-2 border-[#0070f3]/70 shadow-[0_0_40px_rgba(0,112,243,0.3),inset_0_0_25px_rgba(0,112,243,0.15)] sm:shadow-[0_0_60px_rgba(0,112,243,0.4),inset_0_0_35px_rgba(0,112,243,0.15)] p-5 sm:p-8 md:p-10 z-10 backdrop-blur-xl lg:col-start-2 lg:row-start-1 lg:row-span-2">
            {/* Top and right inner gradient border light line glows */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-[#38bdf8] to-transparent opacity-90" />
            <div className="absolute top-0 bottom-0 right-0 w-0.5 bg-linear-to-b from-transparent via-[#0070f3] to-transparent opacity-60" />

            <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-4 sm:gap-5">
              <div className="mb-2 sm:mb-4 text-center sm:text-left">
                <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                  Apply for <span className="text-[#0075ff]">Enrollment</span>
                </h3>
                <p className="text-[#D1D5DB] text-xs sm:text-sm md:text-base mt-2">
                  All fields are required. Admissions are selective.
                </p>
              </div>

              {submitted && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-300 text-sm font-semibold mb-2">
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  <span>Application received! We'll respond within 24 hours.</span>
                </div>
              )}

                {/* Name + Email */}
                <div className="grid grid-cols-2 gap-3 sm:gap-5">
                  {/* Name */}
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-1 sm:mb-2">
                      <label htmlFor="contact-name" className="text-[#b2c0d3] text-[10px] sm:text-[11px] font-bold tracking-widest uppercase truncate">
                        FULL NAME
                      </label>
                      <span className="text-[#99a1ac] text-[9px] sm:text-[10px] ml-1">
                        {form.name.length}/50
                      </span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 px-3 py-2.5 sm:px-4 sm:py-3.5 rounded-lg border border-[#172740] bg-[#070e1b] transition-all focus-within:border-[#0070f3] focus-within:shadow-[0_0_15px_rgba(0,112,243,0.25)]">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#0070f3] shrink-0" />
                      <input
                        id="contact-name"
                        type="text"
                        required
                        maxLength={50}
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value.slice(0, 50) }))}
                        placeholder="Your Name"
                        className="bg-transparent border-none outline-none text-white text-xs sm:text-sm w-full placeholder:text-[#99a1ac]"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-1 sm:mb-2">
                      <label htmlFor="contact-email" className="text-[#b2c0d3] text-[10px] sm:text-[11px] font-bold tracking-widest uppercase truncate">
                        WORK EMAIL
                      </label>
                    </div>
                    <div className={`flex items-center gap-2 sm:gap-3 px-3 py-2.5 sm:px-4 sm:py-3.5 rounded-lg border ${form.email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? 'border-red-500/50 focus-within:border-red-500/50 focus-within:shadow-[0_0_15px_rgba(239,68,68,0.25)]' : 'border-[#172740] focus-within:border-[#0070f3] focus-within:shadow-[0_0_15px_rgba(0,112,243,0.25)]'} bg-[#070e1b] transition-all`}>
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#0070f3] shrink-0" />
                      <input
                        id="contact-email"
                        type="email"
                        required
                        maxLength={100}
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="you@company.com"
                        className="bg-transparent border-none outline-none text-white text-xs sm:text-sm w-full placeholder:text-[#99a1ac]"
                      />
                    </div>
                    {form.email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && (
                      <span className="text-red-400 text-[10px] sm:text-xs mt-1.5 ml-1 font-medium">Invalid email format</span>
                    )}
                  </div>
                </div>

                {/* Phone + Role */}
                <div className="grid grid-cols-2 gap-3 sm:gap-5">
                  {/* Phone */}
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-1 sm:mb-2">
                      <label htmlFor="contact-phone" className="text-[#b2c0d3] text-[10px] sm:text-[11px] font-bold tracking-widest uppercase truncate">
                        WhatsApp Number
                      </label>
                    </div>
                    <div className={`flex items-center gap-2 sm:gap-3 px-3 py-2.5 sm:px-4 sm:py-3.5 rounded-lg border ${form.phone.length > 0 && !/^\+?[0-9\s\-()]{7,15}$/.test(form.phone) ? 'border-red-500/50 focus-within:border-red-500/50 focus-within:shadow-[0_0_15px_rgba(239,68,68,0.25)]' : 'border-[#172740] focus-within:border-[#0070f3] focus-within:shadow-[0_0_15px_rgba(0,112,243,0.25)]'} bg-[#070e1b] transition-all`}>
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-[#0070f3] shrink-0" />
                      <input
                        id="contact-phone"
                        type="tel"
                        value={form.phone}
                        onChange={e => {
                          const value = e.target.value.replace(/[^\d+\s()-]/g, '');
                          if (value.length <= 15) {
                            setForm(f => ({ ...f, phone: value }));
                          }
                        }}
                        placeholder="9876543210"
                        className="bg-transparent border-none outline-none text-white text-xs sm:text-sm w-full placeholder:text-[#99a1ac]"
                      />
                    </div>
                    {form.phone.length > 0 && !/^\+?[0-9\s\-()]{7,15}$/.test(form.phone) && (
                      <span className="text-red-400 text-[10px] sm:text-xs mt-1.5 ml-1 font-medium">Invalid phone</span>
                    )}
                  </div>

                  {/* Role */}
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-1 sm:mb-2">
                      <label htmlFor="contact-role" className="text-[#b2c0d3] text-[10px] sm:text-[11px] font-bold tracking-widest uppercase truncate">
                        CURRENT ROLE
                      </label>
                      <span className="text-[#99a1ac] text-[9px] sm:text-[10px] ml-1">
                        {form.role.length}/50
                      </span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 px-3 py-2.5 sm:px-4 sm:py-3.5 rounded-lg border border-[#172740] bg-[#070e1b] transition-all focus-within:border-[#0070f3] focus-within:shadow-[0_0_15px_rgba(0,112,243,0.25)]">
                      <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-[#0070f3] shrink-0" />
                      <input
                        id="contact-role"
                        type="text"
                        required
                        maxLength={50}
                        value={form.role}
                        onChange={e => setForm(f => ({ ...f, role: e.target.value.slice(0, 50) }))}
                        placeholder="PM, EM, etc."
                        className="bg-transparent border-none outline-none text-white text-xs sm:text-sm w-full placeholder:text-[#99a1ac]"
                      />
                    </div>
                  </div>
                </div>

                {/* Company */}
                <div className="flex flex-col">
                  <div className="flex justify-between items-center mb-1 sm:mb-2">
                    <label htmlFor="contact-company" className="text-[#b2c0d3] text-[10px] sm:text-[11px] font-bold tracking-widest uppercase truncate">
                      COMPANY
                    </label>
                    <span className="text-[#99a1ac] text-[9px] sm:text-[10px] ml-1">
                      {form.company.length}/50
                    </span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 px-3 py-2.5 sm:px-4 sm:py-3.5 rounded-lg border border-[#172740] bg-[#070e1b] transition-all focus-within:border-[#0070f3] focus-within:shadow-[0_0_15px_rgba(0,112,243,0.25)]">
                    <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#0070f3] shrink-0" />
                    <input
                      id="contact-company"
                      type="text"
                      required
                      maxLength={50}
                      value={form.company}
                      onChange={e => setForm(f => ({ ...f, company: e.target.value.slice(0, 50) }))}
                      placeholder="Where you work"
                      className="bg-transparent border-none outline-none text-white text-xs sm:text-sm w-full placeholder:text-[#99a1ac]"
                    />
                  </div>
                </div>

                {/* Why applying */}
                <div className="flex flex-col">
                  <div className="flex justify-between items-center mb-1 sm:mb-2">
                    <label htmlFor="contact-message" className="text-[#b2c0d3] text-[10px] sm:text-[11px] font-bold tracking-widest uppercase truncate">
                      Message or LinkedIn Profile
                    </label>
                    <span className={`text-[9px] sm:text-[10px] font-semibold ${messageWordCount > 250 ? 'text-red-400 font-bold' : 'text-[#99a1ac]'}`}>
                      {messageWordCount}/250 words
                    </span>
                  </div>
                  <div className={`flex items-start gap-2 sm:gap-3 px-3 py-2.5 sm:px-4 sm:py-3.5 rounded-lg border ${messageWordCount > 250 ? 'border-red-500/50 focus-within:border-red-500/50 focus-within:shadow-[0_0_15px_rgba(239,68,68,0.25)]' : 'border-[#172740] focus-within:border-[#0070f3] focus-within:shadow-[0_0_15px_rgba(0,112,243,0.25)]'} bg-[#070e1b] transition-all`}>
                    <Pencil className="w-4 h-4 sm:w-5 sm:h-5 text-[#0070f3] mt-0.5 shrink-0" />
                    <textarea
                      id="contact-message"
                      required
                      rows={3}
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="What's the leadership gap you're trying to close?&#10;What's at stake?"
                      className="bg-transparent border-none outline-none text-white text-xs sm:text-sm w-full placeholder:text-[#99a1ac] resize-none"
                    />
                  </div>
                  {messageWordCount > 250 && (
                    <span className="text-red-400 text-[10px] sm:text-xs mt-1.5 ml-1 font-medium">Message exceeds the 250 words limit (currently {messageWordCount} words).</span>
                  )}
                </div>

                {/* Error Message */}
                {submitError && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold">
                    <span>⚠️</span>
                    <span>{submitError}</span>
                  </div>
                )}

                {/* reCAPTCHA Widget */}
                <div className="mt-2 flex justify-center sm:justify-start">
                  {import.meta.env.VITE_RECAPTCHA_SITE_KEY ? (
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                      theme="dark"
                      onChange={(token) => setRecaptchaToken(token)}
                    />
                  ) : (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold">
                      reCAPTCHA is missing. Please add VITE_RECAPTCHA_SITE_KEY to your environment variables.
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !recaptchaToken || messageWordCount > 250}
                  className="w-full mt-2 sm:mt-4 py-3.5 sm:py-4 px-6 rounded-lg text-white font-bold text-base sm:text-lg bg-linear-to-r from-[#0088ff] via-[#0066ff] to-[#0052eb] hover:from-[#0096ff] hover:via-[#0075ff] hover:to-[#005eff] border-t border-white/40 transition-all duration-300 shadow-[0_0_25px_rgba(0,120,255,0.6)] hover:shadow-[0_0_40px_rgba(0,140,255,0.8)] flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Interview Request
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                {/* Footer Privacy Text */}
                <div className="flex items-center justify-center gap-2 mt-1 sm:mt-2">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#38bdf8]" />
                  <p className="text-[#bec3ca] text-[11px] sm:text-xs font-medium">
                    We respect your privacy. No spam. Ever.
                  </p>
                </div>
              </form>
          </div>

          {/* Bottom Left: Contact info cards */}
          <div className="w-full max-w-xl lg:max-w-none mx-auto lg:mx-0 lg:col-start-1 lg:row-start-2 lg:self-start">
            <div className="flex flex-col sm:flex-row lg:flex-col gap-4 w-full justify-center lg:justify-start">
              {/* Phone Card */}
              <a 
                href="https://wa.me/919979429183" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex-1 flex items-center gap-4 sm:gap-5 p-3.5 sm:p-4 rounded-xl border border-[#0070f3]/25 bg-[#060d1a]/25 backdrop-blur-md shadow-[0_0_25px_rgba(0,100,255,0.06)] hover:border-[#25D366]/50 hover:shadow-[0_0_25px_rgba(37,211,102,0.15)] transition-all duration-300 group cursor-pointer no-underline w-full max-w-sm sm:max-w-none mx-auto lg:mx-0 lg:max-w-xs"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#0070f3]/50 group-hover:border-[#25D366]/60 bg-[#00142c] text-[#38bdf8] group-hover:text-[#25D366] flex items-center justify-center shadow-[inset_0_0_12px_rgba(0,136,255,0.35)] group-hover:shadow-[inset_0_0_15px_rgba(37,211,102,0.35)] shrink-0 transition-all duration-300">
                
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor">
                    <path d="M12.031 0C5.405 0 .028 5.378.028 12.003c0 2.115.548 4.183 1.593 6.002L.038 23.999l6.147-1.611c1.761.966 3.743 1.477 5.845 1.477 6.626 0 12.004-5.377 12.004-12.003C24.034 5.378 18.657 0 12.031 0zm6.577 17.387c-.267.753-1.547 1.439-2.127 1.503-.58.064-1.285.234-4.103-.941-3.385-1.413-5.59-4.872-5.76-5.097-.17-.225-1.377-1.83-1.377-3.489 0-1.658.85-2.476 1.157-2.793.307-.317.674-.396.896-.396.222 0 .445.006.634.015.202.01.472-.078.736.56.28.673.955 2.336 1.04 2.505.085.17.142.368.028.593-.114.225-.17.368-.34.566-.17.198-.354.437-.505.58-.17.16-.35.34-.146.689.204.35 1.115 1.838 2.456 3.036 1.733 1.549 3.197 2.036 3.553 2.193.355.157.562.13.771-.115.21-.245.912-1.06 1.156-1.425.245-.365.489-.304.815-.184.326.12 2.062.973 2.416 1.152.354.179.59.266.674.412.085.146.085.844-.182 1.597z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[#8a93a0] text-[10px] sm:text-[12px] font-bold tracking-widest uppercase mb-1">WhatsApp NUMBER</div>
                  <div className="text-white text-[13px] sm:text-base font-bold tracking-wide">+91 99794 29183</div>
                </div>
              </a>

              {/* Response Time Card */}
              <div className="flex-1 flex items-center gap-4 sm:gap-5 p-3.5 sm:p-4 rounded-xl border border-[#0070f3]/25 bg-[#060d1a]/25 backdrop-blur-md shadow-[0_0_25px_rgba(0,100,255,0.06)] hover:border-[#0070f3]/50 transition-all duration-300 w-full max-w-sm sm:max-w-none mx-auto lg:mx-0 lg:max-w-xs">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#0070f3]/50 bg-[#00142c] text-[#38bdf8] flex items-center justify-center shadow-[inset_0_0_12px_rgba(0,136,255,0.35)] shrink-0">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#38bdf8]" />
                </div>
                <div>
                  <div className="text-[#8a93a0] text-[10px] sm:text-[12px] font-bold tracking-widest uppercase mb-1">RESPONSE TIME</div>
                  <div className="text-white text-[13px] sm:text-base font-bold tracking-wide">Within 24 hours </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
