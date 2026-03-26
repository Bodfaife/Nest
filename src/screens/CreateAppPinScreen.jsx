import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';

export default function CreateAppPinScreen({ onBack, onPinCreated, darkMode = false }) {
  const pinLength = 6;
  const [stage, setStage] = useState('create'); // create | confirm
  const [current, setCurrent] = useState('');
  const [tempPin, setTempPin] = useState('');
  const [error, setError] = useState(false);

  const onlyDigits = (s) => s.replace(/\D/g, '').slice(0, pinLength);

  const handleKeyPress = (val) => {
    if (current.length < pinLength) {
      setCurrent(prev => prev + val);
      setError(false);
    }
  };

  const handleDelete = () => {
    setCurrent(prev => prev.slice(0, -1));
    setError(false);
  };

  useEffect(() => {
    if (current.length === pinLength) {
      const timer = setTimeout(() => {
        if (stage === 'create') {
          setTempPin(current);
          setCurrent('');
          setStage('confirm');
        } else if (stage === 'confirm') {
          if (current === tempPin) {
            onPinCreated(current);
          } else {
            setError(true);
            setCurrent('');
            setTempPin('');
            setStage('create');
          }
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [current, stage, tempPin, onPinCreated]);

  const bgClass = darkMode ? 'bg-gray-900' : 'bg-white';
  const textPrimary = "text-gray-900";
  const pinFilled = darkMode ? 'bg-[#00FF9D] border-[#00FF9D]' : 'bg-[#00875A] border-[#00875A]';
  const pinEmpty = darkMode ? 'border-gray-600' : 'border-gray-200';

  return (
    <div className={`h-full flex flex-col animate-in fade-in duration-300 ${bgClass}`}>
      <div className="p-6 flex items-center gap-3">
        <button
          onClick={onBack}
          className={`p-2 rounded-full active:scale-90 transition-all ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
        >
          <ChevronLeft className={`w-6 h-6 ${"text-gray-900"}`} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center px-8">
        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-8 ${darkMode ? 'bg-gray-800' : 'bg-emerald-50'}`}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 17v-4"/><rect x="3" y="3" width="18" height="14" rx="2"/></svg>
        </div>

        <h1 className={`text-2xl font-black mb-2 text-center ${textPrimary}`}>{stage === 'create' ? 'Create App PIN' : 'Confirm PIN'}</h1>
        <p className={`font-bold text-center text-sm mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
          {stage === 'create' ? 'Enter a 6-digit PIN to secure your app.' : 'Re-enter the PIN to confirm.'}
        </p>

        <div className={`flex gap-4 mb-4 ${error ? 'animate-shake' : ''}`}>
          {[...Array(pinLength)].map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-all duration-200 border-2 ${
                current.length > i ? pinFilled : pinEmpty
              } ${error ? 'border-red-500 bg-red-500' : ''} ${current.length > i && !error ? 'scale-125' : ''}`}
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-[10px] font-black uppercase tracking-widest animate-bounce mb-4">
            PINs did not match. Try again.
          </p>
        )}

        <div className="mt-auto w-full max-w-[300px] mb-12">
          <div className="grid grid-cols-3 gap-y-6 gap-x-12">
            {[1,2,3,4,5,6,7,8,9].map((num) => (
              <button
                key={num}
                onClick={() => handleKeyPress(num.toString())}
                className={`h-16 flex items-center justify-center text-3xl font-black active:scale-75 transition-all ${textPrimary}`}
              >
                {num}
              </button>
            ))}
            <div></div>
            <button
              onClick={() => handleKeyPress('0')}
              className={`h-16 flex items-center justify-center text-3xl font-black active:scale-75 transition-all ${textPrimary}`}
            >
              0
            </button>
            <button
              onClick={handleDelete}
              className={`h-16 flex items-center justify-center active:scale-75 transition-all ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 4H4l1.5 16.5a2 2 0 002 1.5h9a2 2 0 002-1.5L20 4z"/>
                <path d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}