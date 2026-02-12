import React, { useEffect } from 'react';

export default function SplashScreen({ onFinish }) {
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
