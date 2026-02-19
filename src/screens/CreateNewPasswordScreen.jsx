import React, { useState } from 'react';
import { ChevronLeft, Eye, AlertCircle, CheckCircle } from 'lucide-react';

export default function CreateNewPasswordScreen({
  darkMode = false,
  onBack,
  onPasswordCreated,
}) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('weak'); // weak, medium, strong

  const calculatePasswordStrength = (pwd) => {
    if (pwd.length < 6) return 'weak';
    if (pwd.length < 10) return 'medium';
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) return 'strong';
    return 'medium';
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    setPasswordStrength(calculatePasswordStrength(value));
    setError('');
  };

  const handleCreatePassword = () => {
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
    setIsCreating(true);
    // Simulate API call
    setTimeout(() => {
      try {
        const raw = localStorage.getItem('user');
        if (raw) {
          const u = JSON.parse(raw);
          u.password = password;
          localStorage.setItem('user', JSON.stringify(u));
        }
      } catch (e) {}
      onPasswordCreated(password);
    }, 2000);
  };

  const isFormValid = password && confirmPassword && password === confirmPassword && password.length >= 6;
  const bgClass = darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900';
  const inputClass = darkMode
    ? 'bg-gray-800 text-white border border-gray-700 focus:border-emerald-500'
    : 'bg-gray-50 text-gray-900 border border-gray-100 focus:border-emerald-500';
  const labelClass = darkMode ? 'text-gray-300' : 'text-gray-700';

  const strengthColors = {
    weak: darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-700',
    medium: darkMode ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-50 text-yellow-700',
    strong: darkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-50 text-emerald-700',
  };

  const strengthBorderColors = {
    weak: darkMode ? 'border-red-800' : 'border-red-200',
    medium: darkMode ? 'border-yellow-800' : 'border-yellow-200',
    strong: darkMode ? 'border-emerald-800' : 'border-emerald-200',
  };

  return (
    <div className={`min-h-screen flex flex-col ${bgClass} p-6`}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        {!isCreating && (
          <button
            onClick={onBack}
            className={`p-2 rounded-full ${
              darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            <ChevronLeft size={24} />
          </button>
        )}
        <h1 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Create New Password
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-start">
        {!isCreating ? (
          <>
            <p className={`text-sm mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Create a strong password to secure your account. You'll use this password to sign in.
            </p>

            {/* New Password Input */}
            <div className="mb-6">
              <label className={`block text-sm font-bold mb-2 ${labelClass}`}>
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className={`w-full p-4 pr-12 rounded-2xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all ${inputClass}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${
                    darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Eye size={20} />
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-3 space-y-2">
                  <div className="flex gap-2">
                    {['weak', 'medium', 'strong'].map((level) => (
                      <div
                        key={level}
                        className={`flex-1 h-1 rounded-full transition-all ${
                          ['weak', 'medium', 'strong'].indexOf(level) <= ['weak', 'medium', 'strong'].indexOf(passwordStrength)
                            ? level === 'weak' ? 'bg-red-500' : level === 'medium' ? 'bg-yellow-500' : 'bg-emerald-500'
                            : darkMode ? 'bg-gray-700' : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-semibold ${
                    passwordStrength === 'weak' ? 'text-red-600' :
                    passwordStrength === 'medium' ? 'text-yellow-600' :
                    'text-emerald-600'
                  }`}>
                    Strength: {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
                  </p>
                </div>
              )}

              {password && password.length < 6 && (
                <p className="text-xs text-yellow-600 mt-2">Must be at least 6 characters</p>
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
                  className={`w-full p-4 pr-12 rounded-2xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all ${inputClass}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${
                    darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Eye size={20} />
                </button>
              </div>

              {/* Password Match Indicator */}
              {confirmPassword && (
                <div className="mt-2 flex items-center gap-2">
                  {password === confirmPassword ? (
                    <>
                      <CheckCircle size={16} className="text-emerald-600" />
                      <p className="text-xs text-emerald-600 font-semibold">Passwords match</p>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={16} className="text-red-600" />
                      <p className="text-xs text-red-600 font-semibold">Passwords don't match</p>
                    </>
                  )}
                </div>
              )}
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
              className={`p-4 rounded-2xl mb-8 border ${
                darkMode
                  ? 'bg-blue-900/20 border-blue-800'
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <p className={`text-sm font-bold mb-3 ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                Password Requirements:
              </p>
              <ul className={`text-xs space-y-2 ${darkMode ? 'text-blue-200' : 'text-blue-600'}`}>
                <li className="flex items-center gap-2">
                  <span className={password.length >= 6 ? 'text-emerald-500' : 'text-gray-400'}>✓</span>
                  At least 6 characters {password.length >= 6 && <span className="text-xs text-emerald-600 font-semibold">(Done)</span>}
                </li>
                <li className="flex items-center gap-2">
                  <span className={password === confirmPassword && confirmPassword ? 'text-emerald-500' : 'text-gray-400'}>✓</span>
                  Passwords must match {password === confirmPassword && confirmPassword && <span className="text-xs text-emerald-600 font-semibold">(Done)</span>}
                </li>
              </ul>
            </div>

            {/* Create Button */}
            <button
              onClick={handleCreatePassword}
              disabled={!isFormValid}
              className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all ${
                isFormValid
                  ? 'bg-[#00875A] shadow-emerald-100 active:scale-[0.98]'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Create Password
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-6 flex-1">
            <div className="relative w-24 h-24">
              <div className={`absolute inset-0 rounded-full animate-pulse ${
                darkMode ? 'bg-emerald-900/20' : 'bg-emerald-100'
              }`} />
              <div className="absolute inset-0 rounded-full flex items-center justify-center">
                <CheckCircle size={56} className="text-emerald-600 animate-bounce" />
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-black mb-2">Creating Password...</h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Securing your account
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
