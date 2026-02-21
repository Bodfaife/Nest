import React, { useState, useEffect } from 'react';
import { ChevronLeft, CreditCard } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import api from '../helpers/apiClient';
import { debug } from '../helpers/debug';
import { Elements } from '@stripe/react-stripe-js';
import stripePromise from '../helpers/stripeClient';
import StripePaymentForm from '../components/StripePaymentForm';

export default function CardPaymentProcessingScreen({
  darkMode = false,
  onBack,
  card = {},
  amount = 0,
  onPaymentComplete,
  mode = 'save' // 'save' or 'topup' or 'withdraw'
  , user = null
}) {
  const { formatAmount } = useCurrency();
  useEffect(() => {
    // previous behaviour simulated a charge; we now use Stripe Elements
    // keep effect for potential side-effects in the future
    return () => {};
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

            {/* Processing / Stripe Form */}
            <div className="space-y-4 w-full flex items-center justify-center">
              <div className="w-full max-w-lg">
                <h1 className={`text-2xl font-bold ${textPrimary} mb-4`}>Pay {formatAmount(amount)}</h1>
                <Elements stripe={stripePromise}>
                  <StripePaymentForm
                    amount={Math.round(amount)}
                    user={user}
                    onSuccess={(paymentIntent) => {
                      // notify backend or continue app flow
                      debug.log('PaymentIntent succeeded', paymentIntent.id);
                      if (onPaymentComplete) onPaymentComplete();
                    }}
                    onError={(err) => {
                      debug.log('Payment error:', err);
                      // fallback: complete flow after delay
                    }}
                  />
                </Elements>
              </div>
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
