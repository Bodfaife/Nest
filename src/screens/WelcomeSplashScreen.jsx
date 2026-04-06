import React, { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";

export default function WelcomeSplashScreen({ user, onContinue }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          onContinue();
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [onContinue]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-white px-6">
      <div className="text-center space-y-6 max-w-md">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 bg-emerald-100 rounded-full animate-pulse" />
            <div className="relative inset-0 flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Main Message */}
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-gray-900">
            Account Created Successfully!
          </h1>
          <p className="text-lg font-semibold text-emerald-600">
            Welcome to Nest, {user?.fullName?.split(" ")[0] || "User"}!
          </p>
        </div>

        {/* Details */}
        <div className="bg-white rounded-2xl p-6 space-y-3 border border-emerald-100">
          <div className="flex items-start gap-3">
            <div className="text-emerald-600 font-bold">✓</div>
            <p className="text-sm text-gray-700">Account number: <span className={`font-mono font-bold ${!user?.accountNumber ? 'text-gray-400' : 'text-gray-900'}`}>{user?.accountNumber || 'Setting up...'}</span></p>
          </div>
          <div className="flex items-start gap-3">
            <div className="text-emerald-600 font-bold">✓</div>
            <p className="text-sm text-gray-700">PIN secured and verified</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="text-emerald-600 font-bold">✓</div>
            <p className="text-sm text-gray-700">Ready to save and grow</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-600 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Loading Text */}
        <p className="text-sm text-gray-500 font-semibold">
          Preparing your savings experience...
        </p>
      </div>
    </div>
  );
}
