import React, { useState } from 'react';
import { ChevronLeft, Shield, Lock, Eye, AlertCircle } from 'lucide-react';

const SecurityPrivacyScreen = ({ onBack, darkMode = false, onViewPrivacyPolicy, onResetPin, onCloseAccount }) => {
  const [security, setSecurity] = useState({
    biometric: true,
    twoFactor: false,
    sessionTimeout: true,
  });

  const bgClass = darkMode ? 'bg-gray-900' : 'bg-white';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-500';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-gray-50';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const toggleBg = darkMode ? 'bg-gray-700' : 'bg-gray-200';
  const dangerBg = darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200';

  const toggleSecurity = (key) => {
    setSecurity({ ...security, [key]: !security[key] });
  };

  const securityItems = [
    {
      key: 'biometric',
      title: 'Biometric Login',
      description: 'Use fingerprint or face recognition',
      icon: '👆',
    },
    {
      key: 'twoFactor',
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security',
      icon: '🔐',
    },
    {
      key: 'sessionTimeout',
      title: 'Auto Session Timeout',
      description: 'Automatically logout after 15 minutes',
      icon: '⏱️',
    },
  ];

  return (
    <div className={`min-h-screen pb-16 flex flex-col ${bgClass} animate-in slide-in-from-right`}>
      {/* Header */}
      <div className="p-6 flex items-center gap-3 border-b" style={{ borderColor }}>
        <button onClick={onBack} className={`p-2 rounded-full ${cardBg}`}>
          <ChevronLeft className={textPrimary} size={24} />
        </button>
        <h1 className={`text-xl font-black ${textPrimary}`}>Security & Privacy</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <p className={`text-sm ${textSecondary} mb-6`}>Manage your security settings and privacy preferences</p>

        <div className="space-y-3 mb-8">
          {securityItems.map(item => (
            <div key={item.key} className={`p-5 rounded-2xl flex items-center justify-between ${cardBg}`}>
              <div className="flex-1">
                <p className={`font-bold ${textPrimary}`}>{item.title}</p>
                <p className={`text-xs ${textSecondary} mt-1`}>{item.description}</p>
              </div>
              <button
                onClick={() => toggleSecurity(item.key)}
                className={`relative w-12 h-6 rounded-full transition-all flex-shrink-0 ml-4 ${
                  security[item.key] 
                    ? (darkMode ? 'bg-[#00FF9D]' : 'bg-emerald-600')
                    : toggleBg
                }`}
              >
                <div
                  className={`absolute w-5 h-5 rounded-full bg-white transition-all ${
                    security[item.key] ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        <div className="mb-8">
          <h3 className={`font-bold ${textPrimary} mb-4`}>Privacy</h3>
          <div className={`p-5 rounded-2xl ${cardBg} mb-4`}>
            <div className="flex items-center gap-3 mb-4">
              <Eye size={18} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
              <p className={`font-bold ${textPrimary}`}>Data Collection</p>
            </div>
            <p className={`text-xs ${textSecondary}`}>
              We collect minimal data required to provide our services. Your personal information is never shared with third parties.
            </p>
            <button 
              onClick={onViewPrivacyPolicy}
              className={`text-xs font-bold mt-4 ${darkMode ? 'text-[#00FF9D]' : 'text-emerald-600'} hover:opacity-80`}
            >
              View Privacy Policy →
            </button>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border-2 space-y-3 ${dangerBg}`}>
          <div className="flex items-center gap-2">
            <AlertCircle size={18} className={darkMode ? 'text-red-400' : 'text-red-600'} />
            <p className={`font-bold ${darkMode ? 'text-red-200' : 'text-red-700'}`}>Danger Zone</p>
          </div>
          <button 
            onClick={onResetPin}
            className={`w-full p-3 rounded-xl border border-current font-bold text-sm ${
            darkMode ? 'bg-red-900/20 text-red-300 hover:bg-red-900/30' : 'bg-red-50 text-red-600 hover:bg-red-100'
          }`}>
            Reset PIN
          </button>
          <button 
            onClick={onCloseAccount}
            className={`w-full p-3 rounded-xl border border-current font-bold text-sm ${
            darkMode ? 'bg-red-900/20 text-red-300 hover:bg-red-900/30' : 'bg-red-50 text-red-600 hover:bg-red-100'
          }`}>
            Close Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityPrivacyScreen;
