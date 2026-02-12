import React, { useState } from 'react';
import { ChevronLeft, CreditCard, Shield } from 'lucide-react';

const SaveCardDetailsScreen = ({ card, onConfirm, onBack, darkMode = false }) => {
  const [cardName, setCardName] = useState('');
  const [setAsDefault, setSetAsDefault] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = () => {
    if (!cardName.trim()) return;
    setIsSaving(true);
    setTimeout(() => {
      onConfirm({
        ...card,
        nickname: cardName,
        isDefault: setAsDefault,
        savedDate: new Date().toISOString(),
      });
    }, 1000);
  };

  const handleDelete = () => {
    onBack && onBack('delete');
  };

  const bgClass = darkMode ? 'bg-gray-900' : 'bg-white';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-500';
  const inputBg = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-gray-50';
  const buttonBg = darkMode ? 'bg-[#00FF9D] text-gray-900' : 'bg-[#00875A] text-white';
  const toggleBg = darkMode ? 'bg-gray-700' : 'bg-gray-200';

  return (
    <div className={`min-h-screen flex flex-col ${bgClass} animate-in slide-in-from-right`}>
      {/* Header */}
      <div className={`sticky top-0 z-20 p-6 flex items-center gap-3 border-b ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100'}`}>
        <button onClick={onBack} className={`p-2 rounded-full ${cardBg}`}>
          <ChevronLeft className={textPrimary} size={24} />
        </button>
        <h1 className={`text-xl font-black ${textPrimary}`}>Save Card Details</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Card Preview */}
        <div className="w-full aspect-[1.6/1] bg-gradient-to-br from-gray-800 to-gray-950 rounded-[2rem] p-8 text-white relative overflow-hidden mb-10 shadow-2xl">
          <div className="flex justify-between items-start">
            <div className="w-12 h-8 bg-white/20 rounded-md" />
            <CreditCard className="opacity-40" size={28} />
          </div>
          <div className="mt-12">
            <p className="text-xl tracking-[0.3em] font-mono opacity-50">
              **** **** **** {card.cardNumber.slice(-4)}
            </p>
          </div>
          <div className="absolute bottom-8 left-8">
            <p className="text-[8px] uppercase tracking-widest opacity-40 mb-1">Card Holder</p>
            <p className="text-sm font-bold uppercase tracking-widest">Your Name</p>
          </div>
          <div className="absolute top-8 right-8 flex items-center gap-1">
            <Shield size={16} className="text-emerald-400" />
            <span className="text-xs font-bold">Secure</span>
          </div>
        </div>

        {/* Card Nickname */}
        <div className="mb-8">
          <label className={`text-[10px] font-black uppercase tracking-widest ml-1 mb-3 block ${textSecondary}`}>
            Card Nickname (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g., My Visa, Personal Card"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            className={`w-full p-5 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-emerald-500 ${inputBg} ${textPrimary}`}
          />
          <p className={`text-xs mt-2 ${textSecondary}`}>Give your card a friendly name for easy identification</p>
        </div>

        {/* Set as Default */}
        <div className={`flex items-center justify-between p-5 rounded-2xl mb-8 ${cardBg}`}>
          <div>
            <p className={`font-bold ${textPrimary}`}>Set as Default</p>
            <p className={`text-xs ${textSecondary}`}>Use this card for future transactions</p>
          </div>
          <button
            onClick={() => setSetAsDefault(!setAsDefault)}
            className={`relative w-12 h-6 rounded-full transition-all ${setAsDefault ? (darkMode ? 'bg-[#00FF9D]' : 'bg-emerald-600') : toggleBg}`}
          >
            <div
              className={`absolute w-5 h-5 rounded-full bg-white transition-all ${
                setAsDefault ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Security Info */}
        <div className={`flex items-start gap-3 p-4 rounded-xl ${cardBg} mb-8`}>
          <Shield size={16} className={`${darkMode ? 'text-[#00FF9D]' : 'text-emerald-600'} flex-shrink-0 mt-1`} />
          <div>
            <p className={`text-xs font-bold ${textPrimary}`}>Your card details are encrypted</p>
            <p className={`text-[10px] ${textSecondary} mt-1`}>We use industry-standard encryption to protect your payment information</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t" style={{ borderColor: darkMode ? '#374151' : '#e5e7eb' }}>
        {showDeleteConfirm ? (
          <div className="space-y-3">
            <p className={`text-sm font-bold text-center ${textPrimary}`}>Delete this card?</p>
            <button
              onClick={handleDelete}
              className="w-full py-5 rounded-2xl font-black text-white bg-red-600 hover:bg-red-700 transition-all active:scale-95"
            >
              Confirm Delete
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className={`w-full py-5 rounded-2xl font-black transition-all ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={handleSave}
              disabled={!cardName.trim() || isSaving}
              className={`w-full py-5 rounded-2xl font-black transition-all active:scale-95 ${
                cardName.trim()
                  ? `${buttonBg}`
                  : darkMode
                    ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSaving ? 'Saving Card...' : 'Save Card'}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full py-5 rounded-2xl font-black text-red-600 hover:bg-red-50 transitioning-all border border-red-200"
            >
              Delete Card
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SaveCardDetailsScreen;
