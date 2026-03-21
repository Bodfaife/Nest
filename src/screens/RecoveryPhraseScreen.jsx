import React, { useState, useMemo, useEffect } from "react";
import { Copy, Check, Eye, EyeOff, Shield, AlertTriangle } from "lucide-react";
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 py-8 shadow-sm">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Recovery Phrase
        </h1>
        <p className="text-gray-600 text-center text-sm leading-relaxed">
          These 12 words are your backup key to recover your account. Keep them safe and never share them.
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 rounded-full border-2 border-blue-100 border-t-blue-600 animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Generating your recovery phrase...</p>
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            {/* Security Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-amber-800 mb-1">Important Security Notice</h3>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Write these words down in order and store them securely. You'll need them to recover your account if you lose access.
                  </p>
                </div>
              </div>
            </div>

            {/* Phrase Display */}
            {!showPhrases ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Recovery Phrase</h3>
                <p className="text-gray-600 text-sm mb-6">Tap the button below to reveal your 12-word recovery phrase</p>
                <button
                  onClick={() => setShowPhrases(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Reveal Phrase
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Your Recovery Words</h3>
                    <button
                      onClick={() => setShowPhrases(false)}
                      className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <EyeOff className="w-4 h-4" />
                      <span className="text-sm">Hide</span>
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {recoveryPhrases.map((word, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <span className="text-xs font-medium text-gray-500 w-4 flex-shrink-0">
                          {idx + 1}
                        </span>
                        <span className="font-mono text-sm font-medium text-gray-900 truncate">
                          {word}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handleCopyPhrases}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied to clipboard
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy all words
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      {!loading && (
        <div className="bg-white px-6 py-6 border-t border-gray-200">
          <button
            onClick={onContinue}
            className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            I've Saved My Recovery Phrase
          </button>
        </div>
      )}
    </div>
  );
}
