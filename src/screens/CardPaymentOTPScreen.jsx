import React, { useState, useEffect } from 'react';
import { ChevronLeft, AlertCircle, CheckCircle } from 'lucide-react';

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
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

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
    setShowSuccessNotification(true);
    
    // In a real app, this would verify against a backend
    // For demo, we'll accept any valid 6-digit OTP
    setTimeout(() => {
      onVerify(otpValue);
    }, 2500);
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
    <div className={`min-h-screen flex flex-col ${bgClass} p-6 overflow-hidden animate-in fade-in slide-in-from-right duration-300`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
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
        <h1 className="text-2xl font-black">Verify Your Card</h1>
      </div>

      {/* Content */}
      <div className="flex-1 pb-64 flex flex-col justify-center">
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
                    className={`w-12 h-14 text-center text-2xl font-bold rounded-lg outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/30 disabled:opacity-50 transition-all duration-200 ${
                      inputClass
                    } ${digit ? 'animate-in scale-in-105 duration-200' : ''}`}
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
          </>
        ) : (
          <div className="flex pb-64 flex-col items-center justify-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center animate-pulse">
              <CheckCircle size={32} className="text-emerald-600" />
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

      {/* Success Notification Popup - Slides up from bottom */}
      <div className={`fixed inset-0 pointer-events-none transition-all duration-300 ${
        showSuccessNotification ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className={`absolute bottom-20 left-6 right-6 p-4 rounded-2xl border shadow-2xl flex items-center gap-3 transform transition-all duration-500 ${
          showSuccessNotification 
            ? 'translate-y-0 opacity-100 animate-in slide-in-from-bottom-4' 
            : 'translate-y-32 opacity-0'
        } ${
          darkMode
            ? 'bg-emerald-900/90 border-emerald-800 backdrop-blur'
            : 'bg-emerald-50 border-emerald-300 backdrop-blur'
        }`}>
          <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0 animate-bounce">
            <CheckCircle size={20} className="text-white" />
          </div>
          <div>
            <p className={`font-bold text-sm ${darkMode ? 'text-emerald-200' : 'text-emerald-900'}`}>
              OTP Verified Successfully!
            </p>
            <p className={`text-xs ${darkMode ? 'text-emerald-100/70' : 'text-emerald-700/70'}`}>
              Confirming payment details...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
