import React, { useState } from 'react';
import { ChevronLeft, ArrowUpRight, Check } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export default function WithdrawalScreen({
  onBack,
  onConfirm,
  balance = 0,
  bankAccounts = [],
  openScreen,
  darkMode,
}) {
  const { formatAmount } =
    useCurrency() || { formatAmount: (amt) => `₦${amt.toLocaleString()}` };

  const [amount, setAmount] = useState('');
  const [selectedAccountIndex, setSelectedAccountIndex] = useState(0);
  const [error, setError] = useState('');
  const [showAccountModal, setShowAccountModal] = useState(false);

  const numericAmount = Number(amount);
  const selectedAccount = bankAccounts[selectedAccountIndex];
  const destinationBank = selectedAccount 
    ? `${selectedAccount.bankName} ...${selectedAccount.accountNumber?.slice(-4)}` 
    : 'No account selected';

  const isAmountEmpty = !numericAmount || numericAmount <= 0;
  const isAmountTooHigh = numericAmount > balance;

  const isDisabled = isAmountEmpty || isAmountTooHigh || !selectedAccount;

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

    if (!selectedAccount) {
      setError('Please select a destination bank account');
      return;
    }

    // success path
    onConfirm({
      status: 'success',
      amount: numericAmount,
      selectedAccount,
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
            {formatAmount(balance)}
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
            <div className="space-y-2">
              {selectedAccount ? (
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-gray-900">{selectedAccount.bankName}</p>
                    <p className="text-xs text-gray-500 font-medium">
                      {selectedAccount.accountNumber?.slice(-4) ? `...${selectedAccount.accountNumber.slice(-4)}` : 'Account'}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAccountModal(true)}
                    className="text-xs font-black text-[#00875A] hover:opacity-70 transition-opacity"
                  >
                    CHANGE
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    if (bankAccounts.length > 0) {
                      setShowAccountModal(true);
                    } else {
                      openScreen('SavedAccounts');
                    }
                  }}
                  className="w-full p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex justify-between items-center hover:bg-emerald-100 transition-colors"
                >
                  <span className="font-bold text-[#00875A]">
                    {bankAccounts.length > 0 ? 'Select Bank Account' : '+ Add Bank Account'}
                  </span>
                </button>
              )}
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
                : 'bg-emerald-600 active:scale-[0.98]'
            }`}
        >
          Withdraw Now <ArrowUpRight size={20} />
        </button>
      </div>

      {/* Account Selection Modal */}
      {showAccountModal && bankAccounts.length > 0 && (
        <div className="fixed inset-0 z-50 flex flex-col">
          {/* Backdrop */}
          <div 
            className="flex-1 bg-black/40"
            onClick={() => setShowAccountModal(false)}
          />
          
          {/* Modal */}
          <div className="bg-white rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto">
            <h2 className="text-xl font-black text-gray-900 mb-6">Select Bank Account</h2>
            
            <div className="space-y-3">
              {bankAccounts.map((account, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedAccountIndex(idx);
                    setShowAccountModal(false);
                  }}
                  className={`w-full p-4 rounded-2xl border-2 flex justify-between items-center transition-all ${
                    idx === selectedAccountIndex
                      ? 'border-emerald-600 bg-emerald-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="text-left">
                    <p className={`font-bold ${idx === selectedAccountIndex ? 'text-emerald-600' : 'text-gray-900'}`}>
                      {account.bankName}
                    </p>
                    <p className="text-xs text-gray-500 font-medium">
                      {account.accountNumber?.slice(-4) ? `...${account.accountNumber.slice(-4)}` : 'Account'}
                    </p>
                  </div>
                  {idx === selectedAccountIndex && (
                    <Check size={20} className="text-emerald-600" />
                  )}
                </button>
              ))}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowAccountModal(false)}
              className="w-full mt-6 py-3 rounded-xl font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
