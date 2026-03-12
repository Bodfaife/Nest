import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

export default function SavingsProcessingScreen({ 
  onComplete, 
  savingsPlanData = {} 
}) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const messages = [
    { text: "Setting up your savings plan...", icon: "⚙️" },
    { text: "Securing your savings goal...", icon: "🔒" },
    { text: "Savings plan created successfully! 🎉", icon: "✅" },
    { text: "Ready to make your first deposit?", icon: "🚀" }
  ];

  // Sequence messages
  useEffect(() => {
    if (messageIndex < messages.length) {
      setFadeOut(false);
      
      // Fade out before switching message
      const fadeTimer = setTimeout(() => {
        setFadeOut(true);
      }, 2500);

      // Move to next message
      const nextMsgTimer = setTimeout(() => {
        if (messageIndex < messages.length - 1) {
          setMessageIndex(messageIndex + 1);
        } else {
          // Last message shown, mark complete and proceed
          setIsComplete(true);
          setTimeout(onComplete, 1000);
        }
      }, 3000);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(nextMsgTimer);
      };
    }
  }, [messageIndex, onComplete, messages.length]);

  const currentMessage = messages[messageIndex];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-300 bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      {/* Animated Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-300/10 rounded-full blur-3xl -z-10"></div>

      {/* Spinner or Success Icon */}
      <div className="mb-12">
        <div className={`w-20 h-20 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin transition-all ${isComplete ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}></div>
        
        {/* Success checkmark - appears on completion */}
        {isComplete && (
          <div className="absolute w-20 h-20 flex items-center justify-center animate-in scale-in duration-500">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-500/40">
              <CheckCircle size={48} className="text-white" />
            </div>
          </div>
        )}
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

      {/* Summary (shows when complete) */}
      {isComplete && (
        <div className="mt-12 max-w-sm p-6 rounded-2xl transition-all duration-700 animate-in fade-in slide-in-from-bottom-4 bg-white border border-emerald-100 shadow-lg shadow-emerald-100/50">
          <h3 className="font-bold mb-2 text-emerald-900">
            Savings Plan Details
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p><span className="font-semibold">Goal:</span> {savingsPlanData.goal || 'N/A'}</p>
            <p><span className="font-semibold">Target:</span> ₦{parseFloat(savingsPlanData.targetAmount || 0).toLocaleString()}</p>
            <p><span className="font-semibold">Frequency:</span> {savingsPlanData.frequency || 'N/A'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
