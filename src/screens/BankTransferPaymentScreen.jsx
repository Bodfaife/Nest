import React, { useState } from 'react';
import { ChevronLeft, Building2, Copy, Plus } from 'lucide-react';

const BankTransferPaymentScreen = ({ user, bankAccounts = [], onSelectAccount, onAddAccount, onBack, darkMode = false }) => {
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [accountData, setAccountData] = useState({ accountNumber: '', bankName: '', accountName: '' });

  const bgClass = darkMode ? 'bg-gray-900' : 'bg-white';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-500';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-gray-50';
  const inputBg = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100';
  const buttonBg = darkMode ? 'bg-[#00FF9D] text-gray-900' : 'bg-[#00875A] text-white';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';

  const handleAddAccount = () => {
    if (accountData.accountNumber && accountData.bankName && accountData.accountName) {
      onAddAccount(accountData);
      setAccountData({ accountNumber: '', bankName: '', accountName: '' });
      setIsAddingAccount(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${bgClass} animate-in slide-in-from-right`}>
      {/* Header */}
      <div className="p-6 flex items-center gap-3 border-b" style={{ borderColor: borderColor }}>
        <button onClick={onBack} className={`p-2 rounded-full ${cardBg}`}>
          <ChevronLeft className={textPrimary} size={24} />
        </button>
        <h1 className={`text-xl font-black ${textPrimary}`}>Bank Transfer</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        {!isAddingAccount ? (
          <>
            <p className={`text-sm mb-6 ${textSecondary}`}>Select or add a bank account for transfer</p>

            {/* Existing Accounts */}
            {bankAccounts && bankAccounts.length > 0 && (
              <div className="mb-6">
                <p className={`text-xs font-bold uppercase tracking-widest mb-4 ${textSecondary}`}>Your Bank Accounts</p>
                <div className="space-y-3">
                  {bankAccounts.map((account, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSelectAccount(account)}
                      className={`w-full p-5 rounded-2xl border-2 text-left transition-all active:scale-95 ${borderColor} ${cardBg}`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          <Building2 className={darkMode ? 'text-emerald-400' : 'text-emerald-600'} size={18} />
                        </div>
                        <div>
                          <p className={`font-bold ${textPrimary}`}>{account.accountName}</p>
                          <p className={`text-xs ${textSecondary}`}>{account.bankName}</p>
                        </div>
                      </div>
                      <p className={`text-sm font-mono ml-11 ${textSecondary}`}>•••• {account.accountNumber.slice(-4)}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add Account Button */}
            <button
              onClick={() => setIsAddingAccount(true)}
              className={`w-full p-5 rounded-2xl border-2 flex items-center justify-center gap-2 transition-all active:scale-95 ${
                darkMode ? 'border-gray-700 text-[#00FF9D]' : 'border-emerald-200 text-emerald-600'
              } ${cardBg}`}
            >
              <Plus size={20} />
              <span className="font-bold">Add Bank Account</span>
            </button>

            <div className={`p-4 rounded-2xl mt-8 ${cardBg}`}>
              <p className={`text-xs ${textSecondary}`}>
                Your bank account information is encrypted and securely stored. Transfers will proceed only upon savings maturity.
              </p>
            </div>
          </>
        ) : (
          <>
            <p className={`text-sm mb-6 ${textSecondary}`}>Add a new bank account</p>

            <div className="space-y-5">
              <div>
                <label className={`text-xs font-bold uppercase tracking-widest ml-1 mb-2 block ${textSecondary}`}>
                  Account Holder Name
                </label>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={accountData.accountName}
                  onChange={(e) => setAccountData({ ...accountData, accountName: e.target.value })}
                  className={`w-full p-4 rounded-xl font-bold outline-none focus:ring-2 focus:ring-emerald-500 ${inputBg} ${textPrimary}`}
                />
              </div>

              <div>
                <label className={`text-xs font-bold uppercase tracking-widest ml-1 mb-2 block ${textSecondary}`}>
                  Bank Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., First Bank, GTBank"
                  value={accountData.bankName}
                  onChange={(e) => setAccountData({ ...accountData, bankName: e.target.value })}
                  className={`w-full p-4 rounded-xl font-bold outline-none focus:ring-2 focus:ring-emerald-500 ${inputBg} ${textPrimary}`}
                />
              </div>

              <div>
                <label className={`text-xs font-bold uppercase tracking-widest ml-1 mb-2 block ${textSecondary}`}>
                  Account Number
                </label>
                <input
                  type="text"
                  placeholder="0000000000"
                  value={accountData.accountNumber}
                  onChange={(e) => setAccountData({ ...accountData, accountNumber: e.target.value })}
                  className={`w-full p-4 rounded-xl font-bold outline-none focus:ring-2 focus:ring-emerald-500 ${inputBg} ${textPrimary}`}
                />
              </div>
            </div>

            <div className={`p-4 rounded-2xl mt-8 ${cardBg}`}>
              <p className={`text-xs ${textSecondary}`}>
                Make sure you have access to this account. You'll receive a confirmation before the transfer is made.
              </p>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      {isAddingAccount && (
        <div className="p-6 border-t" style={{ borderColor: borderColor }}>
          <button
            onClick={() => setIsAddingAccount(false)}
            className={`w-full py-3 rounded-xl font-bold mb-3 ${
              darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleAddAccount}
            disabled={!accountData.accountNumber || !accountData.bankName || !accountData.accountName}
            className={`w-full py-5 rounded-2xl font-black transition-all active:scale-95 ${
              accountData.accountNumber && accountData.bankName && accountData.accountName
                ? `${buttonBg}`
                : darkMode
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Add Account
          </button>
        </div>
      )}
    </div>
  );
};

export default BankTransferPaymentScreen;
