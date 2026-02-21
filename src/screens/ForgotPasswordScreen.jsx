import React, { useState } from 'react';
import { debug } from '../helpers/debug';
import { ChevronLeft, Mail, AlertCircle } from 'lucide-react';

export default function ForgotPasswordScreen({
  darkMode = false,
  onBack,
  onVerifyEmail,
  user = null,
}) {
  const [contact, setContact] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Log when component mounts for debugging
  React.useEffect(() => {
    debug.log("🔐 ForgotPasswordScreen mounted");
    const localStorageUser = localStorage.getItem("user");
    debug.log("💾 What's in localStorage.getItem('user'):", localStorageUser ? "(string with data)" : "null");
    if (localStorageUser) {
      try {
        const parsed = JSON.parse(localStorageUser);
        debug.log("   Parsed account email:", parsed.email || "(none)");
        debug.log("   Parsed account phone:", parsed.phone || "(none)");
      } catch (e) {
        debug.error("   ERROR parsing JSON:", e);
      }
    } else {
      debug.error("   ⚠️ localStorage is empty or user was never saved!");
    }
  }, []);

  const handleVerifyEmail = () => {
    debug.log("🔍 ForgotPasswordScreen handleVerifyEmail called");
    debug.log("📝 Contact input:", contact);
    
    if (!contact) {
      setError('Please enter your registered email or phone');
      return;
    }

    const isPhoneLike = /^\+?\d[\d\s()-]{6,}$/.test(contact);
    if (!isPhoneLike) {
      // validate as email
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) {
        setError('Enter a valid email address or phone number');
        return;
      }
    }

    // Always read from localStorage - user is not authenticated at this point
    let saved = null;
    try {
      const storedUser = localStorage.getItem('user');
      debug.log("💾 Raw localStorage.getItem('user'):", storedUser);
      
      if (storedUser) {
        saved = JSON.parse(storedUser);
        debug.log("💾 Parsed user object from localStorage:", saved);
      } else {
        debug.error("❌ localStorage.getItem('user') is null or empty");
      }
    } catch (err) {
      debug.error('❌ Error parsing saved user from localStorage:', err);
      setError('Error reading account data. Please try again.');
      return;
    }

    if (!saved) {
      debug.error("❌ No saved user found in localStorage");
      setError('No account found. Please sign up first.');
      return;
    }

    // Normalize phone numbers for comparison
    const normalizePhone = (p) => (p || '').toString().replace(/\D/g, '');
    const inputNormalized = normalizePhone(contact);
    const savedPhoneNormalized = normalizePhone(saved.phone || '');
    const savedEmailNormalized = (saved.email || '').toLowerCase().trim();
    const inputEmailNormalized = contact.toLowerCase().trim();

    debug.log("🔤 Email comparison:", { saved: savedEmailNormalized, input: inputEmailNormalized, match: savedEmailNormalized === inputEmailNormalized });
    debug.log("📱 Phone comparison:", { saved: savedPhoneNormalized, input: inputNormalized, match: inputNormalized === savedPhoneNormalized });

    // Check if contact matches either email or phone
    const matchesEmail = saved.email && savedEmailNormalized === inputEmailNormalized;
    const matchesPhone = saved.phone && savedPhoneNormalized && inputNormalized === savedPhoneNormalized;
    
    if (!matchesEmail && !matchesPhone) {
      debug.error("❌ Contact does not match email or phone in saved account");
      // If neither matched, provide helpful error
      // Check what contact info the account has
      const hasEmail = saved.email ? true : false;
      const hasPhone = saved.phone ? true : false;
      
      let helpText = 'No account found for that email/phone. ';
      if (hasEmail && !hasPhone) {
        helpText += 'This account uses email instead. Please try again.';
      } else if (hasPhone && !hasEmail) {
        helpText += 'This account uses phone instead. Please try again.';
      } else {
        helpText += 'Please check and try again.';
      }
      setError(helpText);
      return;
    }

    debug.log("✅ Contact verified! Proceeding to recovery phrase verification");
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onVerifyEmail && onVerifyEmail();
    }, 800);
  };

  const bgClass = darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900';
  const inputClass = darkMode
    ? 'bg-gray-800 text-white border border-gray-700 focus:border-emerald-500'
    : 'bg-gray-50 text-gray-900 border border-gray-100 focus:border-emerald-500';
  const labelClass = darkMode ? 'text-gray-300' : 'text-gray-700';

  return (
    <div className={`min-h-screen flex flex-col ${bgClass} p-6`}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
          <ChevronLeft size={24} />
        </button>
        <h1 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>Recover Password</h1>
      </div>

      <div className="flex-1 flex flex-col justify-start">
        <p className={`text-sm mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Enter your registered email address or phone number. We'll verify your identity using your recovery phrases and help you reset your password.
        </p>

        <div className="mb-6">
          <label className={`block text-sm font-bold mb-2 ${labelClass}`}>Email or Phone</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="you@example.com or 08012345678"
              value={contact}
              onChange={(e) => { setContact(e.target.value); setError(''); }}
              className={`w-full pl-12 p-4 rounded-2xl outline-none ${inputClass}`}
            />
          </div>
        </div>

        {error && (
          <div className={`flex items-center gap-2 p-4 rounded-xl mb-8 ${darkMode ? 'bg-red-900/30 border border-red-800' : 'bg-red-50 border border-red-200'}`}>
            <AlertCircle size={18} className={darkMode ? 'text-red-400' : 'text-red-600'} />
            <p className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-700'}`}>{error}</p>
          </div>
        )}

        <div className={`p-4 rounded-xl mb-6 ${darkMode ? 'bg-blue-900/30 border border-blue-800' : 'bg-blue-50 border border-blue-200'}`}>
          <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
            Next, you'll be asked to verify your identity by entering your recovery phrases. Make sure you have access to them.
          </p>
        </div>

        <button
          onClick={handleVerifyEmail}
          disabled={isLoading || !contact}
          className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all ${!isLoading && contact ? 'bg-[#00875A] shadow-emerald-100 active:scale-[0.98]' : 'bg-gray-400 cursor-not-allowed'}`}>
          {isLoading ? 'Verifying...' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
