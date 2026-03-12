import React, { useState } from 'react';
import { Lock, Trash2 } from 'lucide-react';

export default function AppLaunchPinScreen({ onPinVerified, onSetupPin, onForgotPin, forceResetMode = false }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isSetupMode, setIsSetupMode] = useState(forceResetMode || !localStorage.getItem('appLaunchPin'));
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);

  const PIN_LENGTH = 6;
  const MAX_ATTEMPTS = 5;
  const LOCK_TIME = 5 * 60 * 1000; // 5 minutes

  // Check if locked due to attempts
  const getLockStatus = () => {
    const lockData = localStorage.getItem('pinLockData');
    if (!lockData) return null;
    
    const { timestamp, locked } = JSON.parse(lockData);
    const now = Date.now();
    
    if (locked && now < timestamp + LOCK_TIME) {
      return Math.ceil((timestamp + LOCK_TIME - now) / 1000);
    }
    
    if (now >= timestamp + LOCK_TIME) {
      localStorage.removeItem('pinLockData');
      return null;
    }
    
    return null;
  };

  const incrementFailedAttempts = () => {
    let attempts = parseInt(localStorage.getItem('pinFailedAttempts') || '0');
    attempts += 1;
    localStorage.setItem('pinFailedAttempts', attempts.toString());
    
    if (attempts >= MAX_ATTEMPTS) {
      localStorage.setItem('pinLockData', JSON.stringify({
        timestamp: Date.now(),
        locked: true
      }));
    }
    
    return attempts;
  };

  const resetFailedAttempts = () => {
    localStorage.removeItem('pinFailedAttempts');
    localStorage.removeItem('pinLockData');
  };

  const handleNumberClick = (num) => {
    const lockSeconds = getLockStatus();
    if (lockSeconds) return;

    if (!isSetupMode) {
      if (pin.length < PIN_LENGTH) {
        setPin(prev => prev + num);
        setError('');
      }
    } else {
      if (!confirmPin) {
        if (pin.length < PIN_LENGTH) {
          setPin(prev => prev + num);
          setError('');
        }
      } else {
        if (confirmPin.length < PIN_LENGTH) {
          setConfirmPin(prev => prev + num);
          setError('');
        }
      }
    }
  };

  const handleBackspace = () => {
    if (!isSetupMode) {
      setPin(prev => prev.slice(0, -1));
    } else {
      if (!confirmPin && pin.length > 0) {
        setPin(prev => prev.slice(0, -1));
      } else if (confirmPin) {
        setConfirmPin(prev => prev.slice(0, -1));
      }
    }
  };

  const handleVerifyPin = async () => {
    const lockSeconds = getLockStatus();
    if (lockSeconds) {
      setError(`Account locked. Try again in ${lockSeconds}s`);
      return;
    }

    if (pin.length !== PIN_LENGTH) {
      setError('PIN must be 6 digits');
      return;
    }

    setLoading(true);

    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const storedPin = localStorage.getItem('appLaunchPin');
    
    if (storedPin === pin) {
      resetFailedAttempts();
      setLoading(false);
      onPinVerified();
    } else {
      const attempts = incrementFailedAttempts();
      setError(`Incorrect PIN. ${MAX_ATTEMPTS - attempts} attempts remaining`);
      if (attempts >= MAX_ATTEMPTS) {
        setError('Account locked for 5 minutes (too many failed attempts)');
      }
      setPin('');
      setLoading(false);
    }
  };

  const handleSetupPin = async () => {
    if (pin.length !== PIN_LENGTH) {
      setError('PIN must be 6 digits');
      return;
    }

    if (!confirmPin) {
      setError('Please confirm your PIN');
      return;
    }

    if (pin !== confirmPin) {
      setError('PINs do not match');
      setPin('');
      setConfirmPin('');
      return;
    }

    setLoading(true);
    
    // Store PIN in localStorage
    localStorage.setItem('appLaunchPin', pin);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    setLoading(false);

    if (onSetupPin) {
      onSetupPin();
    }
  };

  const lockSeconds = getLockStatus();
  const isLocked = lockSeconds !== null;

  const handleSubmit = () => {
    if (isSetupMode) {
      handleSetupPin();
    } else {
      handleVerifyPin();
    }
  };

  const currentPin = isSetupMode && confirmPin ? confirmPin : pin;

  return (
    <div className="h-full bg-white flex flex-col p-6">
      {/* Header */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="mb-8 p-4 rounded-full bg-emerald-50">
          <Lock className="w-8 h-8 text-emerald-600" />
        </div>

        <h1 className="text-2xl font-black text-gray-900 mb-2">
          {isSetupMode 
            ? forceResetMode ? 'Reset PIN' : 'Set Launch PIN'
            : 'Verify PIN'
          }
        </h1>
        <p className="text-gray-500 text-center text-sm">
          {isSetupMode 
            ? confirmPin 
              ? 'Confirm your new PIN to continue'
              : forceResetMode ? 'Create a new 6-digit PIN' : 'Create a 6-digit PIN for app access'
            : 'Enter your 6-digit PIN'}
        </p>

        {/* PIN Display */}
        <div className="mt-12 mb-8 flex gap-2 justify-center">
          {[...Array(PIN_LENGTH)].map((_, i) => (
            <div
              key={i}
              className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-black text-xl transition-all ${
                i < currentPin.length
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                  : 'border-gray-200 bg-white text-gray-900'
              }`}
            >
              {i < currentPin.length ? '•' : ''}
            </div>
          ))}
        </div>

        {/* Stage Indicator (Setup Mode) */}
        {isSetupMode && (
          <div className="mb-6 text-center">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {!confirmPin ? 'Step 1 of 2' : 'Step 2 of 2'}
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 w-full">
            <p className="text-xs font-bold text-red-600 text-center">{error}</p>
          </div>
        )}

        {/* Locked State */}
        {isLocked && (
          <div className="mb-6 p-4 rounded-lg bg-amber-50 border border-amber-200 w-full">
            <p className="text-sm font-bold text-amber-600 text-center">
              Too many attempts. Try again in {lockSeconds}s
            </p>
          </div>
        )}
      </div>

      {/* Numpad */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleNumberClick(num.toString())}
            disabled={isLocked || loading || (isSetupMode && confirmPin && confirmPin.length === PIN_LENGTH)}
            className="py-4 rounded-2xl font-bold text-lg bg-gray-100 text-gray-900 hover:bg-gray-200 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {num}
          </button>
        ))}

        {/* 0 button spans 2 columns */}
        <button
          onClick={() => handleNumberClick('0')}
          disabled={isLocked || loading || (isSetupMode && confirmPin && confirmPin.length === PIN_LENGTH)}
          className="col-span-2 py-4 rounded-2xl font-bold text-lg bg-gray-100 text-gray-900 hover:bg-gray-200 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          0
        </button>

        {/* Backspace button */}
        <button
          onClick={handleBackspace}
          disabled={isLocked || loading || currentPin.length === 0}
          className="py-4 rounded-2xl font-bold text-lg bg-gray-100 text-gray-900 hover:bg-gray-200 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-5 h-5 mx-auto" />
        </button>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={
          isLocked ||
          loading ||
          currentPin.length !== PIN_LENGTH ||
          (isSetupMode && confirmPin && pin !== confirmPin)
        }
        className="w-full py-4 rounded-2xl font-bold text-white bg-emerald-600 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Verifying...' : isSetupMode ? (confirmPin ? 'Confirm PIN' : 'Next') : 'Unlock'}
      </button>

      {/* Forgot PIN Button */}
      {!isSetupMode && localStorage.getItem('appLaunchPin') && (
        <button
          onClick={onForgotPin}
          className="mt-4 text-center text-sm text-gray-500 font-bold hover:text-gray-700 transition-all"
        >
          Forgot PIN?
        </button>
      )}

      {/* Setup/Verify Toggle */}
      {!isSetupMode && !localStorage.getItem('appLaunchPin') && (
        <button
          onClick={() => {
            setIsSetupMode(true);
            setPin('');
            setConfirmPin('');
            setError('');
          }}
          className="mt-4 text-center text-sm text-emerald-600 font-bold"
        >
          Create a PIN Instead
        </button>
      )}

      {isSetupMode && (
        <button
          onClick={() => {
            setIsSetupMode(false);
            setPin('');
            setConfirmPin('');
            setError('');
          }}
          className="mt-4 text-center text-sm text-gray-500 font-bold"
        >
          Cancel Setup
        </button>
      )}
    </div>
  );
}
