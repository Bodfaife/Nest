import React, { useState, useMemo, useEffect } from "react";
import { Copy, Check, Eye, EyeOff, Lock } from "lucide-react";
import { generateRecoveryPhrase } from "../helpers/generateRecoveryPhrase";

export default function RecoveryPhraseScreen({ onContinue, phrases = [], userName = "" }) {
  const [copied, setCopied] = useState(false);
  const [recoveryPhrases, setRecoveryPhrases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPhrases, setShowPhrases] = useState(false);

  // Load existing phrases or generate a new set if none found
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      console.log('📋 RecoveryPhraseScreen: loading with props.phrases =', phrases);

      // first preference is props
      if (phrases && Array.isArray(phrases) && phrases.length > 0) {
        console.log('✅ Using phrases from props');
        setRecoveryPhrases(phrases);
        setLoading(false);
        return;
      }

      // then try localStorage user record
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const parsed = JSON.parse(userStr);
          if (parsed?.recoveryPhrase && Array.isArray(parsed.recoveryPhrase) && parsed.recoveryPhrase.length > 0) {
            console.log('✅ Loaded recovery phrases from localStorage:', parsed.recoveryPhrase.length, 'words');
            setRecoveryPhrases(parsed.recoveryPhrase);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.error('Failed to load recovery phrases from localStorage:', e);
      }

      // nothing available, create one now and persist it
      try {
        console.log('🔄 Generating new recovery phrase...');
        const newPhrase = await generateRecoveryPhrase();
        if (cancelled) return;
        console.log('✅ Generated:', newPhrase.length, 'words');
        setRecoveryPhrases(newPhrase);
        setLoading(false);
        // stash it back in localStorage so page refresh still shows it
        try {
          const userStr = localStorage.getItem('user');
          const userObj = userStr ? JSON.parse(userStr) : {};
          userObj.recoveryPhrase = newPhrase;
          localStorage.setItem('user', JSON.stringify(userObj));
          console.log('💾 Saved recovery phrase to localStorage');
        } catch (e) {
          console.error('Failed to save generated recovery phrases:', e);
        }
      } catch (e) {
        console.error('Failed to generate recovery phrase:', e);
        setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [phrases]);

  const handleCopyPhrases = () => {
    const phraseText = recoveryPhrases.join(" ");
    navigator.clipboard.writeText(phraseText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 py-12 font-['Plus_Jakarta_Sans',_sans-serif]">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
          <Lock size={32} className="text-white" />
        </div>
        <h1 className="text-3xl font-black text-emerald-900 mb-2">Recovery Phrase</h1>
        <p className="text-gray-600 text-base">Your 12-word backup to recover your account anytime</p>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Generating your recovery phrase...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Phrases Display */}
          <div className="flex-1 flex flex-col items-center justify-center mb-8">
            {!showPhrases ? (
              <div className="w-full max-w-sm bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-12 text-center text-white shadow-2xl">
                <Eye size={48} className="text-white/50 mx-auto mb-6" />
                <p className="text-white/90 text-sm font-medium mb-6">Tap to reveal your 12-word recovery phrase</p>
                <button
                  onClick={() => setShowPhrases(true)}
                  className="px-8 py-3 bg-white text-emerald-600 rounded-xl font-bold hover:bg-emerald-50 transition-all active:scale-95"
                >
                  Show My Phrase
                </button>
              </div>
            ) : (
              <div className="w-full max-w-md">
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {recoveryPhrases.map((word, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl hover:border-emerald-400 transition-all"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-mono text-sm font-semibold text-emerald-900">{word}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowPhrases(false)}
                  className="w-full flex items-center justify-center gap-2 text-gray-500 text-sm font-medium hover:text-gray-700 transition-colors"
                >
                  <EyeOff size={16} /> Hide Phrase
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 w-full">
            <button
              onClick={handleCopyPhrases}
              disabled={!showPhrases}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                showPhrases
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {copied ? (
                <>
                  <Check size={20} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={20} />
                  Copy Phrase
                </>
              )}
            </button>

            <button
              onClick={onContinue}
              className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all active:scale-95"
            >
              Continue
            </button>
          </div>
        </>
      )}
    </div>
  );
}
