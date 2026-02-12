import React from 'react';
import { ChevronLeft } from 'lucide-react';

export default function PrivacyPolicyScreen({ darkMode = false, onBack }) {
  const bgClass = darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-100';

  return (
    <div className={`min-h-screen flex flex-col ${bgClass} animate-in slide-in-from-right`}>
      {/* Header */}
      <div className={`sticky top-0 z-10 border-b ${borderColor} p-6 flex items-center gap-4`}>
        <button 
          onClick={onBack}
          className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-black">Privacy Policy</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <p className={`text-sm ${textSecondary}`}>Effective Date: February 2026</p>
            <p className={`text-sm ${textSecondary} mt-2`}>Last Updated: February 11, 2026</p>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">1. Introduction</h2>
            <p className={textSecondary}>
              At Nest Savings (hereinafter "we," "us," "our," or "Nest"), we are committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 
              mobile application and related services (collectively, the "Service").
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">2. Information We Collect</h2>
            <p className={textSecondary}>We may collect information about you in various ways:</p>
            <ul className={`list-disc list-inside space-y-2 ${textSecondary}`}>
              <li><strong>Personal Information:</strong> Name, email address, phone number, account number, date of birth, and identification documents</li>
              <li><strong>Financial Information:</strong> Bank account details, transaction history, savings goals, and payment method information</li>
              <li><strong>Device Information:</strong> Device type, operating system, unique device identifiers, and mobile network information</li>
              <li><strong>Usage Data:</strong> Pages or features you access, time spent on pages, and actions taken within the app</li>
              <li><strong>Location Data:</strong> Approximate location based on IP address (with your consent)</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">3. How We Use Your Information</h2>
            <p className={textSecondary}>We use the collected information for various purposes:</p>
            <ul className={`list-disc list-inside space-y-2 ${textSecondary}`}>
              <li>Providing, maintaining, and improving our Service</li>
              <li>Processing your transactions and sending related information</li>
              <li>Sending promotional communications (with your consent)</li>
              <li>Responding to your inquiries and customer support requests</li>
              <li>Compliance with legal, statutory, and regulatory requirements</li>
              <li>Fraud detection and prevention</li>
              <li>Analyzing usage patterns to improve user experience</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">4. Information Sharing and Disclosure</h2>
            <p className={textSecondary}>
              We do not sell, trade, or rent your personal information to third parties. However, we may share your 
              information in the following circumstances:
            </p>
            <ul className={`list-disc list-inside space-y-2 ${textSecondary}`}>
              <li><strong>Service Providers:</strong> With vendors and service providers who assist us in operating our website and conducting our business</li>
              <li><strong>Legal Requirements:</strong> When required by law or in response to legal processes</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">5. Data Security</h2>
            <p className={textSecondary}>
              We implement comprehensive security measures to protect your personal information from unauthorized access, 
              alteration, disclosure, or destruction. Our security includes:
            </p>
            <ul className={`list-disc list-inside space-y-2 ${textSecondary}`}>
              <li>Encryption of data in transit and at rest</li>
              <li>Secure authentication mechanisms</li>
              <li>Regular security audits and updates</li>
              <li>Limited access to personal information by authorized personnel only</li>
            </ul>
            <p className={textSecondary}>
              However, no method of transmission over the internet or electronic storage is 100% secure. 
              We cannot guarantee absolute security.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">6. Your Privacy Rights</h2>
            <p className={textSecondary}>You have the right to:</p>
            <ul className={`list-disc list-inside space-y-2 ${textSecondary}`}>
              <li>Access the personal information we hold about you</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of marketing communications</li>
              <li>Data portability rights in certain jurisdictions</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">7. Cookies and Tracking Technologies</h2>
            <p className={textSecondary}>
              Our Service may use cookies and similar tracking technologies to enhance your experience. 
              These technologies help us understand user behavior and remember preferences. You can control 
              cookie settings through your device settings.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">8. Third-Party Links</h2>
            <p className={textSecondary}>
              Our Service may contain links to third-party websites and applications. This Privacy Policy does not 
              apply to these external sites, and we are not responsible for their privacy practices. 
              We encourage you to review their privacy policies before providing your information.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">9. Children's Privacy</h2>
            <p className={textSecondary}>
              Nest is not intended for children under the age of 18. We do not knowingly collect personal information 
              from children. If we learn that we have collected personal information from a child under 18, 
              we will take steps to delete such information promptly.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">10. International Data Transfers</h2>
            <p className={textSecondary}>
              Your information may be transferred to, stored in, and processed in countries other than your country 
              of residence. These countries may have data protection laws different from your country. 
              By using our Service, you consent to such transfers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">11. Policy Updates</h2>
            <p className={textSecondary}>
              We may update this Privacy Policy from time to time. We will notify you of any significant changes by 
              posting the new Privacy Policy on our Service and updating the "Last Updated" date above.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">12. Contact Us</h2>
            <p className={textSecondary}>
              If you have questions about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <div className={`mt-4 p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <p className="font-bold mb-2">Nest Savings</p>
              <p className={textSecondary}>Email: privacy@nestsavings.com</p>
              <p className={textSecondary}>Phone: +1 (555) 000-0000</p>
              <p className={textSecondary}>Address: 123 Savings Street, Financial Hub, 12345</p>
            </div>
          </section>

          <div className={`p-4 rounded-xl mt-8 mb-8 ${darkMode ? 'bg-gray-800' : 'bg-blue-50'}`}>
            <p className={`text-sm ${textSecondary}`}>
              By using Nest, you agree to this Privacy Policy. Please review it carefully. 
              If you do not agree with our policies and practices, please do not use our Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
