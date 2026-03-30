import React, { useState } from 'react';
import { Lock, Trash2 } from 'lucide-react';

export default function AppLaunchPinScreen({ onPinVerified, onSetupPin, onForgotPin, forceResetMode = false }) {
  // Get current user for user-specific storage
  const getCurrentUser = () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      return null;
    }
  };

  const getUserKey = (key) => {
    const user = getCurrentUser();
    if (!user?.email) return key;
    return `${key}_${user.email}`;
  };

  const getStoredAppPin = () => {
    const appLaunchPin = localStorage.getItem(getUserKey('appLaunchPin'));
    const appPin = localStorage.getItem(getUserKey('appPin'));
    return appLaunchPin || appPin || null;
  };

  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isSetupMode, setIsSetupMode] = useState(forceResetMode || !getStoredAppPin());
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);

  const PIN_LENGTH = 6;
  const MAX_ATTEMPTS = 5;
  const LOCK_TIME = 5 * 60 * 1000; // 5 minutes

  // Check if locked due to attempts
  const getLockStatus = () => {
    const lockData = localStorage.getItem(getUserKey('pinLockData'));
    if (!lockData) return null;
    
    const { timestamp, locked } = JSON.parse(lockData);
    const now = Date.now();
    
    if (locked && now < timestamp + LOCK_TIME) {
      return Math.ceil((timestamp + LOCK_TIME - now) / 1000);
    }
    
    if (now >= timestamp + LOCK_TIME) {
      localStorage.removeItem(getUserKey('pinLockData'));
      return null;
    }
    
    return null;
  };

  const incrementFailedAttempts = () => {
    let attempts = parseInt(localStorage.getItem(getUserKey('pinFailedAttempts')) || '0');
    attempts += 1;
    localStorage.setItem(getUserKey('pinFailedAttempts'), attempts.toString());
    
    if (attempts >= MAX_ATTEMPTS) {
      localStorage.setItem(getUserKey('pinLockData'), JSON.stringify({
        timestamp: Date.now(),
        locked: true
      }));
    }
    
    return attempts;
  };

  const resetFailedAttempts = () => {
    localStorage.removeItem(getUserKey('pinFailedAttempts'));
    localStorage.removeItem(getUserKey('pinLockData'));
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

    const storedPin = getStoredAppPin();
    
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
    
    // Store PIN in localStorage under both legacy and current app PIN keys.
    try {
      localStorage.setItem(getUserKey('appLaunchPin'), pin);
      localStorage.setItem(getUserKey('appPin'), pin);
    } catch (e) {
      console.error('Unable to save app PIN', e);
    }
    
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
    <div className="h-full flex flex-col bg-white animate-in fade-in duration-300">
      <div className="p-6 flex justify-center">
        <div className="p-4 rounded-3xl bg-emerald-50">
          <Lock className="w-8 h-8 text-emerald-600" />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center px-8 pb-6">
        <h1 className="text-2xl font-black text-gray-900 mb-2 text-center">
          {isSetupMode 
            ? forceResetMode ? 'Reset PIN' : 'Set Launch PIN'
            : 'Enter PIN'
          }
        </h1>
        <p className="text-gray-500 text-center text-sm max-w-xs mb-10">
          {isSetupMode 
            ? confirmPin 
              ? 'Confirm your new PIN to continue'
              : forceResetMode ? 'Create a new 6-digit PIN' : 'Create a 6-digit PIN for app access'
            : 'Enter your 6-digit PIN to unlock the app.'}
        </p>

        <div className="flex gap-4 mb-6">
          {[...Array(PIN_LENGTH)].map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-all border-2 ${
                i < currentPin.length ? 'border-emerald-500 bg-emerald-500' : 'border-gray-200 bg-white'
              } ${error ? 'border-red-500 bg-red-500' : ''}`}
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mb-4 animate-shake text-center">
            {error}
          </p>
        )}

        {isLocked && (
          <div className="mb-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 w-full max-w-[320px]">
            <p className="text-sm font-semibold text-amber-700 text-center">
              Too many attempts. Try again in {lockSeconds}s
            </p>
          </div>
        )}

        <div className="w-full max-w-[320px] mt-auto mb-6">
          <div className="grid grid-cols-3 gap-5 mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleNumberClick(num.toString())}
                disabled={isLocked || loading || (isSetupMode && confirmPin && confirmPin.length === PIN_LENGTH)}
                className="h-16 rounded-2xl bg-gray-100 text-gray-900 text-2xl font-black active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {num}
              </button>
            ))}

            <div className="h-16 rounded-2xl bg-transparent"></div>

            <button
              type="button"
              onClick={() => handleNumberClick('0')}
              disabled={isLocked || loading || (isSetupMode && confirmPin && confirmPin.length === PIN_LENGTH)}
              className="h-16 rounded-2xl bg-gray-100 text-gray-900 text-2xl font-black active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              0
            </button>

            <button
              type="button"
              onClick={handleBackspace}
              disabled={isLocked || loading || currentPin.length === 0}
              className="h-16 rounded-2xl bg-gray-100 text-gray-900 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              isLocked ||
              loading ||
              currentPin.length !== PIN_LENGTH ||
              (isSetupMode && confirmPin && pin !== confirmPin)
            }
            className="w-full py-4 rounded-2xl text-white bg-emerald-600 shadow-lg shadow-emerald-600/20 font-black active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : isSetupMode ? (confirmPin ? 'Confirm PIN' : 'Next') : 'Unlock'}
          </button>

          {!isSetupMode && localStorage.getItem(getUserKey('appLaunchPin')) && (
            <button
              type="button"
              onClick={onForgotPin}
              className="mt-4 w-full text-sm font-black text-[#00875A] uppercase tracking-[0.18em]"
            >
              Forgot PIN?
            </button>
          )}

          {!isSetupMode && !localStorage.getItem(getUserKey('appLaunchPin')) && (
            <button
              type="button"
              onClick={() => {
                setIsSetupMode(true);
                setPin('');
                setConfirmPin('');
                setError('');
              }}
              className="mt-4 w-full text-sm font-black text-gray-500"
            >
              Create a PIN Instead
            </button>
          )}

          {isSetupMode && (
            <button
              type="button"
              onClick={() => {
                setIsSetupMode(false);
                setPin('');
                setConfirmPin('');
                setError('');
              }}
              className="mt-4 w-full text-sm font-black text-gray-500"
            >
              Cancel Setup
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
