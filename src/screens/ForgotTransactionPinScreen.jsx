import React, { useState, useEffect } from 'react';
import { ChevronLeft, AlertCircle } from 'lucide-react';

export default function ForgotTransactionPinScreen({
  darkMode = false,
  onBack,
  onPinReset,
  userEmail = '',
  userPhone = '',
}) {
  const [step, setStep] = useState('otp'); // 'otp' | 'new-pin' | 'success'
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes

  // Countdown timer for OTP
  useEffect(() => {
    if (step !== 'otp' || timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, step]);

  const handleOtpChange = (index, value) => {
    if (!/^[0-9]*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }
    // Simulate OTP verification
    setStep('new-pin');
    setError('');
  };

  const handleResendOtp = () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    setTimeLeft(120);
  };

  const handleSetNewPin = () => {
    if (newPin.length !== 4 || confirmPin.length !== 4) {
      setError('PIN must be 4 digits');
      return;
    }

    if (!/^\d{4}$/.test(newPin)) {
      setError('PIN must contain only digits');
      return;
    }

    if (newPin !== confirmPin) {
      setError('PINs do not match');
      return;
    }

    // Success
    setStep('success');
    setTimeout(() => {
      if (onPinReset) onPinReset(newPin);
    }, 2000);
  };

  const handlePinInput = (value, isPrimary = true) => {
    if (!/^\d*$/.test(value)) return;
    if (isPrimary) {
      setNewPin(value.slice(-4));
    } else {
      setConfirmPin(value.slice(-4));
    }
    setError('');
  };

  const bgClass = darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900';
  const inputClass = darkMode
    ? 'bg-gray-800 text-white border border-gray-700'
    : 'bg-gray-50 text-gray-900 border border-gray-100';
  const labelClass = darkMode ? 'text-gray-300' : 'text-gray-700';

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isOtpComplete = otp.every(digit => digit !== '');
  const isPinFormValid = newPin.length === 4 && confirmPin.length === 4 && newPin === confirmPin;

  return (
    <div className={`min-h-screen flex flex-col ${bgClass} p-6`}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        {step !== 'success' && (
          <>
            <button
              onClick={onBack}
              className={`p-2 rounded-full flex-shrink-0 ${
                darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {step === 'otp' ? 'Verify Your Identity' : 'Create New PIN'}
            </h1>
          </>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-start pt-8">
        {step === 'otp' && (
          <>
            <p className={`text-sm mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              We've sent a 6-digit code to your registered email and phone number.
            </p>

            {/* Info Box */}
            <div
              className={`p-4 rounded-xl mb-8 ${
                darkMode
                  ? 'bg-blue-900/30 border border-blue-800'
                  : 'bg-blue-50 border border-blue-200'
              }`}
            >
              <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                📧 Email: {userEmail || 'your@email.com'}
                <br />
                📱 Phone: {userPhone || '+1 XXX XXX XXXX'}
              </p>
            </div>

            {/* OTP Input Fields */}
            <div className="mb-8">
              <label className={`block text-sm font-bold mb-4 ${labelClass}`}>
                Enter 6-Digit Code
              </label>
              <div className="flex gap-3 justify-between mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className={`w-12 h-14 text-center text-2xl font-bold rounded-lg outline-none focus:border-emerald-500 ${inputClass}`}
                  />
                ))}
              </div>

              {/* Timer */}
              <p className={`text-xs font-semibold ${
                timeLeft < 30 ? 'text-red-600' : darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Code expires in: {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </p>
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

            {/* Resend OTP */}
            <div className="text-center mb-6">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Didn't receive the code?{' '}
                <button
                  onClick={handleResendOtp}
                  className="text-[#00875A] font-semibold hover:underline"
                >
                  Resend OTP
                </button>
              </p>
            </div>

            {/* Verify OTP Button */}
            <button
              onClick={handleVerifyOtp}
              disabled={!isOtpComplete || timeLeft <= 0}
              className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all mb-6 ${
                isOtpComplete && timeLeft > 0
                  ? 'bg-[#00875A] shadow-emerald-100 active:scale-[0.98]'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Verify OTP
            </button>
          </>
        )}

        {step === 'new-pin' && (
          <>
            <p className={`text-sm mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Enter a new 4-digit PIN to secure your transactions.
            </p>

            {/* New PIN Input */}
            <div className="mb-5">
              <label className={`block text-sm font-bold mb-2 ${labelClass}`}>
                New Transaction PIN
              </label>
              <input
                type="password"
                placeholder="••••"
                maxLength="4"
                value={newPin}
                onChange={(e) => handlePinInput(e.target.value, true)}
                className={`w-full p-4 text-center text-3xl font-bold rounded-2xl outline-none focus:border-emerald-500 ${inputClass}`}
              />
            </div>

            {/* Confirm PIN Input */}
            <div className="mb-6">
              <label className={`block text-sm font-bold mb-2 ${labelClass}`}>
                Confirm PIN
              </label>
              <input
                type="password"
                placeholder="••••"
                maxLength="4"
                value={confirmPin}
                onChange={(e) => handlePinInput(e.target.value, false)}
                className={`w-full p-4 text-center text-3xl font-bold rounded-2xl outline-none focus:border-emerald-500 ${inputClass}`}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div
                className={`flex items-center gap-2 p-4 rounded-xl mb-6 ${
                  darkMode
                    ? 'bg-red-900/30 border border-red-800'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                <AlertCircle size={18} className={darkMode ? 'text-red-400' : 'text-red-600'} />
                <p className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-700'}`}>{error}</p>
              </div>
            )}

            {/* Set New PIN Button */}
            <button
              onClick={handleSetNewPin}
              disabled={!isPinFormValid}
              className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all mb-6 ${
                isPinFormValid
                  ? 'bg-[#00875A] shadow-emerald-100 active:scale-[0.98]'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Set New PIN
            </button>

            {/* PIN Requirements */}
            <div
              className={`p-4 rounded-xl ${
                darkMode
                  ? 'bg-blue-900/30 border border-blue-800'
                  : 'bg-blue-50 border border-blue-200'
              }`}
            >
              <p className={`text-sm font-semibold mb-2 ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                PIN Requirements:
              </p>
              <ul className={`text-xs space-y-1 ${darkMode ? 'text-blue-200' : 'text-blue-600'}`}>
                <li>✓ Must be 4 digits</li>
                <li>✓ PINs must match</li>
                <li>✓ Don't use obvious numbers (1111, 1234, etc.)</li>
              </ul>
            </div>
          </>
        )}

        {step === 'success' && (
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center animate-pulse">
              <svg className="w-8 h-8 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-black mb-2">PIN Reset Successful!</h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Your new PIN has been set. Redirecting...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
