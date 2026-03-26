import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

export default function SavingsProcessingScreen({ 
  onComplete, 
  onSkip,
  savingsPlanData = {} 
}) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const messages = [
    { text: "Creating new savings...", icon: "⚙️" },
    { text: "Savings created successfully!", icon: "✅" },
    { text: "All done!", icon: "✅" }
  ];

  // Sequence messages
  useEffect(() => {
    if (messageIndex < messages.length) {
      setFadeOut(false);
      
      // Fade out before switching message
      const fadeTimer = setTimeout(() => {
        setFadeOut(true);
      }, 2000);

      // Move to next message or complete
      const nextMsgTimer = setTimeout(() => {
        if (messageIndex < messages.length - 1) {
          setMessageIndex(messageIndex + 1);
        } else {
          // Final message displayed, show actions
          setIsComplete(true);
        }
      }, 3000);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(nextMsgTimer);
      };
    }
  }, [messageIndex, messages.length]);

  const currentMessage = messages[messageIndex];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-300 bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      {/* Animated Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-300/10 rounded-full blur-3xl -z-10"></div>

      {/* Bouncing Checkmark */}
      <div className="mb-12">
        <div className={`w-20 h-20 rounded-full bg-emerald-600 flex items-center justify-center animate-bounce transition-all`}>
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
      </div>

      {/* Message Container */}
      <div className="text-center mb-8 h-24 flex flex-col items-center justify-center">
        <div className={`transition-all duration-700 ${fadeOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          <p className={`text-4xl mb-4 transition-all ${isComplete ? 'text-emerald-600' : 'text-emerald-900'}`}>
            {currentMessage.icon}
          </p>
          <p className={`text-xl font-bold transition-colors ${isComplete ? 'text-emerald-700' : 'text-emerald-900'}`}>
            {currentMessage.text}
          </p>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="flex gap-2 mb-6">
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

      {isComplete && (
        <div className="w-full max-w-xs space-y-3">
          <button
            onClick={onComplete}
            className="w-full py-3 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Make First Deposit
          </button>
          <button
            onClick={onSkip}
            className="w-full py-3 rounded-xl font-bold border border-emerald-600 text-emerald-600 hover:bg-emerald-50"
          >
            Do This Later
          </button>
        </div>
      )}
    </div>
  );
}
