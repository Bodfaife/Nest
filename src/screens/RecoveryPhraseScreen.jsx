import React, { useState, useEffect } from "react";
import { Copy, Check, Eye, EyeOff, Shield, AlertTriangle, ChevronLeft } from "lucide-react";
import { generateRecoveryPhrase } from "../helpers/generateRecoveryPhrase";

export default function RecoveryPhraseScreen({ onBack, onContinue, phrases = [], userName = "" }) {
  const [copied, setCopied] = useState(false);
  const [recoveryPhrases, setRecoveryPhrases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPhrases, setShowPhrases] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (phrases && Array.isArray(phrases) && phrases.length > 0) {
        setRecoveryPhrases(phrases);
        setLoading(false);
        return;
      }

      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const parsed = JSON.parse(userStr);
          if (parsed?.recoveryPhrase && Array.isArray(parsed.recoveryPhrase) && parsed.recoveryPhrase.length > 0) {
            setRecoveryPhrases(parsed.recoveryPhrase);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.error('Failed to load recovery phrase from localStorage', e);
      }

      try {
        const newPhrase = await generateRecoveryPhrase();
        if (cancelled) return;
        setRecoveryPhrases(newPhrase);
        setLoading(false);

        try {
          const userStr = localStorage.getItem('user');
          const userObj = userStr ? JSON.parse(userStr) : {};
          userObj.recoveryPhrase = newPhrase;
          localStorage.setItem('user', JSON.stringify(userObj));
        } catch (e) {
          console.error('Failed to persist recovery phrase', e);
        }
      } catch (e) {
        console.error('Failed to generate recovery phrase', e);
        setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [phrases]);

  const fallbackCopyText = (text) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    let success = false;
    try {
      success = document.execCommand('copy');
    } catch (err) {
      success = false;
    }
    document.body.removeChild(textarea);
    return success;
  };

  const handleCopyPhrases = async () => {
    const phraseText = recoveryPhrases.join(' ');
    let copiedSuccessfully = false;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(phraseText);
        copiedSuccessfully = true;
      } catch (error) {
        copiedSuccessfully = fallbackCopyText(phraseText);
      }
    } else {
      copiedSuccessfully = fallbackCopyText(phraseText);
    }

    if (copiedSuccessfully) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleViewOrCopy = () => {
    if (!showPhrases) {
      setShowPhrases(true);
      return;
    }
    handleCopyPhrases();
  };

  return (
    <div className="h-screen overflow-y-auto bg-slate-50 text-slate-900">
      <div className="px-4 pt-5">
        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        )}
      </div>
      <div className="mt-4 flex flex-col items-center text-center px-4">
        <div className="flex h-10 w-20 items-center justify-center rounded-3xl bg-white/15">
          <Shield className="h-5 w-10 text-black font-bold" />
        </div>
        <p className="mt-4 text-xs uppercase tracking-[0.32em] font-bold text-black">Vault Access</p>
        <h1 className="mt-3 text-3xl font-black leading-tight">Recovery Phrase</h1>
        <p className="mt-3 max-w-xl text-xs leading-5 text-slate-600">
          {userName ? `Hi ${userName.split(' ')[0]}, this is your secure backup phrase.` : 'This 12-word phrase is your only way to restore your account. Do not share it with anyone.'}
        </p>
      </div>

      <div className="flex-1 min-h-0 px-4 pb-4 pt-4">
        {loading ? (
          <div className="h-full rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-500" />
            <p className="text-sm font-medium text-slate-700">Preparing your recovery phrase…</p>
          </div>
        ) : (
          <div className="h-full flex flex-col gap-4">
            <div className="relative h-full rounded-3xl bg-emerald-600 p-4 shadow-lg ring-1 ring-slate-200/20">
              <div className={`grid h-full gap-2 grid-cols-3 transition-all duration-300 ${showPhrases ? 'blur-0 opacity-100' : 'blur-2xl opacity-60'}`}>
                {(showPhrases ? recoveryPhrases : [...Array(12).fill('')]).map((word, idx) => (
                  <div key={idx} className="rounded-3xl bg-white/10 p-3 text-center text-slate-100">
                    <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-2xl bg-white/15 font-semibold text-base">
                      {idx + 1}
                    </div>
                    {showPhrases ? (
                      <p className="text-sm font-semibold uppercase tracking-[0.08em] text-white">{word}</p>
                    ) : (
                      <div className="h-3 rounded-full bg-white/20 mx-auto w-10" />
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={handleViewOrCopy}
                className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/95 px-5 py-3 text-sm font-semibold text-slate-900 shadow-xl shadow-slate-900/10 backdrop-blur-sm transition hover:bg-white"
              >
                {!showPhrases ? 'View phrases' : copied ? 'Copied!' : 'Copy phrases'}
              </button>
            </div>
          </div>
        )}
      </div>

        {!loading && (
          <div className="flex-none px-4 pb-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                <span>• Write the words down in order.</span>
                <span>• Keep them private and offline.</span>
                <span>• Do not screenshot or share.</span>
              </div>
              <button
                onClick={onContinue}
                className="mt-3 w-full rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
              >
                I’ve saved my recovery phrase
              </button>
          </div>
        )}
    </div>
  );
}
