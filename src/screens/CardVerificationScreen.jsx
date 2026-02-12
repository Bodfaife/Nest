import React, { useState, useEffect } from 'react';
import { Lock, CheckCircle, ChevronLeft } from 'lucide-react';

const CardVerificationScreen = ({ card, onVerified, darkMode = false, onBack }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState(0); // 0: enter code, 1: verified

  useEffect(() => {
    if (verificationStep === 1) {
      const timeout = setTimeout(() => onVerified(card), 2000);
      return () => clearTimeout(timeout);
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [verificationStep, onVerified, card]);

  const handleVerify = () => {
    setIsVerifying(true);
    // Simulate verification
    setTimeout(() => {
      setVerificationStep(1);
    }, 1500);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const bgClass = darkMode ? 'bg-gray-900' : 'bg-white';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-500';
  const inputBg = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100';
  const buttonBg = darkMode ? 'bg-[#00FF9D] text-gray-900' : 'bg-[#00875A] text-white';

  if (verificationStep === 1) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${bgClass} animate-in fade-in`}>
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${darkMode ? 'bg-gray-800' : 'bg-emerald-50'}`}>
          <CheckCircle size={48} className={darkMode ? 'text-[#00FF9D]' : 'text-emerald-600'} />
        </div>
        <h2 className={`text-2xl font-black mb-2 text-center ${textPrimary}`}>Card Verified Successfully!</h2>
        <p className={`text-center ${textSecondary} max-w-xs`}>Your card ending in {card.cardNumber.slice(-4)} has been securely verified and linked to your Nest account.</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col p-6 ${bgClass}`}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        {onBack && (
          <button
            onClick={onBack}
            className={`p-2 rounded-full flex-shrink-0 ${
              darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            <ChevronLeft size={24} />
          </button>
        )}
        <h1 className={`text-2xl font-black ${textPrimary}`}>Verify Your Card</h1>
      </div>

      <div className="flex-1 flex flex-col justify-start">
        <p className={`text-sm mb-8 ${textSecondary}`}>We sent a verification code to your email address.</p>

        {/* Card Preview */}
        <div className={`w-full rounded-2xl p-6 mb-8 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <p className={`text-xs font-bold uppercase tracking-widest ${textSecondary} mb-2`}>Card Ending In</p>
          <p className={`text-2xl font-black tracking-wider ${textPrimary}`}>•••• {card.cardNumber.slice(-4)}</p>
        </div>

        {/* Code Input */}
        <div className="mb-8">
          <label className={`text-[10px] font-black uppercase tracking-widest ml-1 mb-3 block ${textSecondary}`}>
            Verification Code
          </label>
          <input
            type="text"
            placeholder="000000"
            maxLength="6"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
            className={`w-full p-5 rounded-2xl font-bold text-2xl text-center outline-none focus:ring-2 focus:ring-emerald-500 ${inputBg} ${textPrimary}`}
          />
        </div>

        {/* Timer */}
        <div className={`text-center mb-8 ${timeLeft < 60 ? 'text-red-500' : textSecondary}`}>
          <p className="text-sm font-bold">Code expires in {formatTime(timeLeft)}</p>
        </div>

        {/* Resend Code */}
        <button className={`mb-6 text-sm font-bold ${darkMode ? 'text-[#00FF9D]' : 'text-emerald-600'}`}>
          Didn't receive the code? Resend
        </button>

        {/* Verify Card Button */}
        <button
          onClick={handleVerify}
          disabled={verificationCode.length !== 6 || isVerifying}
          className={`w-full py-4 rounded-2xl font-bold mb-8 transition-all ${
            verificationCode.length === 6
              ? `${buttonBg} active:scale-95`
              : darkMode
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isVerifying ? 'Verifying...' : 'Verify Card'}
        </button>

        {/* End-to-End Encrypted */}
        <div className="flex items-center justify-center gap-2 text-gray-400">
          <Lock size={14} />
          <p className="text-[10px] font-black uppercase tracking-widest">End-to-End Encrypted</p>
        </div>
      </div>
    </div>
  );
};

export default CardVerificationScreen;
