import React, { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';

export default function BankAccountSuccessScreen({
  darkMode = false,
  accountData = {},
  onContinue
}) {
  const [animate, setAnimate] = useState(false);

  const bgClass = darkMode ? 'bg-gray-900' : 'bg-white';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-500';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-gray-50';

  useEffect(() => {
    // Trigger animation immediately
    setAnimate(true);

    // Auto-redirect after 3 seconds
    const timer = setTimeout(() => {
      if (onContinue) onContinue();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${bgClass} p-6`}>
      {/* Success Icon with Animation */}
      <div className="mb-8">
        <div
          className={`w-24 h-24 flex items-center justify-center rounded-full bg-emerald-600 transition-transform duration-500 ${
            animate ? 'scale-100' : 'scale-0'
          }`}
        >
          <div
            className={`absolute w-24 h-24 rounded-full border-4 border-emerald-400 transition-all duration-700 ${
              animate ? 'scale-150 opacity-0' : 'scale-100 opacity-100'
            }`}
          />
          <CheckCircle size={56} className="text-white relative z-10" />
        </div>
      </div>

      {/* Success Message */}
      <h1 className={`text-3xl font-black text-center mb-4 ${textPrimary}`}>
        Account Added Successfully!
      </h1>

      <p className={`text-center mb-8 ${textSecondary} max-w-sm`}>
        Your bank account has been verified and added to your Nest account.
      </p>

      {/* Account Details Summary */}
      <div className={`w-full max-w-md p-6 rounded-2xl ${cardBg} border ${darkMode ? 'border-gray-700' : 'border-gray-100'} mb-8`}>
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <span className={`text-sm font-bold ${textSecondary}`}>Bank</span>
            <span className={`text-right font-bold ${textPrimary}`}>{accountData.bankName}</span>
          </div>
          <div className="flex justify-between items-start">
            <span className={`text-sm font-bold ${textSecondary}`}>Account Holder</span>
            <span className={`text-right font-bold ${textPrimary}`}>{accountData.accountHolder}</span>
          </div>
          <div className="flex justify-between items-start">
            <span className={`text-sm font-bold ${textSecondary}`}>Account Number</span>
            <span className={`text-right font-mono font-bold ${textPrimary}`}>
              ...{accountData.accountNumber?.slice(-4) || 'xxxx'}
            </span>
          </div>
          <div className="flex justify-between items-start">
            <span className={`text-sm font-bold ${textSecondary}`}>Account Type</span>
            <span className={`text-right font-bold ${textPrimary} capitalize`}>
              {accountData.accountType || 'Savings'}
            </span>
          </div>
        </div>
      </div>

      {/* Info Message */}
      <p className={`text-center text-sm ${textSecondary} mb-8`}>
        Redirecting you back to your bank accounts...
      </p>

      {/* Manual Continue Button (in case auto-redirect doesn't work) */}
      <button
        onClick={onContinue}
        className="px-8 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all active:scale-95"
      >
        Continue to Bank Accounts
      </button>
    </div>
  );
}
