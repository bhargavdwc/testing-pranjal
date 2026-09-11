import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function RefundPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative bg-[#000001] text-white min-h-screen flex flex-col font-sans overflow-hidden">
      <Helmet>
        <title>Refund Policy | Pranjal Sarkar</title>
        <meta name="description" content="Refund Policy for Pranjal Sarkar's AI Product Leadership Studio masterclasses and workshops." />
        <meta property="og:title" content="Refund Policy | Pranjal Sarkar" />
        <meta property="og:description" content="Refund Policy for Pranjal Sarkar's AI Product Leadership Studio masterclasses and workshops." />
        <meta name="twitter:title" content="Refund Policy | Pranjal Sarkar" />
        <meta name="twitter:description" content="Refund Policy for Pranjal Sarkar's AI Product Leadership Studio masterclasses and workshops." />
      </Helmet>
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-[#0080C7] blur-[150px] opacity-20 pointer-events-none z-0" />
      
      <Navbar />

      <main className="flex-1 relative z-10 pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 md:px-12 max-w-4xl mx-auto w-full">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-[34px] sm:text-3xl md:text-5xl font-serif font-bold leading-[1.15] md:leading-normal mb-2">
            <span className="relative inline-block text-transparent bg-clip-text bg-linear-to-b from-[rgba(24,37,226,1)] to-[#006eff] drop-shadow-[0_0_15px_rgba(24,37,226,0.6)] pb-2">
              Refund Policy
              {/* Horizontal flare line */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 sm:w-64 md:w-96 h-0.5 bg-linear-to-r from-transparent via-[#0080C7] to-transparent shadow-[0_0_20px_rgba(0,128,199,0.9)] opacity-90" />
            </span>
          </h1>
          <p className="text-gray-400 text-[13px] sm:text-sm mt-3 sm:mt-4">Last updated: April 2026</p>
        </div>
        
        <div className="space-y-5 sm:space-y-6 text-gray-300 leading-[1.65] sm:leading-relaxed text-[14.5px] md:text-[16px] text-justify sm:text-left">
          <p>This Refund Policy applies to all paid services offered through pranjalsarkar.com including live masterclasses and workshops. Please read this carefully before making a purchase.</p>
          <p>For any refund requests or questions, write to <a href="mailto:office@pranjalsarkar.com" className="text-[#3B82F6] hover:underline">office@pranjalsarkar.com</a></p>
          
          <h3 className="text-[20px] sm:text-xl md:text-2xl font-serif font-bold text-white mt-8 sm:mt-10 mb-3 sm:mb-4">1. Masterclasses and Workshops</h3>
          <h4 className="text-[17px] sm:text-lg font-bold text-gray-100 mt-5 sm:mt-6 mb-2 sm:mb-3">1.1 Eligibility for Refund</h4>
          <p>A full refund is available if you cancel your registration more than 24 hours before the scheduled session start time.</p>
          <p>No refund is issued in the following circumstances:</p>
          <ul className="list-disc pl-4 sm:pl-6 space-y-1.5 sm:space-y-2">
            <li>Cancellation requested less than 24 hours before the session starts.</li>
            <li>The session has already begun.</li>
            <li>You attended the session and then requested a refund.</li>
            <li>You did not attend and did not inform us before the session.</li>
          </ul>
          <p>No exceptions are made to this policy. Every seat taken is a seat another participant could not get. This policy exists to keep the group committed and the experience high quality for everyone.</p>

          <h4 className="text-[17px] sm:text-lg font-bold text-gray-100 mt-5 sm:mt-6 mb-2 sm:mb-3">1.2 How to Request a Refund</h4>
          <p>To request a refund, write to <a href="mailto:office@pranjalsarkar.com" className="text-[#3B82F6] hover:underline">office@pranjalsarkar.com</a> with the following details:</p>
          <ul className="list-disc pl-4 sm:pl-6 space-y-1.5 sm:space-y-2">
            <li>Your full name.</li>
            <li>Your registered email address or mobile number.</li>
            <li>The session name and date.</li>
            <li>Reason for cancellation.</li>
          </ul>
          <p>Refund requests are processed within 5 to 7 working days from the date of approval. The amount will be credited back to the original payment method.</p>

          <h4 className="text-[17px] sm:text-lg font-bold text-gray-100 mt-5 sm:mt-6 mb-2 sm:mb-3">1.3 Missed Sessions</h4>
          <p>If you are unable to attend a session you registered for, you are entitled to one complimentary seat in the next available session of the same programme at no extra cost. This applies once per registration only.</p>
          <p>To exercise this option, write to <a href="mailto:office@pranjalsarkar.com" className="text-[#3B82F6] hover:underline">office@pranjalsarkar.com</a> at least 2 hours before the session begins. This option is not available after the session has ended.</p>
          <p>After one transfer, a fresh registration at the applicable price is required for future sessions.</p>

          <h4 className="text-[17px] sm:text-lg font-bold text-gray-100 mt-5 sm:mt-6 mb-2 sm:mb-3">1.4 Session Cancelled by Pranjal Sarkar</h4>
          <p>In the unlikely event that a session is cancelled, all registered participants will be offered one of the following at their choice:</p>
          <ul className="list-disc pl-4 sm:pl-6 space-y-1.5 sm:space-y-2">
            <li>A full refund to the original payment method.</li>
            <li>A complimentary seat in the next available session of the same programme.</li>
          </ul>
          <p>Participants will be notified via WhatsApp and email as soon as a cancellation decision is made.</p>

          <h3 className="text-[20px] sm:text-xl md:text-2xl font-serif font-bold text-white mt-8 sm:mt-10 mb-3 sm:mb-4">2. Early Bird Pricing</h3>
          <p>Early bird pricing is non-transferable between sessions. If you registered at early bird pricing and request a transfer to a future session, the early bird rate applies only to the original session. Future sessions are charged at the applicable rate at the time of transfer.</p>

          <h3 className="text-[20px] sm:text-xl md:text-2xl font-serif font-bold text-white mt-8 sm:mt-10 mb-3 sm:mb-4">3. Corporate Registrations</h3>
          <p>For corporate registrations involving multiple seats, refund requests must be submitted in writing to <a href="mailto:office@pranjalsarkar.com" className="text-[#3B82F6] hover:underline">office@pranjalsarkar.com</a> at least 48 hours before the session. Partial refunds for unused seats within a group booking are considered on a case by case basis.</p>

          <h3 className="text-[20px] sm:text-xl md:text-2xl font-serif font-bold text-white mt-8 sm:mt-10 mb-3 sm:mb-4">4. Free Tools and Resources</h3>
          <p>The Decision Audit Tools and free downloadable resources on this website are provided at no cost. No refund policy applies to free resources.</p>

          <h3 className="text-[20px] sm:text-xl md:text-2xl font-serif font-bold text-white mt-8 sm:mt-10 mb-3 sm:mb-4">5. Digital Products</h3>
          <p>For any digital products purchased through this website or linked platforms, refunds are not available once the product has been downloaded or accessed. If you experience a technical issue preventing access, write to <a href="mailto:office@pranjalsarkar.com" className="text-[#3B82F6] hover:underline">office@pranjalsarkar.com</a> and the issue will be resolved promptly.</p>

          <h3 className="text-[20px] sm:text-xl md:text-2xl font-serif font-bold text-white mt-8 sm:mt-10 mb-3 sm:mb-4">6. Payment Processing</h3>
          <p>All payments are processed securely through our payment gateway. No card or payment details are stored on this website. Refunds are processed back to the original payment method and may take 5 to 10 working days to reflect in your account depending on your bank.</p>

          <h3 className="text-[20px] sm:text-xl md:text-2xl font-serif font-bold text-white mt-8 sm:mt-10 mb-3 sm:mb-4">7. GST</h3>
          <p>GST invoices are available on request. Write to <a href="mailto:office@pranjalsarkar.com" className="text-[#3B82F6] hover:underline">office@pranjalsarkar.com</a> with your GST number and billing details before the session. GST amounts are non-refundable once an invoice has been issued, in accordance with applicable tax regulations.</p>

          <h3 className="text-[20px] sm:text-xl md:text-2xl font-serif font-bold text-white mt-8 sm:mt-10 mb-3 sm:mb-4">8. Changes to This Policy</h3>
          <p>This Refund Policy may be updated from time to time. The date of the most recent revision is shown at the top of this page. Continued use of this website after any changes constitutes your acceptance of the updated policy.</p>

          <h3 className="text-[20px] sm:text-xl md:text-2xl font-serif font-bold text-white mt-8 sm:mt-10 mb-3 sm:mb-4">9. Contact</h3>
          <p>For any refund requests, questions, or concerns related to this policy, please contact:</p>
          <p>
            Pranjal Sarkar<br />
            Email: <a href="mailto:office@pranjalsarkar.com" className="text-[#3B82F6] hover:underline">office@pranjalsarkar.com</a><br />
            Website: pranjalsarkar.com<br />
            Location: Ahmedabad, Gujarat, India
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
