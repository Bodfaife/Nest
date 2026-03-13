import React from 'react';

export default function VerifyAccountScreen({ onVerify }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      <h1 className="text-3xl font-black text-emerald-900 mb-4">Verify Your Account</h1>
      <p className="text-center text-gray-600 mb-8">
        After clicking the link in your email, press the button below to finish
        verification and continue.
      </p>
      <button
        onClick={onVerify}
        className="px-8 py-4 bg-[#00875A] text-white font-bold rounded-2xl shadow-lg hover:bg-[#006f48] transition"
      >
        Verify Account
      </button>
    </div>
  );
}
