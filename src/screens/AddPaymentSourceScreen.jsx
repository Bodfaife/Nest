import React, { useState } from "react";
import { ChevronLeft, CreditCard, Lock } from "lucide-react";

const AddPaymentSourceScreen = ({ user, onBack, onSave, darkMode }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

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
          <ChevronLeft className={darkMode ? "text-white" : "text-gray-900"} />
        </button>
        <h1 className="text-xl font-black">{`Link New Card`}</h1>
      </div>

      {/* Card Preview */}
      <div className="p-8 flex-1">
        <div className="w-full aspect-[1.6/1] bg-gradient-to-br from-gray-800 to-gray-950 rounded-[2rem] p-8 text-white relative overflow-hidden mb-10 shadow-2xl">
          <div className="flex justify-between items-start">
            <div className="w-12 h-8 bg-white/20 rounded-md" />
            <CreditCard className="opacity-40" />
          </div>
          <div className="mt-12">
            <p className="text-xl tracking-[0.3em] font-mono opacity-50">
              {cardNumber ? cardNumber.replace(/\d{4}(?=.)/g, "**** ") : "**** **** **** ****"}
            </p>
          </div>
          <div className="absolute bottom-8 left-8">
            <p className="text-[8px] uppercase tracking-widest opacity-40 mb-1">
              Card Holder
            </p>
            <p className="text-sm font-bold uppercase tracking-widest">
              {user?.name || "User"}
            </p>
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
              onChange={(e) => setCardNumber(e.target.value)}
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
                onChange={(e) => setExpiry(e.target.value)}
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
                onChange={(e) => setCvv(e.target.value)}
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
          onClick={() => onSave({ cardNumber, expiry, cvv })}
          className="w-full py-5 bg-[#00875A] text-white rounded-[2rem] font-black shadow-emerald-100"
        >
          Securely Link Card
        </button>
      </div>
    </div>
  );
};

export default AddPaymentSourceScreen;
