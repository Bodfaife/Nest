import React from 'react';
import { ChevronLeft, Lock, Key } from 'lucide-react';

export default function PinSelectionScreen({ onBack, onSelectAppPin, onSelectTransactionPin }) {
  return (
    <div className="min-h-screen flex flex-col bg-white p-6 animate-in slide-in-from-right">
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={onBack}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Manage PIN</h1>
          <p className="text-sm text-gray-500">Choose which PIN to create or update</p>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={onSelectAppPin}
          className="w-full flex items-center gap-4 p-5 rounded-3xl border border-gray-200 bg-emerald-50 hover:bg-emerald-100 transition"
        >
          <div className="w-12 h-12 rounded-3xl bg-emerald-600 text-white flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <div className="text-left">
            <p className="font-bold text-gray-900">App PIN</p>
            <p className="text-xs text-gray-500">Secure app access and authentication</p>
          </div>
        </button>

        <button
          onClick={onSelectTransactionPin}
          className="w-full flex items-center gap-4 p-5 rounded-3xl border border-gray-200 bg-slate-50 hover:bg-slate-100 transition"
        >
          <div className="w-12 h-12 rounded-3xl bg-slate-700 text-white flex items-center justify-center">
            <Key className="w-6 h-6" />
          </div>
          <div className="text-left">
            <p className="font-bold text-gray-900">Transaction PIN</p>
            <p className="text-xs text-gray-500">Authorize transactions and transfers</p>
          </div>
        </button>
      </div>
    </div>
  );
}
