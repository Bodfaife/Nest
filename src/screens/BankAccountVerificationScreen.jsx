import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';

export default function BankAccountVerificationScreen({
  darkMode = false,
  status = 'success', // 'success' | 'failed'
  bankName = 'Access Bank',
  accountNumber = '0123456789',
  accountHolder = 'John Doe',
  onDone,
}) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const isSuccess = status === 'success';
  const bgClass = darkMode
    ? isSuccess ? 'bg-gray-900' : 'bg-red-900/20'
    : isSuccess ? 'bg-white' : 'bg-red-50';

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${bgClass} p-6 animate-in fade-in duration-300`}>
      {/* Success/Error Animation Container */}
      <div className={`flex flex-col items-center space-y-8 transition-all duration-500 transform ${
        showContent ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
      }`}>
        {/* Icon */}
        <div className="relative w-24 h-24 mb-4">
          <div className={`absolute inset-0 rounded-full animate-pulse ${
            isSuccess
              ? darkMode ? 'bg-emerald-900/20' : 'bg-emerald-100'
              : darkMode ? 'bg-red-900/20' : 'bg-red-100'
          }`} />
          <div className="absolute inset-0 rounded-full flex items-center justify-center">
            <div className={`w-20 h-20 rounded-full ${
              isSuccess
                ? darkMode ? 'bg-emerald-900/40' : 'bg-emerald-50'
                : darkMode ? 'bg-red-900/40' : 'bg-red-50'
            } flex items-center justify-center`}>
              {isSuccess ? (
                <CheckCircle size={56} className="text-emerald-600 animate-bounce" />
              ) : (
                <XCircle size={56} className="text-red-600" />
              )}
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-3">
          <h1 className={`text-3xl font-black ${
            darkMode
              ? isSuccess ? 'text-white' : 'text-red-200'
              : isSuccess ? 'text-gray-900' : 'text-red-600'
          }`}>
            {isSuccess ? 'Account Verified!' : 'Verification Failed'}
          </h1>
          <p className={`text-lg ${
            darkMode
              ? isSuccess ? 'text-gray-400' : 'text-red-300'
              : isSuccess ? 'text-gray-600' : 'text-red-500'
          }`}>
            {isSuccess
              ? 'Your bank account has been successfully added.'
              : 'We couldn\'t verify your account. Please try again.'}
          </p>
        </div>

        {/* Account Details */}
        {isSuccess && (
          <div className={`w-full max-w-sm p-6 rounded-2xl border-2 ${
            darkMode
              ? 'bg-emerald-900/20 border-emerald-800'
              : 'bg-emerald-50 border-emerald-200'
          }`}>
            <div className="space-y-4">
              <div>
                <p className={`text-xs font-bold uppercase ${
                  darkMode ? 'text-emerald-300' : 'text-emerald-700'
                }`}>Bank Name</p>
                <p className={`text-lg font-black ${
                  darkMode ? 'text-emerald-100' : 'text-emerald-900'
                }`}>{bankName}</p>
              </div>
              <div>
                <p className={`text-xs font-bold uppercase ${
                  darkMode ? 'text-emerald-300' : 'text-emerald-700'
                }`}>Account Number</p>
                <p className={`text-lg font-black font-mono ${
                  darkMode ? 'text-emerald-100' : 'text-emerald-900'
                }`}>...{accountNumber.slice(-4)}</p>
              </div>
              <div>
                <p className={`text-xs font-bold uppercase ${
                  darkMode ? 'text-emerald-300' : 'text-emerald-700'
                }`}>Account Holder</p>
                <p className={`text-lg font-black ${
                  darkMode ? 'text-emerald-100' : 'text-emerald-900'
                }`}>{accountHolder}</p>
              </div>
            </div>
          </div>
        )}

        {/* Retry Message for Failure */}
        {!isSuccess && (
          <div className={`w-full max-w-sm p-6 rounded-2xl border-2 ${
            darkMode
              ? 'bg-red-900/20 border-red-800'
              : 'bg-red-50 border-red-200'
          }`}>
            <p className={`text-sm font-bold ${
              darkMode ? 'text-red-300' : 'text-red-700'
            }`}>
              • Check your account number and try again
              <br/>
              • Verify the OTP entered correctly
              <br/>
              • Contact support if the issue persists
            </p>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={onDone}
          className={`w-full max-w-sm py-4 rounded-2xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 group active:scale-[0.98] ${
            isSuccess
              ? 'bg-emerald-600 hover:bg-emerald-700'
              : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {isSuccess ? 'Continue' : 'Try Again'}
          <ArrowRight size={20} className="group-active:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
