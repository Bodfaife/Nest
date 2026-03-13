import React from 'react';

export default function EmailSentScreen({ onContinue }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      <h1 className="text-3xl font-black text-emerald-900 mb-4">Check Your Email</h1>
      <p className="text-center text-gray-600 mb-8">
        We've sent a confirmation link to the address you provided. Please open the
        email and click the link to verify your account.
      </p>
      <button
        onClick={onContinue}
        className="px-8 py-4 bg-[#00875A] text-white font-bold rounded-2xl shadow-lg hover:bg-[#006f48] transition"
      >
        Continue
      </button>
    </div>
  );
}
