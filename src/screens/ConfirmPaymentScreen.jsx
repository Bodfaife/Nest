import React from 'react';
import { ChevronLeft, ShieldCheck, ArrowRight, Wallet, CreditCard } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

const ConfirmPaymentScreen = ({
  type = "Transaction",
  amount = 0,
  source = "Nest Balance",
  destination = "Savings Vault",
  fee = 0,
  onBack,
  darkMode,
  onConfirm,
}) => {
  const { formatAmount } = useCurrency();

  const numericAmount = Number(amount) || 0;
  const numericFee = Number(fee) || 0;
  const total = numericAmount + numericFee;

  // Helper classes for dark mode
  const bgClass = darkMode ? "bg-gray-900" : "bg-white";
  const textClass = darkMode ? "text-white" : "text-gray-900";
  const textGrayClass = darkMode ? "text-gray-300" : "text-gray-400";
  const cardBgClass = darkMode ? "bg-gray-800" : "bg-gray-50";
  const cardBorderClass = darkMode ? "border-gray-700" : "border-gray-100";

  return (
    <div className={`h-full flex flex-col animate-in slide-in-from-right duration-300 ${bgClass} ${textClass}`}>
      
      {/* Header */}
      <div className={`p-6 flex items-center gap-3 border-b ${darkMode ? "border-gray-700" : "border-gray-50"}`}>
        <button
          onClick={onBack}
          className={`p-2 rounded-full transition-colors ${darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-50 hover:bg-gray-100"}`}
        >
          <ChevronLeft className={`w-6 h-6 ${textClass}`} />
        </button>
        <h1 className={`text-xl font-black ${textClass}`}>Review {type}</h1>
      </div>

      {/* Body */}
      <div className="flex-1 p-8 overflow-y-auto scrollbar-hide">
        
        {/* Total Amount */}
        <div className="text-center mb-10">
          <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${textGrayClass}`}>
            Total to Pay
          </p>
          <h2 className="text-5xl font-black tracking-tight">{formatAmount(total)}</h2>
        </div>

        {/* Source → Destination */}
        <div className={`flex items-center justify-between p-6 rounded-[2.5rem] mb-10 border ${cardBorderClass} ${cardBgClass}`}>
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${darkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-400"}`}>
              {source.toLowerCase().includes("card") ? (
                <CreditCard size={24} />
              ) : (
                <Wallet size={24} />
              )}
            </div>
            <span className="text-[10px] font-black uppercase text-center">{source}</span>
          </div>

          <div className="px-4 text-[#00875A] animate-pulse">
            <ArrowRight size={24} />
          </div>

          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="w-12 h-12 bg-[#00875A] rounded-2xl flex items-center justify-center text-white shadow-lg">
              <ShieldCheck size={24} />
            </div>
            <span className="text-[10px] font-black uppercase text-center">{destination}</span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-4">
          <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${textGrayClass}`}>
            Breakdown
          </label>

          <div className={`rounded-[2rem] overflow-hidden border ${cardBorderClass} ${cardBgClass}`}>
            <div className={`p-5 flex justify-between items-center`}>
              <span className={`text-sm font-bold ${darkMode ? "text-gray-300" : "text-gray-500"}`}>Amount</span>
              <span className="font-black">{formatAmount(numericAmount)}</span>
            </div>

            <div className={`p-5 flex justify-between items-center border-t ${cardBorderClass} ${darkMode ? "bg-gray-800/50" : "bg-gray-50/50"}`}>
              <span className={`text-sm font-bold ${darkMode ? "text-gray-300" : "text-gray-500"}`}>Transaction Fee</span>
              <span className="font-black text-emerald-600">
                {numericFee === 0 ? "FREE" : formatAmount(numericFee)}
              </span>
            </div>

            <div className={`p-5 flex justify-between items-center border-t ${cardBorderClass}`}>
              <span className={`text-sm font-bold ${textClass}`}>Final Total</span>
              <span className="text-lg font-black text-[#00875A]">{formatAmount(total)}</span>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className={`mt-8 p-5 rounded-[1.8rem] border flex gap-4 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-blue-50 border-blue-100"}`}>
          <ShieldCheck className={`shrink-0 ${darkMode ? "text-gray-300" : "text-blue-500"}`} size={20} />
          <p className={`text-[10px] font-bold leading-relaxed ${darkMode ? "text-gray-300" : "text-blue-700"}`}>
            By clicking confirm, you authorize Nest to process this transaction.
            Funds will be moved instantly.
          </p>
        </div>
      </div>

      {/* Confirm Button */}
      <div className="p-6 flex justify-center ">
        <button
          onClick={onConfirm}
          className={`w-[90%] py-4 rounded-2xl font-bold text-lg shadow-xl active:scale-[0.98] transition-all bg-emerald-600 hover:bg-emerald-700 text-white`}
        >
          Confirm & Authorize
        </button>
      </div>
    </div>
  );
};

export default ConfirmPaymentScreen;
