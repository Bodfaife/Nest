import React, { useEffect, useState } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function PasswordResetSuccessScreen({
  darkMode = false,
  onContinueToLogin,
}) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const bgClass = darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900';

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${bgClass} p-6`}>
      {/* Success Animation Container */}
      <div className={`flex flex-col items-center space-y-8 transition-all duration-500 transform ${
        showContent ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
      }`}>
        {/* Animated Checkmark Circle */}
        <div className="relative w-24 h-24 mb-4">
          <div className={`absolute inset-0 rounded-full animate-pulse ${
            darkMode ? 'bg-emerald-900/20' : 'bg-emerald-100'
          }`} />
          <div className="absolute inset-0 rounded-full flex items-center justify-center">
            <div className={`w-20 h-20 rounded-full ${
              darkMode ? 'bg-emerald-900/40' : 'bg-emerald-50'
            } flex items-center justify-center`}>
              <CheckCircle size={56} className="text-emerald-600 animate-bounce" />
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-black">Password Reset!</h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Your password has been successfully reset.
          </p>
        </div>

        {/* Info Points */}
        <div className={`w-full max-w-sm space-y-3 p-4 rounded-2xl ${
          darkMode
            ? 'bg-emerald-900/20 border border-emerald-800'
            : 'bg-emerald-50 border border-emerald-200'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`w-5 h-5 rounded-full mt-0.5 flex items-center justify-center flex-shrink-0 text-xs font-bold ${
              darkMode
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-600 text-white'
            }`}>
              ✓
            </div>
            <p className={`text-sm ${darkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>
              Your account is now secure with the new password.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className={`w-5 h-5 rounded-full mt-0.5 flex items-center justify-center flex-shrink-0 text-xs font-bold ${
              darkMode
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-600 text-white'
            }`}>
              ✓
            </div>
            <p className={`text-sm ${darkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>
              You can now sign in with your new password.
            </p>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={onContinueToLogin}
          className="w-full max-w-sm py-4 rounded-2xl font-bold text-white bg-[#00875A] shadow-lg shadow-emerald-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
        >
          Continue to Sign In
          <ArrowRight size={20} className="group-active:translate-x-1 transition-transform" />
        </button>

        {/* Additional Info */}
        <p className={`text-xs text-center max-w-sm ${
          darkMode ? 'text-gray-500' : 'text-gray-400'
        }`}>
          Remember your new password. Keep it safe and don't share it with anyone.
        </p>
      </div>
    </div>
  );
}
