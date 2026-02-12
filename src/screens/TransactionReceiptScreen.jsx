import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Share2, Download, Copy, ChevronLeft } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export default function TransactionReceiptScreen({
  transaction,
  status = 'success',
  onDone,
  onShare,
  darkMode = false,
  onDownload,
  onBack
}) {
  const { formatAmount } = useCurrency();
  if (!transaction) return <p className={`p-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>No transaction selected</p>;

  const isSuccess = status === 'success';
  const bgPage = darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900';
  const bgCard = darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-500';
  const topBarColor = isSuccess 
    ? darkMode ? 'bg-[#00FF9D]' : 'bg-[#00875A]' 
    : darkMode ? 'bg-red-600' : 'bg-red-500';
  const buttonBg = isSuccess 
    ? darkMode ? 'bg-[#00FF9D] text-gray-900' : 'bg-[#00875A] text-white' 
    : darkMode ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white';
  const actionBg = darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-600';
  const borderColor = darkMode ? 'border-gray-600' : 'border-gray-200';

  // Determine type, icon, and circle color
  let typeLabel = '';
  let typeIcon = null;
  let circleBg = '';
  let circleColor = '';
  let fullTypeDisplay = '';

  // Get payment method display
  const getPaymentMethod = () => {
    if (transaction.paymentMethod === 'card') {
      return 'Debit Card';
    } else if (transaction.paymentMethod === 'bank') {
      return 'Bank Transfer';
    }
    return null;
  };

  if (transaction.type === 'save') {
    typeLabel = 'Deposit';
    typeIcon = <ArrowDownLeft size={24} />;
    circleBg = darkMode ? 'bg-gray-700' : 'bg-emerald-50';
    circleColor = darkMode ? 'text-[#00FF9D]' : 'text-[#00875A]';
    fullTypeDisplay = getPaymentMethod() ? `Deposit/${getPaymentMethod()}` : typeLabel;
  } else if (transaction.type === 'topup') {
    typeLabel = 'Top Up';
    typeIcon = <ArrowDownLeft size={24} />;
    circleBg = darkMode ? 'bg-gray-700' : 'bg-emerald-50';
    circleColor = darkMode ? 'text-[#00FF9D]' : 'text-[#00875A]';
    fullTypeDisplay = getPaymentMethod() ? `Top Up/${getPaymentMethod()}` : typeLabel;
  } else {
    typeLabel = 'Withdrawal';
    typeIcon = <ArrowUpRight size={24} />;
    circleBg = darkMode ? 'bg-red-700' : 'bg-red-50';
    circleColor = darkMode ? 'text-red-400' : 'text-red-500';
    fullTypeDisplay = typeLabel;
  }

  return (
    <div className={`min-h-screen flex flex-col ${bgPage}`}>
      {/* Header with Back Button */}
      <div className={`sticky top-0 z-20 px-6 py-4 border-b ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'} flex items-center gap-4`}>
        <button
          onClick={onBack || onDone}
          className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
        >
          <ChevronLeft className={darkMode ? 'text-white' : 'text-gray-900'} size={24} />
        </button>
        <h1 className={`text-xl font-bold ${textPrimary}`}>Receipt</h1>
      </div>

      {/* Content */}
      <div className={`h-full p-6 flex flex-col justify-center flex-1 overflow-auto animate-in zoom-in-95 duration-300 ${bgPage}`}>
      <div className={`rounded-[3rem] p-8 shadow-2xl relative overflow-hidden ${bgCard}`}>
        
        {/* Top highlight bar */}
        <div className={`absolute top-0 left-0 w-full h-3 ${topBarColor}`} />

        {/* Status */}
        <div className="flex flex-col items-center mb-10 mt-4">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-inner ${circleBg} ${circleColor}`}>
            {typeIcon}
          </div>

          <h2 className={`text-xl font-black ${textPrimary}`}>{typeLabel}</h2>

          <p className={`text-4xl font-black mt-3 tracking-tight ${textPrimary}`}>
            {formatAmount(transaction.amount)}
          </p>
        </div>

        {/* Transaction Details */}
        <div className={`space-y-5 pt-6 border-t border-dashed ${borderColor}`}>
          {[
            { label: 'Type', value: fullTypeDisplay },
            { label: 'Recipient / Source', value: transaction.title || 'Nest Balance' },
            { label: 'Transaction ID', value: transaction.reference, icon: Copy },
            { label: 'Date', value: new Date(transaction.date).toLocaleString() },
            {
              label: 'Payment Status',
              value: isSuccess ? 'Completed' : 'Failed',
              highlight: isSuccess 
                ? (darkMode ? 'text-[#00FF9D]' : 'text-[#00875A]') 
                : (darkMode ? 'text-red-400' : 'text-red-500'),
            },
          ].map((row, idx) => (
            <div key={idx} className="flex justify-between items-center text-sm">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${textSecondary}`}>
                {row.label}
              </span>
            <div className="flex items-center gap-2">
                <span className={`font-black ${row.highlight || textPrimary}`}>{row.value || 'N/A'}</span>
                {row.icon && <row.icon size={12} className={`cursor-pointer ${darkMode ? 'text-gray-400' : 'text-gray-300'}`} />}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-12">
          <button onClick={() => onShare?.(transaction)} className="flex-1 flex flex-col items-center gap-2 group">
            <div className={`w-12 h-12 ${actionBg} rounded-2xl flex items-center justify-center group-active:scale-95 transition-transform`}>
              <Share2 size={20} />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${textSecondary}`}>Share</span>
          </button>

          <button
            disabled={!isSuccess}
            onClick={() => onDownload?.(transaction)}
            className={`flex-1 flex flex-col items-center gap-2 group ${!isSuccess && 'opacity-40 pointer-events-none'}`}
          >
            <div className={`w-12 h-12 ${actionBg} rounded-2xl flex items-center justify-center group-active:scale-95 transition-transform`}>
              <Download size={20} />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${textSecondary}`}>Save PDF</span>
          </button>
        </div>
      </div>

      {/* Close */}
      <button onClick={onDone} className={`mt-10 w-full py-4 rounded-2xl font-black active:scale-95 transition-all ${buttonBg}`}>
        Close Receipt
      </button>
      </div>
    </div>
  );
}
