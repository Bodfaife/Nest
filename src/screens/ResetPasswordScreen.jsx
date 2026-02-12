import React, { useState } from 'react';
import { ChevronLeft, Eye, AlertCircle } from 'lucide-react';

export default function ResetPasswordScreen({
  darkMode = false,
  onBack,
  onResetComplete,
}) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = () => {
    if (!password || !confirmPassword) {
      setError('Please enter both passwords');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setIsResetting(true);
    setTimeout(() => {
      onResetComplete(password);
    }, 2000);
  };

  const isFormValid = password && confirmPassword && password === confirmPassword && password.length >= 6;
  const bgClass = darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900';
  const inputClass = darkMode
    ? 'bg-gray-800 text-white border border-gray-700'
    : 'bg-gray-50 text-gray-900 border border-gray-100';
  const labelClass = darkMode ? 'text-gray-300' : 'text-gray-700';

  return (
    <div className={`min-h-screen flex flex-col ${bgClass} p-6`}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        {!isResetting && (
          <button
            onClick={onBack}
            className={`p-2 rounded-full ${
              darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            <ChevronLeft size={24} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center">
        {!isResetting ? (
          <>
            <h1 className="text-3xl font-black mb-3">Set New Password</h1>
            <p className={`text-sm mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Create a strong password to secure your account.
            </p>

            {/* Password Input */}
            <div className="mb-6">
              <label className={`block text-sm font-bold mb-2 ${labelClass}`}>
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className={`w-full p-4 pr-12 rounded-2xl outline-none focus:border-emerald-500 ${inputClass}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  <Eye size={20} />
                </button>
              </div>
              {password && password.length < 6 && (
                <p className="text-xs text-yellow-600 mt-1">Password must be at least 6 characters</p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="mb-8">
              <label className={`block text-sm font-bold mb-2 ${labelClass}`}>
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError('');
                  }}
                  className={`w-full p-4 pr-12 rounded-2xl outline-none focus:border-emerald-500 ${inputClass}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  <Eye size={20} />
                </button>
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

            {/* Password Requirements */}
            <div
              className={`p-4 rounded-xl mb-8 ${
                darkMode
                  ? 'bg-blue-900/30 border border-blue-800'
                  : 'bg-blue-50 border border-blue-200'
              }`}
            >
              <p className={`text-sm font-semibold mb-2 ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                Password Requirements:
              </p>
              <ul className={`text-xs space-y-1 ${darkMode ? 'text-blue-200' : 'text-blue-600'}`}>
                <li>✓ At least 6 characters</li>
                <li>✓ Passwords must match</li>
              </ul>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center animate-pulse">
              <CheckCircle size={32} className="text-emerald-600" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-black mb-2">Password Reset!</h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Your password has been successfully reset.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Reset Button */}
      {!isResetting && (
        <button
          onClick={handleReset}
          disabled={!isFormValid}
          className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all ${
            isFormValid
              ? 'bg-[#00875A] shadow-emerald-100 active:scale-[0.98]'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Reset Password
        </button>
      )}
    </div>
  );
}

function CheckCircle(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
