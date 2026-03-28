import React, { useState, useEffect } from 'react';

export default function EmailSentScreen({ email, initialReturn = false, onContinue }) {
  const [hasOpenedEmail, setHasOpenedEmail] = useState(false);
  const [showContinueButton, setShowContinueButton] = useState(initialReturn);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && hasOpenedEmail) {
        setShowContinueButton(true);
      }
    };

    window.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleVisibility);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
    };
  }, [hasOpenedEmail]);

  const openEmailLink = () => {
    setHasOpenedEmail(true);
    window.open('/email-confirmed.html?flow=signup-verify', '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-black text-emerald-900 mb-4">Confirm Your Registration</h1>
        <p className="text-sm text-gray-600 mb-6 leading-7">
          We sent a confirmation link to <strong>{email || 'your email'}</strong>. Open your email, click the Nest confirmation link, then return to the app.
        </p>
        <button
          onClick={openEmailLink}
          className="w-full px-8 py-4 bg-[#00875A] text-white font-bold rounded-2xl shadow-lg hover:bg-[#006f48] transition mb-4"
        >
          Open Email and Confirm
        </button>

        {showContinueButton ? (
          <button
            onClick={onContinue}
            className="w-full px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-lg hover:bg-gray-800 transition"
          >
            Continue to Nest
          </button>
        ) : (
          <p className="text-sm text-gray-500">
            When you return to the app after confirming, a continue button will appear here.
          </p>
        )}
      </div>
    </div>
  );
}
