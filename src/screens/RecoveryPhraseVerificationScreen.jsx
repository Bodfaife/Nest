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
    if (enteredPhrases.some(p => !p.trim())) {
      setError('Please enter all recovery phrases');
      return;
    }

    // Verify phrases match exactly (case-insensitive, trimmed)
    const enteredLower = enteredPhrases.map(p => p.trim().toLowerCase());
    const originalLower = recoveryPhrases.map(p => p.toLowerCase());

    const phrasesMatch = enteredLower.every((phrase, index) => phrase === originalLower[index]);

    if (!phrasesMatch) {
      setError('Recovery phrases do not match. Please check your entries and try again.');
      return;
    }

    // Phrases verified successfully
    setIsVerifying(true);
    setTimeout(() => {
      onVerified();
    }, 1500);
  };

  const allFilled = enteredPhrases.every(p => p.trim().length > 0);
  const bgClass = darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900';
  const inputClass = darkMode
    ? 'bg-gray-800 text-white border border-gray-700'
    : 'bg-gray-50 text-gray-900 border border-gray-100';
  const labelClass = darkMode ? 'text-gray-300' : 'text-gray-700';

  return (
    <div className={`min-h-screen flex flex-col ${bgClass} p-6`}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        {!isVerifying && (
          <button
            onClick={onBack}
            className={`p-2 rounded-full ${
              darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            <ChevronLeft size={24} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center">
        {!isVerifying ? (
          <>
            <h1 className="text-3xl font-black mb-3">Verify Your Identity</h1>
            <p className={`text-sm mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Enter your 12 recovery phrases in the exact order and spelling as shown when you created your account.
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

            {/* Phrase Inputs */}
            <div className="space-y-4 mb-8">
              {recoveryPhrases.map((_, index) => (
                <div key={index}>
                  <label className={`block text-sm font-bold mb-2 ${labelClass}`}>
                    Phrase {index + 1}
                  </label>
                  <input
                    type="text"
                    placeholder={`Enter word ${index + 1}`}
                    value={enteredPhrases[index]}
                    onChange={(e) => handlePhrasesChange(index, e.target.value)}
                    disabled={isVerifying}
                    className={`w-full p-3 rounded-xl outline-none focus:border-emerald-500 disabled:opacity-50 ${inputClass}`}
                  />
                </div>
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div
                className={`flex items-center gap-2 p-4 rounded-xl mb-8 ${
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

      {/* Verify Button */}
      {!isVerifying && (
        <button
          onClick={handleVerify}
          disabled={!allFilled}
          className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all ${
            allFilled
              ? 'bg-[#00875A] shadow-emerald-100 active:scale-[0.98]'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Verify Phrases
        </button>
      )}
    </div>
  );
}
