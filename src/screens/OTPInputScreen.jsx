import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { verifyOTP, getOTPTimeRemaining, clearOTP } from '../lib/otpGenerator';

export default function OTPInputScreen({
  context, // 'forgotPin', 'verifyCard', 'verifyBankAccount'
  darkMode = false,
  onBack,
  onVerifySuccess,
  onResendOTP,
  title = 'Enter OTP',
  description = 'Enter the 6-digit code sent to your device to proceed',
}) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Update countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getOTPTimeRemaining(context);
      setTimeRemaining(remaining);
      if (remaining === 0) {
        setError('OTP expired. Please request a new one.');
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [context]);

  const handleVerify = () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setIsVerifying(true);
    setError('');

    // Verify OTP
    if (verifyOTP(context, otp)) {
      clearOTP(context);
      setIsVerifying(false);
      onVerifySuccess && onVerifySuccess();
    } else {
      setIsVerifying(false);
      setError('Invalid OTP. Please try again.');
      setOtp('');
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    setError('');
    try {
      if (onResendOTP) {
        await onResendOTP();
        setOtp('');
      }
    } catch (e) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const isExpired = timeRemaining === 0;

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} animate-in slide-in-from-right duration-300`}>
      {/* Header */}
      <div className={`flex items-center gap-3 px-6 py-4 sticky top-0 z-20 border-b ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100'}`}>
        <button onClick={onBack} className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className={`text-xl font-bold`}>{title}</h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <h2 className="text-2xl font-bold text-center mb-3">{title}</h2>
        <p className={`text-center mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
        <p className={`text-sm text-center mb-6 ${"text-gray-500"}`}>Check your device's notification center for the OTP code</p>

        {/* OTP Input */}
        <div className="w-full max-w-md mb-6">
          <input
            type="text"
            inputMode="numeric"
            maxLength="6"
            value={otp}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 6);
              setOtp(val);
            }}
            placeholder="000000"
            className={`w-full p-4 text-center text-3xl font-bold rounded-2xl border-2 outline-none ${
              darkMode
                ? 'bg-gray-800 border-gray-700 text-white focus:border-emerald-500'
                : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-emerald-500'
            }`}
          />
        </div>

        {/* Timer */}
        {timeRemaining > 0 && (
          <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Code expires in {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
          </p>
        )}

        {/* Error */}
        {error && (
          <p className={`text-sm mb-6 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
        )}

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={isVerifying || otp.length !== 6 || isExpired}
          className={`w-full max-w-md py-4 rounded-2xl font-bold text-white transition-all ${
            isVerifying || otp.length !== 6 || isExpired
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#00875A] active:scale-[0.98]'
          }`}
        >
          {isVerifying ? 'Verifying...' : 'Verify OTP'}
        </button>

        {isExpired && (
          <div className="flex flex-col items-center gap-3 mt-6">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              OTP expired.
            </p>
            <button
              onClick={handleResendOTP}
              disabled={isResending}
              className={`text-sm font-bold transition-colors ${
                isResending
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-emerald-600 hover:text-emerald-700 active:opacity-70'
              }`}
            >
              {isResending ? 'Resending...' : 'Resend OTP'}
            </button>
          </div>
        )}

        {!isExpired && timeRemaining > 0 && (
          <button
            onClick={handleResendOTP}
            disabled={isResending}
            className={`text-sm font-bold transition-colors mt-6 ${
              isResending
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-emerald-600 hover:text-emerald-700 active:opacity-70'
            }`}
          >
            {isResending ? 'Resending...' : 'Resend OTP'}
          </button>
        )}
      </div>
    </div>
  );
}
