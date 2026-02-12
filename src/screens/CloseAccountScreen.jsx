import React, { useState } from 'react';
import { ChevronLeft, AlertCircle } from 'lucide-react';

export default function CloseAccountScreen({ darkMode = false, onBack, onCloseAccount }) {
  const [confirmText, setConfirmText] = useState('');
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');

  const bgClass = darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-100';
  const inputClass = darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900';
  const warningBg = darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200';

  const handleClose = () => {
    setError('');
    
    if (step === 0) {
      setStep(1);
    } else if (step === 1) {
      if (confirmText.toLowerCase() !== 'close my account') {
        setError('Please type "close my account" to confirm');
        return;
      }
      // Call the onCloseAccount callback
      if (onCloseAccount) {
        onCloseAccount();
      }
      setStep(2);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${bgClass} animate-in slide-in-from-right`}>
      {/* Header */}
      <div className={`sticky top-0 z-10 border-b ${borderColor} p-6 flex items-center gap-4`}>
        <button 
          onClick={onBack}
          className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-black">Close Account</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 flex flex-col items-center justify-center">
        {step === 0 && (
          <div className="w-full max-w-md space-y-6">
            <div className={`p-6 rounded-2xl border-2 flex items-start gap-4 ${warningBg}`}>
              <AlertCircle size={28} className={darkMode ? 'text-red-400' : 'text-red-600'} />
              <div>
                <h3 className="font-bold mb-2">Account Closure Warning</h3>
                <p className={`text-sm ${textSecondary}`}>
                  Closing your account is permanent and cannot be undone. All your data, transactions, and savings will be deleted.
                </p>
              </div>
            </div>

            <div className="space-y-3 p-4 rounded-xl bg-opacity-50" style={{ backgroundColor: darkMode ? 'rgba(0, 255, 157, 0.05)' : 'rgba(0, 135, 90, 0.05)' }}>
              <p className="font-bold mb-3">Before closing, please note:</p>
              <ul className={`space-y-2 text-sm ${textSecondary}`}>
                <li>✓ Ensure all funds have been withdrawn from your savings</li>
                <li>✓ Your account number will be deactivated</li>
                <li>✓ You will no longer have access to transaction history</li>
                <li>✓ You cannot recover your data after deletion</li>
              </ul>
            </div>

            <div className="space-y-3 pt-4">
              <button
                onClick={handleClose}
                className="w-full py-3 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white transition-all"
              >
                I Understand, Close My Account
              </button>
              <button
                onClick={onBack}
                className={`w-full py-3 rounded-xl font-bold transition-all ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="w-full max-w-md space-y-6">
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${darkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
                <AlertCircle size={32} className={darkMode ? 'text-red-400' : 'text-red-600'} />
              </div>
              <h2 className="text-xl font-bold mb-2">Confirm Account Closure</h2>
              <p className={textSecondary}>Type the text below to confirm account closure</p>
            </div>

            <div>
              <p className="text-sm font-bold mb-3">Type this to confirm:</p>
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} border-2 border-red-500 text-center font-bold text-red-600`}>
                close my account
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Confirmation Text</label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type the confirmation text"
                className={`w-full p-4 rounded-xl border outline-none focus:ring-2 focus:ring-red-500 ${inputClass}`}
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="space-y-3">
              <button
                onClick={handleClose}
                disabled={confirmText.toLowerCase() !== 'close my account'}
                className={`w-full py-3 rounded-xl font-bold transition-all ${
                  confirmText.toLowerCase() === 'close my account'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                }`}
              >
                Close Account Permanently
              </button>
              <button
                onClick={onBack}
                className={`w-full py-3 rounded-xl font-bold transition-all ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="w-full max-w-md space-y-6 text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <div className="text-3xl">👋</div>
            </div>
            <h2 className="text-xl font-bold">Account Closed</h2>
            <p className={textSecondary}>
              Your Nest account has been permanently closed. We've sent a confirmation to your email address. All your data has been securely deleted from our servers.
            </p>
            <button
              onClick={onBack}
              className={`w-full py-3 rounded-xl font-bold transition-all ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
