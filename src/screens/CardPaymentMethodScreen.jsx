import React from 'react';
import { ChevronLeft, CreditCard, Plus } from 'lucide-react';

const CardPaymentMethodScreen = ({ bankCards = [], onSelectCard, onAddCard, onBack, darkMode = false }) => {
  const bgClass = darkMode ? 'bg-gray-900' : 'bg-white';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-500';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-gray-50';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const buttonBg = darkMode ? 'bg-[#00FF9D] text-gray-900' : 'bg-[#00875A] text-white';

  return (
    <div className={`min-h-screen flex flex-col ${bgClass} animate-in slide-in-from-right`}>
      {/* Header */}
      <div className="p-6 flex items-center gap-3 border-b" style={{ borderColor: borderColor }}>
        <button onClick={onBack} className={`p-2 rounded-full ${cardBg}`}>
          <ChevronLeft className={textPrimary} size={24} />
        </button>
        <h1 className={`text-xl font-black ${textPrimary}`}>Debit Card Payment</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        <p className={`text-sm mb-6 ${textSecondary}`}>Select a card to lock your savings</p>

        {/* Existing Cards */}
        {bankCards && bankCards.length > 0 && (
          <div className="mb-6">
            <p className={`text-xs font-bold uppercase tracking-widest mb-4 ${textSecondary}`}>Your Debit Cards</p>
            <div className="space-y-4">
              {bankCards.map((card, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectCard(card)}
                  className={`w-full rounded-2xl overflow-hidden transition-all active:scale-95`}
                >
                  {/* Card Visual */}
                  <div className="w-full aspect-[1.6/1] bg-gradient-to-br from-gray-800 to-gray-950 rounded-2xl p-5 text-white relative overflow-hidden shadow-lg mb-2">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-6 bg-white/20 rounded-md" />
                      <CreditCard className="opacity-40" size={20} />
                    </div>
                    <div className="mt-8">
                      <p className="text-lg tracking-[0.2em] font-mono opacity-50">
                        **** **** {card.cardNumber?.slice(-7, -4)} {card.cardNumber?.slice(-4) || 'XXXX'}
                      </p>
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className={`p-4 rounded-xl text-left ${cardBg}`}>
                    <p className={`font-bold ${textPrimary}`}>{card.nickname || 'Linked Card'}</p>
                    <p className={`text-xs ${textSecondary}`}>Expires {card.expiry || '••/••'}</p>
                    {card.isDefault && (
                      <p className={`text-xs font-bold mt-1 ${darkMode ? 'text-[#00FF9D]' : 'text-emerald-600'}`}>
                        • Default Card
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add Card Button */}
        <button
          onClick={onAddCard}
          className={`w-full p-5 rounded-2xl border-2 flex items-center justify-center gap-2 transition-all active:scale-95 ${
            darkMode ? 'border-gray-700 text-blue-400' : 'border-blue-200 text-blue-600'
          } ${cardBg}`}
        >
          <Plus size={20} />
          <span className="font-bold">Add New Card</span>
        </button>

        <div className={`p-4 rounded-2xl mt-8 ${cardBg}`}>
          <p className={`text-xs ${textSecondary}`}>
            Your debit card information is encrypted and securely stored. Charges will only proceed upon savings maturity or your request.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardPaymentMethodScreen;
