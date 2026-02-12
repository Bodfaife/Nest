import React from 'react';
import { ChevronLeft, ArrowDownLeft, ArrowUpRight, Search, Download } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export default function TransactionHistoryScreen({ transactions = [], onBack, openScreen, darkMode, onDownloadStatement }) {
  const { formatAmount } = useCurrency();
  const [search, setSearch] = React.useState("");
  const container = darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900';
  const cardBg = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-50';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-500';
  const filtered = transactions.filter(tx => {
    if (!search) return true;
    const lower = search.toLowerCase();
    return (
      tx.type?.toLowerCase().includes(lower) ||
      tx.reference?.toLowerCase().includes(lower) ||
      tx.sender?.toLowerCase().includes(lower) ||
      String(tx.amount).includes(lower) ||
      new Date(tx.date).toLocaleString().toLowerCase().includes(lower)
    );
  });
  return (
    <div className={`flex flex-col animate-in slide-in-from-right duration-300 min-h-screen ${container}`}>
      {/* Header */}
      <div className={`px-6 py-4 sticky top-0 z-10 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-full">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Activities</h1>
          <button onClick={onDownloadStatement} className="ml-auto p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <Download size={20} />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input
            placeholder="Search transactions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={`w-full p-3 pl-12 rounded-xl border outline-none ${
              darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-100 text-gray-900'
            } focus:border-[#00875A]`}
          />
        </div>
      </div>

      {/* Transactions List */}
      <div className="pb-64 space-y-4 flex-1 overflow-y-auto px-6 pt-4">
        {filtered.length === 0 ? (
          <p className="text-center mt-10">No matching transactions found</p>
        ) : (
          filtered.map((tx) => {
            const isDeposit = tx.type === 'save' || tx.type === 'topup';
            const title = tx.type === 'save' ? 'Deposit' : tx.type === 'topup' ? 'Top Up' : 'Withdrawal';
            const dateStr = new Date(tx.date).toLocaleString();
            return (
              <div
                key={tx.id}
                onClick={() => openScreen && typeof openScreen === 'function' && openScreen('TransactionReceipt', tx)}
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  darkMode
                    ? 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                    : 'bg-white border-gray-50 hover:bg-emerald-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      isDeposit ? 'bg-emerald-50 text-[#00875A]' : 'bg-red-50 text-red-500'
                    }`}
                  >
                    {isDeposit ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div>
                    <p className={`font-black text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>{title}</p>
                    <p className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${textSecondary}`}>{dateStr}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <p className={`font-black ${isDeposit ? 'text-[#00875A]' : 'text-red-500'}`}> 
                    {isDeposit ? '+' : '-'}
                    {formatAmount(tx.amount)}
                  </p>
                  <span
                    className={`text-[9px] font-black mt-1 px-2 py-0.5 rounded-full ${
                      tx.status === 'failed'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-emerald-100 text-[#00875A]'
                    }`}
                  >
                    {(tx.status || 'success').toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
