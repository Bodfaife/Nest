import React from 'react';

export default function AccountCreatedSuccessScreen({ userName, onContinue }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      <h1 className="text-3xl text-center font-black text-emerald-900 mb-4">Account Created Successfully!</h1>
      <p className="text-center justify-center text-gray-600 mb-8">
        Welcome to Nest, {userName}! Your account has been verified and is ready to use.
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