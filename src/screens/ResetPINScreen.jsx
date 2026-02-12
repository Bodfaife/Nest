import React, { useState } from 'react';
import { ChevronLeft, Lock } from 'lucide-react';

export default function ResetPINScreen({ darkMode = false, onBack, user, onResetPin }) {
  const [steps, setSteps] = useState(0);
  const [verificationCode, setVerificationCode] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');

  const bgClass = darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-100';
  const inputClass = darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900';
  const buttonClass = 'bg-emerald-600 hover:bg-emerald-700 text-white';

  const handleReset = () => {
    setError('');
    
    if (steps === 0) {
      // Verify email code
      if (!verificationCode) {
        setError('Please enter the verification code');
        return;
      }
      // Simulate verification (in real app, check against sent code)
      setSteps(1);
    } else if (steps === 1) {
      // Set new PIN
      if (!newPin || newPin.length < 4) {
        setError('PIN must be at least 4 digits');
        return;
      }
      if (!confirmPin || confirmPin !== newPin) {
        setError('PINs do not match');
        return;
      }
      // Call the onResetPin callback
      if (onResetPin) {
        onResetPin(newPin);
      }
      setSteps(2);
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
        <h1 className="text-2xl font-black">Reset PIN</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 flex flex-col items-center justify-center">
        {steps === 0 && (
          <div className="w-full max-w-md space-y-6">
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <Lock size={32} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
              </div>
              <h2 className="text-xl font-bold mb-2">Verify Your Email</h2>
              <p className={textSecondary}>A verification code has been sent to {user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Verification Code</label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength="6"
                className={`w-full p-4 rounded-xl border outline-none focus:ring-2 focus:ring-emerald-500 ${inputClass}`}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              onClick={handleReset}
              className={`w-full py-3 rounded-xl font-bold ${buttonClass} transition-all`}
            >
              Verify & Continue
            </button>
          </div>
        )}

        {steps === 1 && (
          <div className="w-full max-w-md space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Set New PIN</h2>
              <p className={textSecondary}>Choose a new 4-6 digit PIN</p>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">New PIN</label>
              <input
                type="password"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="••••"
                maxLength="6"
                className={`w-full p-4 rounded-xl border outline-none focus:ring-2 focus:ring-emerald-500 ${inputClass}`}
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Confirm PIN</label>
              <input
                type="password"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                placeholder="••••"
                maxLength="6"
                className={`w-full p-4 rounded-xl border outline-none focus:ring-2 focus:ring-emerald-500 ${inputClass}`}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              onClick={handleReset}
              className={`w-full py-3 rounded-xl font-bold ${buttonClass} transition-all`}
            >
              Reset PIN
            </button>
          </div>
        )}

        {steps === 2 && (
          <div className="w-full max-w-md space-y-6 text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${darkMode ? 'bg-emerald-900/30' : 'bg-emerald-50'}`}>
              <div className={`text-3xl ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>✓</div>
            </div>
            <h2 className="text-xl font-bold">PIN Reset Successful</h2>
            <p className={textSecondary}>Your PIN has been successfully reset. You can now use your new PIN to access your account.</p>
            <button
              onClick={onBack}
              className={`w-full py-3 rounded-xl font-bold ${buttonClass} transition-all`}
            >
              Back to Settings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
