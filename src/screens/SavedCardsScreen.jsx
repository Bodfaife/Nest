import React, { useState } from 'react';
import { ChevronLeft, Plus, Trash2, CreditCard } from 'lucide-react';

export default function SavedCardsScreen({
  darkMode = false,
  onBack,
  cards = [],
  onAddCard,
  onDeleteCard,
  onSelectCard
}) {
  const [deletingId, setDeletingId] = useState(null);

  const bgClass = darkMode ? 'bg-gray-900' : 'bg-white';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-500';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-gray-50';
  const buttonBg = darkMode ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-emerald-600 hover:bg-emerald-700';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-100';

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
              <div
                key={idx}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  darkMode ? 'border-gray-700 bg-gray-800 hover:border-emerald-600/50' : 'border-gray-100 bg-gray-50 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                      <CreditCard size={24} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className={`font-bold ${textPrimary}`}>{card.cardholderName || 'Card'}</p>
                      <p className={`text-sm ${textSecondary}`}>{card.cardNetwork || 'Debit Card'}</p>
                    </div>
                  </div>
                  {deletingId !== idx && (
                    <button
                      onClick={() => setDeletingId(idx)}
                      className={`p-2 rounded-lg transition-all ${
                        darkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-50'
                      }`}
                      title="Delete card"
                    >
                      <Trash2 size={18} className="text-red-600" />
                    </button>
                  )}
                </div>

                <div className={`p-3 rounded-xl mb-4 ${cardBg} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <p className={`text-xs font-bold uppercase ${textSecondary}`}>Card Number</p>
                  <p className="font-mono font-bold text-lg tracking-wider mt-1">
                    **** **** **** {card.cardNumber?.slice(-4) || 'XXXX'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className={`p-3 rounded-xl ${cardBg}`}>
                    <p className={`text-xs font-bold uppercase ${textSecondary}`}>Expires</p>
                    <p className="font-bold mt-1">{card.expiryDate || 'MM/YY'}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${cardBg}`}>
                    <p className={`text-xs font-bold uppercase ${textSecondary}`}>CVV</p>
                    <p className="font-bold mt-1">***</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => onSelectCard && onSelectCard(card)}
                    className="flex-1 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all"
                  >
                    Use Card
                  </button>
                  {deletingId === idx && (
                    <>
                      <button
                        onClick={() => {
                          onDeleteCard && onDeleteCard(idx);
                          setDeletingId(null);
                        }}
                        className="flex-1 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-all"
                      >
                        Confirm Delete
                      </button>
                      <button
                        onClick={() => setDeletingId(null)}
                        className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                          darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        Cancel
                      </button>
                    </>
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
