import React, { useEffect, useState } from "react";
import { Check, CreditCard } from "lucide-react";

const LinkCardSuccessScreen = ({ onDone, darkMode = false, cardData = {} }) => {
  const [animate, setAnimate] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);

  useEffect(() => {
    setAnimate(true);
    setTimeout(() => setShowCheckmark(true), 300);
  }, []);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-300 ${
      darkMode ? "bg-black" : "bg-gradient-to-br from-emerald-50 via-white to-blue-50"
    }`}>
      {/* Animated Background Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl -z-10"></div>

      {/* Success Animation */}
      <div className="relative w-24 h-24 mb-8">
        {/* Outer ring animation */}
        <div
          className={`absolute inset-0 rounded-full border-2 border-emerald-500/20 ${
            animate ? 'scale-150 opacity-0' : 'scale-100 opacity-100'
          } transition-all duration-700`}
        ></div>

        {/* Inner checkmark circle */}
        <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-500/40 ${
          showCheckmark ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        } transition-all duration-500 delay-200`}>
          <Check size={48} className="text-white" />
        </div>
      </div>

      {/* Success Message */}
      <div className="text-center mb-8 max-w-md">
        <h1 className={`text-4xl font-black mb-3 transition-colors ${
          darkMode ? "text-white" : "text-emerald-900"
        }`}>
          Card Linked!
        </h1>
        <p className={`text-lg transition-colors ${
          darkMode ? "text-gray-400" : "text-gray-600"
        }`}>
          Your card has been securely linked and verified.
        </p>
      </div>

      {/* Card Preview */}
      {cardData && (cardData.cardNumber || cardData.last4) ? (
        <div className="w-full max-w-sm mb-10">
          <div className={`rounded-3xl p-8 text-white font-['Plus_Jakarta_Sans',_sans-serif] shadow-2xl transition-all ${
            darkMode
              ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700"
              : "bg-gradient-to-br from-emerald-600 via-emerald-500 to-blue-600"
          }`}>
            <div className="flex items-center justify-between mb-12">
              <span className="text-sm font-bold opacity-80">NEST CARD</span>
              <CreditCard size={24} />
            </div>
            <div className="mb-8">
              <p className="text-xs opacity-60 mb-2">CARD NUMBER</p>
              <p className="text-xl font-mono tracking-widest font-bold">
                •••• •••• •••• {cardData.last4 || cardData.cardNumber?.slice(-4) || '0000'}
              </p>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs opacity-60 mb-1">CARDHOLDER</p>
                <p className="text-sm font-bold">{cardData.cardHolder || cardData.cardholderName || 'YOUR NAME'}</p>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-60 mb-1">EXPIRES</p>
                <p className="text-sm font-bold">{cardData.expiryDate || cardData.expiry || 'MM/YY'}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Feature List */}
      <div className={`w-full max-w-md space-y-3 mb-10 ${
        darkMode ? "" : ""
      }`}>
        {[
          { emoji: "💳", text: "Use for deposits and payments" },
          { emoji: "🔒", text: "Secure and encrypted" },
          { emoji: "⚡", text: "Instant transactions" }
        ].map((item, idx) => (
          <div key={idx} className={`flex items-center gap-4 p-4 rounded-2xl transition-colors ${
            darkMode ? "bg-gray-800" : "bg-white/80 backdrop-blur-sm"
          }`}>
            <span className="text-2xl">{item.emoji}</span>
            <span className={`font-medium ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}>{item.text}</span>
          </div>
        ))}
      </div>

      {/* Continue Button */}
      <button
        onClick={onDone}
        className={`w-full max-w-md py-4 rounded-2xl font-bold text-white text-lg transition-all active:scale-95 shadow-lg ${
          darkMode
            ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/30"
            : "bg-gradient-to-r from-emerald-600 to-emerald-600 hover:from-emerald-700 hover:to-emerald-700 shadow-emerald-600/30"
        }`}
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default LinkCardSuccessScreen;
