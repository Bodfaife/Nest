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

  const handleCopyPhrases = () => {
    const phraseText = recoveryPhrases.join(' ');
    navigator.clipboard.writeText(phraseText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="relative overflow-hidden pb-10">
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-r from-emerald-600 to-emerald-400 opacity-90" />
        <div className="relative px-6 pt-6">
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-white/20"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}
        </div>

        <div className="relative mx-auto mt-8 max-w-3xl px-6">
          <div className="rounded-[32px] border border-white/20 bg-white/5 px-8 py-10 shadow-xl backdrop-blur-xl text-white">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-black/80">Vault Access</p>
                <h1 className="mt-3 text-3xl font-black sm:text-4xl">Recovery Phrase</h1>
              </div>
              <p className="max-w-xl text-sm leading-7 text-black/80">
                {userName ? `Hi ${userName.split(' ')[0]}, this is your secure backup phrase.` : 'This 12-word phrase is your only way to restore your account. Do not share it with anyone.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 pb-8">

        {loading ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-500" />
            <p className="text-sm font-medium text-slate-700">Preparing your recovery phrase…</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {!showPhrases ? (
              <div className="rounded-3xl bg-emerald-600 p-8 text-center shadow-lg ring-1 ring-slate-200/20">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 text-white">
                  <Eye className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold text-white">Hidden recovery phrase</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Tap reveal to see your recovery words. Keep them offline and store them where only you can access them.
                </p>
                <button
                  onClick={() => setShowPhrases(true)}
                  className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-emerald-900 transition hover:bg-slate-100"
                >
                  Reveal phrase
                </button>
              </div>
            ) : (
              <div className="rounded-3xl bg-emerald-600 p-6 shadow-lg ring-1 ring-slate-200/10">
                <div className="flex items-center justify-between pb-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-100">Recovery phrase</p>
                    <p className="text-xs text-slate-100">12 words — keep them private</p>
                  </div>
                  <button
                    onClick={() => setShowPhrases(false)}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-600 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:bg-slate-500"
                  >
                    <EyeOff className="h-4 w-4" />
                    Hide
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {recoveryPhrases.map((word, idx) => (
                    <div key={idx} className="flex items-center gap-3 rounded-3xl bg-white/5 px-4 py-3 text-sm text-slate-100 ring-1 ring-slate-700">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-slate-600 font-semibold text-slate-200">{idx + 1}</span>
                      <span className="break-words font-medium">{word}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleCopyPhrases}
                  className="mt-6 mx-auto flex w-50% max-w-xs items-center justify-center gap-2 rounded-full bg-slate-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-500"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied to clipboard
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy all words
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {!loading && (
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h3 className="text-sm font-semibold text-slate-900">What to do next</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p>• Write the words down in the correct order.</p>
              <p>• Store them somewhere safe and private.</p>
              <p>• Do not take screenshots or share them with anyone.</p>
            </div>
            <button
              onClick={onContinue}
              className="mt-6 mx-auto flex w-50% max-w-xs items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
            >
              I’ve saved my recovery phrase
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
