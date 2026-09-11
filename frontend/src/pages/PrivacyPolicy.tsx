import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative bg-[#000001] text-white min-h-screen flex flex-col font-sans overflow-hidden">
      <Helmet>
        <title>Privacy Policy | Pranjal Sarkar</title>
        <meta name="description" content="Privacy Policy for Pranjal Sarkar's AI Product Leadership Studio. Learn how your data is collected, used, and protected." />
        <meta property="og:title" content="Privacy Policy | Pranjal Sarkar" />
        <meta property="og:description" content="Privacy Policy for Pranjal Sarkar's AI Product Leadership Studio. Learn how your data is collected, used, and protected." />
        <meta name="twitter:title" content="Privacy Policy | Pranjal Sarkar" />
        <meta name="twitter:description" content="Privacy Policy for Pranjal Sarkar's AI Product Leadership Studio. Learn how your data is collected, used, and protected." />
      </Helmet>
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-[#0080C7] blur-[150px] opacity-20 pointer-events-none z-0" />
      
      <Navbar />

      <main className="flex-1 relative z-10 pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 md:px-12 max-w-4xl mx-auto w-full">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-[34px] sm:text-3xl md:text-5xl font-serif font-bold leading-[1.15] md:leading-normal mb-2">
            <span className="relative inline-block text-transparent bg-clip-text bg-linear-to-b from-[rgba(24,37,226,1)] to-[#006eff] drop-shadow-[0_0_15px_rgba(24,37,226,0.6)] pb-2">
              Privacy Policy
              {/* Horizontal flare line */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 sm:w-64 md:w-96 h-0.5 bg-linear-to-r from-transparent via-[#0080C7] to-transparent shadow-[0_0_20px_rgba(0,128,199,0.9)] opacity-90" />
            </span>
          </h1>
          <p className="text-gray-400 text-[13px] sm:text-sm mt-3 sm:mt-4">Last updated: April 2026</p>
        </div>
        
        <div className="space-y-5 sm:space-y-6 text-gray-300 leading-[1.65] sm:leading-relaxed text-[14.5px] md:text-[16px] text-justify sm:text-left">
          <p>This Privacy Policy explains how Pranjal Sarkar collects, uses, and protects information when you visit pranjalsarkar.com, register for a masterclass or workshop, use any free tool on this site, or get in touch directly.</p>
          <p>For any questions about this policy, write to <a href="mailto:office@pranjalsarkar.com" className="text-[#3B82F6] hover:underline">office@pranjalsarkar.com</a></p>
          
          <h3 className="text-[20px] sm:text-xl md:text-2xl font-serif font-bold text-white mt-8 sm:mt-10 mb-3 sm:mb-4">1. Who This Policy Applies To</h3>
          <p>This policy applies to all visitors and users of pranjalsarkar.com, including people who:</p>
          <ul className="list-disc pl-4 sm:pl-6 space-y-1.5 sm:space-y-2">
            <li>Browse the website without registering for anything.</li>
            <li>Register for a masterclass or workshop.</li>
            <li>Use the free Decision Audit Tools.</li>
            <li>Download free resources.</li>
            <li>Submit a contact or enquiry form.</li>
            <li>Follow or engage on linked social media platforms.</li>
          </ul>

          <h3 className="text-[20px] sm:text-xl md:text-2xl font-serif font-bold text-white mt-8 sm:mt-10 mb-3 sm:mb-4">2. What Information Is Collected</h3>
          <h4 className="text-[17px] sm:text-lg font-bold text-gray-100 mt-5 sm:mt-6 mb-2 sm:mb-3">2.1 Information You Provide Directly</h4>
          <p>When you register for a masterclass, submit a contact form, or request a GST invoice, you may provide:</p>
          <ul className="list-disc pl-4 sm:pl-6 space-y-1.5 sm:space-y-2">
            <li>Your full name.</li>
            <li>Your email address.</li>
            <li>Your mobile number.</li>
            <li>Your organisation name, if relevant.</li>
            <li>Any message or context you choose to share.</li>
          </ul>

          <h4 className="text-[17px] sm:text-lg font-bold text-gray-100 mt-5 sm:mt-6 mb-2 sm:mb-3">2.2 Information Collected Automatically</h4>
          <p>When you visit this website, certain information may be collected automatically through standard web technologies:</p>
          <ul className="list-disc pl-4 sm:pl-6 space-y-1.5 sm:space-y-2">
            <li>Your IP address and approximate location.</li>
            <li>Browser type and version.</li>
            <li>Pages visited and time spent on each page.</li>
            <li>Referring website or source.</li>
          </ul>
          <p>This information is collected through cookies and analytics tools to understand how visitors use the site and to improve it over time.</p>

          <h4 className="text-[17px] sm:text-lg font-bold text-gray-100 mt-5 sm:mt-6 mb-2 sm:mb-3">2.3 Decision Audit Tools</h4>
          <p>The Decision Audit Tools available on this website process all responses on your device. No answers, scores, or results from these tools are stored on any server. No account or login is required. Your responses are never transmitted or saved externally.</p>

          <h3 className="text-[20px] sm:text-xl md:text-2xl font-serif font-bold text-white mt-8 sm:mt-10 mb-3 sm:mb-4">3. How This Information Is Used</h3>
          <p>Information collected through this website is used only for the following purposes:</p>
          <ul className="list-disc pl-4 sm:pl-6 space-y-1.5 sm:space-y-2">
            <li>To process your masterclass or workshop registration.</li>
            <li>To send you session details, WhatsApp group links, and post-session resources.</li>
            <li>To issue GST invoices when requested.</li>
            <li>To respond to your enquiries or messages.</li>
            <li>To send you updates about upcoming sessions or resources, if you have opted in.</li>
            <li>To understand website traffic and improve the site experience.</li>
          </ul>
          <p>Your information is never sold to third parties. It is never used for advertising or shared with external marketing platforms.</p>

          <h3 className="text-[20px] sm:text-xl md:text-2xl font-serif font-bold text-white mt-8 sm:mt-10 mb-3 sm:mb-4">4. WhatsApp Communication</h3>
          <p>Registered participants are added to a dedicated WhatsApp group for each session. This group is used to share session links, reminders, updates, and post-session resources.</p>
          <p>Your mobile number is used solely for this purpose. You will be removed from the group after the session concludes unless you choose to stay for ongoing updates.</p>

          <h3 className="text-[20px] sm:text-xl md:text-2xl font-serif font-bold text-white mt-8 sm:mt-10 mb-3 sm:mb-4">5. Email Communication</h3>
          <p>If you register for a session or contact through the website, you may receive emails related to your registration, GST invoice, or enquiry response.</p>
          <p>Promotional emails about upcoming sessions or resources are only sent if you have opted in. You can opt out at any time by replying to any email with the word Unsubscribe or by writing to <a href="mailto:office@pranjalsarkar.com" className="text-[#3B82F6] hover:underline">office@pranjalsarkar.com</a></p>

          <h3 className="text-[20px] sm:text-xl md:text-2xl font-serif font-bold text-white mt-8 sm:mt-10 mb-3 sm:mb-4">6. Cookies</h3>
          <p>This website uses cookies to improve your browsing experience and to understand how visitors use the site. Cookies are small text files stored on your device.</p>
          <p>The types of cookies used on this site include:</p>
          <ul className="list-disc pl-4 sm:pl-6 space-y-1.5 sm:space-y-2">
            <li>Essential cookies: required for the website to function correctly.</li>
            <li>Analytics cookies: used to understand visitor behaviour and improve the site. This includes Google Analytics or similar tools.</li>
          </ul>
          <p>You can disable cookies through your browser settings. Note that disabling cookies may affect how some parts of the website function.</p>

          <h3 className="text-[20px] sm:text-xl md:text-2xl font-serif font-bold text-white mt-8 sm:mt-10 mb-3 sm:mb-4">7. Third-Party Services</h3>
          <p>This website uses third-party services to operate effectively. These may include:</p>
          <ul className="list-disc pl-4 sm:pl-6 space-y-1.5 sm:space-y-2">
            <li>Google Analytics: for website traffic analysis.</li>
            <li>WPForms or similar: for contact and registration forms.</li>
            <li>Razorpay: for payment processing.</li>
            <li>Brevo: for email delivery.</li>
            <li>Interakt: for WhatsApp communication.</li>
            <li>Zoom: for live session delivery.</li>
          </ul>
          <p>Each of these services has its own privacy policy and data practices. Pranjal Sarkar is not responsible for the data practices of these third-party providers.</p>
          <p>Payment information including card details is processed directly by Razorpay and is never stored on this website.</p>

          <h3 className="text-[20px] sm:text-xl md:text-2xl font-serif font-bold text-white mt-8 sm:mt-10 mb-3 sm:mb-4">8. Data Storage and Security</h3>
          <p>Information you provide is stored securely. Reasonable technical and organisational measures are in place to protect your data from unauthorised access, loss, or misuse.</p>
          <p>However, no method of transmission over the internet or electronic storage is completely secure. While every effort is made to protect your information, absolute security cannot be guaranteed.</p>
          <p>Data is stored for as long as necessary to fulfil the purpose for which it was collected, after which it is deleted or anonymised.</p>

          <h3 className="text-[20px] sm:text-xl md:text-2xl font-serif font-bold text-white mt-8 sm:mt-10 mb-3 sm:mb-4">9. Your Rights</h3>
          <p>You have the right to:</p>
          <ul className="list-disc pl-4 sm:pl-6 space-y-1.5 sm:space-y-2">
            <li>Request a copy of the personal information held about you.</li>
            <li>Request correction of any inaccurate information.</li>
            <li>Request deletion of your personal information, subject to any legal obligations.</li>
            <li>Withdraw consent for communications at any time.</li>
            <li>Ask questions about how your data is being used.</li>
          </ul>
          <p>To exercise any of these rights, write to <a href="mailto:office@pranjalsarkar.com" className="text-[#3B82F6] hover:underline">office@pranjalsarkar.com</a> Your request will be responded to within 7 working days.</p>

          <h3 className="text-[20px] sm:text-xl md:text-2xl font-serif font-bold text-white mt-8 sm:mt-10 mb-3 sm:mb-4">10. Children</h3>
          <p>This website and its services are intended for adults. No services are directed at individuals under the age of 18. If you believe a minor has submitted personal information through this website, write to <a href="mailto:office@pranjalsarkar.com" className="text-[#3B82F6] hover:underline">office@pranjalsarkar.com</a> and the information will be removed promptly.</p>

          <h3 className="text-[20px] sm:text-xl md:text-2xl font-serif font-bold text-white mt-8 sm:mt-10 mb-3 sm:mb-4">11. Links to Other Websites</h3>
          <p>This website contains links to third-party websites including LinkedIn, YouTube, Instagram, ProductTank, DigiFixKit, and HyperPolling. Once you leave this website, this Privacy Policy no longer applies. The privacy practices of those sites are governed by their own policies.</p>

          <h3 className="text-[20px] sm:text-xl md:text-2xl font-serif font-bold text-white mt-8 sm:mt-10 mb-3 sm:mb-4">12. Changes to This Policy</h3>
          <p>This Privacy Policy may be updated from time to time. The date of the most recent revision is shown at the top of this page. Continued use of this website after any changes constitutes your acceptance of the updated policy.</p>

          <h3 className="text-[20px] sm:text-xl md:text-2xl font-serif font-bold text-white mt-8 sm:mt-10 mb-3 sm:mb-4">13. Contact</h3>
          <p>For any questions, concerns, or requests related to this Privacy Policy, please contact:</p>
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
