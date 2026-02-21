import React, { useState } from 'react';
import { debug } from '../helpers/debug';
import { ChevronLeft, AlertCircle, CheckCircle } from 'lucide-react';
import PaymentProcessingScreen from './PaymentProcessingScreen';

export default function RecoveryPhraseVerificationScreen({
  darkMode = false,
  recoveryPhrases = [],
  onBack,
  onVerified,
}) {
  React.useEffect(() => {
    debug.log('🔎 RecoveryPhraseVerificationScreen mounted');
    debug.log('   received recoveryPhrases prop:', recoveryPhrases);
    try {
      const raw = localStorage.getItem('user');
      debug.log('   localStorage.user:', raw ? JSON.parse(raw).recoveryPhrase : null);
    } catch (e) {
      debug.error('   error reading localStorage user:', e);
    }
  }, []);
  const [enteredPhrases, setEnteredPhrases] = useState(Array(recoveryPhrases.length).fill(''));
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);

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

    // Verify phrases match (case-insensitive comparison)
    const phrasesMatch = enteredPhrases.every((p, index) => {
      const a = (p || '').toString().trim().toLowerCase();
      const b = (recoveryPhrases[index] || '').toString().trim().toLowerCase();
      return a === b;
    });

    if (!phrasesMatch) {
      setError('Recovery phrases do not match. Ensure spelling is correct (case is ignored).');
      return;
    }

    // Phrases verified successfully -> show processing screen first
    setShowProcessing(true);
  };

  const allFilled = enteredPhrases.every(p => p && p.trim().length > 0);
  const normalize = (s) => (s || '').toString().trim().toLowerCase();
  const exactMatch = recoveryPhrases.length > 0 && enteredPhrases.every((p, i) => normalize(p) === normalize(recoveryPhrases[i]));
  // Per-word match booleans for visual feedback
  const enteredMatches = recoveryPhrases.map((_, i) => normalize(enteredPhrases[i]) === normalize(recoveryPhrases[i]));
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
        {showProcessing ? (
          <PaymentProcessingScreen
            message={"Verifying recovery phrases..."}
            onComplete={() => {
              // after processing, show verified UI then call parent
              setShowProcessing(false);
              setIsVerifying(true);
              setTimeout(() => {
                onVerified();
              }, 800);
            }}
            darkMode={darkMode}
          />
        ) : !isVerifying ? (
          <>
            <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Enter your recovery phrases below in the exact order and spelling as shown when you created your account. Case is ignored.
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
                Important: Spelling and order must match (case-insensitive)
              </p>
              <p className={`text-xs ${darkMode ? 'text-amber-200' : 'text-amber-600'}`}>
                Example: If you see "Coffee", entering "coffee" will be accepted.
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

              <div className="space-y-3 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-3 gap-3">
                  {recoveryPhrases.map((_, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        darkMode
                          ? 'bg-emerald-900/40 text-emerald-300'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {index + 1}
                      </span>
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder={`Word ${index + 1}`}
                          value={enteredPhrases[index]}
                          onChange={(e) => handlePhrasesChange(index, e.target.value)}
                          disabled={isVerifying}
                          className={`w-full p-3 rounded-xl outline-none transition-all disabled:opacity-50 ${inputClass} ${enteredPhrases[index] ? (enteredMatches[index] ? (darkMode ? 'border-emerald-500 bg-emerald-900/20' : 'border-emerald-500 bg-emerald-50') : (darkMode ? 'border-red-500 bg-red-900/10' : 'border-red-500 bg-red-50')) : ''}`}
                        />
                        {enteredPhrases[index] && enteredMatches[index] && (
                          <CheckCircle size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600" />
                        )}
                        {enteredPhrases[index] && !enteredMatches[index] && (
                          <AlertCircle size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Verify Button placed under the grid */}
                <div className="mt-6">
                  <button
                    onClick={handleVerify}
                    disabled={!exactMatch}
                    className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all ${
                      exactMatch
                        ? 'bg-[#00875A] shadow-emerald-100 active:scale-[0.98]'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Verify Phrases
                  </button>
                </div>
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
