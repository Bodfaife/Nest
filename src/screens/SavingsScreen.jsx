import React from "react";
import { Lock, Calendar, ArrowUpRight, Wallet, ChevronLeft, Banknote } from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";

export default function SavingsScreen({
  savings,
  openScreen,
  onBack,
  onViewSavingsDetails,
}) {
  const { formatAmount } = useCurrency();

  const container = "bg-gray-50 text-gray-900";
  const card = "bg-white border-gray-100";
  const secondaryText = "text-gray-500";

  const hasSavings = Boolean(savings);

  return (
    <div className={`flex flex-col min-h-screen px-5 pt-8 ${container}`}> 
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className={`p-2 rounded-xl border ${card}`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">{hasSavings && savings.goal ? savings.goal : 'Your Savings'}</h1>
      </div>

      {hasSavings ? (
        <>
          {/* Main Savings Card */}
          <div 
            onClick={onViewSavingsDetails}
            className={`rounded-3xl p-6 shadow-sm mb-6 border cursor-pointer transition-all hover:shadow-md ${card}`}> 
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="font-semibold">{savings.goal || 'Savings Plan'}</span>
              </div>
              {!savings.isMatured && (
                <div className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full border border-amber-500/10">
                  <Lock className="w-3.5 h-3.5" /> Locked
                </div>
              )}
            </div>

            {/* Additional Info */}

            <div className="mb-8">
              <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${secondaryText}`}>Total Balance</p>
              <p className="text-4xl font-black">{formatAmount(savings.total)}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t pt-6 border-gray-200">
              <div className="space-y-1">
                <p className={`text-[10px] font-bold uppercase ${secondaryText}`}>Started</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-bold">{savings.startDate ? new Date(savings.startDate).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className={`text-[10px] font-bold uppercase ${secondaryText}`}>Withdrawal</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-bold">{savings.withdrawDate ? new Date(savings.withdrawDate).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <button
              onClick={() => openScreen("Deposit", { mode: "topup" })} // Pass mode="topup"
              className="w-full flex items-center justify-center gap-2 rounded-2xl py-4 font-bold bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
            >
              <ArrowUpRight className="w-5 h-5" /> Top Up Savings
            </button>

            <button
              disabled={!savings.isMatured}
              onClick={() => openScreen("WithdrawSavings")}
              className={`w-full rounded-2xl py-4 font-bold border transition-all ${
                savings.isMatured
                  ? "border-emerald-600 text-emerald-600 bg-emerald-50"
                  : "border-gray-300 text-gray-400 opacity-50 cursor-not-allowed"
              }`}
            >
              Withdraw Savings
            </button>
          </div>

          {!savings.isMatured && (
            <p className={`text-xs text-center mt-10 px-8 font-medium leading-relaxed ${secondaryText}`}>
              You can top up anytime, but withdrawal is only available on the set date.
            </p>
          )}
        </>
      ) : (
        <>
          {/* No savings yet */}
          <div className={`rounded-3xl p-6 shadow-sm mb-6 border flex flex-col items-center justify-center text-center gap-4 ${card}`}>
            <Banknote className="w-10 h-10 text-emerald-500" />
            <p className="text-lg font-semibold">No Active Savings Yet</p>
            <p className={`text-sm ${secondaryText}`}>Start saving today and lock your funds securely.</p>
             <button
            onClick={() => openScreen("CreateSavingsPrompt")}
            className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 bg-emerald-600 text-white hover:bg-emerald-700 transition"
            >
            <ArrowUpRight size={18} />
            Start Saving
            </button>
          </div>
        </>
      )}
    </div>
  );
}
