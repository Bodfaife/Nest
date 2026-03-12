import React, { useState } from 'react';
import { ChevronLeft, Lock } from 'lucide-react';

export default function ForgotAppLaunchPinScreen({ onBack, onProceedToReset }) {
  const [recoveryPhrase, setRecoveryPhrase] = useState('');
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVerifyRecovery = async () => {
    if (!recoveryPhrase.trim()) {
      setError('Please enter your recovery phrase');
      return;
    }

    setLoading(true);

    // Get user's stored recovery phrase from localStorage
    const userRaw = localStorage.getItem('user');
    if (!userRaw) {
      setError('User data not found. Please sign in again.');
      setLoading(false);
      return;
    }

    try {
      const user = JSON.parse(userRaw);
      const enteredPhrase = recoveryPhrase.trim().toLowerCase();
      const storedPhrase = user.recoveryPhrase?.toLowerCase();

      if (enteredPhrase === storedPhrase) {
        // Recovery phrase verified
        setVerified(true);
        setError('');
        setLoading(false);

        // Proceed to PIN reset after a brief delay
        setTimeout(() => {
          onProceedToReset?.();
        }, 500);
      } else {
        setError('Recovery phrase does not match. Please try again.');
        setRecoveryPhrase('');
        setLoading(false);
      }
    } catch (e) {
      console.error('Error verifying recovery phrase:', e);
      setError('Error verifying recovery phrase');
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleVerifyRecovery();
    }
  };

  return (
    <div className="h-full bg-white flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 transition-all"
        >
          <ChevronLeft className="w-5 h-5 text-gray-900" />
        </button>
        <h1 className="text-2xl font-black text-gray-900">Reset PIN</h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Icon */}
        <div className="mb-8 p-4 rounded-full bg-emerald-50 w-fit">
          <Lock className="w-8 h-8 text-emerald-600" />
        </div>

        {/* Text */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Verify Your Identity
          </h2>
          <p className="text-gray-500 text-sm">
            Enter your recovery phrase to reset your app launch PIN. This is the same phrase you saved when you created your account.
          </p>
        </div>

        {/* Recovery Phrase Input */}
        <div className="mb-6">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 block mb-2">
            Recovery Phrase
          </label>
          <textarea
            value={recoveryPhrase}
            onChange={(e) => {
              setRecoveryPhrase(e.target.value);
              setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder="Enter your 12-word recovery phrase (space-separated)"
            disabled={verified || loading}
            className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-emerald-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            rows={4}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-xs font-bold text-red-600">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {verified && (
          <div className="mb-6 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
            <p className="text-xs font-bold text-emerald-600">✓ Recovery phrase verified! Proceeding to reset your PIN...</p>
          </div>
        )}

        {/* Info Box */}
        <div className="mb-8 p-4 rounded-xl bg-blue-50 border border-blue-100">
          <p className="text-xs text-blue-600 font-medium">
            💡 <strong>Tip:</strong> Your recovery phrase is case-insensitive and can have extra spaces between words.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="space-y-3">
        <button
          onClick={handleVerifyRecovery}
          disabled={verified || loading || !recoveryPhrase.trim()}
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
