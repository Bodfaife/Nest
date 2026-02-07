import React, { useState } from "react";
import { ChevronLeft, Banknote, Lock } from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";

export default function DepositScreen({
  onBack,       // dynamic back function from App.jsx
  onConfirm,
  darkMode,
  openScreen,
  mode = "start", // "start" for first-time savings, "topup" for adding to existing savings
}) {
  const { formatAmount } = useCurrency();

  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState(3); // only for first-time savings
  const [sourceAccount, setSourceAccount] = useState("Access Bank - **** 1234");

  const numericAmount = Number(amount);
  const isValidAmount = numericAmount > 0 && !Number.isNaN(numericAmount);

  const calculateWithdrawalDate = (months) => {
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    return date;
  };

  const handleConfirm = () => {
    if (!isValidAmount) return;

    const startDate = new Date();
    const withdrawalDate = mode === "start" ? calculateWithdrawalDate(duration) : null;

    onConfirm({
      amount: numericAmount,
      durationMonths: mode === "start" ? duration : undefined,
      startDate: startDate.toISOString(),
      withdrawalDate: withdrawalDate ? withdrawalDate.toISOString() : null,
      source: sourceAccount,
    });
  };

  // Dark mode classes
  const bgClass = darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900";
  const headerBgClass = darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-50";
  const inputClass = darkMode
    ? "bg-gray-800 text-white border border-gray-700"
    : "bg-gray-50 text-gray-900 border border-gray-100";
  const selectClass = darkMode
    ? "bg-gray-800 text-white border border-gray-700"
    : "bg-gray-50 text-gray-900 border border-gray-100";
  const textGray = darkMode ? "text-gray-300" : "text-gray-700";
  const durationInactive = darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700";

  // Decide default back behavior dynamically
  const handleBack = () => {
    if (mode === "topup") {
      // If top-up, go back to SavingsScreen
      onBack && onBack("savings");
    } else {
      // If first-time savings, go back to HomeScreen
      onBack && onBack("home");
    }
  };

  return (
    <div className={`flex flex-col animate-in slide-in-from-right duration-300 h-full ${bgClass}`}>

      {/* Header */}
      <div className={`flex items-center gap-3 px-6 py-4 sticky top-0 z-10 border-b ${headerBgClass}`}>
        <button
          onClick={handleBack}
          className={`p-2 rounded-full transition-colors ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">
          {mode === "start" ? "Lock Your Savings" : "Top Up Savings"}
        </h1>
      </div>

      {/* Content */}
      <div className="p-6 flex-1">

        {/* Lock Info */}
        {mode === "start" && (
          <div className={`p-6 rounded-[2.5rem] mb-8 border ${darkMode ? "bg-gray-800 border-gray-700 text-gray-300" : "bg-emerald-50 border-emerald-100 text-emerald-700"}`}>
            <div className="flex items-center gap-2 mb-2 font-bold">
              <Lock size={18} />
              Locked Savings
            </div>
            <p className="text-sm">
              Your money will be locked until the selected withdrawal date.
              Early withdrawal is not allowed.
            </p>
          </div>
        )}

        {/* Amount */}
        <div className="space-y-2 mb-6">
          <label className={`text-sm font-bold ml-1 ${textGray}`}>Amount to Save</label>
          <div className="relative">
            <Banknote className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${textGray}`} />
            <input
              type="number"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={formatAmount(0)}
              className={`w-full p-4 pl-12 rounded-2xl outline-none focus:border-[#00875A] text-lg font-bold ${inputClass}`}
            />
          </div>
        </div>

        {/* Duration (only for first-time savings) */}
        {mode === "start" && (
          <div className="space-y-3 mb-6">
            <label className={`text-sm font-bold ml-1 ${textGray}`}>Savings Duration</label>
            <div className="grid grid-cols-3 gap-3">
              {[3, 6, 12].map((m) => (
                <button
                  key={m}
                  onClick={() => setDuration(m)}
                  className={`py-3 rounded-xl font-bold transition ${
                    duration === m ? "bg-[#00875A] text-white" : durationInactive
                  }`}
                >
                  {m} months
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Source Account */}
        <div className="space-y-2">
          <label className={`text-sm font-bold ml-1 ${textGray}`}>Payment Source</label>
          <select
            value={sourceAccount}
            onChange={(e) => setSourceAccount(e.target.value)}
            className={`w-full p-4 rounded-2xl outline-none font-medium ${selectClass}`}
          >
            <option>Access Bank - **** 1234</option>
            <option>GTBank - **** 5678</option>
            <option value="add-new">Add New Bank Card</option>
          </select>
        </div>
      </div>

      {/* Add Bank */}
      <p className={`text-center text-sm mb-4 ${textGray}`}>
        Don&apos;t see your card?{" "}
        <button
          className="text-[#00875A] font-black cursor-pointer"
          onClick={() => openScreen && openScreen("AddPaymentSource")}
        >
          Add New Card
        </button>
      </p>

      {/* Confirm */}
      <div className="pb-10 flex justify-center">
        <button
          onClick={handleConfirm}
          disabled={!isValidAmount}
          className={`w-[90%] py-4 rounded-2xl font-bold text-white shadow-xl transition-all ${
            isValidAmount ? "bg-[#00875A] active:scale-95" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {mode === "start" ? "Lock Savings" : "Top Up"}
        </button>
      </div>
    </div>
  );
}
