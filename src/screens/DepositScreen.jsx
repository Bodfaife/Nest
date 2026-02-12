import React, { useState, useEffect } from "react";
import { ChevronLeft, Banknote, Lock } from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";

export default function DepositScreen({
  onBack,       // dynamic back function from App.jsx
  onConfirm,
  darkMode,
  openScreen,
  mode = "start", // "start" for first-time savings, "topup" for adding to existing savings
  bankCards = [],
  user = {},
  savingsPlanData = null, // Contains duration, amount (amountPerInterval), frequency, goal, etc.
}) {
  const { formatAmount } = useCurrency();

  const [amount, setAmount] = useState("");
  // Payment source logic
  const hasBankCard = bankCards && bankCards.length > 0;
  const [sourceAccount, setSourceAccount] = useState("Bank Transfer");

  // Track this screen in the savings flow (for resuming if app closes)
  useEffect(() => {
    if (mode === "start") {
      localStorage.setItem("savingsFlowScreen", "Deposit");
    }
  }, [mode]);

  const numericAmount = Number(amount);
  const isValidAmount = numericAmount > 0 && !Number.isNaN(numericAmount);


  const handleConfirm = () => {
    if (!isValidAmount) return;
    if (mode === "start" && !savingsPlanData?.duration) return; // Duration required for initial savings

    const startDate = new Date();
    let withdrawalDate = startDate;

    // Calculate withdrawal date based on duration (only for initial savings)
    if (mode === "start" && savingsPlanData?.duration) {
      withdrawalDate = new Date(startDate);
      withdrawalDate.setMonth(withdrawalDate.getMonth() + parseInt(savingsPlanData.duration));
    }

    // Determine payment method and selected card/account
    let paymentMethod = 'bank'; // default to bank transfer
    let selectedCard = null;
    let selectedAccount = null;

    if (sourceAccount.startsWith('card-')) {
      paymentMethod = 'card';
      const cardIdx = parseInt(sourceAccount.split('-')[1]);
      selectedCard = bankCards[cardIdx];
    }

    onConfirm({
      amount: numericAmount,
      startDate: startDate.toISOString(),
      withdrawalDate: withdrawalDate.toISOString(),
      durationMonths: mode === "start" ? parseInt(savingsPlanData?.duration || 0) : undefined,
      source: sourceAccount,
      amountPerInterval: mode === "start" ? (savingsPlanData?.amount || numericAmount) : undefined,
      frequency: mode === "start" ? (savingsPlanData?.frequency || null) : undefined,
      paymentMethod,
      selectedCard,
      selectedAccount,
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
      <div className={`flex items-center gap-3 px-6 py-4 sticky top-0 z-20 border-b ${headerBgClass}`}>
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

        {/* Payment Source Dropdown */}
        <div className="space-y-2">
          <label className={`text-sm font-bold ml-1 ${textGray}`}>Payment Source</label>
          <select
            value={sourceAccount}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "add-card") {
                openScreen && openScreen("AddPaymentSource");
                return;
              }
              setSourceAccount(val);
            }}
            className={`w-full p-4 rounded-2xl outline-none font-medium ${selectClass}`}
          >
            <option value="Bank Transfer">Bank Transfer</option>
            {bankCards && bankCards.length > 0 && bankCards.map((card, idx) => (
              <option key={idx} value={`card-${idx}`}>
                {card.cardNumber ? `**** **** **** ${card.cardNumber.slice(-4)}` : `Saved Card ${idx + 1}`}
              </option>
            ))}
            <option value="add-card"> Add Bank Card</option>
          </select>
        </div>
      </div>

      {/* Add Bank (only show if user has cards) */}
      {hasBankCard && (
        <p className={`text-center text-sm mb-4 ${textGray}`}>
          Don&apos;t see your card?{" "}
          <button
            className="text-[#00875A] font-black cursor-pointer"
            onClick={() => openScreen && openScreen("AddPaymentSource")}
          >
            Add New Card
          </button>
        </p>
      )}

      {/* Show account number if Bank Transfer is selected */}
      {sourceAccount === "Bank Transfer" && user?.accountNumber && (
        <div className="my-4 p-4 rounded-xl border-emerald-200 text-emerald-800 text-center">
          <div className="font-bold text-[#00875A] text-l">Your Account Number</div>
          <div className="text-2xl font-bold text-[#00875A] tracking-widest">{user.accountNumber}</div>
        </div>
      )}

      {/* Confirm */}
      <div className="pb-10 flex justify-center">
        <button
          onClick={handleConfirm}
          disabled={!isValidAmount || (mode === "start" && !savingsPlanData?.duration)}
          className={`w-[90%] py-4 rounded-2xl font-bold text-white shadow-xl transition-all ${
            (isValidAmount && (mode === "topup" || savingsPlanData?.duration)) ? "bg-[#00875A] active:scale-95" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {mode === "start" ? "Lock Savings" : "Top Up"}
        </button>
      </div>
    </div>
  );
}
