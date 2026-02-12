import React, { useState, useEffect } from 'react';
import { ChevronLeft, CreditCard } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export default function CardPaymentProcessingScreen({
  darkMode = false,
  onBack,
  card = {},
  amount = 0,
  onPaymentComplete,
  mode = 'save' // 'save' or 'topup' or 'withdraw'
}) {
  const { formatAmount } = useCurrency();
  useEffect(() => {
    // Simulate charging process and then complete
    const timer = setTimeout(() => {
      if (onPaymentComplete) onPaymentComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onPaymentComplete]);

  const bgClass = darkMode ? 'bg-gray-900' : 'bg-white';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-500';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-gray-50';

  const getCardBrand = () => {
    const lastFour = card.cardNumber?.slice(-4) || 'XXXX';
    return `Debit Card ending in ${lastFour}`;
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${bgClass} animate-in slide-in-from-right`}>
      {/* Header - minimal */}
      <div className="absolute top-0 left-0 right-0 p-6 flex items-center gap-4">
        <button
          onClick={onBack}
          className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center justify-center space-y-8 px-6 text-center">
            {/* Animating Card */}
            <div className="relative">
              <div className={`w-64 h-40 rounded-3xl p-6 flex flex-col justify-between animate-pulse ${
                darkMode ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-gradient-to-br from-emerald-500 to-emerald-700'
              }`}>
                <div className="flex justify-between items-start">
                  <CreditCard size={32} className="text-white" />
                  <span className="text-white font-black">VISA</span>
                </div>
                <div>
                  <p className="text-white/80 text-sm">Card Number</p>
                  <p className="text-white font-bold text-xl tracking-wider">**** **** **** {card.cardNumber?.slice(-4) || 'XXXX'}</p>
                </div>
              </div>

              {/* Floating particles */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-2 h-2 rounded-full animate-bounce ${
                      darkMode ? 'bg-emerald-400' : 'bg-emerald-300'
                    }`}
                    style={{
                      left: `${25 + i * 20}%`,
                      top: `-10px`,
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Processing Info */}
            <div className="space-y-4">
              <h1 className={`text-3xl font-black ${textPrimary}`}>Processing Payment</h1>
              <p className={textSecondary}>Charging {getCardBrand()}</p>

              <div className={`p-6 rounded-2xl ${cardBg}`}>
                <p className={`text-sm ${textSecondary} mb-2`}>Amount</p>
                <p className="text-3xl font-black text-emerald-600">{formatAmount(amount)}</p>
              </div>

              {/* Status Dots */}
              <div className="flex gap-2 justify-center mt-6">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full animate-bounce ${
                      darkMode ? 'bg-emerald-400' : 'bg-emerald-600'
                    }`}
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>

              <p className={`text-sm ${textSecondary} mt-8`}>Please don't close the app</p>
            </div>
          
      </div>

      {/* Background animation */}
      <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
