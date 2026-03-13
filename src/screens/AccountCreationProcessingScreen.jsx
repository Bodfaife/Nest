import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function AccountCreationProcessingScreen({ onComplete, userName }) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  const messages = [
    { text: "Creating your account...", icon: "⚙️" },
    { text: "Validating account details...", icon: "🔍" },
    { text: "Setting up your profile...", icon: "👤" },
    { text: `Welcome to Nest, ${userName}!`, icon: "🎉" }
  ];

  useEffect(() => {
    if (messageIndex < messages.length) {
      setFadeOut(false);

      const fadeTimer = setTimeout(() => {
        setFadeOut(true);
      }, 2500);

      const nextMsgTimer = setTimeout(() => {
        if (messageIndex < messages.length - 1) {
          setMessageIndex(messageIndex + 1);
        } else {
          setTimeout(onComplete, 1000);
        }
      }, 3000);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(nextMsgTimer);
      };
    }
  }, [messageIndex, onComplete, messages.length, userName]);

  const currentMessage = messages[messageIndex];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      <div className="relative mb-10">
        <div className="w-24 h-24 border-4 border-emerald-50 border-t-[#00875A] rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="text-[#00875A] animate-pulse" size={32} />
        </div>
      </div>

      <div className="text-center mb-8 h-24 flex flex-col items-center justify-center">
        <div className={`transition-all duration-700 ${fadeOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          <p className="text-4xl mb-4">{currentMessage.icon}</p>
          <p className="text-xl font-bold text-emerald-900">
            {currentMessage.text}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        {messages.map((_, idx) => (
          <div
            key={idx}
            className={`h-2 rounded-full transition-all ${
              idx === messageIndex
                ? 'w-8 bg-emerald-600'
                : idx < messageIndex
                ? 'w-2 bg-emerald-300'
                : 'w-2 bg-emerald-100'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}