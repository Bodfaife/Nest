import React, { useState } from "react";
import { ChevronLeft, CreditCard, Lock } from "lucide-react";

const AddPaymentSourceScreen = ({ user, onBack, onSave, darkMode }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState(user?.name || "");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 16);
    setCardNumber(value);
  };

  const handleExpiryChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    // Format as MM/YY
    if (value.length <= 2) {
      setExpiry(value);
    } else {
      setExpiry(value.slice(0, 2) + "/" + value.slice(2));
    }
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 3);
    setCvv(value);
  };

  return (
    <div
      className={`h-full flex flex-col animate-in slide-in-from-right duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Header */}
      <div className="p-6 flex items-center gap-3">
        <button
          onClick={onBack}
          className={`p-2 rounded-full ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}
        >
          <ChevronLeft className={"text-gray-900"} />
        </button>
        <h1 className="text-xl font-black">{`Link New Card`}</h1>
      </div>

      {/* Card Preview */}
      <div className="p-8 flex-1">
        <div className="mx-auto w-full max-w-sm">
          <div className="relative w-full min-h-[240px] aspect-[1.58/1] rounded-[28px] shadow-2xl overflow-hidden mb-10">
            <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-emerald-500 via-slate-800 to-slate-900 p-5 text-white flex flex-col">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.16),_transparent_32%)]" />
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[12px] uppercase tracking-[0.3em] text-slate-200">Nest Bank</p>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200">Debit</p>
                </div>
                <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/90">
                  {cardNumber.startsWith('4') ? 'Visa' : cardNumber.startsWith('5') ? 'Mastercard' : cardNumber.startsWith('6304') ? 'Verve' : 'Nest'}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <div className="h-12 w-14 rounded-2xl border border-white/20 bg-white/5" />
              </div>

              <div className="mt-3">
                <p className="text-[14px] font-semibold tracking-[0.22em] text-white">
                  {cardNumber ? cardNumber.replace(/(\d{4})(?!$)/g, "$1 ") : "0000 0000 0000 0000"}
                </p>
              </div>

              <div className="mt-auto flex items-end justify-between gap-4 text-sm text-slate-300">
                <div className="min-w-0">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-slate-400">Card holder</p>
                  <p className="mt-2 text-[15px] font-semibold uppercase tracking-[0.12em] text-white truncate">
                    {cardHolder || user?.name || 'CARD HOLDER'}
                  </p>
                </div>
                <div className="w-20 text-right flex-shrink-0">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-slate-400">Expires</p>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-[0.12em] text-white">
                    {expiry || 'MM/YY'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

          {/* Card Inputs */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label
                className={`text-[10px] font-black uppercase tracking-widest ml-1 ${
                  darkMode ? "text-gray-400" : "text-gray-400"
                }`}
              >
                Card Number
              </label>
              <input
                type="text"
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChange={handleCardNumberChange}
                maxLength="16"
                className={`w-full p-5 rounded-2xl font-bold outline-none focus:border-[#00875A] ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    : "bg-gray-50 border-gray-100 text-gray-900 placeholder-gray-400"
                }`}
              />
            </div>
            <div className="space-y-2">
              <label
                className={`text-[10px] font-black uppercase tracking-widest ml-1 ${
                  darkMode ? "text-gray-400" : "text-gray-400"
                }`}
              >
                Card Holder Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                className={`w-full p-5 rounded-2xl font-bold outline-none focus:border-[#00875A] ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    : "bg-gray-50 border-gray-100 text-gray-900 placeholder-gray-400"
                }`}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  className={`text-[10px] font-black uppercase tracking-widest ml-1 ${
                    darkMode ? "text-gray-400" : "text-gray-400"
                  }`}
                >
                  Expiry
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={handleExpiryChange}
                  maxLength="5"
                  className={`w-full p-5 rounded-2xl font-bold outline-none focus:border-[#00875A] ${
                    darkMode
                      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-100 text-gray-900 placeholder-gray-400"
                  }`}
                />
              </div>
              <div className="space-y-2">
                <label
                  className={`text-[10px] font-black uppercase tracking-widest ml-1 ${
                    darkMode ? "text-gray-400" : "text-gray-400"
                  }`}
                >
                  CVV
                </label>
                <input
                  type="password"
                  placeholder="***"
                  value={cvv}
                  onChange={handleCvvChange}
                  maxLength="3"
                  className={`w-full p-5 rounded-2xl font-bold outline-none focus:border-[#00875A] ${
                    darkMode
                      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-100 text-gray-900 placeholder-gray-400"
                  }`}
                />
            </div>
          </div>
        </div>
      </div>

      {/* Footer & Save */}
      <div className="p-6">
        <div className="flex items-center justify-center gap-2 mb-6 text-gray-300">
          <Lock size={14} />
          <p className="text-[10px] font-black uppercase tracking-widest">
            End-to-End Encrypted
          </p>
        </div>
        <button
          onClick={() => {
            onSave({ cardNumber, expiry, cvv, cardHolder, cardNetwork: cardNumber.startsWith('4') ? 'Visa' : cardNumber.startsWith('5') ? 'Mastercard' : cardNumber.startsWith('6304') ? 'Verve' : 'Nest' });
          }}
          className="w-full py-5 bg-[#00875A] text-white rounded-[2rem] font-black shadow-emerald-100"
        >
          Securely Link Card
        </button>
      </div>
    </div>
  );
};

export default AddPaymentSourceScreen;
