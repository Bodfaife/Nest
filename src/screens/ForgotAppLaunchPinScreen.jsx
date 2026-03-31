import React, { useState } from 'react';
import { ChevronLeft, Lock } from 'lucide-react';

export default function ForgotAppLaunchPinScreen({ onBack, onProceedToReset }) {
  const [phraseWords, setPhraseWords] = useState(Array(12).fill(''));
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleWordChange = (index, value) => {
    setError('');
    const nextWords = [...phraseWords];
    nextWords[index] = value;
    setPhraseWords(nextWords);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    const words = paste.trim().split(/\s+/).slice(0, 12);
    if (words.length === 12) {
      const nextWords = Array(12).fill('');
      words.forEach((word, index) => {
        nextWords[index] = word;
      });
      setPhraseWords(nextWords);
      setError('');
    }
  };

  const handleVerifyRecovery = async () => {
    const entered = phraseWords.map((w) => w.trim());
    if (entered.some((word) => word === '')) {
      setError('Please fill in all 12 phrase fields.');
      return;
    }

    setLoading(true);

    const userRaw = localStorage.getItem('user');
    if (!userRaw) {
      setError('User data not found. Please sign in again.');
      setLoading(false);
      return;
    }

    try {
      const user = JSON.parse(userRaw);
      const savedPhrase = user.recoveryPhrase || [];
      const currentPhrase = Array.isArray(savedPhrase)
        ? savedPhrase
        : typeof savedPhrase === 'string'
          ? savedPhrase.split(/\s+/)
          : [];

      if (currentPhrase.length !== 12) {
        setError('Saved recovery phrase is invalid.');
        setLoading(false);
        return;
      }

      const matches = currentPhrase.every((word, index) => word === entered[index]);

      if (matches) {
        setVerified(true);
        setError('');
        setLoading(false);
        setTimeout(() => {
          onProceedToReset?.();
        }, 500);
      } else {
        setError('Recovery phrase does not match. Please check the order and spelling.');
        setLoading(false);
      }
    } catch (e) {
      console.error('Error verifying recovery phrase:', e);
      setError('Error verifying recovery phrase');
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-white flex flex-col p-6">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 transition-all"
        >
          <ChevronLeft className="w-5 h-5 text-gray-900" />
        </button>
        <h1 className="text-2xl font-black text-gray-900">Reset PIN</h1>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="mb-8 p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
          <h2 className="text-lg font-bold text-emerald-900 mb-2">Verify Your Identity</h2>
          <p className="text-gray-600 text-sm">
            Enter your recovery phrase exactly into the numbered fields below. The order and case must match.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 mb-6">
          {phraseWords.map((word, index) => (
            <div key={index} className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                {index + 1}
              </label>
              <input
                type="text"
                value={word}
                onChange={(e) => handleWordChange(index, e.target.value)}
                onPaste={index === 0 ? handlePaste : undefined}
                disabled={verified || loading}
                placeholder="word"
                className="w-full p-3 rounded-2xl border border-gray-200 bg-gray-50 focus:border-emerald-500 outline-none"
              />
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-xs font-bold text-red-600">{error}</p>
          </div>
        )}

        {verified && (
          <div className="mb-6 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
            <p className="text-xs font-bold text-emerald-600">✓ Recovery phrase verified! Proceeding to reset your PIN...</p>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <button
          onClick={handleVerifyRecovery}
          disabled={verified || loading}
          className="w-full py-4 rounded-2xl font-bold text-white bg-emerald-600 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Verifying...' : 'Verify & Reset PIN'}
        </button>

        <button
          onClick={onBack}
          className="w-full py-4 rounded-2xl font-bold text-emerald-600 border border-emerald-600 bg-white active:scale-95 transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
