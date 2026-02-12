import React, { useState } from 'react';
import { ChevronLeft, Mail, AlertCircle } from 'lucide-react';

export default function ForgotPasswordScreen({
  darkMode = false,
  onBack,
  onVerifyEmail,
}) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerifyEmail = () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onVerifyEmail();
    }, 1500);
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
          className={`p-2 rounded-full ${
            darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
          }`}
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Recover Password
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-start">
        <p className={`text-sm mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Enter your registered email address. We'll verify your identity using your recovery phrases and help you reset your password.
        </p>

        {/* Email Input */}
        <div className="mb-6">
          <label className={`block text-sm font-bold mb-2 ${labelClass}`}>
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              placeholder="yourname@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              className={`w-full pl-12 p-4 rounded-2xl outline-none ${inputClass}`}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className={`flex items-center gap-2 p-4 rounded-xl mb-8 ${
              darkMode
                ? 'bg-red-900/30 border border-red-800'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            <AlertCircle size={18} className={darkMode ? 'text-red-400' : 'text-red-600'} />
            <p className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-700'}`}>{error}</p>
          </div>
        )}

        {/* Info Box */}
        <div
          className={`p-4 rounded-xl mb-6 ${
            darkMode
              ? 'bg-blue-900/30 border border-blue-800'
              : 'bg-blue-50 border border-blue-200'
          }`}
        >
          <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
            Next, you'll be asked to verify your identity by entering your recovery phrases. Make sure you have access to them.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleVerifyEmail}
          disabled={isLoading || !email}
          className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all ${
            !isLoading && email
              ? 'bg-[#00875A] shadow-emerald-100 active:scale-[0.98]'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? 'Verifying...' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
