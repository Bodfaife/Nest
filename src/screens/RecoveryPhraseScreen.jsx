import React, { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";


export default function RecoveryPhraseScreen({ phrases = [], onContinue }) {
  const [copied, setCopied] = useState(false);
  const [showScreenshotAlert, setShowScreenshotAlert] = useState(false);

  // Note: Cannot reliably detect screenshots on web browsers
  // Only keyboard shortcuts for desktop can be detected
  useEffect(() => {}, []);

  // Also detect keyboard shortcuts on desktop
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Detect print screen
      if (e.key === "PrintScreen") {
        e.preventDefault();
        setShowScreenshotAlert(true);
        setTimeout(() => setShowScreenshotAlert(false), 4000);
      }
      // Detect Ctrl+Shift+S (Windows) or Cmd+Shift+5 (Mac)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 's' || e.key === '5')) {
        e.preventDefault();
        setShowScreenshotAlert(true);
        setTimeout(() => setShowScreenshotAlert(false), 4000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCopy = async () => {
    const phraseText = phrases.join(' ');
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(phraseText);
      } else {
        // fallback for mobile browsers
        const textarea = document.createElement('textarea');
        textarea.value = phraseText;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      alert('Failed to copy. Please copy manually.');
    }
  };

  return (
    <div className="min-h-screen items-center justify-center flex flex-col bg-white px-6 py-12 font-['Plus_Jakarta_Sans',_sans-serif] relative">
      {/* Sticky Header */}
      <div
        className={`fixed top-0 left-0 right-0 px-6 pt-4 pb-6 bg-red-50 border-b-2 border-red-300 flex items-start gap-4 transition-all duration-300 transform origin-top ${
          showScreenshotAlert 
            ? 'translate-y-0 opacity-100 pointer-events-auto' 
            : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={20} />
        <div className="flex-1">
          <p className="font-bold text-red-800">Screenshot Detected</p>
          <p className="text-xs text-red-700 mt-0.5">For security, please do not take screenshots of your recovery phrase. Write down the words manually instead.</p>
        </div>
      </div>

      <img src="/Nest logo.png" alt="Nest Logo" className="w-12 h-12 mb-6 rounded-xl" />
      <h2 className="text-2xl font-black text-emerald-900 mb-2">Recovery Phrase</h2>
      <p className="text-gray-500 mb-6 text-center max-w-xs">Write down these 12 words in order and keep them safe. You will need them to recover your account. Screenshots are not allowed.</p>
      <div className="grid grid-cols-3 gap-3 bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-6 select-text">
        {phrases.map((word, i) => (
          <div key={i} className="text-sm font-bold text-slate-700 px-2 py-1 rounded bg-white/80 border border-slate-200 text-center">{i+1}. {word}</div>
        ))}
      </div>
      <button onClick={handleCopy} className="mb-4 px-6 py-2 rounded-xl bg-emerald-800 text-white font-bold shadow active:scale-95 transition">
        {copied ? "Copied!" : "Copy Phrase"}
      </button>
      <button onClick={onContinue} className="w-[50%] max-w-xs py-4 rounded-2xl font-bold text-white bg-[#00875A] shadow-lg shadow-emerald-100 active:scale-[0.98] transition-all mt-2">
        Continue
      </button>
    </div>
  );
}
