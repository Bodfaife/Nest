import React, { useState } from 'react';
import { ChevronLeft, Building2, AlertCircle, CheckCircle } from 'lucide-react';

// Nigerian banks list
const NIGERIAN_BANKS = [
  'Access Bank',
  'Ecobank Nigeria',
  'First Bank of Nigeria',
  'Guaranty Trust Bank',
  'United Bank for Africa',
  'Zenith Bank',
  'Stanbic IBTC Bank',
  'Standard Chartered Bank',
  'Citibank Nigeria',
  'Wema Bank',
  'Sterling Bank',
  'Union Bank of Nigeria',
  'Fidelity Bank',
  'Polaris Bank',
  'Kuda Microfinance Bank',
  'Providus Bank',
  'Globus Bank',
  'Heritage Bank',
  'GTBank',
  'FCMB',
  'Keystone Bank',
  'MainOne',
  'Moniepoint MFB'
];

export default function AddBankAccountScreen({
  darkMode = false,
  onBack,
  onAddAccount,
}) {
  const [step, setStep] = useState('bank'); // 'bank' | 'account' | 'otp'
  const [selectedBank, setSelectedBank] = useState(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [accountType, setAccountType] = useState('savings');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showBankDropdown, setShowBankDropdown] = useState(false);

  const bgClass = darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900';
  const inputClass = darkMode
    ? 'bg-gray-800 text-white border border-gray-700 focus:border-emerald-500'
    : 'bg-gray-50 text-gray-900 border border-gray-100 focus:border-emerald-500';
  const labelClass = darkMode ? 'text-gray-300' : 'text-gray-700';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-gray-50';

  const handleBankSelect = (bank) => {
    setSelectedBank(bank);
    setShowBankDropdown(false);
    setError('');
  };

  const handleAccountNumberChange = (value) => {
    setAccountNumber(value);
    setError('');
    // Mock: simulate fetching account holder name
    if (value.length === 10) {
      // Simulate API call to fetch account holder name
      setTimeout(() => {
        setAccountHolder('John Doe'); // This should come from backend
      }, 500);
    }
  };

  const handleContinue = () => {
    setError('');

    if (step === 'bank') {
      if (!selectedBank) {
        setError('Please select a bank');
        return;
      }
      setStep('account');
    } else if (step === 'account') {
      if (!accountNumber || accountNumber.length < 10) {
        setError('Please enter a valid account number');
        return;
      }
      if (!accountHolder) {
        setError('Please wait for account verification');
        return;
      }
      // Request OTP
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setStep('otp');
      }, 1500);
    } else if (step === 'otp') {
      if (!otp || otp.length < 6) {
        setError('Please enter a valid OTP');
        return;
      }
      // Verify OTP and add account
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        onAddAccount({
          id: Date.now(),
          bankName: selectedBank,
          accountNumber,
          accountHolder,
          accountType,
        });
      }, 2000);
    }
  };

  return (
    <div className={`min-h-screen pb-8 flex flex-col ${bgClass} p-6 animate-in slide-in-from-right duration-300`}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-black">Add Bank Account</h1>
      </div>

      {/* Progress Indicator */}
      <div className="flex gap-2 mb-8">
        <div className={`flex-1 h-1 rounded-full ${step === 'bank' || step === 'account' || step === 'otp' ? 'bg-emerald-600' : 'bg-gray-300'}`} />
        <div className={`flex-1 h-1 rounded-full ${step === 'account' || step === 'otp' ? 'bg-emerald-600' : 'bg-gray-300'}`} />
        <div className={`flex-1 h-1 rounded-full ${step === 'otp' ? 'bg-emerald-600' : 'bg-gray-300'}`} />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-start">
        {step === 'bank' && (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-black mb-2">Select Your Bank</h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Choose from Nigerian banks, microfinance, and online banks
              </p>
            </div>

            {/* Bank Dropdown */}
            <div className="mb-6">
              <label className={`block text-sm font-bold mb-2 ${labelClass}`}>Bank Name</label>
              <div className="relative">
                <button
                  onClick={() => setShowBankDropdown(!showBankDropdown)}
                  className={`w-full p-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 flex items-center justify-between text-left font-bold transition-all ${inputClass}`}
                >
                  <span className={selectedBank ? '' : darkMode ? 'text-gray-500' : 'text-gray-400'}>
                    {selectedBank || 'Select a bank...'}
                  </span>
                  <svg className={`w-5 h-5 transition-transform ${showBankDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showBankDropdown && (
                  <div className={`absolute top-full left-0 right-0 mt-2 rounded-2xl border z-50 max-h-64 overflow-y-auto shadow-lg ${
                    darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}>
                    {NIGERIAN_BANKS.map((bank, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleBankSelect(bank)}
                        className={`w-full text-left p-4 border-b last:border-b-0 transition-colors ${
                          selectedBank === bank
                            ? darkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-50 text-emerald-700'
                            : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                        }`}
                      >
                        <p className="font-bold">{bank}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {step === 'account' && (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-black mb-2">Account Details</h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {selectedBank}
              </p>
            </div>

            {/* Account Number */}
            <div className="mb-6">
              <label className={`block text-sm font-bold mb-2 ${labelClass}`}>Account Number</label>
              <input
                type="text"
                placeholder="Enter 10-digit account number"
                value={accountNumber}
                onChange={(e) => handleAccountNumberChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
                maxLength="10"
                className={`w-full p-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold transition-all ${inputClass}`}
              />
            </div>

            {/* Account Holder (Auto-filled) */}
            {accountNumber.length === 10 && (
              <div className="mb-6">
                <label className={`block text-sm font-bold mb-2 ${labelClass}`}>Account Holder Name</label>
                <div className={`p-4 rounded-2xl border-2 transition-all ${
                  accountHolder
                    ? darkMode ? 'border-emerald-600 bg-emerald-900/20' : 'border-emerald-500 bg-emerald-50'
                    : darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
                }`}>
                  {accountHolder ? (
                    <div className="flex items-center gap-3">
                      <CheckCircle size={20} className="text-emerald-600" />
                      <div>
                        <p className={`text-sm font-bold ${labelClass}`}>Verified</p>
                        <p className="font-black">{accountHolder}</p>
                      </div>
                    </div>
                  ) : (
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Verifying account...</p>
                  )}
                </div>
              </div>
            )}

            {/* Account Type */}
            <div className="mb-6">
              <label className={`block text-sm font-bold mb-2 ${labelClass}`}>Account Type</label>
              <select
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                className={`w-full p-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold transition-all ${inputClass}`}
              >
                <option value="savings">Savings</option>
                <option value="current">Current</option>
              </select>
            </div>
          </>
        )}

        {step === 'otp' && (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-black mb-2">Verify Account</h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Enter the OTP sent to your registered email and phone
              </p>
            </div>

            {/* OTP Input */}
            <div className="mb-6">
              <label className={`block text-sm font-bold mb-2 ${labelClass}`}>Enter 6-Digit OTP</label>
              <input
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setOtp(val);
                  setError('');
                }}
                maxLength="6"
                className={`w-full p-4 text-center text-3xl font-black rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 tracking-[0.3em] transition-all ${inputClass}`}
              />
            </div>

            {/* Summary */}
            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-200'}`}>
              <p className={`text-sm font-bold ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                ✓ {selectedBank}<br/>
                ✓ Account: {accountNumber}<br/>
                ✓ Name: {accountHolder}
              </p>
            </div>
          </>
        )}

        {/* Error Message */}
        {error && (
          <div className={`mt-6 flex items-center gap-2 p-4 rounded-xl ${
            darkMode
              ? 'bg-red-900/30 border border-red-800'
              : 'bg-red-50 border border-red-200'
          }`}>
            <AlertCircle size={18} className={darkMode ? 'text-red-400' : 'text-red-600'} />
            <p className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-700'}`}>{error}</p>
          </div>
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={handleContinue}
        disabled={
          isLoading || 
          (step === 'bank' && !selectedBank) || 
          (step === 'account' && (!accountNumber || !accountHolder)) ||
          (step === 'otp' && otp.length < 6)
        }
        className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all mt-8 ${
          isLoading || 
          (step === 'bank' && !selectedBank) || 
          (step === 'account' && (!accountNumber || !accountHolder)) ||
          (step === 'otp' && otp.length < 6)
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-emerald-600 active:scale-[0.98]'
        }`}
      >
        {isLoading ? (step === 'account' ? 'Requesting OTP...' : step === 'otp' ? 'Verifying...' : 'Processing...') : (step === 'otp' ? 'Complete' : 'Continue')}
      </button>
    </div>
  );
}
