import React, { useState } from 'react';
import { ChevronLeft, Copy, Building2, Clock, CheckCircle } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export default function BankTransferInstructionsScreen({
  darkMode = false,
  onBack,
  user = {},
  amount = 0,
  onTransferConfirmed
}) {
  const { formatAmount } = useCurrency();
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const bgClass = darkMode ? 'bg-gray-900' : 'bg-white';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-500';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-gray-50';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-100';

  const bankDetails = {
    bankName: 'Nest Financial Bank',
    accountNumber: user?.accountNumber || '0123456789',
    accountName: 'Nest Savings Account',
    routingNumber: '021000021',
    swiftCode: 'NESTUSUS',
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => {
      if (onTransferConfirmed) {
        onTransferConfirmed();
      }
    }, 2000);
  };

  return (
    <div className={`min-h-screen flex flex-col ${bgClass} animate-in slide-in-from-right`}>
      {/* Header */}
      <div className={`sticky top-0 z-10 border-b ${borderColor} p-6 flex items-center gap-4 bg-white`}>
        <button
          onClick={onBack}
          className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-black text-gray-900">Bank Transfer Instructions</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {!confirmed && (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Amount Highlight */}
            <div className={`p-6 rounded-3xl text-center ${cardBg} border-2 ${darkMode ? 'border-emerald-900/50' : 'border-emerald-100'}`}>
              <p className={textSecondary}>Amount to Transfer</p>
              <h2 className="text-4xl font-black text-emerald-600 my-2">{formatAmount(amount)}</h2>
              <p className={`text-sm ${textSecondary}`}>to your Nest Savings Account</p>
            </div>

            {/* Bank Details */}
            <div>
              <h3 className="text-lg font-bold mb-4">Bank Account Details</h3>
              <div className="space-y-3">
                {[
                  { label: 'Bank Name', value: bankDetails.bankName },
                  { label: 'Account Number', value: bankDetails.accountNumber },
                  { label: 'Account Name', value: bankDetails.accountName },
                  { label: 'Routing Number', value: bankDetails.routingNumber },
                  { label: 'SWIFT Code', value: bankDetails.swiftCode },
                ].map((item, idx) => (
                  <div key={idx} className={`p-4 rounded-xl flex items-center justify-between ${cardBg}`}>
                    <div>
                      <p className={`text-xs font-bold uppercase ${textSecondary}`}>{item.label}</p>
                      <p className="font-bold text-lg font-mono mt-1">{item.value}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(item.value)}
                      className={`p-2 rounded-full transition-all ${
                        copied && copied === item.value
                          ? 'bg-emerald-600 text-white'
                          : darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className={`p-5 rounded-2xl ${cardBg} space-y-4`}>
              <h3 className="font-bold flex items-center gap-2">
                <Building2 size={20} />
                How to Send the Transfer
              </h3>
              <ol className={`list-decimal list-inside space-y-3 text-sm ${textSecondary}`}>
                <li>Log into your bank's mobile app or online banking platform</li>
                <li>Select "Send Money" or "Transfer Funds"</li>
                <li>Choose "Bank Transfer" option</li>
                <li>Enter the Nest account details above</li>
                <li>Enter the amount: <span className="font-bold text-white">{formatAmount(amount)}</span></li>
                <li>Review all details carefully before confirming</li>
                <li>Complete the transfer from your bank</li>
              </ol>
            </div>

            {/* Timeline */}
            <div className={`p-5 rounded-2xl ${cardBg} space-y-4`}>
              <h3 className="font-bold flex items-center gap-2">
                <Clock size={20} />
                What Happens Next
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 font-bold">1</div>
                  <div>
                    <p className="font-bold">Send the Transfer</p>
                    <p className={textSecondary}>Initiate the bank transfer from your account</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} text-gray-600 flex items-center justify-center flex-shrink-0 font-bold`}>2</div>
                  <div>
                    <p className="font-bold">Funds are Processing</p>
                    <p className={textSecondary}>Your bank processes the transfer (1-3 business days)</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} text-gray-600 flex items-center justify-center flex-shrink-0 font-bold`}>3</div>
                  <div>
                    <p className="font-bold">Funds Received</p>
                    <p className={textSecondary}>We confirm receipt and your savings are locked</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Note */}
            <div className={`p-5 rounded-2xl border-2 ${darkMode ? 'bg-yellow-900/20 border-yellow-800 text-yellow-200' : 'bg-yellow-50 border-yellow-200 text-yellow-800'}`}>
              <p className="text-sm font-bold mb-2">⚠️ Important:</p>
              <p className="text-xs">
                Ensure the amount matches exactly. Bank transfers may take 1-3 business days to process. 
                Once your transfer is received, we'll confirm it immediately.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 sticky bottom-0 bg-opacity-95" style={{ background: darkMode ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)' }}>
              <button
                onClick={handleConfirm}
                className="w-full py-4 rounded-2xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all active:scale-95"
              >
                I've Sent the Transfer
              </button>
              <button
                onClick={onBack}
                className={`w-full py-4 rounded-2xl font-bold transition-all ${
                  darkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {confirmed && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${darkMode ? 'bg-emerald-900/30' : 'bg-emerald-50'}`}>
              <CheckCircle size={48} className="text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black mb-2">Transfer Initiated!</h2>
              <p className={textSecondary}>
                We've received confirmation of your transfer. Your funds will be processed within 1-3 business days.
              </p>
            </div>
            <p className={`text-sm ${textSecondary} max-w-sm`}>
              You'll receive an email notification once your funds are received and your savings account is locked.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
