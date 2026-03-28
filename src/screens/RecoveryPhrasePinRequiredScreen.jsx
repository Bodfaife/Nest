import React from 'react';
import { ChevronLeft, Lock, Shield } from 'lucide-react';

export default function RecoveryPhrasePinRequiredScreen({ onBack, onCreateAppPin }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-100 transition"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-xl font-black text-gray-900">Secure Recovery Access</h1>
      </div>

      <div className="flex-1 px-6 py-8 flex flex-col items-center justify-center text-center">
        <div className="mb-6 rounded-3xl bg-white p-8 shadow-sm border border-gray-100">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <Lock className="w-7 h-7 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Create App PIN to view recovery phrase</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            You must create an App PIN before viewing your recovery phrase. This protects your backup words and prevents unauthorized access.
          </p>
        </div>

        <button
          onClick={onCreateAppPin}
          className="mt-4 w-full max-w-sm rounded-2xl bg-emerald-600 py-4 text-white font-bold hover:bg-emerald-700 transition-all"
        >
          Create App PIN
        </button>
      </div>
    </div>
  );
}
