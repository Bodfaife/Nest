import React, { useState } from 'react';
import { ChevronLeft, Plus, Trash2, Building2, Check } from 'lucide-react';

export default function SavedAccountsScreen({
  darkMode = false,
  onBack,
  accounts = [],
  onAddAccount,
  onDeleteAccount,
  onSetDefault
}) {
  const [deletingId, setDeletingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    accountHolder: '',
    bankName: '',
    accountNumber: '',
    accountType: 'savings'
  });

  const bgClass = darkMode ? 'bg-gray-900' : 'bg-white';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-500';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-gray-50';
  const inputClass = darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900';
  const buttonBg = darkMode ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-emerald-600 hover:bg-emerald-700';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-100';

  const handleAddAccount = () => {
    if (!formData.accountHolder || !formData.bankName || !formData.accountNumber) {
      alert('Please fill in all fields');
      return;
    }

    onAddAccount && onAddAccount({
      id: Date.now(),
      ...formData
    });

    setFormData({
      accountHolder: '',
      bankName: '',
      accountNumber: '',
      accountType: 'savings'
    });
    setIsAdding(false);
  };

  return (
    <div className={`min-h-screen flex flex-col ${bgClass} animate-in slide-in-from-right`}>
      {/* Header */}
      <div className={`sticky top-0 z-20 border-b ${borderColor} p-6 flex items-center justify-between ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-2xl font-black">Bank Accounts</h1>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className={`p-3 rounded-full text-white ${buttonBg} transition-all`}
          title="Add new account"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {!isAdding ? (
          <>
            {accounts && accounts.length > 0 ? (
              <div className="max-w-2xl mx-auto space-y-4">
                <p className={`text-sm ${textSecondary} mb-6`}>
                  Bank accounts are used to receive funds when your savings mature.
                </p>
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className={`p-6 rounded-2xl border-2 transition-all ${
                      darkMode ? 'border-gray-700 bg-gray-800 hover:border-emerald-600/50' : 'border-gray-100 bg-gray-50 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                          <Building2 size={24} className="text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <p className={`font-bold ${textPrimary}`}>{account.bankName}</p>
                          <p className={`text-sm ${textSecondary}`}>{account.accountType}</p>
                        </div>
                      </div>
                      {deletingId !== account.id && (
                        <button
                          onClick={() => setDeletingId(account.id)}
                          className={`p-2 rounded-lg transition-all ${
                            darkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-50'
                          }`}
                        >
                          <Trash2 size={18} className="text-red-600" />
                        </button>
                      )}
                    </div>

                    <div className={`p-3 rounded-xl mb-4 ${cardBg} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <p className={`text-xs font-bold uppercase ${textSecondary}`}>Account Holder</p>
                      <p className="font-bold mt-1">{account.accountHolder}</p>
                    </div>

                    <div className={`p-3 rounded-xl mb-4 ${cardBg} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <p className={`text-xs font-bold uppercase ${textSecondary}`}>Account Number</p>
                      <p className="font-mono font-bold mt-1">
                        {account.accountNumber.slice(0, -4).replace(/./g, '*')}{account.accountNumber.slice(-4)}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => onSetDefault && onSetDefault(account.id)}
                        className="flex-1 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                      >
                        <Check size={18} />
                        Set as Default
                      </button>
                      {deletingId === account.id && (
                        <>
                          <button
                            onClick={() => {
                              onDeleteAccount && onDeleteAccount(account.id);
                              setDeletingId(null);
                            }}
                            className="flex-1 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-all"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setDeletingId(null)}
                            className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                              darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center ${cardBg}`}>
                  <Building2 size={40} className={textSecondary} />
                </div>
                <h2 className={`text-xl font-black ${textPrimary}`}>No Bank Accounts</h2>
                <p className={`text-sm ${textSecondary} max-w-sm`}>
                  Add a bank account where we'll transfer your savings when they mature
                </p>
                <button
                  onClick={() => setIsAdding(true)}
                  className="mt-6 px-6 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all"
                >
                  Add Bank Account
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="max-w-md mx-auto">
            <div className="mb-6">
              <h2 className={`text-xl font-bold ${textPrimary} mb-2`}>Add Bank Account</h2>
              <p className={`text-sm ${textSecondary}`}>
                This account will receive your savings when they mature
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-bold mb-2 ${textSecondary}`}>Account Holder Name</label>
                <input
                  type="text"
                  value={formData.accountHolder}
                  onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                  placeholder="Your full name"
                  className={`w-full p-4 rounded-xl border outline-none focus:ring-2 focus:ring-emerald-500 ${inputClass}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-bold mb-2 ${textSecondary}`}>Bank Name</label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  placeholder="e.g., First National Bank"
                  className={`w-full p-4 rounded-xl border outline-none focus:ring-2 focus:ring-emerald-500 ${inputClass}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-bold mb-2 ${textSecondary}`}>Account Number</label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  placeholder="Enter account number"
                  className={`w-full p-4 rounded-xl border outline-none focus:ring-2 focus:ring-emerald-500 ${inputClass}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-bold mb-2 ${textSecondary}`}>Account Type</label>
                <select
                  value={formData.accountType}
                  onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                  className={`w-full p-4 rounded-xl border outline-none focus:ring-2 focus:ring-emerald-500 ${inputClass}`}
                >
                  <option value="savings">Savings Account</option>
                  <option value="checking">Checking Account</option>
                  <option value="money-market">Money Market Account</option>
                </select>
              </div>

              <div className="space-y-3 pt-4 pb-16">
                <button
                  onClick={handleAddAccount}
                  className="w-full py-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all"
                >
                  Add Account
                </button>
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setFormData({
                      accountHolder: '',
                      bankName: '',
                      accountNumber: '',
                      accountType: 'savings'
                    });
                  }}
                  className={`w-full py-4 rounded-xl font-bold transition-all ${
                    darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
