import React, { useState } from 'react';
import { ChevronLeft, Bell, AlertCircle } from 'lucide-react';

const NotificationsScreen = ({ onBack, darkMode = false }) => {
  const [notifications, setNotifications] = useState({
    topUp: true,
    transactions: true,
    savingsReminder: true,
    promotions: false,
  });

  const bgClass = darkMode ? 'bg-gray-900' : 'bg-white';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-500';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-gray-50';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const toggleBg = darkMode ? 'bg-gray-700' : 'bg-gray-200';

  const toggleNotification = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const notificationItems = [
    {
      key: 'topUp',
      title: 'Top-Up Confirmations',
      description: 'Get notified when you top up your savings',
      icon: '💰',
    },
    {
      key: 'transactions',
      title: 'Transaction Alerts',
      description: 'Receive alerts for all transactions',
      icon: '📊',
    },
    {
      key: 'savingsReminder',
      title: 'Savings Reminders',
      description: 'Be reminded when it\'s time to save',
      icon: '⏰',
    },
    {
      key: 'promotions',
      title: 'Promotions & Updates',
      description: 'Get news about new features and offers',
      icon: '🎉',
    },
  ];

  return (
    <div className={`min-h-screen flex flex-col ${bgClass} animate-in slide-in-from-right`}>
      {/* Header */}
      <div className="p-6 flex items-center gap-3 border-b" style={{ borderColor }}>
        <button onClick={onBack} className={`p-2 rounded-full ${cardBg}`}>
          <ChevronLeft className={textPrimary} size={24} />
        </button>
        <h1 className={`text-xl font-black ${textPrimary}`}>Notifications</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-3">
          {notificationItems.map(item => (
            <div key={item.key} className={`p-5 rounded-2xl flex items-center justify-between ${cardBg}`}>
              <div className="flex-1">
                <p className={`font-bold ${textPrimary}`}>{item.title}</p>
                <p className={`text-xs ${textSecondary} mt-1`}>{item.description}</p>
              </div>
              <button
                onClick={() => toggleNotification(item.key)}
                className={`relative w-12 h-6 rounded-full transition-all flex-shrink-0 ml-4 ${
                  notifications[item.key] 
                    ? (darkMode ? 'bg-[#00FF9D]' : 'bg-emerald-600')
                    : toggleBg
                }`}
              >
                <div
                  className={`absolute w-5 h-5 rounded-full bg-white transition-all ${
                    notifications[item.key] ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        <div className={`p-5 rounded-2xl ${cardBg} mt-8 flex items-start gap-3`}>
          <AlertCircle size={18} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
          <p className={`text-xs ${textSecondary}`}>
            Notifications help you stay updated about your account activity and savings progress. You can adjust these settings at any time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationsScreen;
