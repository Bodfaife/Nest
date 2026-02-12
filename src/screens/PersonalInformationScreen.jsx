import React, { useState } from 'react';
import { ChevronLeft, User, Mail, Phone, MapPin } from 'lucide-react';

const PersonalInformationScreen = ({ user, onBack, onUserChange, darkMode = false }) => {
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    country: user?.country || '',
    accountNumber: user?.accountNumber || '',
  });

  const [isEditing, setIsEditing] = useState({
    phone: false,
    country: false,
  });

  const bgClass = darkMode ? 'bg-gray-900' : 'bg-white';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-500';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-gray-50';
  const inputBg = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const buttonBg = darkMode ? 'bg-[#00FF9D] text-gray-900' : 'bg-[#00875A] text-white';

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
    // Auto-save to parent
    if (onUserChange) {
      onUserChange({ ...user, ...formData, [key]: value });
    }
  };

  const handleEditToggle = (field) => {
    const newEditState = { ...isEditing, [field]: !isEditing[field] };
    setIsEditing(newEditState);
    // Save when toggling off (Done button)
    if (isEditing[field] && onUserChange) {
      onUserChange({ ...user, ...formData });
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${bgClass} animate-in slide-in-from-right`}>
      {/* Header */}
      <div className="p-6 flex items-center gap-3 border-b" style={{ borderColor }}>
        <button onClick={onBack} className={`p-2 rounded-full ${cardBg}`}>
          <ChevronLeft className={textPrimary} size={24} />
        </button>
        <h1 className={`text-xl font-black ${textPrimary}`}>Personal Information</h1>
      </div>

      {/* Content */}
      <div className="flex-1 pb-16 overflow-auto p-6">
        <div className="space-y-5">
          {/* Read-Only Fields */}
          <div>
            <label className={`text-xs font-bold uppercase tracking-widest ml-1 mb-2 block ${textSecondary}`}>
              <User size={14} className="inline mr-2" />
              Full Name
            </label>
            <input
              type="text"
              disabled
              value={formData.fullName}
              className={`w-full p-4 rounded-xl font-bold outline-none opacity-60 cursor-not-allowed ${inputBg} ${textPrimary}`}
            />
            <p className={`text-[10px] mt-1 ${textSecondary}`}>Cannot be changed. Contact support if needed.</p>
          </div>

          <div>
            <label className={`text-xs font-bold uppercase tracking-widest ml-1 mb-2 block ${textSecondary}`}>
              <Mail size={14} className="inline mr-2" />
              Email Address
            </label>
            <input
              type="email"
              disabled
              value={formData.email}
              className={`w-full p-4 rounded-xl font-bold outline-none opacity-60 cursor-not-allowed ${inputBg} ${textPrimary}`}
            />
            <p className={`text-[10px] mt-1 ${textSecondary}`}>Verified email</p>
          </div>

          <div>
            <label className={`text-xs font-bold uppercase tracking-widest ml-1 mb-2 block ${textSecondary}`}>
              Account Number
            </label>
            <input
              type="text"
              disabled
              value={formData.accountNumber}
              className={`w-full p-4 rounded-xl font-mono font-bold outline-none opacity-60 cursor-not-allowed ${inputBg} ${textPrimary}`}
            />
            <p className={`text-[10px] mt-1 ${textSecondary}`}>Your unique Nest account identifier</p>
          </div>

          {/* Editable Fields */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={`text-xs font-bold uppercase tracking-widest ml-1 ${textSecondary}`}>
                <Phone size={14} className="inline mr-2" />
                Phone Number
              </label>
              <button
                onClick={() => handleEditToggle('phone')}
                className={`text-[10px] font-bold ${darkMode ? 'text-[#00FF9D]' : 'text-emerald-600'}`}
              >
                {isEditing.phone ? 'Done' : 'Edit'}
              </button>
            </div>
            <input
              type="tel"
              disabled={!isEditing.phone}
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+1 (555) 000-0000"
              className={`w-full p-4 rounded-xl font-bold outline-none focus:ring-2 focus:ring-emerald-500 ${inputBg} ${textPrimary} ${!isEditing.phone && 'opacity-60 cursor-not-allowed'}`}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={`text-xs font-bold uppercase tracking-widest ml-1 ${textSecondary}`}>
                <MapPin size={14} className="inline mr-2" />
                Country
              </label>
              <button
                onClick={() => handleEditToggle('country')}
                className={`text-[10px] font-bold ${darkMode ? 'text-[#00FF9D]' : 'text-emerald-600'}`}
              >
                {isEditing.country ? 'Done' : 'Edit'}
              </button>
            </div>
            <select
              disabled={!isEditing.country}
              value={formData.country}
              onChange={(e) => handleChange('country', e.target.value)}
              className={`w-full p-4 rounded-xl font-bold outline-none focus:ring-2 focus:ring-emerald-500 ${inputBg} ${textPrimary} ${!isEditing.country && 'opacity-60 cursor-not-allowed'}`}
            >
              <option value="">Select Country</option>
              <option value="NG">Nigeria</option>
              <option value="KE">Kenya</option>
              <option value="GH">Ghana</option>
              <option value="ZA">South Africa</option>
              <option value="US">United States</option>
              <option value="GB">United Kingdom</option>
            </select>
          </div>
        </div>

        <div className={`p-5 rounded-2xl ${cardBg} mt-8`}>
          <p className={`text-xs ${textSecondary}`}>
            Your personal information is securely stored and encrypted. We never share your data with third parties without your consent.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformationScreen;
