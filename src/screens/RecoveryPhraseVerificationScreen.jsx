import React, { useState } from 'react';
import { ChevronLeft, AlertCircle, CheckCircle } from 'lucide-react';

export default function RecoveryPhraseVerificationScreen({
  darkMode = false,
  recoveryPhrases = [],
  onBack,
  onVerified,
}) {
  const [enteredPhrases, setEnteredPhrases] = useState(Array(recoveryPhrases.length).fill(''));
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handlePhrasesChange = (index, value) => {
    const newPhrases = [...enteredPhrases];
    newPhrases[index] = value;
    setEnteredPhrases(newPhrases);
    setError('');
  };

  const handleVerify = () => {
    // Check if all phrases are entered
    if (enteredPhrases.some(p => p === undefined || p === null || p.length === 0)) {
      setError('Please enter all recovery phrases');
      return;
    }

    // Verify phrases match exactly (case-sensitive, word-for-word)
    const phrasesMatch = enteredPhrases.every((p, index) => p.trim() === recoveryPhrases[index]);

    if (!phrasesMatch) {
      setError('Recovery phrases do not match. Ensure spelling and capitalization are exact.');
      return;
    }

    // Phrases verified successfully
    setIsVerifying(true);
    setTimeout(() => {
      onVerified();
    }, 800);
  };

  const allFilled = enteredPhrases.every(p => p && p.trim().length > 0);
  const exactMatch = recoveryPhrases.length > 0 && enteredPhrases.every((p, i) => p.trim() === recoveryPhrases[i]);
  const bgClass = darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900';
  const inputClass = darkMode
    ? 'bg-gray-800 text-white border border-gray-700'
    : 'bg-gray-50 text-gray-900 border border-gray-100';
  const labelClass = darkMode ? 'text-gray-300' : 'text-gray-700';

  return (
    <div className={`min-h-screen flex flex-col ${bgClass} p-6`}>
      {/* Header with back button and title */}
      <div className="flex items-center gap-4 mb-8">
        {!isVerifying && (
          <button
            onClick={onBack}
            className={`p-2 rounded-full flex-shrink-0 ${
              darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            <ChevronLeft size={24} />
          </button>
        )}
        <div className="flex-1">
          <h1 className="text-2xl font-black">Verify Your Identity</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-start">
        {!isVerifying ? (
          <>
            <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Enter your recovery phrases below in the exact order and spelling as shown when you created your account.
            </p>

            {/* Info Box */}
            <div
              className={`p-4 rounded-xl mb-8 ${
                darkMode
                  ? 'bg-amber-900/30 border border-amber-800'
                  : 'bg-amber-50 border border-amber-200'
              }`}
            >
              <p className={`text-sm font-semibold mb-2 ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                Important: Case and spelling must match exactly
              </p>
              <p className={`text-xs ${darkMode ? 'text-amber-200' : 'text-amber-600'}`}>
                Example: If you see "Coffee", don't enter "coffee" or "Coffee123"
              </p>
            </div>

            

            {exactMatch && (
              <div className="mb-4 flex items-center gap-2 text-emerald-600">
                <CheckCircle size={16} />
                <span className="text-sm font-semibold">All phrases match exactly.</span>
              </div>
            )}

            {/* Recovery Phrases Input Section */}
            <div className="mb-8">
              <label className={`block text-sm font-bold mb-4 ${labelClass}`}>
                Enter Your Recovery Phrases
              </label>

              {/* Pasteable rectangle for full phrase */}
              <div className={`p-4 rounded-xl mb-4 border ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                <p className={`text-xs mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Paste your full recovery phrase (space-separated) or type the words below.
                </p>
                <textarea
                  placeholder="e.g. word1 word2 word3 ..."
                  className={`w-full p-3 rounded-md resize-none h-20 outline-none ${inputClass}`}
                  onChange={(e) => {
                    const raw = e.target.value || '';
                    const parts = raw.trim().split(/\s+/).filter(Boolean);
                    if (parts.length >= recoveryPhrases.length) {
                      const newP = Array(recoveryPhrases.length).fill('');
                      for (let i = 0; i < recoveryPhrases.length; i++) newP[i] = parts[i] || '';
                      setEnteredPhrases(newP);
                      setError('');
                    }
                    // allow partial paste/typing without overwriting when insufficient words
                  }}
                />
              </div>

              {/* Verify Button - Positioned after info box */}
            <button
              onClick={handleVerify}
              disabled={!exactMatch}
              className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all mb-8 ${
                exactMatch
                  ? 'bg-[#00875A] shadow-emerald-100 active:scale-[0.98]'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Verify Phrases
            </button>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recoveryPhrases.map((_, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      darkMode
                        ? 'bg-emerald-900/40 text-emerald-300'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {index + 1}
                    </span>
                    <input
                      type="text"
                      placeholder={`Word ${index + 1}`}
                      value={enteredPhrases[index]}
                      onChange={(e) => handlePhrasesChange(index, e.target.value)}
                      disabled={isVerifying}
                      className={`flex-1 p-3 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50 transition-all ${inputClass}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div
                className={`flex items-center gap-2 p-4 rounded-xl ${
                  darkMode
                    ? 'bg-red-900/30 border border-red-800'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                <AlertCircle size={18} className={darkMode ? 'text-red-400' : 'text-red-600'} />
                <p className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-700'}`}>{error}</p>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center animate-pulse">
              <CheckCircle size={32} className="text-emerald-600" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-black mb-2">Phrases Verified!</h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Proceeding to password reset...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
