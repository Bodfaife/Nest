import React, { useState } from 'react';
import { ChevronLeft, Calendar, Download } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { formatStatementAsCSV, formatStatementAsHTML, downloadCSV, openStatementPreview } from '../helpers/statementFormatter';

const DownloadStatementScreen = ({ transactions = [], onBack, darkMode = false, user = {} }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statementFormat, setStatementFormat] = useState('pdf'); // pdf | csv
  const { formatAmount } = useCurrency();

  const bgClass = darkMode ? 'bg-gray-900' : 'bg-white';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-500';
  const inputBg = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-gray-50';
  const buttonBg = darkMode ? 'bg-[#00FF9D] text-gray-900' : 'bg-[#00875A] text-white';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';

  // Filter transactions by date range
  const filteredTransactions = transactions.filter(tx => {
    const txDate = new Date(tx.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && txDate < start) return false;
    if (end) {
      const endOfDay = new Date(end);
      endOfDay.setHours(23, 59, 59, 999);
      if (txDate > endOfDay) return false;
    }
    return true;
  });

  // Calculate summary
  const summary = filteredTransactions.reduce(
    (acc, tx) => {
      if (tx.type === 'save' || tx.type === 'topup' || tx.type === 'deposit') {
        acc.deposits += tx.amount;
      } else {
        acc.withdrawals += tx.amount;
      }
      acc.count += 1;
      return acc;
    },
    { deposits: 0, withdrawals: 0, count: 0 }
  );

  // Get current balance (last transaction's balance or 0)
  const currentBalance = filteredTransactions.length > 0 
    ? filteredTransactions[filteredTransactions.length - 1].balanceAfter || 0
    : 0;

  const handleDownload = async () => {
    if (statementFormat === 'pdf') {
      const html = formatStatementAsHTML(filteredTransactions, user, currentBalance);
      // open preview in browser tab (preview contains its own Download button)
      openStatementPreview(html);
    } else {
      const csv = formatStatementAsCSV(filteredTransactions, user, currentBalance);
      downloadCSV(csv, `statement_${startDate}_to_${endDate}.csv`);
    }
  };

  

  const isValidDate = startDate && endDate && new Date(startDate) <= new Date(endDate);

  return (
    <div className={`min-h-screen flex flex-col ${bgClass} animate-in slide-in-from-right`}>
      {/* Header */}
      <div className="p-6 flex items-center gap-3 border-b" style={{ borderColor }}>
        <button onClick={onBack} className={`p-2 rounded-full ${cardBg}`}>
          <ChevronLeft className={textPrimary} size={24} />
        </button>
        <h1 className={`text-xl font-black ${textPrimary}`}>Download Statement</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <p className={`text-sm mb-6 ${textSecondary}`}>Select date range and format for your transaction statement</p>

        {/* Date Selection */}
        <div className="space-y-5 mb-8">
          <div>
            <label className={`text-xs font-bold uppercase tracking-widest ml-1 mb-2 block ${textSecondary}`}>
              <Calendar size={14} className="inline mr-2" />
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={`w-full p-4 rounded-xl font-bold outline-none focus:ring-2 focus:ring-emerald-500 ${inputBg} ${textPrimary}`}
            />
          </div>

          <div>
            <label className={`text-xs font-bold uppercase tracking-widest ml-1 mb-2 block ${textSecondary}`}>
              <Calendar size={14} className="inline mr-2" />
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={`w-full p-4 rounded-xl font-bold outline-none focus:ring-2 focus:ring-emerald-500 ${inputBg} ${textPrimary}`}
            />
          </div>
        </div>

        {/* Format Selection */}
        <div className="mb-8">
          <p className={`text-xs font-bold uppercase tracking-widest ml-1 mb-3 ${textSecondary}`}>Format</p>
          <div className="space-y-2">
            {[
              { id: 'pdf', label: 'PDF Format', desc: 'Best for printing and sharing' },
              { id: 'csv', label: 'CSV Format', desc: 'For spreadsheet applications' }
            ].map(format => (
              <button
                key={format.id}
                onClick={() => setStatementFormat(format.id)}
                className={`w-full p-4 rounded-xl text-left transition-all border-2 ${
                  statementFormat === format.id
                    ? `border-emerald-600 ${cardBg}`
                    : `border-transparent ${cardBg}`
                }`}
              >
                <p className={`font-bold ${textPrimary}`}>{format.label}</p>
                <p className={`text-xs ${textSecondary}`}>{format.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Summary Preview */}
        {isValidDate && (
          <div className={`p-5 rounded-2xl ${cardBg} mb-8`}>
            <p className={`text-xs font-bold uppercase tracking-widest mb-4 ${textSecondary}`}>Preview</p>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className={textSecondary}>Total Deposits</span>
                <span className={`font-bold ${darkMode ? 'text-[#00FF9D]' : 'text-emerald-600'}`}>{formatAmount(summary.deposits)}</span>
              </div>
              <div className="flex justify-between">
                <span className={textSecondary}>Total Withdrawals</span>
                <span className={`font-bold text-red-500`}>{formatAmount(summary.withdrawals)}</span>
              </div>
              <div className="flex justify-between border-t" style={{ borderColor }}>
                <span className={`font-bold ${textPrimary} pt-3`}>Transactions</span>
                <span className={`font-bold ${textPrimary} pt-3`}>{summary.count}</span>
              </div>
            </div>
          </div>
        )}

        {/* Info */}
        <div className={`p-4 rounded-2xl ${cardBg}`}>
          <p className={`text-xs ${textSecondary}`}>
            If you choose PDF the statement will open in a new browser tab for preview; use your browser's Save/Print to save as PDF. CSV will download directly.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t" style={{ borderColor }}>
        <button
          onClick={handleDownload}
          disabled={!isValidDate}
          className={`w-full py-5 rounded-2xl font-black transition-all active:scale-95 flex items-center justify-center gap-2 ${
            isValidDate
              ? `${buttonBg}`
              : darkMode
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Download size={20} />
          {statementFormat === 'pdf' ? 'Download PDF' : 'Download CSV'}
        </button>
      </div>
    </div>
  );
};

export default DownloadStatementScreen;
