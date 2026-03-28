import React, { useState } from 'react';
import { ChevronLeft, Plus, Trash2, CreditCard } from 'lucide-react';

export default function SavedCardsScreen({
  darkMode = false,
  onBack,
  cards = [],
  onAddCard,
  onDeleteCard,
  onSetDefaultCard
}) {
  const [deletingId, setDeletingId] = useState(null);

  const bgClass = 'bg-white';
  const textPrimary = "text-gray-900";
  const textSecondary = "text-gray-500";
  const cardBg = 'bg-gray-50';
  const buttonBg = 'bg-emerald-600 hover:bg-emerald-700';
  const borderColor = 'border-gray-100';

  return (
    <div className={`min-h-screen flex flex-col ${bgClass} animate-in slide-in-from-right`}>
      {/* Header */}
      <div className={`sticky top-0 z-20 border-b ${borderColor} p-6 flex items-center justify-between ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-2xl font-black">Saved Cards</h1>
        </div>
        <button
          onClick={onAddCard}
          className={`p-3 rounded-full text-white ${buttonBg} transition-all`}
          title="Add new card"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 pb-16 overflow-auto p-6">
        {cards && cards.length > 0 ? (
          <div className="max-w-2xl mx-auto space-y-4">
            {cards.map((card, idx) => (
              <div key={idx} className="space-y-4">
                <div className="mx-auto w-full max-w-sm">
                  <div className="relative w-full min-h-[240px] aspect-[1.58/1] rounded-[28px] shadow-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-slate-800 to-slate-900" />
                    <div className="relative flex h-full flex-col p-5 text-white">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[12px] uppercase tracking-[0.3em] text-slate-200">Nest Bank</p>
                          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200">Debit</p>
                        </div>
                        <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/90">
                          {card.cardNetwork || 'Nest'}
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="h-12 w-14 rounded-2xl border border-white/20 bg-white/5" />
                      </div>

                      <div className="mt-4">
                        <p className="text-[14px] font-semibold tracking-[0.22em] text-white">
                          {card.cardNumber ? card.cardNumber.replace(/(\d{4})(?!$)/g, "$1 ") : `**** **** **** ${card.cardNumber?.slice(-4) || 'XXXX'}`}
                        </p>
                      </div>

                      <div className="mt-auto flex items-end justify-between gap-4 text-sm text-slate-300">
                        <div className="min-w-0">
                          <p className="text-[9px] uppercase tracking-[0.3em] text-slate-400">Card holder</p>
                          <p className="mt-2 text-[15px] font-semibold uppercase tracking-[0.12em] text-white truncate">
                            {card.cardHolder || card.cardholderName || 'CARD HOLDER'}
                          </p>
                        </div>
                        <div className="w-24 text-right flex-shrink-0">
                          <p className="text-[9px] uppercase tracking-[0.3em] text-slate-400">Expires</p>
                          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.12em] text-white">
                            {card.expiryDate || card.expiry || 'MM/YY'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 max-w-sm mx-auto">
                  <button
                    onClick={() => onSetDefaultCard && onSetDefaultCard(card)}
                    className="w-full py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all"
                  >
                    {card.isDefault ? 'Default Card' : 'Set as default'}
                  </button>
                  {deletingId === idx ? (
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => {
                          onDeleteCard && onDeleteCard(idx);
                          setDeletingId(null);
                        }}
                        className="py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-all"
                      >
                        Confirm Delete
                      </button>
                      <button
                        onClick={() => setDeletingId(null)}
                        className={`py-3 rounded-xl font-bold transition-all ${
                          darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeletingId(idx)}
                      className={`py-3 rounded-xl font-bold transition-all ${
                        darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      Remove Card
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${cardBg}`}>
              <CreditCard size={40} className={textSecondary} />
            </div>
            <h2 className={`text-xl font-black ${textPrimary}`}>No Saved Cards</h2>
            <p className={`text-sm ${textSecondary} max-w-sm`}>Add your first debit card to make fast and secure payments</p>
            <button
              onClick={onAddCard}
              className="mt-6 px-6 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all"
            >
              Add Card Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
