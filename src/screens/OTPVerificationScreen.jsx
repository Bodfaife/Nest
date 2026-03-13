import React, { useEffect } from "react";
import { Check } from "lucide-react";

const OTPVerificationScreen = ({ onBack, onVerify, email = "user@example.com", darkMode = false }) => {
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-300 bg-gradient-to-br from-emerald-50 via-white to-emerald-50`}>{
      {/* Animated Background Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-300/10 rounded-full blur-3xl -z-10"></div>

      {/* Success Icon */}
      <div className="mb-12 animate-in scale-in duration-500 delay-100">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-500/40">
          <Check size={64} className="text-white" strokeWidth={3} />
        </div>
      </div>

      {/* Message */}
      <div className="text-center max-w-md animate-in fade-in duration-700 delay-200">
        <h1 className={`text-3xl font-black mb-3 ${
          darkMode ? "text-white" : "text-emerald-900"
        }`}>
          Verify Your Email
        </h1>
        <p className={`text-lg ${
          darkMode ? "text-gray-300" : "text-gray-600"
        }`}>
          Check your email to verify your account before proceeding
        </p>
      </div>

      {/* Subtle Loading Indicator */}
      <div className="mt-16">
        <div className="flex gap-2 justify-center">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse delay-100"></div>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse delay-200"></div>
        </div>
        <p className={`text-sm text-center mt-4 font-medium ${
          darkMode ? "text-gray-400" : "text-emerald-600"
        }`}>
          Waiting for confirmation...
        </p>
      </div>
    </div>
  );
};

export default OTPVerificationScreen;
