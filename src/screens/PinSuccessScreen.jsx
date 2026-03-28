import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function PinSuccessScreen({ message = 'Your PIN has been saved.', onBack, buttonText = 'Back to Security' }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Success</h1>
        <p className="text-sm text-gray-600 mb-8">{message}</p>
        <button
          onClick={onBack}
          className="w-full rounded-2xl bg-emerald-600 py-3 text-white font-semibold hover:bg-emerald-700 transition-colors"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
