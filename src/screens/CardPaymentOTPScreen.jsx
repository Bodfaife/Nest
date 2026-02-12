import React, { useState, useEffect } from 'react';
import { ChevronLeft, AlertCircle } from 'lucide-react';

export default function CardPaymentOTPScreen({
  darkMode = false,
  onBack,
  onVerify,
  cardLast4 = "0000",
  amount = 0,
}) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setError('OTP expired. Please request a new one.');
      return;
    }

    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

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

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerifyOTP = () => {
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    // Simulate OTP verification
    setIsVerifying(true);
    
    // In a real app, this would verify against a backend
    // For demo, we'll accept any valid 6-digit OTP
    setTimeout(() => {
      onVerify(otpValue);
    }, 1500);
  };

  const handleResendOTP = () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    setTimeLeft(120);
    // In a real app, this would request a new OTP from the backend
  };

  const isComplete = otp.every(digit => digit !== '');
  const bgClass = darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900';
  const inputClass = darkMode
    ? 'bg-gray-800 text-white border border-gray-700'
    : 'bg-gray-50 text-gray-900 border border-gray-100';
  const labelClass = darkMode ? 'text-gray-300' : 'text-gray-700';

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className={`min-h-screen flex flex-col ${bgClass} p-6`}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        {!isVerifying && (
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
        <h1 className="text-3xl font-black mb-3">Verify Your Card</h1>
        <p className={`text-sm mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          We've sent a 6-digit code to your registered phone number. {!isVerifying && 'Please enter it below.'}
        </p>

        {!isVerifying ? (
          <>
            {/* Transaction Summary */}
            <div
              className={`p-4 rounded-xl mb-8 ${
                darkMode
                  ? 'bg-gray-800 border border-gray-700'
                  : 'bg-gray-50 border border-gray-100'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className={`text-xs font-bold uppercase ${labelClass}`}>Card</p>
                  <p className="font-semibold">•••• {cardLast4}</p>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-bold uppercase ${labelClass}`}>Amount</p>
                  <p className="font-semibold">₦{amount.toLocaleString()}</p>
                </div>
              </div>
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
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={isVerifying}
                    className={`w-12 h-14 text-center text-2xl font-bold rounded-lg outline-none focus:border-emerald-500 disabled:opacity-50 transition ${inputClass}`}
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
            <div className="text-center mb-8">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Didn't receive the code?{' '}
                <button
                  onClick={handleResendOTP}
                  className="text-[#00875A] font-semibold hover:underline"
                >
                  Resend OTP
                </button>
              </p>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center animate-pulse">
              <svg className="w-8 h-8 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-black mb-2">OTP Verified!</h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Processing your payment...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Verify Button */}
      {!isVerifying && (
        <button
          onClick={handleVerifyOTP}
          disabled={!isComplete || timeLeft <= 0}
          className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all ${
            isComplete && timeLeft > 0
              ? 'bg-[#00875A] shadow-emerald-100 active:scale-[0.98]'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Verify & Pay
        </button>
      )}
    </div>
  );
}
