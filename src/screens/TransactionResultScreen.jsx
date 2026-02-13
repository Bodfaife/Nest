import React from 'react';
import { CheckCircle2, XCircle, Share2 } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

const TransactionResultScreen = ({
  status = 'success',
  amount,
  type,
  onDone,
  darkMode = false,
  paymentDestination,
}) => {
  const isSuccess = status === 'success';
  const { formatAmount } = useCurrency();

  const mapTypeToLabel = (t) => {
    if (!t) return 'Transaction';
    if (t === 'save') return 'Deposit';
    if (t === 'topup') return 'Topup';
    if (t === 'withdraw') return 'Withdrawal';
    return t.charAt(0).toUpperCase() + t.slice(1);
  };

  // Dynamic classes based on dark mode
  const bgClass = darkMode
    ? isSuccess
      ? 'bg-gray-900'
      : 'bg-red-900'
    : isSuccess
      ? 'bg-white'
      : 'bg-red-50';

  const textPrimary = darkMode
    ? isSuccess
      ? 'text-white'
      : 'text-red-200'
    : isSuccess
      ? 'text-gray-900'
      : 'text-red-500';

  const textSecondary = darkMode
    ? 'text-gray-400'
    : 'text-gray-400';

  const cardBg = darkMode
    ? 'bg-gray-800'
    : 'bg-gray-50';

  const cardText = darkMode
    ? 'text-white'
    : 'text-gray-900';

  const buttonPrimaryBg = darkMode
    ? isSuccess
      ? 'bg-[#00FF9D]'
      : 'bg-gray-700'
    : isSuccess
      ? 'bg-[#00875A]'
      : 'bg-gray-900';

  const buttonPrimaryText = darkMode ? 'text-gray-900' : 'text-white';

  const shareButtonBg = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100';
  const shareButtonText = darkMode ? 'text-white' : 'text-gray-800';

  return (
    <div className={`h-full flex flex-col p-8 animate-in ${bgClass}`}>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center mb-6 
          ${isSuccess
            ? darkMode
              ? 'bg-gray-800 text-[#00FF9D]'
              : 'bg-emerald-50 text-[#00875A]'
            : darkMode
              ? 'bg-red-800 text-red-400 shadow-lg'
              : 'bg-white text-red-500 shadow-xl'
          }`}>
          {isSuccess ? <CheckCircle2 size={48} strokeWidth={2.5} /> : <XCircle size={48} strokeWidth={2.5} />}
        </div>

        <h2 className={`text-3xl font-black mb-2 text-center ${textPrimary}`}>
          {isSuccess ? 'Payment Successful' : 'Transaction Failed'}
        </h2>

        <p className={`font-bold text-center mb-8 ${textSecondary}`}>
          {isSuccess
            ? `Your ${mapTypeToLabel(type)} of ${formatAmount(amount)} has been processed.`
            : 'Your bank declined the request. Please check your balance and try again.'}
        </p>

        {isSuccess && (
          <div className={`w-full ${cardBg} rounded-[2rem] p-6 space-y-4`}>
            <div className="flex justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Reference</span>
              <span className="font-mono text-xs font-bold text">NEST-TX-928374</span>
            </div>
            <div className="flex justify-between border-t border-gray-700 pt-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Amount</span>
              <span className={`font-black ${cardText}`}>{formatAmount(amount)}</span>
            </div>
            {type === 'withdraw' && paymentDestination && (
              <div className="flex justify-between border-t border-gray-700 pt-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Destination</span>
                <span className={`font-black text-right ${cardText}`}>{paymentDestination}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">

        <button
          onClick={onDone}
          className={`w-full py-5 rounded-[2rem] font-black active:scale-95 transition-all ${buttonPrimaryBg} ${buttonPrimaryText}`}
        >
          {isSuccess ? 'Back to Home' : 'Try Another Method'}
        </button>
      </div>
    </div>
  );
};

export default TransactionResultScreen;
