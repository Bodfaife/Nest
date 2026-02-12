import React from 'react';
import { ChevronLeft, CreditCard, Building2 } from 'lucide-react';

const LockSavingsMethodScreen = ({ onSelectMethod, onBack, darkMode = false }) => {
  const bgClass = darkMode ? 'bg-gray-900' : 'bg-white';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-500';
  const cardBg = darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';

  const methods = [
    {
      id: 'card',
      title: 'Debit Card',
      description: 'Use your linked debit card',
      icon: CreditCard,
      color: darkMode ? 'text-blue-400' : 'text-blue-600'
    },
    {
      id: 'bank',
      title: 'Bank Transfer',
      description: 'Transfer from your bank account',
      icon: Building2,
      color: darkMode ? 'text-emerald-400' : 'text-emerald-600'
    }
  ];

  return (
    <div className={`min-h-screen flex flex-col ${bgClass} animate-in slide-in-from-right`}>
      {/* Header */}
      <div className="p-6 flex items-center gap-3 border-b" style={{ borderColor: darkMode ? '#374151' : '#e5e7eb' }}>
        <button onClick={onBack} className={`p-2 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <ChevronLeft className={textPrimary} size={24} />
        </button>
        <h1 className={`text-xl font-black ${textPrimary}`}>Lock Your Savings</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col justify-center">
        <p className={`text-sm mb-8 ${textSecondary}`}>Choose how you'd like to lock your savings</p>

        <div className="space-y-4 mb-8">
          {methods.map(method => {
            const Icon = method.icon;
            return (
              <button
                key={method.id}
                onClick={() => onSelectMethod(method.id)}
                className={`w-full p-6 rounded-2xl border-2 flex items-start gap-4 transition-all active:scale-95 ${
                  darkMode ? 'border-gray-700' : 'border-gray-200'
                } ${cardBg}`}
              >
                <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex-shrink-0`}>
                  <Icon className={method.color} size={24} />
                </div>
                <div className="text-left flex-1">
                  <h3 className={`font-bold ${textPrimary}`}>{method.title}</h3>
                  <p className={`text-xs ${textSecondary}`}>{method.description}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 ${darkMode ? 'border-gray-600' : 'border-gray-300'} flex-shrink-0 mt-1`} />
              </button>
            );
          })}
        </div>

        <div className={`p-4 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <p className={`text-xs ${textSecondary}`}>
            Both payment methods are secure and encrypted. You can add multiple payment methods in your settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LockSavingsMethodScreen;
