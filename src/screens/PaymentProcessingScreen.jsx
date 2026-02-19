import React, { useEffect } from "react";
import { Loader2, ShieldCheck } from "lucide-react";

/**
 * PaymentProcessingScreen
 * Generic processing screen for ALL transactions
 *
 * Props:
 * - message: string (custom text per transaction)
 * - onComplete: function (called after processing finishes)
 * - darkMode: boolean
 */
export default function PaymentProcessingScreen({ message, onComplete, darkMode }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof onComplete === "function") {
        onComplete();
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const bgClass = darkMode ? "bg-gray-900" : "bg-white";
  const textPrimary = darkMode ? "text-white" : "text-gray-900";
  const textSecondary = darkMode ? "text-gray-400" : "text-gray-400";
  const spinnerBorder = darkMode ? "border-gray-700" : "border-emerald-50";
  const spinnerTop = darkMode ? "border-t-[#00FF9D]" : "border-t-[#00875A]"; // brighter in dark mode
  const loaderColor = darkMode ? "text-[#00FF9D]" : "text-[#00875A]";
  const footerText = darkMode ? "text-gray-400" : "text-gray-300";

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-6 animate-in fade-in duration-500 ${bgClass}`}>

      {/* Spinner */}
      <div className="relative mb-10">
        <div className={`w-24 h-24 border-4 ${spinnerBorder} ${spinnerTop} rounded-full animate-spin`} />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className={`${loaderColor} animate-pulse`} size={32} />
        </div>
      </div>

      {/* Text */}
      <h2 className={`text-2xl font-black text-center mb-3 leading-tight ${textPrimary}`}>
        {message || "Securing your transaction..."}
      </h2>

      <p className={`font-bold text-center text-sm max-w-xs ${textSecondary}`}>
        Please do not close the app or refresh this page.
      </p>

      {/* Footer trust badge */}
      <div className={`absolute bottom-10 flex items-center gap-2 ${footerText}`}>
        <ShieldCheck size={16} />
        <span className="text-[10px] font-black uppercase tracking-widest">
          PCI-DSS Compliant
        </span>
      </div>
    </div>
  );
}
