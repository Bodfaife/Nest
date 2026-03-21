import React from 'react';

export default function AccountCreatedSuccessScreen({ userName, accountNumber, onContinue, nextScreen }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      <h1 className="text-3xl text-center font-black text-emerald-900 mb-4">Account Created Successfully!</h1>
      <p className="text-center justify-center text-gray-600 mb-4">
        Welcome to Nest, {userName}! Your account has been verified and is ready to use.
      </p>
      {accountNumber && (
        <p className="text-center text-gray-600 mb-8">
          Your Nest account number is <span className="font-mono font-bold">{accountNumber}</span>
        </p>
      )}
      <button
        onClick={() => onContinue(nextScreen)}
        className="px-8 py-4 bg-[#00875A] text-white font-bold rounded-2xl shadow-lg hover:bg-[#006f48] transition"
      >
        Continue
      </button>
    </div>
  );
}