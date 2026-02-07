import React from 'react';
import { ChevronLeft, ArrowDownLeft, ArrowUpRight, Search, Download } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export default function TransactionHistoryScreen({ transactions = [], onBack, openScreen, darkMode }) {
  const { formatAmount } = useCurrency();

  return (
    <div className="flex flex-col bg-white animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="px-6 py-4 sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-full">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Activities</h1>
          <button className="ml-auto p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <Download size={20} />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input
            placeholder="Search transactions..."
            className="w-full bg-gray-50 p-3 pl-12 rounded-xl border border-gray-100 outline-none focus:border-[#00875A]"
          />
        </div>
      </div>

      {/* Transactions List */}
      <div className="pb-64 space-y-4 flex-1 overflow-y-auto">
        {transactions.map((tx) => {
          const isPositive = tx.type === 'deposit' || tx.type === 'save';
          return (
            <div
              key={tx.id}
              onClick={() => openScreen("TransactionReceipt", tx)}
              className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-50 hover:border-emerald-100 active:bg-emerald-50 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    isPositive ? 'bg-emerald-50 text-[#00875A]' : 'bg-red-50 text-red-500'
                  }`}
                >
                  {isPositive ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                </div>
                <div>
                  <p className="font-black text-gray-800 text-sm">{tx.title}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                    {tx.date}
                  </p>
                </div>
              </div>
              <p className={`font-black ${isPositive ? 'text-[#00875A]' : 'text-gray-900'}`}>
                {isPositive ? '+' : '-'}
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
          );
        })}
      </div>
    </div>
  );
}
