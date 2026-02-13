import React, { useState, useEffect } from 'react';
import { ChevronLeft, Lock, Delete } from 'lucide-react';

/**
 * TransactionPinScreen Component
 * Secure entry point for authorizing any movement of funds.
 */
const TransactionPinScreen = ({
  onBack,
  onSuccess,
  darkMode,
  onForgotPin,
  transactionType = "Transaction",
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const pinLength = 4;

  const handleKeyPress = (val) => {
    if (pin.length < pinLength) {
      setPin(pin + val);
      setError(false);
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError(false);
  };

  // Trigger success when PIN length is reached
  useEffect(() => {
    if (pin.length === pinLength) {
      const timer = setTimeout(() => {
        // Get stored PIN from localStorage, default to '1234' if not set
        const storedPin = localStorage.getItem('userPin') || '1234';
        if (pin === storedPin) {
          onSuccess();
        } else {
          setError(true);
          setPin('');
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pin, onSuccess]);

  // Dark mode classes
  const bgClass = darkMode ? 'bg-gray-900' : 'bg-white';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-400';
  const pinFilled = darkMode ? 'bg-[#00FF9D] border-[#00FF9D]' : 'bg-[#00875A] border-[#00875A]';
  const pinEmpty = darkMode ? 'border-gray-600' : 'border-gray-200';
  const keypadText = darkMode ? 'text-white' : 'text-gray-900';
  const keypadBg = darkMode ? 'bg-gray-800' : 'bg-transparent';
  const deleteColor = darkMode ? 'text-gray-400' : 'text-gray-400';

  return (
    <div className={`h-full flex flex-col animate-in fade-in duration-300 ${bgClass}`}>
      {/* Header */}
      <div className="p-6 flex items-center gap-3">
        <button
          onClick={onBack}
          className={`p-2 rounded-full active:scale-90 transition-all ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
        >
          <ChevronLeft className={`w-6 h-6 ${textPrimary}`} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center px-8">
        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-8 ${darkMode ? 'bg-gray-800' : 'bg-emerald-50'}`}>
          <Lock size={28} strokeWidth={2.5} className={darkMode ? 'text-[#00FF9D]' : 'text-[#00875A]'} />
        </div>

        <h1 className={`text-2xl font-black mb-2 text-center ${textPrimary}`}>Enter PIN</h1>
        <p className={`font-bold text-center text-sm mb-12 ${textSecondary}`}>
          Confirm authorize for this <span className={textPrimary}>{transactionType}</span>
        </p>

        {/* PIN Dots Display */}
        <div className={`flex gap-6 mb-4 ${error ? 'animate-shake' : ''}`}>
          {[...Array(pinLength)].map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-all duration-200 border-2 ${
                pin.length > i ? pinFilled : pinEmpty
              } ${error ? 'border-red-500 bg-red-500' : ''} ${pin.length > i && !error ? 'scale-125' : ''}`}
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-[10px] font-black uppercase tracking-widest animate-bounce">
            Incorrect PIN. Try again.
          </p>
        )}

        <div className="mt-auto w-full max-w-[300px] mb-12">
          {/* Numeric Keypad */}
          <div className="grid grid-cols-3 gap-y-6 gap-x-12">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleKeyPress(num.toString())}
                className={`h-16 flex items-center justify-center text-3xl font-black active:scale-75 transition-all ${keypadText}`}
              >
                {num}
              </button>
            ))}

            {/* Empty placeholder for spacing */}
            <button className="h-16 bg-transparent pointer-events-none"></button>

            {/* Zero Button */}
            <button
              onClick={() => handleKeyPress('0')}
              className={`h-16 flex items-center justify-center text-3xl font-black active:scale-75 transition-all ${keypadText}`}
            >
              0
            </button>

            {/* Delete Button */}
            <button
              onClick={handleDelete}
              className={`h-16 flex items-center justify-center active:scale-75 transition-all ${deleteColor}`}
            >
              <Delete size={28} />
            </button>
          </div>
        </div>

        <button 
          onClick={onForgotPin}
          className="mb-8 text-[10px] font-black text-[#00875A] uppercase tracking-[0.2em] active:opacity-50 hover:opacity-80 transition-opacity"
        >
          Forgot Transaction PIN?
        </button>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};

export default TransactionPinScreen;
