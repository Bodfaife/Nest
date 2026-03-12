import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export default function SplashScreen({ onFinish, installPrompt, handleInstallApp, isInstalled }) {
  const [showBanner, setShowBanner] = useState(true);
  const [bannerTimer, setBannerTimer] = useState(null);

  // Show install banner for 5 seconds, then auto-hide
  useEffect(() => {
    if (installPrompt && !isInstalled && showBanner) {
      const timer = setTimeout(() => {
        setShowBanner(false);
      }, 5000);
      setBannerTimer(timer);
      return () => clearTimeout(timer);
    }
  }, [installPrompt, isInstalled, showBanner]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof onFinish === 'function') onFinish();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center">
      {/* Ensure html and body are white */}
      <style>{`
        html, body {
          background-color: #ffffff;
          margin: 0;
          height: 100%;
        }
      `}</style>

      {/* Install PWA Banner */}
      {installPrompt && !isInstalled && showBanner && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-[#00875A]/80 text-white px-6 py-3 flex items-center justify-between shadow-lg z-50 rounded-full w-11/12 max-w-lg">
          {/* transparent green pill-shaped banner centered */}
          <div className="flex-1">
            <p className="font-semibold text-sm">Install Nest on your device</p>
            <p className="text-xs mt-0.5 opacity-90">Quick access from your home screen</p>
          </div>
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => {
                handleInstallApp();
                setShowBanner(false);
              }}
              className="px-4 py-1.5 bg-white text-emerald-600 rounded text-xs font-bold hover:bg-emerald-50 whitespace-nowrap"
            >
              Install
            </button>
            <button
              onClick={() => setShowBanner(false)}
              className="p-1.5 hover:bg-emerald-700 rounded transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Logo and brand */}
      <div className="relative flex flex-col items-center scale-up-center">
        <div className="w-24 h-24 bg-[#00875A] rounded-[2rem] flex items-center justify-center rotate-12 mb-6">
          <span className="text-white font-black text-5xl -rotate-12">N</span>
        </div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter">
          Nest<span className="text-[#00875A]">.</span>
        </h1>
        <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">
          Secure Wealth
        </p>
      </div>

      {/* Loading indicator */}
      <div className="absolute bottom-16 flex gap-1.5">
        <div className="w-2 h-2 bg-[#00875A] rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-[#00875A] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-[#00875A] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      </div>

      {/* Scale-up animation */}
      <style>{`
        @keyframes scaleUp {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .scale-up-center {
          animation: scaleUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
