import React, { useState } from 'react';
import { ChevronLeft, ArrowUpRight } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export default function WithdrawalScreen({
  onBack,
  onConfirm,
  availableBalance,
  darkMode,
}) {
  const { formatAmount } =
    useCurrency() || { formatAmount: (amt) => `₦${amt.toLocaleString()}` };

  const [amount, setAmount] = useState('');
  const [destinationBank, setDestinationBank] = useState('Access Bank ...1234');
  const [error, setError] = useState('');

  const numericAmount = Number(amount);

  const isAmountEmpty = !numericAmount || numericAmount <= 0;
  const isAmountTooHigh = numericAmount > availableBalance;

  const isDisabled = isAmountEmpty || isAmountTooHigh;

  const handleWithdraw = () => {
    setError('');

    if (isAmountEmpty) {
      setError('Enter a valid amount');
      return;
    }

    if (isAmountTooHigh) {
      setError('Insufficient balance');
      return;
    }

    // success path
    onConfirm({
      status: 'success',
      amount: numericAmount,
      destinationBank,
    });
  };

  return (
    <div className="flex flex-col bg-white animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 sticky top-0 bg-white z-10">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Withdraw Funds</h1>
      </div>

      {/* Main Content */}
      <div className="p-6 flex-1">
        {/* Available Balance */}
        <div className="bg-gray-50 p-6 rounded-[2.5rem] mb-8 text-center border border-gray-100">
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">
            Available to Withdraw
          </p>
          <h2 className="text-3xl font-black text-gray-900">
            {formatAmount(availableBalance)}
          </h2>
        </div>

        {/* Inputs */}
        <div className="space-y-6">
          {/* Amount */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">
              Amount
            </label>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError('');
              }}
              className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-[#00875A] text-lg font-bold"
            />

            {error && (
              <p className="text-sm font-bold text-red-500 ml-1">
                {error}
              </p>
            )}
          </div>

          {/* Destination Bank */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">
              Destination Bank
            </label>
            <div
              className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex justify-between items-center cursor-pointer"
              onClick={() => alert('Change Bank Function')}
            >
              <span className="font-bold text-gray-700">
                {destinationBank}
              </span>
              <span className="text-xs font-black text-[#00875A]">
                CHANGE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Withdraw Button */}
      <div className="pb-24 flex justify-center items-center">
        <button
          disabled={isDisabled}
          onClick={handleWithdraw}
          className={`w-[90%] py-4 rounded-2xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2
            ${
              isDisabled
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gray-900 active:scale-[0.98]'
            }`}
        >
          Withdraw Now <ArrowUpRight size={20} />
        </button>
      </div>
    </div>
  );
}
