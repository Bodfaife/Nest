import React from 'react';
import { ChevronLeft, Zap, TrendingUp, Calendar, Wallet } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

const SavingsDetailScreen = ({ savings, transactions = [], onBack, darkMode = false }) => {
  const { formatAmount } = useCurrency();

  if (!savings) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <p className={darkMode ? 'text-white' : 'text-gray-900'}>No active savings</p>
      </div>
    );
  }

  const bgClass = darkMode ? 'bg-gray-900' : 'bg-white';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-500';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-gray-50';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const statBg = darkMode ? 'bg-gray-700' : 'bg-emerald-50';
  const statText = darkMode ? 'text-[#00FF9D]' : 'text-emerald-600';

  // Calculate savings progress
  const savingsTransactions = transactions.filter(tx => tx.type === 'save' || tx.type === 'topup');
  const totalSaved = savingsTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  
  // Get last top-up date
  const lastTopUp = savingsTransactions[0];
  const lastTopUpDate = lastTopUp ? new Date(lastTopUp.date).toLocaleDateString() : 'Not yet';

  // Next top-up calculation
  const frequency = savings.frequency || null; // 'daily'|'weekly'|'monthly'
  const amountPerInterval = savings.amountPerInterval || 0;
  const computeNextTopUp = () => {
    let base = null;
    if (lastTopUp) base = new Date(lastTopUp.date);
    else if (savings.startDate) base = new Date(savings.startDate);
    else return { dateStr: 'N/A', amount: amountPerInterval };

    let next = new Date(base);
    if (frequency === 'daily') next.setDate(next.getDate() + 1);
    else if (frequency === 'weekly') next.setDate(next.getDate() + 7);
    else next.setMonth(next.getMonth() + 1); // default monthly

    return { dateStr: next.toLocaleDateString(), amount: amountPerInterval };
  };

  const nextTopUp = computeNextTopUp();

  // Calculate withdrawal date
  const withdrawalDate = new Date(savings.withdrawDate);
  const today = new Date();
  const daysRemaining = Math.ceil((withdrawalDate - today) / (1000 * 60 * 60 * 24));
  const isMatured = daysRemaining <= 0;

  // Recent transactions in savings
  const recentTransactions = savingsTransactions.slice(0, 5);

  return (
    <div className={`min-h-screen flex flex-col ${bgClass} animate-in slide-in-from-right`}>
      {/* Header */}
      <div className="p-6 flex items-center gap-3 border-b" style={{ borderColor }}>
        <button onClick={onBack} className={`p-2 rounded-full ${cardBg}`}>
          <ChevronLeft className={textPrimary} size={24} />
        </button>
        <h1 className={`text-xl font-black ${textPrimary}`}>Savings Details</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Status */}
        <div className={`p-8 rounded-3xl mb-8 text-center ${
          isMatured 
            ? darkMode ? 'bg-gradient-to-br from-emerald-50 to-emerald-50' : 'bg-gradient-to-br from-emerald-50 to-emerald-100'
            : darkMode ? 'bg-gradient-to-br from-gray-700 to-gray-700' : 'bg-gradient-to-br from-blue-50 to-blue-100'
        }`}>
          <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${
            isMatured ? statText : darkMode ? 'text-[#00FF9D]' : 'text-gray-700'
          }`}>
            {isMatured ? 'Matured' : 'Active'}
          </p>
          <p className={`text-4xl font-black ${textPrimary} mb-2`}>{formatAmount(savings.total)}</p>
          <p className={`text-xs ${textSecondary}`}>
            {isMatured ? 'Ready for withdrawal' : `Locked until ${withdrawalDate.toLocaleDateString()}`}
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Days Remaining */}
          {!isMatured && (
            <div className={`p-5 rounded-2xl ${statBg}`}>
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={16} className={statText} />
                <p className={`text-xs font-bold uppercase tracking-widest ${textSecondary}`}>Days Left</p>
              </div>
              <p className={`text-2xl font-black ${textPrimary}`}>{daysRemaining}</p>
              <p className={`text-[10px] ${textSecondary} mt-1`}>Until {withdrawalDate.toLocaleDateString()}</p>
            </div>
          )}

          {/* Last Top-Up */}
          <div className={`p-5 rounded-2xl ${statBg}`}>
            <div className="flex items-center gap-2 mb-2">
              <Wallet size={16} className={statText} />
              <p className={`text-xs font-bold uppercase tracking-widest ${textSecondary}`}>Last Top-Up</p>
            </div>
            <p className={`text-sm font-black ${textPrimary} truncate`}>{lastTopUpDate}</p>
            {lastTopUp && <p className={`text-xs ${statText} mt-1`}>{formatAmount(lastTopUp.amount)}</p>}
          </div>

          {/* Next Top-Up */}
          {!isMatured && (
            <div className={`p-5 rounded-2xl ${statBg}`}>
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={16} className={statText} />
                <p className={`text-xs font-bold uppercase tracking-widest ${textSecondary}`}>Next Top-Up</p>
              </div>
              <p className={`text-sm font-black ${textPrimary} truncate`}>{nextTopUp.dateStr}</p>
              <p className={`text-xs ${statText} mt-1`}>{formatAmount(nextTopUp.amount)}</p>
            </div>
          )}

          {/* Total Transactions */}
          <div className={`p-5 rounded-2xl ${statBg}`}>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className={statText} />
              <p className={`text-xs font-bold uppercase tracking-widest ${textSecondary}`}>Transactions</p>
            </div>
            <p className={`text-2xl font-black ${textPrimary}`}>{savingsTransactions.length}</p>
            <p className={`text-[10px] ${textSecondary} mt-1`}>Total deposits</p>
          </div>

          {/* Duration */}
          <div className={`p-5 rounded-2xl ${statBg}`}>
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className={statText} />
              <p className={`text-xs font-bold uppercase tracking-widest ${textSecondary}`}>Duration</p>
            </div>
            <p className={`text-2xl font-black ${textPrimary}`}>{savings.durationMonths || '—'}</p>
            <p className={`text-[10px] ${textSecondary} mt-1`}>months</p>
          </div>

          {/* Frequency */}
          <div className={`p-5 rounded-2xl ${statBg}`}>
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={16} className={statText} />
              <p className={`text-xs font-bold uppercase tracking-widest ${textSecondary}`}>Frequency</p>
            </div>
            <p className={`text-lg font-black ${textPrimary} capitalize`}>{savings.frequency || 'Monthly'}</p>
            <p className={`text-[10px] ${textSecondary} mt-1`}>Topup schedule</p>
          </div>

          {/* Target Amount */}
          {savings.targetAmount && (
            <div className={`p-5 rounded-2xl ${statBg}`}>
              <div className="flex items-center gap-2 mb-2">
                <Wallet size={16} className={statText} />
                <p className={`text-xs font-bold uppercase tracking-widest ${textSecondary}`}>Target</p>
              </div>
              <p className={`text-lg font-black ${textPrimary}`}>{formatAmount(savings.targetAmount)}</p>
              <p className={`text-[10px] ${textSecondary} mt-1`}>Goal amount</p>
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div>
          <p className={`text-xs font-bold uppercase tracking-widest mb-4 ${textSecondary}`}>Recent Activity</p>
          {recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {recentTransactions.map((tx, idx) => (
                <div key={idx} className={`p-4 rounded-xl flex justify-between items-center ${cardBg}`}>
                  <div>
                    <p className={`font-bold text-sm ${textPrimary}`}>
                      {tx.type === 'save' ? 'Initial Deposit' : 'Top-Up'}
                    </p>
                    <p className={`text-xs ${textSecondary}`}>{new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                  <p className={`font-black text-sm ${darkMode ? 'text-[#00FF9D]' : 'text-emerald-600'}`}>
                    +{formatAmount(tx.amount)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className={`text-sm ${textSecondary}`}>No transactions yet</p>
          )}
        </div>
      </div>

      {/* Withdrawal Info */}
      {isMatured && (
        <div className={`p-6 border-t ${cardBg}`} style={{ borderColor }}>
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900' : 'bg-emerald-50'}`}>
            <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${statText}`}>
              Ready to Withdraw
            </p>
            <p className={`text-sm ${textSecondary}`}>
              Your savings have matured. You can now withdraw your funds or continue saving.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavingsDetailScreen;
