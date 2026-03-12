import React, { useState } from 'react';
import { ChevronLeft, AlertCircle, TrendingUp, Clock, Gift } from 'lucide-react';

const NotificationsScreen = ({ onBack }) => {
  const [notifications, setNotifications] = useState({
    topUp: true,
    transactions: true,
    savingsReminder: true,
    promotions: false,
  });

  const bgClass = 'bg-white';
  const textPrimary = "text-gray-900";
  const textSecondary = "text-gray-500";
  const cardBg = 'bg-gray-50';
  const borderColor = 'border-gray-200';

  const toggleNotification = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const notificationItems = [
    {
      key: 'topUp',
      title: 'Top-Up Confirmations',
      description: 'Get notified when you top up your savings',
      icon: '💰',
      color: 'from-emerald-50 to-emerald-100',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      badgeColor: 'bg-emerald-500',
    },
    {
      key: 'transactions',
      title: 'Transaction Alerts',
      description: 'Receive alerts for all transactions',
      icon: '📊',
      color: 'from-blue-50 to-blue-100',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      badgeColor: 'bg-blue-500',
    },
    {
      key: 'savingsReminder',
      title: 'Savings Reminders',
      description: 'Be reminded when it\'s time to save',
      icon: '⏰',
      color: 'from-amber-50 to-amber-100',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      badgeColor: 'bg-amber-500',
    },
    {
      key: 'promotions',
      title: 'Promotions & Updates',
      description: 'Get news about new features and offers',
      icon: '🎉',
      color: 'from-purple-50 to-purple-100',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      badgeColor: 'bg-purple-500',
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
        <div className="space-y-4">
          {notificationItems.map(item => (
            <div 
              key={item.key} 
              className={`p-1 rounded-2xl bg-gradient-to-br ${item.color} border border-gray-100 overflow-hidden transition-all hover:shadow-md`}
            >
              <div className={`p-4 flex items-center justify-between `}>
                <div className="flex items-center gap-4 flex-1">
                  {/* Icon */}
                  <div className={`p-3 rounded-xl ${item.iconBg} flex-shrink-0`}>
                    <span className="text-2xl">{item.icon}</span>
                  </div>
                  
                  {/* Text Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`font-bold text-sm ${textPrimary}`}>{item.title}</p>
                      {notifications[item.key] && (
                        <span className={`h-2 w-2 rounded-full ${item.badgeColor}`}></span>
                      )}
                    </div>
                    <p className={`text-xs ${textSecondary} mt-1 leading-relaxed`}>{item.description}</p>
                  </div>
                </div>
                
                {/* Toggle Switch */}
                <button
                  onClick={() => toggleNotification(item.key)}
                  className={`relative w-14 h-8 rounded-full transition-all flex-shrink-0 ml-4 ${
                    notifications[item.key] 
                      ? `${item.badgeColor}`
                      : 'bg-gray-300'
                  }`}
                  style={{
                    transitionDuration: '200ms',
                  }}
                >
                  <div
                    className={`absolute w-6 h-6 rounded-full bg-white transition-all shadow-md ${
                      notifications[item.key] ? 'translate-x-7' : 'translate-x-1'
                    }`}
                    style={{
                      transitionDuration: '200ms',
                    }}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Info Card */}
        <div className={`p-4 rounded-2xl ${cardBg} mt-8 flex items-start gap-3 border border-gray-100`}>
          <AlertCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <p className={`text-sm ${textSecondary} leading-relaxed`}>
            Notifications help you stay updated about your account activity and savings progress. You can adjust these settings at any time. We'll respect your preferences and never spam.
          </p>
        </div>

        {/* Status Summary */}
        <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
          <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Active Alerts</p>
          <div className="grid grid-cols-2 gap-3">
            {notificationItems.map(item => (
              <div key={item.key} className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${notifications[item.key] ? item.badgeColor : 'bg-gray-300'}`}></div>
                <span className="text-xs text-gray-700 font-medium truncate">{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsScreen;
